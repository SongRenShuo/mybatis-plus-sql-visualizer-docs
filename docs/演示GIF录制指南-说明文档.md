---
search: false
---

# 演示 GIF 录制指南

> 2026-09-12 修订九轮全量重录（7/8 张）验收通过后沉淀。本文是面向下一次录制/补拍的操作手册，管线原理与平台坑的完整分析在插件仓库 `docs/经验总结/20260910-0100-IntelliJ演示GIF录制-经验总结.md`（§十为本轮新增），两处不重复维护。
> 本方法论已固化为 ZCode skill **`ide-demo-gif`**（用户级 `~/.zcode/skills/ide-demo-gif/`，含通用化工具脚本与场景模板，自然语言「录一张演示 GIF」可触发）。本文保留作背景与规格依据；通用能力改动以 skill 内 scripts 为权威源。
> 录制脚本在插件仓库 `record/`（仅 dev 分支），中间产物 `record/perf/` 不入库。

## 成品规格（写死，不再讨论）

| 项 | 值 |
|------|------|
| 构图 | 窗口 1370×984 @ 屏幕 (277,25)，录制区域=窗口外框 |
| IDE 缩放 | 120%（Settings → Appearance → Zoom） |
| 编辑器字体 | 13pt（2026.2 默认值，不要再设 18pt） |
| 主题 | Islands Dark |
| 导出宽度 | 1280，wrapper-preview 因首页共用 1440 |
| 帧率 | 15fps |
| 体积 | 预算 4~6MB（本轮实际 0.3~2.6MB 全部富余） |
| 文件 | `public/demo/<功能名>.gif` + 同名 `.png` poster（取关键定格帧） |
| 循环 | 首尾帧一致，接缝 diff ≤1（sql-log 场景的结构性跳变除外） |

16 个功能页 md 不用动——文件同名，替换即生效。

## 环境启动

1. 插件仓库 **dev worktree**（`mybatis-plus-sql-visualizer-dev`），确认 `grep -c gifRecord build.gradle.kts` 非 0（开关只在 dev，master 敲参数会被静默忽略、给你 243 沙盒）。
2. `python C:\Users\USER\.zcode\cli\parallel_tasks.py check`，有并行任务先 register 独立沙盒名。
3. `./gradlew runIde -PgifRecord=true` 后台跑，一条命令带上 262 平台 + JCEF + toolchain24 + 独立沙盒 MPSV-GifFresh；不带参数即 243 常规态，录完无需还原。
4. 沙盒免费评估模式即可，全部 Ultimate 功能可用。

## 环境就位清单（每次开新沙盒都要）

- 主题 Islands Dark + 缩放 120%（新沙盒这两项要重设；Islands Dark 会随 colors.scheme.xml 保留，Zoom 缺省回 100%）
- 编辑器字体确认 13pt 默认——「120% + 18pt」正是被用户判退的中间态，别搞混
- 窗口定位 (277,25,1370,984)：用 Win32 `MoveWindow`（DPI 感知脚本），**等 IDE 完全空闲后再移**——刚启动/改完 Zoom 的窗口会被 AWT 最小高度钳制（1042→1100）弹回
- 关项目目录树（修订九硬性项）：Project 工具窗的「—」隐藏按钮，别点到「折叠全部」
- 系统输入法切英文态：微软拼音「中」态下 typewrite 走组合输入，候选框会录进画面且提交时机不稳
- 录制中系统空闲时优先，用户/其他会话动鼠标会打偏点击

## 管线流程

```
标定（shot.py 抓帧定坐标 → 改 scene 脚本常量）
→ scene_tN.py 重放（mss 15fps 无损 mp4 + curlog 光标日志）
→ assemble.py 转制（空白压缩 + 光标回绘 + palette GIF + poster）
→ ffmpeg 抽帧逐点验收（动作节点/定格/poster 三处）
```

固定套路：

- scene 脚本内**自包含就位**：open_file/goto_line/图标检测全在 `Recorder.start()` 之前，take 中途只做演示动作
- gutter 图标用 `find_gutter_icons` 像素检测动态取，不写死坐标；当前构图条带在 region 相对 x≈95~130
- 13pt 下视口行数比 150% 时代多一倍，「取最低簇」会误选下方方法的图标——用窄 y_range 直取或取最接近视口中心者
- 弹窗控件坐标（取消按钮、复选框、输入框）必须弹窗打开态现标；取消按钮当前在 (1485,827)
- 转制后核对 `decoded 帧数 == Recorder.frames`，防残留帧混入（见下）

## 本轮踩坑定论（按代价排序）

1. **assemble 残留帧**：decode_frames 原来不清 frames 目录，上次解码帧数多于本次时旧尾帧混入新 GIF（T4 实证 132=119 新+13 旧，旧构图布局直接穿帮）。已修复为解码前清目录；转制后核对帧数是最后防线。
2. **T5 捕捉顺序**：先点「捕捉」再启动应用，监听建立失败、列表恒空。正解是应用先跑起来（Services 选中 MybatisPlusDemoApplication 后点面板 ▶），再点捕捉，脚本内 urllib 轮询 `/user/list` 触发查询。
3. **IME**：整个录制期保持英文态，打字前看一眼任务栏指示器。中文态的候选框入镜只有抽帧才能发现。
4. **T3 类打字场景全键盘化**：goto_line 居中有 ±2 行漂移，点击行坐标不可靠；goto 本身把光标落在目标行行首，之后 End/Enter/键入全键盘完成，鼠标只做演示滑动。
5. **前台抢夺**：`AttachThreadInput + SetForegroundWindow` 只给焦点不改 Z 序，视觉上窗口还在浏览器后面，坐标点击会穿透。要配 TOPMOST→NOTOPMOST 舞步；点击坐标在窗口可视区内（DWM 阴影边约 13px 不算数，超了就点到后面的窗口上）。
6. **坐标系两套**：shot.py/region 截图是 region 相对坐标，点击要 +277/+25；全屏截图 raster 是 1280×720，物理坐标 ×1.5。混用是最大的时间坑，写坐标前先想清楚手里是哪张图。裁剪局部图量的坐标还要再加一层偏移——三套数字（屏幕 / region / 裁剪内）逐级换算，点错一格就是 neighboring 控件。
7. **运行时改 Zoom 的钳制**：见环境就位清单，预写 other.xml 或等空闲后再定位。
8. **PixPin 全局热键撞车**：PixPin 常驻时 `Ctrl+Shift+A`（截图）、`Ctrl+Alt+S`（取色）都会被它劫持——Find Action 和 Settings 快捷键全部失效还会弹出它的覆盖层。开 Settings 走 IDE 工具栏齿轮菜单；Find Action 期间先确认 PixPin 不在撞键范围。
9. **IDE 编辑器缓冲污染**：误打进编辑器的文字用 Ctrl+Z 可能撤不掉（撤销栈状态异常），关标签重开也可能复用内存脏 Document。可靠清理是右键 > Local History > Show History，选污染前的时间点 Revert——它按内容快照回滚，不依赖撤销栈。
10. **置顶覆盖层抢前台**：ZCode 自动化面板等常驻应用若处于置顶态，TOPMOST→NOTOPMOST 舞步会把 IDE 抬回非置顶带、照样被盖住，坐标点击会打进覆盖层（曾误触自动化面板）。点前先 EnumWindows 核对目标窗口标题与位置，必要时让 IDE 持续保持 TOPMOST 干完活再撤。

## 逐张场景速查（修订九实测）

| 场景 | 文件 | 要点 |
|------|------|------|
| annotation | t7 | goto(33) 后窄窗找图标；参数输入 (593,465)/(593,523) |
| wrapper | t4 | goto(36)；status 复选框 (417,399)；13pt 下 SQL 开窗即全文，无需 Ctrl+End |
| batch | t2 | goto(211) 后 y_range=(350,650) 避开上方 205 行图标；age 复选框动态标定取蓝色第 2 行 |
| xml | t8 | goto(74)；roleId 复选框 (417,378) |
| completion | t3 | goto(77) 后全键盘（End/Enter/join us/Enter），结尾 undo×4 还原现场 |
| jpa | t1 | 双弹窗：42 行窄窗直取 + goto(147) 中心取簇，结尾回跳 42 保证接缝 |
| sql-log | t5 | 应用先跑（8081，选 MybatisPlusDemoApplication），捕捉后轮询触发查询 |
| sql-to-java | t6 | 修订十一已重录（宽侧栏+Services 关闭构图）；回归已消失；tab 判定用暗蓝药丸（见 scene_t6 ensure_sqljava_tab）；复制按钮=输出区图标行左一（1187,421 旧标，宽侧栏下 (1038,582)） |

## 落地清单（录完到 commit）

```
□ 7+1 张 gif+png 复制进 docs 仓库 public/demo/（路径用正斜杠，反斜杠 cp 会静默写错位置）
□ md5 抽查源/目标一致
□ npm run build 通过，.vitepress/dist/demo/ 资产齐全
□ npm run preview + puppeteer 抽查：功能页与首页 GIF 动画播放、poster 淡入结构、686px 列宽清晰度
□ 计划文档实施状态更新（逐张规格）
□ 只 add 本次文件 commit，不 push，部署等用户确认
□ 环境还原：demo 应用停掉（Services ■ 或按端口杀进程）、沙盒 IDE 关窗、并行登记 done --name 注销、IME 按需切回
```

## 相关文档

- 插件仓库 `docs/经验总结/20260910-0100-IntelliJ演示GIF录制-经验总结.md`——管线原理、平台坑完整版（§十为本轮增量）
- 插件仓库 `record/`——gifkit.py / assemble.py / shot.py / scene_t1~t8
- `docs/开发计划/20260907-1138-文档站演示图GIF化补齐与替换-开发计划.md`——本轮计划全历程与实施状态
- `docs/开发计划/20260909-脚本重放式录制-开发计划.md`——脚本重放管线立项

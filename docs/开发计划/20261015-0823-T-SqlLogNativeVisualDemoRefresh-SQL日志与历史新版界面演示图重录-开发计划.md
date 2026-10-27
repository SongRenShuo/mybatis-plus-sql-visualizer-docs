# SQL 日志与历史新版界面演示图重录开发计划

> 日期：2026-10-15
> 任务：T-SqlLogNativeVisualDemoRefresh
> 状态：**17 组已重录并替换 dev；构建及浏览器加载检查通过，待用户逐图目视验收**
> 插件录制分支：`master`（截至 `ab37ec3b` 已合入 O-146 / O-148 / O-149 与 robot-server 录制工具；正式开录前复核当时 master tip）
> 文档站承接：`mybatis-plus-sql-visualizer-docs` 的 `dev` 分支，当前基线 `e77af1e`
> 录制授权：用户将在录制沙盒启动后，**手工登录自己的 JetBrains 合法订阅账号**；未确认授权生效前不出正式素材
> 部署边界：只更新文档站 `dev` 并提交，**不部署生产站、不回流文档站 master**

## 一、背景

插件 `master` 已合入 SQL 日志与历史列表改造（`ab37ec3b`）；正式录制以开工当天的 master 实际代码和沙盒插件产物为准：

- O-146：列表语法色改用 IDEA Color Scheme；默认仍为关键字换行，最多三行并提示剩余行数；来源和 SQL 按宽度省略，取消横向滚动条。
- O-148：手动滚轮、拖动滚动条或键盘浏览后暂停尾部跟随；点「滚动到底部」恢复；排序移入左侧动作组，并新增同结构聚类、按目标库分组和「只看慢查询」。
- O-149：工具窗页签改用平台 JBTabs，窄侧栏下始终保持单行。

文档站当前多张日志／历史动图仍拍着旧界面，常见过时画面包括：

1. 右侧独立的文字排序按钮「时间升序／时间降序」。
2. 列表底部横向滚动条与超出视口的长 SQL。
3. 旧页签容器和旧历史 SQL 行布局。
4. 旧配色（固定 One Dark）而非当前 IDEA 语义色。
5. 尾部跟随动图没有覆盖新的「真实用户输入暂停」语义。

2026-10-15 已在 `dev` 增加 `sql-log-list-native-preview.gif` 做画面预览，但该片标题栏带 `Start Free Trial`，且只展示入列和同结构计数，不能证明完整尾随暂停语义。用户已确认它的方向可接受，但要求该预览本身也重录。

## 二、目标与非目标

### 2.1 目标

1. 重录 **16 组在役日志／历史动图**，使画面与 O-146 / O-148 / O-149 一致。
2. 重录 `sql-log-list-native-preview.gif/.png`，去掉试用横幅，保留为 `dev` 的新版列表综合预览。
3. 更新必须重拍的 GIF 与 poster；不受影响的旧 poster 继续复用，避免无意义重复劳动。
4. 录制脚本优先使用已经真机验证的 robot-server 组件树定位；组件未暴露时用 OpenCV 图像锚点，几何坐标只作最后兜底。
5. 全部素材只落文档站 `dev`，构建并提供本地预览给用户逐图验收。
6. 全部录完后另建新的验收文档；本轮已删除的 `20261015-文档站dev演示图更新-验收文档.md` 不再使用。

### 2.2 非目标

- 不改 SQL 日志／历史的产品行为；录制中发现真缺陷时另立任务，不把修产品和拍图混在一个提交里。
- 不重录不受 O-146 / O-148 / O-149 影响的 Wrapper、XML、JPA、SQL→Java、MCP 等素材。
- 不部署 Cloudflare Pages，不改文档站 master。
- 不以带 `Start Free Trial`、语言包提示、挂载气泡或错误弹窗的画面冒充正式成片。

## 三、录制环境与启动纪律

### 3.1 用户授权前置

沙盒启动后由用户手工完成 JetBrains 合法订阅账号登录。正式录制前必须同时满足：

- IDEA 标题栏不再显示 `Start Free Trial`。
- `Manage Subscriptions` / `License required` 不出现。
- Ultimate 的 Database 工具与数据源可用。
- 用户明确表示账号登录完成，且随后不再操作键鼠。

授权未就绪时可以做脚本定位和验证母片，但**禁止覆盖 `public/demo/` 的正式素材**。

### 3.2 标准启动命令

在插件仓库主工作树 `F:/code/Java/Gitee/SongRenShuo/mybatis-plus-sql-visualizer`（`master`）运行；先核对 `git branch --show-current` 为 `master`，并检查本次使用的插件提交已进入该分支：

```bash
python record/bootstrap-robot-server.py
./gradlew runIde -PgifRecord=true -PgifRobotServer=true \
  --args=F:/code/Java/Gitee/SongRenShuo/mybatis-plus-sql-visualizer-demo
```

解释：

- `-PgifRecord=true` 使用 IDEA Ultimate 2026.2.1 + 独立沙盒 `MPSV-GifFresh`。
- `-PgifRobotServer=true` 通过 `localPlugin(...)` 把 robot-server 与 SQL Visualizer、AI Assistant 一并安装。
- 不设置 `-Didea.plugins.path=<robot目录>`——它会替换整个插件目录，导致主插件丢失。
- 起完只认沙盒 `idea.log` 的落点和端口 8580，不按窗口标题猜实例身份。

### 3.3 构图基线

- 窗口：1370×984，屏幕位置 `(277,25)`。
- IDE Scale：120%；编辑器字号：13pt；主题：Islands Dark。
- 背景：Chrome 白色新标签页垫底。
- 导出：15fps、宽 1280；每张 GIF 配同名 PNG poster。
- 录制脚本与 IDE 同权限运行：

```powershell
Start-Process -FilePath 'cmd.exe' \
  -ArgumentList '/c','<abs>\record\_run_elev.bat','scene_xxx.py' \
  -Verb RunAs -WindowStyle Hidden -Wait
```

`-WindowStyle Hidden` 不能省；否则提权黑控制台会盖住 IDE，点击和滚轮全部打空。

### 3.4 定位优先级

1. `record/robot.py`：XPath 找唯一 Swing 组件，沿祖先链累加相对坐标，得到屏幕物理坐标。
2. `record/anchor.py`：OpenCV 模板匹配，灰度 + 多尺度；模板必须带文字／边框／图标，低方差模板禁止使用。
3. `record/locate.py`：窗口矩形、像素剖面、按钮行偏移。
4. 固定坐标：仅作为已验证构图下的最后兜底，点后必须用 `verify.Guard.after_click()` 验可见变化。

录制开工前先用以下动作校验定位链：

- XPath 切换「SQL 日志 / SQL 历史」页签。
- XPath 点击「清空」「滚动到底部」。
- 图像锚点点击捕捉按钮（robot-server 未暴露可访问名称时）。
- robot-server 截图返回 1920×1080 PNG。

## 四、素材清单（17 组）

### 4.1 重录规则

| 规则 | 素材 |
|---|---|
| GIF + PNG 都重拍 | `sql-log`、`enhanced-capture`、`slow-query-highlight`、`n1-badge`、`sql-log-tail-follow`、`sql-log-jump-source`、`sql-log-stack-jump`、`sql-suppress`、`sql-log-focus`、`sql-click-preview`、`history-export`、`history-compare`、`sql-log-list-native-preview` |
| 只重拍 GIF，旧 PNG 可保留 | `sql-list-display`、`sql-history`、`capture-diagnostics`、`datasource-badge` |

### 4.2 逐项录制要求

| # | 素材 | 当前在役落点 | 重录重点 | 录制前置 |
|---:|---|---|---|---|
| 1 | `sql-log-list-native-preview.gif/.png` | `features/sql-log.md` + en「SQL 高亮与耗时显示」的 dev 预览区 | 综合展示新版工具栏、IDE 语义色、宽度省略、无横向滚动、同结构计数；去掉试用横幅 | 8081 应用、捕捉开启、去重按场景控制 |
| 2 | `sql-log.gif/.png` | `features/sql-log.md` + en hero；首页 `FeatureAlternate.vue` | 日志主画面；新版工具栏、单行页签、列表语义色与无横向滚动 | 8081 应用从 IDE Run，稳定入列 |
| 3 | `enhanced-capture.gif/.png` | SQL 日志页 hero 下方 | 真实参数、毫秒耗时、影响行数、源码位置、MySQL 角标及一条执行报错；画面必须是新列表 | agent 在线、增强捕获已挂、工具窗宽度固定 |
| 4 | `slow-query-highlight.gif/.png` | 「慢查询与性能建议」 | 慢条目标红、慢查询计数；打开类型筛选显示「只看慢查询」；可顺带耗时降序 | demo 有 >1s 查询；列表内有普通查询对照 |
| 5 | `n1-badge.gif/.png` | 同节 | N+1 同结构徽章；打开排序图标显示「同结构聚类」；右键「只看同结构」 | `/logFeed/n1` 或 8082 `/mpj/perf/n1` |
| 6 | `sql-log-tail-follow.gif/.png` | 「滚动到底部与尾部跟随」 | **完整证明**：入列自动贴底 → 用户滚轮／滚动条／键盘任一输入暂停 → 新条目不抢视口 → 点滚底恢复 → 新条目继续贴底 | 先关去重；持续 MyBatis 灌流；不使用 JdbcTemplate storm 作为唯一来源 |
| 7 | `sql-log-jump-source.gif/.png` | 首页日志溯源 + SQL 日志页 | 新列表右键「跳转到源码」→ 编辑器精确落行业务代码 | 带真实源码位置的 agent 条目 |
| 8 | `sql-log-stack-jump.gif/.png` | 「从调用栈跳转」 | 预览 meta 行悬停调用栈 → 点中间业务帧 → 跳源码；背景列表与页签必须是新 UI | 带调用栈快照的增强捕获条目 |
| 9 | `sql-suppress.gif/.png` | 「SQL 屏蔽」 | 新列表右键屏蔽 → 行消失 → 管理屏蔽规则；背景不露旧排序控件 | 普通 SQL + 心跳 SQL；起手无屏蔽规则 |
| 10 | `sql-log-focus.gif/.png` | 「聚焦页签」 | 从新版日志列表开聚焦 → 聚焦页签 → 双击预览；四个主页签恒单行 | 带源码条目，工具窗宽度至少做一次窄宽验证 |
| 11 | `sql-list-display.gif` | 「三种显示模式」 | 设置中切模式 → 确定 → 列表按新布局重绘；默认仍为关键字换行，不误写成单行默认 | 设置页由用户人工滚到「列表显示」分组 |
| 12 | `sql-click-preview.gif/.png` | 「单击预览与双击弹窗」 | 新列表单击轻预览、复制、双击完整弹窗；背景页签单行且列表无横向滚动 | 捕获条目至少一条，浮层初态清干净 |
| 13 | `sql-history.gif` | 「SQL 历史」hero | 文件列表 → 二级 SQL 列表 → 检索 → 双击预览；二级列表使用新配色、省略和 JBTabs | 预置历史文件；历史页签按 XPath 切换 |
| 14 | `history-export.gif/.png` | 「导出与对比」 | 历史二级列表右键导出 → 格式选择/存盘；背景历史列表是新布局 | 预选条目、导出目录预先清理 |
| 15 | `history-compare.gif/.png` | 同节 | 两条历史多选 → 对比 → 差异视图；背景历史列表是新布局 | 二级列表至少两条不同 SQL |
| 16 | `capture-diagnostics.gif` | 「捕获诊断与授权」 | 空列表新版工具栏与诊断行 → 打开设置；不能露旧文字排序按钮 | 空列表；捕捉中零条目状态与未捕捉状态分别校准 |
| 17 | `datasource-badge.gif` | 「数据源上下文角标」 | 设置前后角标变化；返回日志后的列表使用新 UI | MySQL 条目带真实 URL；设置页人工滚到对应分组 |

## 五、批次与顺序

### 批次 0：授权与基线（不产正式图）

1. 在插件仓 `master` 启动录制沙盒并等待用户登录合法 JetBrains 订阅账号。
2. 核验标题栏无 `Start Free Trial`、无许可弹框、Database 工具可用。
3. robot-server 真机探活：`python record/robot.py probe`。
4. 恢复窗口构图、隐藏 Project 栏、展开 SQL Visualizer 工具窗至标准宽度。
5. 先拍 5 秒验证片并抽首／中／末帧；确认无授权横幅、通知气泡和外部窗口后，才启动正式批次。

### 批次 1：列表基线与性能（5 组）

`sql-log-list-native-preview` → `sql-log` → `enhanced-capture` → `slow-query-highlight` → `n1-badge`

理由：共用 8081/8082 运行态和列表构图，且先用预览片钉住配色、宽度省略和工具栏。慢查询/N+1 最后灌入，避免污染前两张的列表。

### 批次 2：尾随与定位（3 组）

`sql-log-tail-follow` → `sql-log-jump-source` → `sql-log-stack-jump`

尾随片必须在干净列表独立录，不复用 N+1 的大量历史条目；随后保留 agent 业务条目给两张跳转片。

### 批次 3：列表操作与显示（4 组）

`sql-suppress` → `sql-log-focus` → `sql-list-display` → `sql-click-preview`

屏蔽场景结束后删除规则；显示模式录完恢复默认「关键字换行」；预览片最后录，避免残留浮窗影响前面的列表操作。

### 批次 4：历史（3 组）

`sql-history` → `history-export` → `history-compare`

三张共用同一历史文件和二级列表；每张 take 前显式归一搜索词、选中态和右键菜单。

### 批次 5：空态与设置（2 组）

`capture-diagnostics` → `datasource-badge`

空态片必须在清空列表／停应用后录，放最后避免反复清场。设置页内容合成滚动无效，提前请用户人工滚到目标分组。

## 六、脚本改造要求

### 6.1 共性改造

16 个旧正式脚本都存在旧布局硬编码，不能直接执行。改造要求：

- 捕捉、清空、滚底、页签：优先 XPath。
- 捕捉按钮如无可访问名称：先悬停使动作渲染，再用 OpenCV 模板。
- 右键菜单与列表条目：先 robot-server 找容器矩形，再在容器局部用模板／像素检测；禁止全屏固定点。
- 预览弹窗：按 PID/窗口矩形定位；按钮优先 XPath，找不到再图像模板。
- 所有点击后增加可见变化校验；失败即中止，不继续盲飞。
- `Recorder.start()` 前完成文件打开、列表清空、数据预热、窗口取焦等 prep。
- 提权脚本统一加 `-WindowStyle Hidden`，避免黑控制台遮挡 IDE。

### 6.2 场景状态复位

- 每张片记录它会修改的状态：捕捉开关、去重、排序、筛选、屏蔽规则、设置项、历史搜索词、列表选中项。
- take 结束后立即恢复：默认关键字换行、去重开启、时间升序、筛选清空、屏蔽规则删除。
- demo 端口 8081 / 8082 按批次串行，不同时跑无关应用。
- 退出前按端口查 PID，提权关闭自有进程；不按进程名全杀。

## 七、页面落点与素材替换

1. 所有正式素材维持原文件名，直接同名替换，页面引用不改。
2. `sql-log.gif/png` 与 `sql-log-jump-source.gif/png` 同时服务首页组件，替换前后需单独检查首页桌面端与 375px 手机端。
3. `sql-log-list-native-preview.gif/png` 保留 dev 警示区块，但替换为授权干净版；正式 16 组录完后再评估是否仍需要长期保留。
4. 四组只换 GIF 的素材不得误删旧 PNG：`sql-list-display.png`、`sql-history.png`、`capture-diagnostics.png`、`datasource-badge.png`。
5. 全部只提交文档站 dev；用户验收通过后另行决定是否合入 master／部署。

## 八、验收门禁

### 8.1 每张成片

- 1280 宽、15fps、GIF 多帧；同名 PNG poster。
- mp4 帧数与 Recorder 打印一致。
- 首／中／末关键帧逐张检查；无输入法候选框、授权横幅、通知气泡、文档浮层、列类型 tooltip。
- 无旧右侧文字排序按钮；排序动作在左侧工具组。
- 无列表底部横向滚动条；长 SQL 按宽度省略。
- 四个主页签在目标窄宽下保持单行。
- IDE 语法色跟随当前 Color Scheme；默认显示仍为关键字换行。

### 8.2 O-148 专项

`sql-log-tail-follow.gif` 必须从画面本身可判：

1. 入列时视口贴底。
2. 真实用户输入后视口停住。
3. 暂停期间仍有新条目入列，但视口不被抢走。
4. 点「滚动到底部」后跳到尾部。
5. 恢复后后续条目继续贴底。

少任一步都不能写「尾部跟随已验收」。

### 8.3 文档站

```bash
npm run build
```

构建后核对：

- `.vitepress/dist/demo/` 17 组素材均在。
- 中英 `features/sql-log` 均命中对应 GIF。
- 首页组件命中 `sql-log.gif/png` 与 `sql-log-jump-source.gif/png`。
- `sql-log-list-native-preview.gif` 无 `Start Free Trial`，dev warning 文案更新为正式预览口径。
- 全站 `/demo/*` 引用零缺失。

随后启动 `dev` 本地站点并保持运行，由用户真实浏览器验收动画播放和构图；验收前不停止服务。

## 九、待验证前提

1. 用户登录合法订阅后，授权状态能在该沙盒会话内稳定维持，且不触发 Restarter 回落为日常 IDE。
2. robot-server 对本轮需要的页签、工具栏、设置控件和弹窗按钮都能给出唯一 XPath；若多命中，脚本必须缩小到唯一组件，不得取第一项。
3. `sql-log-tail-follow` 的滚轮/滚动条/键盘暂停语义需重新选一条可稳定自动化的真实用户输入；当前验证母片未充分证明该分支。
4. 增强捕获、调用栈与源码跳转需在账号授权、应用 attach 和 Maven 导入均正常后再录；否则只能写「环境受限未验证」。
5. 设置页内容合成滚动仍按本机实测视为 no-op；需要首屏之下控件时提前安排用户人工滚到位。
6. 旧历史文件是否足够展示检索、导出和对比，在批次 4 开始前先盘点；不够时只补演示数据，不改产品语义。
7. 插件 `master` 后续若继续改变日志列表、排序或页签，在正式录制前重新跑一次视觉差异盘点，避免拍完即过期。

## 十、交付物

### 10.1 素材

- 17 组 GIF/PNG，按 §4 的重录规则覆盖文档站 dev。
- 对应无损 MP4、关键帧抽图与脚本留在插件仓 `master` 的录制工作区／录制归档，不进入文档站。

### 10.2 脚本

- 16 个正式场景脚本完成新版布局改造。
- robot-server XPath 和图像模板命名统一，低方差模板拒绝。
- 开录前的 `require_component` / `require_anchor` 与点后可见变化闸门在场。

### 10.3 文档

- 本开发计划回填每批实施读数。
- 全部录完后新建一份验收文档，按「页面 → 素材 → 关键画面 → 构建／浏览器结果」逐项核对。
- 不恢复已删除的 `docs/20261015-文档站dev演示图更新-验收文档.md`。

## 十一、实施记录

2026-10-15 批次 0：插件仓 `master` 以 §3.2 标准 Gradle 命令启动录制沙盒；首次启动后 IDE 退出，用户反馈已在沙盒完成订阅授权，因此以相同命令重启。重启实例的 `robot-server` 探活成功（`//div` 根节点数 127），沙盒 `idea.log` 落在 `build/MPSV-GifFresh/.../log/`。重启后标题栏一度仍显示 `Start Free Trial`；用户再次在当前沙盒完成授权后，2026-10-15 当前窗口截图已无该横幅。随后通过当前 UI 核对：Database 工具窗可打开并显示数据源，工具窗内的云数据库引导已关闭，`Restart advised` 通知消失；沙盒窗口归位到 `(277,25)`、`1370×984`，Project 栏关闭、SQL Visualizer 日志页展开。robot-server 截图为 `1920×1080`；页签、清空与滚底组件均可查询。5 秒验证片 `record/perf/native-refresh-validation.mp4` 录得 64 帧，`ffprobe` 解码也为 64 帧、15fps、`1370×984`；首、中、末帧均无授权横幅与通知。本片只验环境，正式素材尚未覆盖。

### 批次 1 进度（2026-10-16 回填，未最终验收）

- 耗时分档：用户反馈正常耗时变灰后暂停录制。确认 `SqlEntryPresentation` 对低于半阈值耗时二次覆盖为灰；修复提交 `fea2640a` 移除覆盖，保留绿／橙／红与未知灰。定向测试修复态通过，恢复旧覆盖后 4 测试恰 1 失败；真机已观察到 `1ms` 绿色、`1211ms` 红色。旧灰色母片不用于最终交付。
- demo 的固定主键重复 INSERT 不再作为录制错误语料；提交 `28b994c` 增加只读 `/logFeed/sqlError`。IDE Run 编译运行后实测 HTTP 500，列表与控制台均出现真实 SQL 语法错误。
- 已有候选素材：综合预览、日志主图、增强捕获、慢查询。仍需按完整分镜验收，不能仅凭 poster 判已交付；综合预览还须补齐明确的“同结构 N 条”徽章（“×N”去重计数不是同一功能）。所有候选仍在插件仓 `record/perf/`，未覆盖文档站正式资源。
- 慢查询母片 `s1_slow_query_native.mp4`：Recorder/ffprobe 均 113 帧，1370×984、15fps；转制 99 帧、1280 宽、6.6 秒。截图可见普通查询绿色、SLEEP 耗时 1211ms 红色、“慢 1”、勾选后仅慢条目、复位后普通条目恢复。首末状态存在结构性变化（全列表→仅慢查询），转制器接缝均值 1.43，不能记为无缝循环。
- “只看慢查询”实际位于“全部”类型下拉的 JCheckBox；漏斗打开的是持久化屏蔽规则管理，用户询问后决定不移动慢查询筛选。
- 用户授权精简去重标签为“SQL 去重”；子智能体仅改 `log.panel.dedupe` 中文资源一行，未改行为。当前沙盒尚未加载该文案，最终正式素材需统一新标签后再核验，避免新旧混杂。
- 新增 robot-server 重量级弹出菜单坐标回归：其 HeavyWeightWindow 已是屏幕坐标，不得重复加 IdeFrame 偏移；用实际菜单坐标做样本，修复前测试红、修复后 5 测试通过。相关工具改动尚未独立提交。

### 批次 2 候选片与验证读数（2026-10-16）

- N+1 母片 `s3_n1_native.mp4` 共 126 帧，转制 126 帧/8.4 秒/约 0.5MB。已逐步实测“同结构 5 条”徽章、原生排序菜单“同结构聚类”、右键“只看同结构”、聚焦关闭和恢复时间升序。首末结构改变，接缝均值 1.67，非无缝片。
- 尾随母片 `a7_tail_follow_native.mp4` 共 132 帧，转制 132 帧/8.8 秒/约 2.1MB。`a7_tail_follow_native-evidence.json` 记录五步：following 到底；拖动后 y=-1046；追加数据后 height 2858→3333、y 仍 -1046；滚底后到底；再次追加后 height 3808→4758，仍到底。真实滚动条拖动路径已证实，滚轮和 PageUp 在本机合成输入下未可靠暂停，未用于正式五步证据。
- 源码跳转母片 `a1_jump_native.mp4` 共 77 帧，末帧业务代码 `UserServiceImpl.java:41` 与日志来源一致；菜单项通过 XPath 定位。调用栈场景正在校准。
- robot 定位新增独立对话框坐标起点处理：MyDialog 与 HeavyWeightWindow 都从最近的顶层窗口计算，不能重复叠加主窗口坐标。新增对话框回归先红后绿，当前 6 测试通过。

### 批次 3 当前验证（2026-10-16）

- 调用栈候选片已完成：85 帧，点击 `UserController:38` 业务帧后关闭 SQL 预览，让落行源码显露。保留当前实际的内部帧折叠 UI。
- 聚焦片已重录：126 帧，真实右键“聚焦调用方方法”、单行主页签、双击完整预览、关闭聚焦恢复列表。
- 预览片按 master 当前行为校正：默认单击只选择，显式开启快速预览后底部展示 SQL，复制后剪贴板确含 SELECT/FROM，双击完整弹窗。母片/转制均 138 帧、9.2 秒、约 1.1MB。不能把当前默认行为继续描述为“默认单击即弹出预览”。
- 屏蔽场景已验证规则创建、条目消失与删除恢复，但候选片带操作通知，暂不作为正式素材；规则已删除，未保留本轮屏蔽状态。
- 设置滚动前提更新：当前沙盒使用 `NonModalWindowWrapper$FloatDialog`，按组件树定位右侧滚动条并拖动，已把“SQL 显示模式”和数据源角标项滚到可视区。因此本轮无需人工滚动；旧“所有合成滚动都无效”不适用于这次已验证的拖动路径。FloatDialog 坐标用例先红后绿，robot 回归仍为 6 测试通过。

### 历史与设置候选片（2026-10-16）

- 显示模式母片 83 帧：关键字换行切单行，录后恢复关键字换行，前后列表截图已比对。
- 数据源角标母片 73 帧：完整上下文展示 `mp_demo@localhost:3306`，录后复位关闭。
- 历史检索母片 128 帧：打开 2026-10-13 的既有历史文件，搜索 SLEEP 实际得到 5 条，双击预览并清空搜索。历史对比已实测两条不同 SQL 的平台 Diff；候选末帧的长 SQL 单行可读性仍需最终检查。
- 历史导出改用原生保存框控件定位：文件 `record/tmp/history-export-verified.sql` 实际 685 字节，包含选中的 COUNT 与 car_device_info 查询；母片 1713 帧（含工具交互等待），转制保留 148 帧/9.9 秒/约 1.3MB。之前快捷键导出尝试误将路径贴入 UserController.java，已通过撤销恢复并确认该文件 Git diff 为零；误导出的默认文件留在 Maven 驱动目录，未当作目标产物。
- 诊断空态已录到捕获中诊断、停止后引导、点击设置链接定位增强捕获分组；录后关闭设置，不改变设置值。
- 屏蔽校准产生的 SELECT 1 规则已删除，清理日志确认“demo suppression rule removed”。原屏蔽候选通知气泡问题仍未验收。
- 上述全部是候选件。还需统一加载“SQL 去重”标签、完成全部分镜与隐私检查、正式替换 dev、构建浏览器验收及提交；本计划目标未完成。

### 最新阻塞：统一标签后的授权门禁（2026-10-16 03:31 起）

- 旧沙盒通过窗口退出、逐个终止演示应用并断开已结束的陈旧会话后正常关闭；对应 runIde 退出码 0，未强杀 IDE。
- 再用计划标准命令启动后，新实例 PID 24188，日志在原 MPSV-GifFresh 路径，工具栏“SQL 去重”已完整显示。新标签实际加载、窄栏可见均已确认。
- 但新会话日志出现 `License required; details: N/A`，组件树仍有 `Manage Subscriptions`，主窗口 disabled。当前正式录制被授权门禁阻塞，需用户在此实例核实合法订阅。没有关闭许可框冒充通过，也没有生成带该状态的新正式图。
- 此次正常退出仍出现授权问题，故不能把失效归因为强杀导致未落盘；早先该解释没有证据，应撤回。没有试用横幅也不能单独证明订阅有效，须结合许可对话框和功能验证。
- 17 条候选 MP4 均有可解码产物（统一 1370×984、15fps），但尚未全部满足分镜与新标签一致性，不代表交付完成。网站正式素材未替换，构建／浏览器验收／最终提交仍未完成。

### 最终 dev 交付（2026-10-16）

用户再次处理订阅后，按同一 Gradle 命令启动；实际 config/log 路径连续五次相同，idea.key 与 vmoptions 启动前后摘要一致，没有观察到被启动流程清除。当前无许可对话框；不再推断失效原因。

17 组已重录／转制并替换 dev 的 17 个 GIF、13 个 PNG；四张约定旧 poster 原样保留。所有带日志工具栏的最终片统一“SQL 去重”；增强捕获补齐 WHERE id=NULL 的零匹配 UPDATE，实际显示 0 rows；综合预览已出现同结构 5 条。屏蔽片为真实操作两段连接，通知关闭等待不入镜，规则已删除。

两次 `npm run build` 均成功，最终说明版本已重建；`.vitepress/dist/demo/` 与 public/demo 逐文件摘要一致；17 组页面引用在场、扫描得到 73 个演示资源引用零缺失。中英文功能页各 20 个演示图片浏览器加载成功；首页共用两组 GIF/PNG 正常，1440px 桌面和 375px 手机无横向溢出，亮暗主题页面均已观察。

本地预览 `http://127.0.0.1:4173/` 保持运行。新的逐图验收文档为 `../验收文档/20261016-SQL日志与历史新版演示图-验收文档.md`，列出每张图的位置、证据、剪辑例外与待用户目视确认项。未部署、未回流站点 master。用户实际浏览器的逐图播放与构图确认仍待进行，不把自动加载检查写作用户验收。

## 十二、实施前确认（历史开工顺序）

本文件最初写完时停止录制；随后用户已发出实施指令。开工顺序为：

1. 从插件仓 `master` 用 §3.2 的 Gradle 命令启动带 robot-server 的录制沙盒。
2. 用户手工登录合法 JetBrains 订阅账号。
3. 用户确认不再占用键鼠。
4. 批次 0 探活与验证片通过。
5. 再开始批次 1 的正式素材重录。

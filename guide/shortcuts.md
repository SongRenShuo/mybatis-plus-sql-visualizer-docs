# 快捷键与触发方式速查

Windows / Linux 与 macOS 的默认键位，以及各功能的入口方式。

## 快捷键

| 功能 | Windows / Linux | macOS |
|------|-----------------|-------|
| SQL 预览（Wrapper / XML / 注解 / HQL·JPQL / 自定义 DAO HQL / JdbcTemplate / `@NamedQuery` / `.hbm.xml` 命名查询 / 方法体内字符串 SQL） | `Alt+Shift+Q` | `Option+Shift+Q` |
| SQL → Java 反向转换 | `Alt+Shift+J` | `Cmd+Shift+J` |
| 预览弹窗中执行 SQL（Ultimate + Database 插件） | `Ctrl+Enter` | `Cmd+Enter` |

键位可在 IDE 的 `Settings` > `Keymap` 中搜索插件动作名自行修改。

## 非快捷键入口

| 功能 | 入口 |
|------|------|
| SQL 预览 | 光标置于 Wrapper 链 / mapper 语句上 → 右键 `Convert to SQL`；或行首 gutter 图标（Wrapper 锚点左键直接预览、右键可选「最近执行记录」） |
| 注解 SQL 预览 | `@Select` / `@Update` 等注解行的 gutter 图标 |
| JPA / Hibernate 预览 | 派生方法 / CRUD 调用 / `@Query` / `@NamedQuery` / Criteria 链 / `.hbm.xml` 命名查询所在行的 gutter 图标 |
| EXPLAIN 执行计划 | 预览面板按钮行「执行计划」按钮（英文界面 EXPLAIN） |
| SQL 快捷模板（EXPLAIN / COUNT / 抽样 10 行） | 在 mapper XML 或预览编辑器里选中表名 → 右键菜单「SQL 快捷模板」组；默认不占键位，可在插件设置页「快捷键」节或 Keymap 自绑 |
| SQL → Java | 选中 SQL 文本 → 右键菜单；或工具窗口侧边栏 tab |
| SQL 日志工具窗口 | 底部工具窗口栏；自动捕获控制台 MyBatis 日志，可开启「项目启动时自动开始监听」 |
| 批量操作参数面板 | 预览弹窗内的参数面板 |
| 复制 SQL 并关闭 | 预览面板底部蓝色主行动（一次复制当前 SQL 并关掉面板） |
| 预估影响行数 | 预览面板「更多」菜单（仅 UPDATE / DELETE） |
| 导出回放脚本 / 导出可移植 SQL | 预览面板「更多」菜单 |
| 复制为 AI 上下文 | 预览面板「更多」菜单（另有「含表列名」出口） |
| 一键诊断报告 | 预览面板「更多」→「分享」→ 复制 / 导出诊断报告 |
| 历史列表直达末条 | SQL 历史二级列表工具栏「↓≡」 |
| 加入交流群 | SQL 日志工具栏靠右的聊天气泡图标（它右侧只剩帮助「?」） |

## 使用提示

- 预览弹窗是非模态窗口，可以边看 SQL 边改代码
- SQL → Java 支持四种目标形态，转换结果可直接粘贴回项目
- Ctrl+C 在所有带 SQL 编辑器的界面里语义一致：无选中复制全文、圈选后只复制片段（Ctrl+Insert 同义）；列表上的 Ctrl+C 复制纯 SQL，而不是渲染出来的文本
- macOS 上如果 `Option+Shift+Q` 打出了特殊字符，是输入法拦截，可在 Keymap 中改绑

# 快捷键与触发方式速查

Windows / Linux 与 macOS 的默认键位，以及各功能的入口方式。

## 快捷键

| 功能 | Windows / Linux | macOS |
|------|-----------------|-------|
| SQL 预览（Wrapper / XML / 注解 / HQL·JPQL / 自定义 DAO HQL / JdbcTemplate / `@NamedQuery`） | `Alt+Shift+Q` | `Option+Shift+Q` |
| SQL → Java 反向转换 | `Alt+Shift+J` | `Cmd+Shift+J` |
| 预览弹窗中执行 SQL（Ultimate + Database 插件） | `Ctrl+Enter` | `Cmd+Enter` |

键位可在 IDE 的 `Settings` > `Keymap` 中搜索插件动作名自行修改。

## 非快捷键入口

| 功能 | 入口 |
|------|------|
| SQL 预览 | 光标置于 Wrapper 链 / mapper 语句上 → 右键 `Convert to SQL`；或行首 gutter 图标（Wrapper 锚点左键直接预览、右键可选「最近执行记录」） |
| 注解 SQL 预览 | `@Select` / `@Update` 等注解行的 gutter 图标 |
| JPA / Hibernate 预览 | 派生方法 / CRUD 调用 / `@Query` / `@NamedQuery` / Criteria 链所在行的 gutter 图标 |
| EXPLAIN 执行计划 / 生成测试资产 | 预览面板按钮行「EXPLAIN」「生成测试」按钮 |
| SQL → Java | 选中 SQL 文本 → 右键菜单；或工具窗口侧边栏 tab |
| SQL 日志工具窗口 | 底部工具窗口栏；自动捕获控制台 MyBatis 日志 |
| 批量操作参数面板 | 预览弹窗内的参数面板 |

## 使用提示

- 预览弹窗是非模态窗口，可以边看 SQL 边改代码
- SQL → Java 支持四种目标形态，转换结果可直接粘贴回项目
- macOS 上如果 `Option+Shift+Q` 打出了特殊字符，是输入法拦截，可在 Keymap 中改绑

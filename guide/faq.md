# 常见问题 FAQ

## 插件支持哪些 IDE 版本？

IntelliJ IDEA 2024.3 及以上（`since-build=243`）。兼容 2024.3 / 2025.3 / 2026.2 全系列。Community 与 Ultimate 均支持，但「执行 SQL」功能需 Ultimate + Database 插件。

## 为什么 gutter 图标不显示？

Gutter 图标仅在以下位置出现：

- Wrapper 链末尾行（`.eq()` 等终止调用所在行）
- mapper XML 的 `<select>` / `<update>` 等语句行
- Java Mapper 接口中 `@Select` 等注解行

确认光标位于上述位置；如仍不显示，检查设置页「代码左侧显示预览 SQL 图标」是否开启。

## 支持 MyBatis-Plus-Join（MPJ）联表查询吗？

支持。`MPJLambdaWrapper` 与 `MPJQueryWrapper` 联表预览、以及 MPJ 形态的 SQL→Java 反向转换均已实现。反向转换选择 MPJ 形态时，项目需引入 `mybatis-plus-join` 依赖（1.5.6+）。

## 预览 SQL 与实际运行 SQL 有差异吗？

预览目标是对齐 MP 运行时语义，以下差异是静态求值的固有特性，语义等价、仅文本不同：

| 差异 | 说明 |
|------|------|
| **静态常量内联** | `in(col, DicConstants.A)` 等静态 final 常量被求值内联（预览 `IN (1)`）；MP 运行时渲染 `IN (?)$` |
| **集合单占位符** | `in(col, 集合变量)` 运行时大小无法静态展开 → 预览 `IN (?)`；面板输入框支持逗号分隔回填 |
| **分页字面量计算** | `page(new Page<>(1, 10), wrapper)` 直接计算 `LIMIT 0, 10`；运行时渲染 `LIMIT ?, ?` |

## `?` 占位符能不能识别并替换为实际值？

可以。左侧面板输入框支持逗号分隔多值回填（输入 `1,2,3` → 渲染为 `(1, 2, 3)`）。LIKE 参数自动拼百分号。按字段类型决定是否加引号。设置页「替换 ? 占位符」默认开启，关闭后变量也渲染为 `?`。

## SQL 日志捕获不到 SQL 怎么办？

排查步骤：

1. 确认已点击侧边栏「捕捉」按钮开始监听（按钮变为「停止」）
2. 确认应用日志包含 `Preparing:` / `Parameters:` 格式
3. 如日志格式为 `==> Preparing:`，需开启设置页「启用混合前缀」
4. 检查是否被「移除包含关键字」过滤规则命中
5. 确认日志输出到运行控制台（非独立日志文件）

## SQL → Java 反向转换生成的代码能直接编译吗？

可以。生成代码严格基于 MyBatis-Plus 公开 API（以本地 jar 反编译为唯一权威），不含虚构方法。自动推断实体类后使用 Lambda 形态生成类型安全代码；找不到实体时回退字符串列 `QueryWrapper`。

## 如何切换插件界面语言？

`Settings → Tools → MyBatis-Plus SQL Visualizer → 界面语言`。支持 简体中文 / English / 跟随系统。插件语言独立于 IDE 语言设置，切换后重新打开预览弹窗即生效。

## 支持哪些数据库方言的分页语法？

9 种：MySQL、PostgreSQL、Oracle、SQL Server、H2、SQLite、MariaDB、DM（达梦）、KingBase（金仓）。分页子句和 upsert 冲突子句按方言差异渲染。

## 快捷键冲突怎么办？

在插件设置页点击快捷键旁的「编辑」按钮重新录制。若与其他插件冲突，弹窗提供「使用」（共存）或「强制使用」（抢占）选项。也可在 `Settings → Keymap` 中直接修改。

## 反馈问题需要提供什么信息？

请到 [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) 提交反馈。建议附上：

- 插件版本号（设置页「内部构建号」可一键复制）
- IDE 版本（`Help → About`）
- 复现步骤与示例代码
- 相关日志或截图

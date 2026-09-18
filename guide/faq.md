# 常见问题 FAQ

## 插件支持哪些 IDE 版本？

IntelliJ IDEA 2024.3 及以上（`since-build=243`）。兼容 2024.3 / 2025.3 / 2026.2 全系列。Community 与 Ultimate 均支持，但「执行 SQL」功能需 Ultimate + Database 插件。

## 为什么 gutter 图标不显示？

Gutter 图标仅在以下位置出现：

- Wrapper 链末尾行（`.eq()` 等终止调用所在行）
- mapper XML 的 `<select>` / `<update>` 等语句行
- Java Mapper 接口中 `@Select` 等注解行
- Hibernate HQL 调用行（`session.createQuery(...)`）与 JPA `@Query` 注解行、Repository 推导方法行

确认光标位于上述位置；如仍不显示，检查设置页「代码左侧显示预览 SQL 图标」是否开启。多行 `+` 拼接的 HQL 字符串同样支持 gutter 图标。

## 支持 MyBatis-Plus-Join（MPJ）联表查询吗？

支持。`MPJLambdaWrapper` 与 `MPJQueryWrapper` 联表预览、以及 MPJ 形态的 SQL→Java 反向转换均已实现。反向转换选择 MPJ 形态时，项目需引入 `mybatis-plus-join` 依赖（1.5.6+）。

## 为什么 JPA 的 findAllById 没有预览？

JPA 派生查询的第一批尚未包含 `findAllById` 这类 IN 展开形态，暂无法生成预览，后续版本补齐，已列入[开发路线](../about/roadmap.md)。

## 预览 SQL 与实际运行 SQL 有差异吗？

预览目标是对齐 MP 运行时语义，以下差异是静态求值的固有特性，语义等价、仅文本不同：

| 差异 | 说明 |
|------|------|
| **静态常量内联** | `in(col, DicConstants.A)` 等静态 final 常量被求值内联（预览 `IN (1)`）；MP 运行时渲染 `IN (?)$` |
| **集合单占位符** | `in(col, 集合变量)` 运行时大小无法静态展开 → 预览 `IN (?)`；面板输入框支持逗号分隔回填 |
| **分页字面量计算** | `page(new Page<>(1, 10), wrapper)` 直接计算 `LIMIT 0, 10`；运行时渲染 `LIMIT ?, ?` |

## `?` 占位符能不能识别并替换为实际值？

可以。左侧面板输入框支持逗号分隔多值回填（输入 `1,2,3` → 渲染为 `(1, 2, 3)`）。LIKE 参数自动拼百分号。按字段类型决定是否加引号。设置页「替换 ? 占位符」默认开启，关闭后变量也渲染为 `?`。

## EXPLAIN 点击失败或没反应？

最常见原因是未配置数据源：「EXPLAIN」与「执行 SQL」一样依赖 IntelliJ IDEA Ultimate 的 Database 工具窗，先在里面配好数据源再试。Oracle / SQL Server 暂不支持 EXPLAIN，点击后面板内会给出提示。执行出错时错误信息直接显示在面板内，不会弹窗。

## SQL 日志捕获不到 SQL 怎么办？

排查步骤：

1. 确认已点击侧边栏「捕捉」按钮开始监听（按钮变为「停止」）
2. 确认应用日志包含 `Preparing:` / `Parameters:` 格式
3. 如日志格式为 `==> Preparing:`，需开启设置页「启用混合前缀」
4. 检查是否被「移除包含关键字」过滤规则命中
5. 确认日志输出到运行控制台（非独立日志文件）

## gutter 右键「最近执行记录」是空的？

「最近执行记录」从本次会话捕获的日志里反查该位置附近的执行，需要日志捕获处于开启状态，且此前已捕获过该位置的执行。新会话刚启动、还没跑过 SQL 时菜单项为空，属正常现象。日志一直捕获不到时，先按上一节的步骤排查。

## 实时日志「跳转到源码」跳不准怎么办？

SQL 日志本身不含调用位置，未做任何配置时插件按表名搜索实体做近似跳转，可能落空。要精确跳转到触发 SQL 的 Service / Controller 行，请把插件自带的自包含拦截器 `SqlSourceInterceptor`（见插件仓库 `docs/instrumentation/SqlSourceInterceptor.kt`）复制到项目并注册为 MyBatis-Plus `InnerInterceptor`，详见[功能详解 · 跳转到源码](../features/sql-log.md#跳转到源码)。不配置也不影响其他功能。

## 自动弹出的日志窗口能彻底关掉吗？

可以。「发现 SQL 时自动打开日志窗口」默认开启，捕获到第一条 SQL 时会自动展开日志窗口；手动关掉后，本次会话内不会再自动弹出。想彻底关闭，在设置页把「发现 SQL 时自动打开日志窗口」关掉即可；重新开启该开关或重启 IDE 后恢复自动展开。

## 升级后 SQL 历史记录去哪了？

v2026.9.2 起，插件在项目内的数据目录由 `.idea/mybatis-plus-sql-visualizer/` 改名为 `.idea/sql-visualizer/`（历史 SQL 与执行临时文件）。此次更名不做旧数据迁移，升级后历史 SQL 从新目录起算重新积累；如需保留旧记录，可手动把旧目录 `sql-history/` 下的 `.sql` 文件复制到新目录。

## 升级后我的 SQL 方言怎么变了？

v2026.9.18 起，数据库方言默认改为「智能推断（跟随数据源）」：插件优先按增强捕获连接的 JDBC URL、其次按 IDE 数据源配置自动判定方言，都没有时回退 MySQL。老配置里如果从未手动设置过方言，升级后会自动进入推断模式（原默认 MySQL）。

想固定某个方言，在设置页把方言手动选定即可，分页 / upsert 等渲染都按选定方言走；随时可以切回「智能推断」。

## SQL → Java 反向转换生成的代码能直接编译吗？

可以。生成代码严格基于 MyBatis-Plus 公开 API（以本地 jar 反编译为唯一权威），不含虚构方法。自动推断实体类后使用 Lambda 形态生成类型安全代码；找不到实体时回退字符串列 `QueryWrapper`。

## 如何切换插件界面语言？

`Settings → Tools → SQL Visualizer → 界面语言`。支持 简体中文 / English / 跟随系统。插件语言独立于 IDE 语言设置，切换后重新打开预览弹窗即生效。

## 内网 / 无外网环境能用吗？

可以，核心功能完全离线——预览、参数回填、反向转换、日志还原、JOIN 图、格式化、CRUD 生成都不需要外网，插件也没有遥测或账号校验。仅「检查更新」与「提交反馈」两个可选入口会访问外网，失败时只提示不阻塞。

内网部署另需注意两点：执行 SQL 所需的 JDBC 驱动要提前预置（驱动缺失时是 IDE 平台联网下载），以及可用系统属性把更新源换成内网地址。详见[内网与离线环境](./offline.md)。

## 支持哪些数据库方言的分页语法？

9 种：MySQL、PostgreSQL、Oracle、SQL Server、H2、SQLite、MariaDB、DM（达梦）、KingBase（金仓）。分页子句和 upsert 冲突子句按方言差异渲染。

## 快捷键冲突怎么办？

在插件设置页点击快捷键旁的「编辑」按钮重新录制。若与其他插件冲突，弹窗提供「使用」（共存）或「强制使用」（抢占）选项。也可在 `Settings → Keymap` 中直接修改。

## 反馈问题需要提供什么信息？

请到 [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) 提交反馈。建议附上：

- 插件版本号（设置页「内部构建号」可一键复制）
- IDE 版本（`Help → About`）
- 复现步骤与示例代码
- 相关日志或截图

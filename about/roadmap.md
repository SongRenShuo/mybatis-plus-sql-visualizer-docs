---
prev:
  text: 更新日志
  link: /about/changelog
next: false
---

# 开发路线

插件功能的计划与进度。

## 已完成

### 预览与诊断

- [x] Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ 联表 / Kotlin）
- [x] XML / 注解动态 SQL 预览（OGNL 面板、`maintainPage` XML）
- [x] HQL / JPQL / JPA Criteria 预览，HQL `SELECT 实体别名` 自动展开为列清单
- [x] `.hbm.xml` 命名查询预览（`<query>` / `<sql-query>`，`createNamedQuery` 自动回落 hbm 定义）
- [x] JPA Repository CRUD 写路径预览（save / findById / findAllById / delete 家族 / flush 语义），派生查询深化（六前缀、Pageable / Sort、Page / Slice / Stream 返回），Specification 与 QueryByExample
- [x] 其他 ORM 链式框架预览第一批：xbatis、Easy-Query、MyBatis Dynamic SQL、Querydsl、Spring Data JDBC / R2DBC
- [x] 自研 DAO 字符串 SQL 方法定义锚点（方法名行 gutter 图标，快捷键在方法定义处生效）
- [x] gutter 锚点左键直接预览、右键反查最近执行记录
- [x] SQL 预览字段列表自动折叠（SELECT / INSERT 列清单、VALUES 组、UPDATE SET 收起为「… N 列」占位符，阈值可配，默认关）
- [x] 真实 EXPLAIN 执行计划（按方言包装提交原生数据库控制台，MySQL / PostgreSQL / 金仓 / 达梦真机验证；MySQL / MariaDB 对齐 IDEA 原生计划表格形态）
- [x] JOIN 关系可视化图（IDEA 原生 Diagrams 引擎渲染，Diagrams 缺席自动回退自绘；数据源可用时列类型 / 注释取 DB 真实值）
- [x] SQL 性能分析建议（索引缺失 / 全表扫描等 20 条规则）
- [x] Wrapper 链复杂度评分
- [x] 逻辑删除 / 多租户 / 动态表名 / 数据权限拦截器模拟
- [x] 9 种数据库方言分页 / upsert 渲染（保留字按官方文档全量校准，H2 upsert 为原生 `MERGE INTO ... KEY`）
- [x] 方言智能推断（默认跟随数据源：增强捕获连接 URL 优先、IDE 数据源次之、回退 MySQL，状态行显示推断依据，手动选定后按手动值生效）
- [x] 预览可靠性增强（跨命名空间 include 解析、动态条件支持面预检标注、`${}` 注入确认闸门、参数面板类型契约、`${table}` 快捷模板）
- [x] 执行护栏（执行超时设置、执行确认的无界写发现清单）

### 转换与补全

- [x] SQL → Java 反向转换（AUTO / QueryWrapper / Lambda / Wrappers / MPJ 五形态，多表 JOIN）
- [x] SQL 代码补全（表列名、注释提示）
- [x] Wrapper 方法链智能补全（`.eq(` 后提示后续方法与字段）
- [x] 批量操作参数面板（列级勾选、批量导入）
- [x] 实体类 / 数据库表右键生成 CRUD SQL（INSERT / UPDATE / SELECT / DELETE 候选浮层选定后进预览；自增主键默认不勾、`@Version` 列乐观锁自动追加、逻辑删除实体出对应变体；Community 版仅实体侧入口）
- [x] 预览一键生成回滚 SQL（对当前预览的 INSERT / UPDATE / DELETE 生成对应逆向 SQL——INSERT 按主键删、UPDATE 还原原值、DELETE 按 WHERE 重插，弹窗展示一键复制）

### 日志与历史

- [x] SQL 日志工具窗口（MyBatis / Hibernate / JdbcTemplate 日志捕获含多行语句与双路打印合并，Log → SQL 批量还原）
- [x] 耗时显示与慢查询检测（阈值着色、按耗时排序）
- [x] 精确跳转源码——运行期 `InnerInterceptor` 标记调用点，精确 `file:line` 跳转；支持设置页一键自动注入拦截器（多模块项目弹窗勾选注入范围）；跳转仅认拦截器捕获的真实位置；多模块源根跳转容错
- [x] 首条 SQL 自动展开日志工具窗（默认开、防抖不抢焦点，手动关闭后本会话抑制，再次运行项目解除抑制）
- [x] 项目启动时自动开始监听（打开项目 / 运行项目自动捕捉，手动停止后再次运行项目自动恢复）
- [x] SQL 日志列表行号（`#N` 会话内捕获序号，启动项目重新计数；历史列表按文件内条目顺序显示行号）
- [x] 单击预览（SQL 高亮轻量预览可直接编辑，复制带对号反馈；双击仍开完整弹窗）
- [x] SQL 日志 / 历史列表三种显示模式（单行 / 关键字换行 / 格式化，默认关键字换行，设置页切换即时生效）
- [x] SQL 列表多选批量复制（右键一次复制全部选中 SQL，逐条分号收尾）与右键复制时间戳（纯时间文本逐行）
- [x] 日志列表搜索支持行号与时间（`#N` 精确匹配第 N 条、时间文本所见即所搜）
- [x] 日志原始时间记录与显示切换（默认显示日志行解析的原始时间，可切换为捕获时间；历史文件向后兼容）
- [x] JdbcTemplate 集合参数按元素还原（`IN (:p)` 配集合参数不再把方括号带进 SQL）与并发交错日志按线程分桶还原
- [x] SQL 列表 CRUD 类型颜色标记（左侧色条 / 整行淡背景 / 关闭三形态，四色可自定义，选中态保留类型色调）
- [x] 关闭工具窗口时自动停止监听
- [x] SQL 历史两级导航 + 收藏（文件列表 → 逐条 SQL，自动保存）
- [x] 历史 SQL 参数记忆（历史文件 v2 随条目保存参数，旧版文件照常可读）与零占位符字面量参数恢复
- [x] 日志捕捉链路性能优化（EDT 开销治理）
- [x] 性能红线全面治理（执行失败面板内报错、日志流式增量渲染、参数输入防抖、历史大文件后台读取、内存泄漏清理）
- [x] 增强捕获启动即捕获（premain 通道：启动期 SQL 不丢、免动态挂载告警，失败回落 attach）
- [x] 日志面板聚焦与定位增强（方法级 / 请求级聚焦页签、日志条目直跳 mapper XML、执行报错与条目同列展示）

### 平台与生态

- [x] SQL → Java 面板原生 Database 控制台执行（Ultimate）
- [x] SQL 分享（Markdown / HTML / 可执行 SQL 三格式）
- [x] 设置导入导出 + 按项目覆盖
- [x] Gitee 抢先体验更新通道 + 忽略此版本
- [x] 自更新免重启（「立即安装」后新版在运行中的 IDE 内热替换即时生效，不支持动态安装的环境自动回退重启脚本）
- [x] 帮助页面本地 HTML（零网络依赖，暗色模式适配）
- [x] 插件更名 SQL Visualizer（MyBatis-Plus / MPJ / JPA / Hibernate 全面支持不变）
- [x] 错误 / 反馈一键上报官网需求池（帮助菜单、设置页、IDE 内部错误对话框三入口，异常堆栈附件可选，24 小时去重；多选错误合并为一帖、超限条目自动错峰补发，提交失败可见服务端原因并可原地重试）
- [x] MCP Server 十个只读工具（AI agent 工具面：渲染 SQL / schema 上下文 / EXPLAIN / 日志还原 / 回滚预案等，设置页逐项门控；需 IDEA 2025.2+）

> 以上功能已随 v2026.9.8 ~ v2026.9.18 正式发行，可在 JetBrains Marketplace 更新获取；版本明细见[更新日志](./changelog)。v2026.9.18 正式版（含此前 beta 系列全部内容）同版上架，本轮代表功能：MCP Server 十工具、增强捕获启动即捕获（premain）、方法级 / 请求级聚焦页签、预览一键回滚 SQL、方言智能推断、跨命名空间 include 解析等。

## 规划中

- MPJ `fill` 关联填充渲染
- 其他 ORM 支持第二批（候选：jOOQ / Jimmer / Fluent MyBatis / dbVisitor，调研矩阵已备）
- JPA 派生查询长尾形态收尾
- 大型 Wrapper 链解析与日志渲染性能持续优化
- MyBatis-Flex 支持（调研已暂缓，视生态需求再评估）

---

欢迎通过 [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) 提交功能建议。

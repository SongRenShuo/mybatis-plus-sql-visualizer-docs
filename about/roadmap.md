---
prev:
  text: 更新日志
  link: /about/changelog
next: false
---

# 开发路线

插件功能的计划与进度。

## 已完成

已完成能力按模块分组，点标题展开查看明细。

::: details 预览与诊断（30 项）

- [x] Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ 联表 / Kotlin）
- [x] XML / 注解动态 SQL 预览（OGNL 面板、`maintainPage` XML）
- [x] HQL / JPQL / JPA Criteria 预览，HQL `SELECT 实体别名` 自动展开为列清单，无别名形态裸属性转列名
- [x] `.hbm.xml` 命名查询预览（`<query>` / `<sql-query>`，`createNamedQuery` 自动回落 hbm 定义）
- [x] JPA Repository CRUD 写路径预览（save / findById / findAllById / delete 家族 / flush 语义），派生查询深化（六前缀、Pageable / Sort、Page / Slice / Stream 返回），Specification 与 QueryByExample
- [x] 嵌入值对象（@Embedded / @Embeddable / @EmbeddedId）字段按宿主表列展平参与预览（嵌套点路径覆写、Spring Data prefix 与捷径注解、派生查询嵌入段驼峰路径、MyBatis-Plus 混合注解实体）
- [x] 其他 ORM 链式框架预览第一批：xbatis、Easy-Query、MyBatis Dynamic SQL、Querydsl、Spring Data JDBC / R2DBC
- [x] 自研 DAO 字符串 SQL 方法定义锚点（方法名行 gutter 图标，快捷键在方法定义处生效）
- [x] gutter 锚点左键直接预览、右键反查最近执行记录
- [x] SQL 预览字段列表自动折叠（SELECT / INSERT 列清单、VALUES 组、UPDATE SET 收起为「… N 列」占位符，阈值可配，默认关）
- [x] 预览 INSERT 目标列 inlay 提示（VALUES 表达式 / SELECT 投影旁标注列名，列-值错位一眼可见）
- [x] 通用 XML 内嵌 SQL 识别（自研框架 XML 的自定义标签 CDATA / 文本兜底通道，`type="hql"` 走 HQL 转换管道，设置页可关）
- [x] 真实 EXPLAIN 执行计划（按方言包装提交原生数据库控制台，MySQL / PostgreSQL / 金仓 / 达梦真机验证；MySQL / MariaDB 对齐 IDEA 原生计划表格形态）
- [x] JOIN 关系可视化图（IDEA 原生 Diagrams 引擎渲染，Diagrams 缺席自动回退自绘；数据源可用时列类型 / 注释取 DB 真实值）
- [x] SQL 性能分析建议（索引缺失 / 全表扫描等 20 条规则）
- [x] Wrapper 链复杂度评分
- [x] 逻辑删除 / 多租户 / 动态表名 / 数据权限拦截器模拟
- [x] 11 种数据库方言分页 / upsert 渲染（保留字按官方文档全量校准，H2 upsert 为原生 `MERGE INTO ... KEY`；信创方言 OceanBase / openGauss 按真机证据落地——openGauss 的 upsert 实为 `ON DUPLICATE KEY UPDATE` MySQL 形态）
- [x] 方言智能推断（默认跟随数据源：增强捕获连接 URL 优先、IDE 数据源次之、回退 MySQL，状态行显示推断依据，手动选定后按手动值生效）
- [x] 预览可靠性增强（跨命名空间 include 解析、动态条件支持面预检标注、`${}` 注入确认闸门、参数面板类型契约（含集合参数按签名拆分多值渲染）、`${table}` 快捷模板）
- [x] 执行护栏（执行超时设置、执行确认的无界写发现清单、`DELIMITER` 自定义界符感知、空参数默认 `?` 占位防 NULL 静默过滤行）
- [x] 预览参数面板记忆调试参数（同一 SQL 再次预览自动召回上次填写值；无表名的纯文本 / 自定义 DAO 预览按 SQL 文本规范化指纹持久化，参数不再丢失）
- [x] 预览参数预设（当前填好的参数另存为预设一键切换，参数值与 OGNL 勾选态整组还原，管理对话框支持另存 / 重命名 / 删除，预设行可折叠）
- [x] mapper XML 语法高亮注入（语句文本 SQL 关键字着色、`#{}`/`${}` 参数占位底色、`test`/`value` 表达式着色，`#`/`$` 敲键自动闭合 `{}`，resultMap 列名补全，与平台注入 / CodeHelperPro 共存自动让位，设置页可关）
- [x] gutter SQL 图标分组开关（按语句来源分组控制显隐：mapper XML / 注解 SQL / JPA·HQL / JdbcTemplate 等，默认全开）
- [x] IPage 分页拦截器模拟（带 IPage 形参的查询按方言在 SELECT 尾追 LIMIT，并同步产出 COUNT 包裹语句；手写 LIMIT 不重复追加）
- [x] EXPLAIN 支持面扩至 11 种方言与结果结构化渲染（Oracle / SQL Server 接入；MySQL 表格 / PostgreSQL JSON 计划树在预览面板内直接渲染成表格 / 可折叠树，失败自动回退原生控制台）
- [x] 动态 SQL 条件求值探镜（XML 条件行旁标注本轮预览的求值结果——真 / 假 / 未求值，纯只读探针）
- [x] 预览交互细节（列信息表恢复 Ctrl+A 全选、快捷模板「抽样」行数可配置）
- [x] 预览面板数据源绑定指示行（参数区常驻灰字显示当前绑定的数据源，三态——未绑定数据源（在控制台执行一次查询即可绑定）/ 关联（上次使用）：数据源名 / 已绑定：数据源名；绑定与「执行 SQL」「执行计划」实际使用的数据源同源，最近使用数据源按项目记忆跨重启有效，执行挂载数据源后即时刷新）
:::

::: details 转换与补全（7 项）

- [x] SQL → Java 反向转换（AUTO / QueryWrapper / Lambda / Wrappers / MPJ 五形态，多表 JOIN）
- [x] SQL 代码补全（表列名、注释提示，`<foreach>` 的 `collection` 快捷别名候选）
- [x] Wrapper 方法链智能补全（`.eq(` 后提示后续方法与字段）
- [x] 批量操作参数面板（列级勾选、批量导入）
- [x] 实体类 / 数据库表右键生成 CRUD SQL（INSERT / UPDATE / SELECT / DELETE 候选浮层选定后进预览；自增主键默认不勾、`@Version` 列乐观锁自动追加、逻辑删除实体出对应变体；SQL Server 身份列 INSERT 自动包 `SET IDENTITY_INSERT` 可直接回放；Community 版仅实体侧入口）
- [x] 预览一键生成回滚 SQL（对当前预览的 INSERT / UPDATE / DELETE 生成对应逆向 SQL——INSERT 按主键删、UPDATE 还原原值、DELETE 按 WHERE 重插，弹窗展示一键复制）
- [x] CRUD / 回滚 SQL 可移植导出（「更多」菜单导出当前语句与回滚链串联产物，逐条注释标注方言 / 种类 / UPSERT 形态，走 CSV / TSV / TXT 三格式）
:::

::: details 日志与历史（30 项）

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
- [x] SQL 日志屏蔽（右键一键屏蔽保活心跳类 SQL，管理对话框规则列表 / 命中计数 / 可选结构匹配，上限 500 条，对话框可拖拽缩放）
- [x] 源码跳转落点双修复与 JAR 业务帧反向名单（自研工具类里的执行点不再上顶到上层调用方行；以依赖 JAR 形态运行的业务工具库登记包名前缀后按业务帧对待，与跳过前缀两栏随输入校验、可一键修复）
- [x] 多语句切分全角括号容错（IME 误输的全角括号与半角括号同栈计数，混对语句不再误切成多条或吞并后续语句）
- [x] 历史条目钉住与正则检索（钉住防淘汰；`regex:` 前缀正则匹配 SQL / 摘要 / 源文件，非法正则回退子串）
- [x] 历史 / 日志导出（右键导出 CSV / TSV / 纯文本，后台写盘）
- [x] ShardingSphere 双段日志捕获（`Logic SQL` 主条目 + `Actual SQL` 折叠附注的第四解析器，默认开）
- [x] 历史 SQL 对比（右键恰两条逐行差异 + 结构指纹等价判定，IDEA 原生 Diff 窗口呈现）
- [x] N+1 同模板计数徽章（同结构模板 ≥3 条显示「×N 同模板」徽章，右键聚焦该模板全部条目）
- [x] 数据源上下文角标（条目角标升级为「方言 · 库名@host」，从 JDBC URL 解析，凭据信息不入任何展示）
- [x] 日志转 SQL 剪贴板读取按钮（一键贴入并立即转换）
:::

::: details 平台与生态（11 项）

- [x] SQL → Java 面板原生 Database 控制台执行（Ultimate）
- [x] SQL 分享（Markdown / HTML / 可执行 SQL 三格式）
- [x] 设置导入导出 + 按项目覆盖
- [x] Gitee 抢先体验更新通道 + 忽略此版本
- [x] 自更新免重启（「立即安装」后新版在运行中的 IDE 内热替换即时生效，不支持动态安装的环境自动回退重启脚本）
- [x] 帮助页面本地 HTML（零网络依赖，暗色模式适配）
- [x] 插件更名 SQL Visualizer（MyBatis-Plus / MPJ / JPA / Hibernate 全面支持不变）
- [x] 错误 / 反馈一键上报官网需求池（帮助菜单、设置页、IDE 内部错误对话框三入口，异常堆栈附件可选，24 小时去重；多选错误合并为一帖、超限条目自动错峰补发，提交失败可见服务端原因并可原地重试）
- [x] MCP Server 十个只读工具（AI agent 工具面：渲染 SQL / schema 上下文 / EXPLAIN / 日志还原 / 回滚预案等，设置页逐项门控；需 IDEA 2025.2+）
- [x] MCP 第十一工具 sqlv_history_search（AI agent 检索本地 SQL 历史：关键词 / 正则 / 时间范围 / 来源文件过滤，只读不执行）
- [x] 设置页与引导可发现性打磨（MCP 设置页就绪横幅、SQL 日志空面板补「增强捕获」引导、帧过滤前缀入口指向说明、设置首页能力矩阵、首次引导通知一键直达预览）
:::

> 以上功能已随 v2026.9.8 ~ v2026.9.23 发行，版本明细见[更新日志](./changelog)。v2026.9.23 代表功能：MCP Server 十工具、增强捕获启动即捕获（premain）、方法级 / 请求级聚焦页签、预览一键回滚 SQL、方言智能推断、跨命名空间 include 解析等。其后一批能力（嵌入值对象 @Embedded 识别补全、SQL 日志屏蔽、通用 XML 内嵌 SQL 识别、无别名 HQL 映射、信创方言 OceanBase / openGauss、空参数默认 `?` 占位、JAR 业务帧登记与跳转落点修复等）已合入 master，将随下一版 v2026.10.6 发行；预览参数预设、mapper XML 语法高亮、EXPLAIN 全方言支持与结构化渲染、IPage 分页模拟、ShardingSphere 日志捕获、MCP 历史检索工具、历史对比与导出、多语句全角括号容错、预览数据源绑定指示行、预览参数记忆等已先行合入 dev 分支，将随后续版本发行。

## 规划中

- MPJ `fill` 关联填充渲染
- 其他 ORM 支持第二批（候选：jOOQ / Jimmer / Fluent MyBatis / dbVisitor，调研矩阵已备）
- JPA 派生查询长尾形态收尾
- 大型 Wrapper 链解析与日志渲染性能持续优化
- MyBatis-Flex 支持（调研已暂缓，视生态需求再评估）

---

欢迎通过 [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) 提交功能建议。

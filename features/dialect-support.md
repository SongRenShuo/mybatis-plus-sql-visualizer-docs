---
title: "数据库方言支持矩阵"
description: "15 种数据库方言支持矩阵：MySQL、PostgreSQL、Oracle、SQL Server、达梦、金仓、openGauss、GaussDB、OceanBase、瀚高、海量、GoldenDB 等，分页渲染与 EXPLAIN 执行计划按方言输出。"
---

# 数据库方言支持矩阵

插件内置 15 种数据库方言，用于 Wrapper、XML / 注解动态 SQL、JPA / Hibernate 等来源的 SQL 渲染（分页、标识符引用、UPSERT、批量插入等），以及执行计划与增强捕获的方言识别。

**我的数据库能用吗？** 主流数据库基本都在支持面内——MySQL、MariaDB、GoldenDB、PostgreSQL、Oracle、SQL Server、SQLite、H2、达梦、人大金仓、OceanBase、openGauss、GaussDB、瀚高、海量共 15 种。装上插件即按当前方言渲染 SQL，无需任何配置；整组方言已转正发行（自 v2026.10.31 起，逐版本变化见[更新日志](/about/changelog)）。

## 方言速览

每行一种方言，列出日常使用最常查的四件事。「起始支持版本」本页没有逐方言记录，以[更新日志](/about/changelog)为准；「EXPLAIN」列是该方言执行计划的语句形态与验证程度；「预览形态」列指执行计划在预览面板的呈现族——表格行计划（可结构化对比）、JSON 计划（可结构化对比）或文本计划（按原文呈现）。

| 方言 | 起始支持版本 | 分页渲染 | EXPLAIN | 预览形态 |
|------|--------------|----------|---------|----------|
| MySQL | [见更新日志](/about/changelog) | `LIMIT [offset,] count` | `EXPLAIN <sql>`，真机实证 | 表格行计划 |
| MariaDB | [见更新日志](/about/changelog) | `LIMIT [offset,] count` | `EXPLAIN <sql>`，真机实证 | 表格行计划 |
| GoldenDB（中兴） | [见更新日志](/about/changelog) | `LIMIT [offset,] count` | —（执行计划模板未登记） | — |
| PostgreSQL | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>`，真机实证 | JSON 计划 |
| Oracle | [见更新日志](/about/changelog) | `OFFSET n ROWS FETCH NEXT m ROWS ONLY`（无 offset 时 `FETCH FIRST m ROWS ONLY`） | `EXPLAIN PLAN FOR <sql>`，真机实证 | 文本计划 |
| SQL Server | [见更新日志](/about/changelog) | `OFFSET {offset\|0} ROWS FETCH NEXT count ROWS ONLY` | `SET STATISTICS XML`，官方镜像实证 | 文本计划 |
| SQLite | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN QUERY PLAN <sql>`，引擎级单测 | 文本计划 |
| H2 | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN PLAN FOR <sql>`，引擎级单测 | 文本计划 |
| DM（达梦） | [见更新日志](/about/changelog) | `LIMIT [offset,] count` | — | 表格行计划 |
| KingBase（人大金仓） | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON) <sql>`，真机实证 | JSON 计划 |
| OceanBase | [见更新日志](/about/changelog) | `LIMIT [offset,] count`（MySQL 模式） | `EXPLAIN <sql>`，社区镜像实证 | 文本计划 |
| openGauss | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON) <sql>`，真机实证 | JSON 计划 |
| GaussDB | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON) <sql>`，文档级验证 | JSON 计划 |
| HighGo（瀚高） | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON) <sql>`，社区镜像实证 | JSON 计划 |
| Vastbase（海量） | [见更新日志](/about/changelog) | `LIMIT count OFFSET offset` | `EXPLAIN (FORMAT JSON) <sql>`，社区镜像实证 | JSON 计划 |

## 使用注意

- SQL Server 的 `OFFSET … FETCH` 必须跟在 `ORDER BY` 之后：语句没有排序时，分页渲染会自动补 `ORDER BY (SELECT NULL)` 占位，否则产物在真机直接报语法错
- OceanBase 的执行计划返回 OB 自有的 ASCII 计划树（单列 `Query Plan`），按文本档呈现；插件按文本树规则识别全表扫描类形态并给出索引建议（与 MySQL 同口径，社区镜像 OB CE 4.3.5 实证）——建议经 MCP `sqlv_explain` 的建议节承载，预览面板的结构化渲染面仍只认 MySQL / PostgreSQL 两族格式，OceanBase 的 EXPLAIN 照旧直送原生控制台
- GaussDB 的执行计划目前是官方文档级验证（真机读数留账）；瀚高 / 海量的验证实例为社区第三方镜像，OceanBase 为社区版镜像
- GoldenDB 的渲染形态来自厂商文档与驱动级对照（vendor 驱动连 MySQL 8.0 协议实例，384 个保留字逐词全量扫描 PASS），尚未在 GoldenDB 引擎上验证；执行计划模板未登记，能力矩阵如实显示不支持
- 磐维 PanWeiDB：`jdbc:panwei:` / `jdbc:panweidb:` 连接可识别、增强捕获已登记，日志条目角标显示「Panwei（磐维）」；渲染恒按 Oracle 方言——磐维的 SQL 兼容模式由建库参数决定（出厂默认 A＝Oracle），PG / MySQL 模式的库请在面板手动改选
- 增强捕获（SQL 日志的增强通道）在金仓 / 瀚高 / 海量三族尚无 attach 端到端读数，SQL 渲染与预览不受影响

::: details 依据与验证记录（面向维护者）

本节保留内部验证口径与证据编号——commit 短哈希、内部任务代号与插件仓内部路径，仅供维护者核对，普通用户无需阅读。

**等级定义**

| 等级 | 含义 |
|------|------|
| 真机引擎级 | 在真实数据库引擎上执行插件渲染的 SQL 套件（分页 / 引用 / UPSERT / 批量 / 逐保留字扫描）并全部通过 |
| 社区镜像级 | 仅在社区版或社区第三方镜像实例上完成上述验证；不是厂商官方商业版本 |
| 文档级 | 只按官方文档实现，未在真实引擎上执行 |

表格中「渲染」列的词数，是该方言保留字集合的全量扫描词数——每个词都作为标识符建列，并执行 SELECT / INSERT / UPDATE。「EXPLAIN」列是该方言执行计划模板的验证档位，逐方言依据见依据索引中的 `ExplainSupport.kt` 行（每个表项自带 evidence 文案）。「采集」列是增强捕获（字节码 agent）的验证深度，三档含义见表格下方。

**支持矩阵（验证等级与依据）**

| 方言 | 显示名 | 验证等级 | 渲染 | EXPLAIN | 采集 | 依据 |
|------|--------|----------|------|---------|------|------|
| MySql | MySQL | 真机引擎级 | PASS 262 词 | 真机 | attach 端到端 | `afd3d091`、`20260828` 报告 |
| PostgreSQL | PostgreSQL | 真机引擎级 | PASS 86 词 | 真机 | attach 端到端 | `afd3d091`、`20261010-1535` 发行说明 |
| Oracle | Oracle | 真机引擎级 | PASS 109 词 | 真机 | attach 端到端 | `afd3d091`、`20260828` 报告、`20261010-1535` 发行说明 |
| SqlServer | SQL Server | 真机引擎级 | PASS 180 词 | 官方镜像 | attach 端到端 | `afd3d091`、`b0e79325`、`44c50cd2` |
| H2 | H2 | 真机引擎级 | PASS TC 套件（H2 2.3.232） | 引擎级单测 | 字节织入 | `DialectH2VerificationTest`、`20260828` 报告 |
| Sqlite | SQLite | 真机引擎级 | PASS TC 套件（SQLite 3.50.3） | 引擎级单测 | 织入 + 冒烟 | `DialectSqliteVerificationTest`、`20260828` 报告 |
| MariaDb | MariaDB | 真机引擎级 | PASS 281 词 | 真机 | 织入 + 冒烟 | `afd3d091`、`e767edc7`、`9409993a` |
| DM | DM（达梦） | 真机引擎级 | PASS 254 词 | 真机 | attach 端到端 | `afd3d091`、`20260828` 报告、`d14b15a` |
| KingBase | KingBase（人大金仓） | 真机引擎级 | PASS 118 词 | 真机 | 织入 + 冒烟 | `b29ca61e`、`427f69c9` |
| OceanBase | OceanBase | 社区镜像级 | PASS 262 词 | 社区镜像 | 织入 + 冒烟 | `afd3d091`、`58b8b5f3`、`9409993a` |
| OpenGauss | openGauss | 真机引擎级 | PASS 186 词 | 真机 | 字节织入 | `e767edc7`、`afd3d091` |
| GaussDb | GaussDB | 真机引擎级（Kernel 503） | PASS 197 词 | 文档级 | 字节织入 | `e767edc7`、`afd3d091`、`20261031-1512` 发行说明 |
| HighGo | HighGo（瀚高） | 社区镜像级 | PASS 153 词 | 社区镜像 | 织入 + 冒烟 | `b29ca61e`、`427f69c9`、`20261030-1300` 发行说明 |
| Vastbase | Vastbase（海量） | 社区镜像级 | PASS 201 词 | 社区镜像 | 织入 + 冒烟 | `b29ca61e`、`427f69c9`、`d9f9262e` |
| GoldenDb | GoldenDB（中兴） | 文档级（驱动级替代对照） | PASS 384 词（vendor 驱动 × MySQL 8.0.46 协议实例） | 未登记 | 驱动字节登记 | `20261109-1705` 发行说明 |

采集列的三种深度：

- **attach 端到端**：真实应用挂载 agent 后，SQL 事件回流 IDE 有读数。
- **织入 + 冒烟**：真实驱动字节织入通过 JVM 链接期校验，并在真实 JVM 上做过 premain / attach 冒烟（`matched` / `woven` 计数、宿主无强转异常）；IDE 事件回流未验证。
- **字节织入**：真实驱动字节织入通过 JVM 链接期校验，未做 attach 冒烟。
- **驱动字节登记**：织入面按 vendor 驱动的真实字节登记（连接 / 语句 / prepare 三面），未做冒烟与 attach 读数。

**已知边界（等级口径）**

- 等级口径：「真机引擎级」指在独立数据库实例（含厂商官方镜像部署的实例）上执行渲染套件；「社区镜像级」只用于社区版或社区第三方镜像（非厂商商业版实例）。H2 / SQLite 为嵌入式引擎，验证在本进程内执行，同样按「在真实引擎上执行」计入真机引擎级。
- 除 GoldenDB 外的 14 种方言渲染套件都有真机或镜像实例读数，但「全部方言都在厂商官方实例上验证」不成立：瀚高、海量为社区第三方镜像（瀚高为 V6.0.1，非 V9 线）；OceanBase 的验证实例为社区版 OB CE 镜像；GaussDB 与 openGauss 的读数都取自 GaussDB Kernel 503.1.0（2023 年内核，兼容命名 A/B/C/PG，不等于 openGauss 5.x / 6.x 的新命名与关键字表），官方 openGauss 5.0.0 实例因 public schema 无 CREATE 权限未能建夹具表；GaussDB 商用版需华为授权或云实例，未验证；GoldenDB 只有厂商文档与驱动级替代对照，无引擎读数。
- 增强捕获的金仓 / 瀚高 / 海量三族 attach 端到端尚无读数，这三族的「增强捕获已验证」不成立。
- SQL Server 的 `OFFSET … FETCH` 必须跟在 `ORDER BY` 之后，无排序分页时插件补 `ORDER BY (SELECT NULL)` 占位（`b0e79325`，真机实证）。
- OceanBase 的 `EXPLAIN` 返回 OB 自有的 ASCII 计划树（单列 `Query Plan`），按文本档接收（`58b8b5f3`，社区镜像实证）；文本树索引建议规则补齐（TABLE SCAN / TABLE FULL SCAN，与 MySQL 同口径，建议节挂 MCP `sqlv_explain` 输出，`9219ca61`）。
- 方言清单以插件仓 `DialectRegistry.dialects` 为准，共 15 种；设置页下拉顺序与本表一致。

**依据索引**

| 标识 | 内容 |
|------|------|
| `afd3d091` | T-DialectExternalGate：真机方言验证改外部实例门禁。首轮矩阵 13 条（12 PASS / 1 SKIP），读数：MySQL 262 词、PostgreSQL 86、Oracle 109、SQL Server 180、MariaDB 281、达梦 254、金仓 118、OceanBase 262、瀚高 153、海量 201、GaussDB 197、openGauss 186。见插件仓 `docs/变更记录.md` 2026-10-31 行 |
| `e767edc7` | T-DialectDriverGap：补三族驱动并修六处方言验证脚手架缺陷；达梦 254 / openGauss 186 / GaussDB 197 / MariaDB 281 四族真机读数闭环 |
| `b29ca61e` | T-XcDialects3 §7.6b：插件渲染 SQL 套件在瀚高（153 词）、海量（201 词）、金仓（118 词）三实例全 PASS |
| `427f69c9` | T-XcDialects3 合流：金仓升真机引擎级，瀚高 / 海量升社区镜像引擎级（含渲染套件）；同时登记三族 attach 端到端未闭环 |
| `58b8b5f3` | OceanBase EXPLAIN 档位由 TABLE 改为 TEXT（真机实证返回单列 ASCII 计划树） |
| `b0e79325` | SQL Server 无排序分页渲染非法 T-SQL，补 `ORDER BY (SELECT NULL)`（真机实证） |
| `44c50cd2` | SQL Server EXPLAIN 升为官方镜像引擎级实证（SQL Server 2022 CU27-GDR on Linux） |
| `9409993a` | T-CaptureCoverage：MariaDB / SQLite / OceanBase 三族采集面字节层硬断言与真实 JVM premain / attach 冒烟 |
| `d14b15a` | T-DmWeave：达梦增强捕获语句面 / prepare 面补登，真库 E2E 红转绿 |
| `d9f9262e` | T-XcDialects3 海量按 A 模式真机实证切换 upsert 与 DELETE LIMIT 两处定案；Vastbase EXPLAIN 社区镜像实证 |
| `ExplainSupport.kt` | 插件仓 `src/main/kotlin/cn/song/mybatisplus/visualizer/sql/ExplainSupport.kt`：14 方言的 EXPLAIN 模板与逐条 evidence 文案（MySQL / MariaDB / PostgreSQL / KingBase / DM 真机；SQL Server 官方镜像；H2 / SQLite 引擎级单测；OceanBase / HighGo / Vastbase 社区镜像；GaussDB 文档级） |
| `20260828` 报告 | 插件仓 `docs/调研报告/20260828-2000-P-立项-05-方言输出真实验证-报告.md`：Tier 2 真机矩阵（MySQL / PostgreSQL / Oracle / SQL Server / MariaDB / 达梦 / 金仓 / H2 / SQLite） |
| `20261010-1535` 发行说明 | 插件仓 `docs/发行说明/20261010-1535-编码期能力补齐与增强捕获方言扩面-发行说明.md`：增强捕获对运行中的 PostgreSQL / Oracle / SQL Server / 达梦 DM8 应用 attach 织入扩面 |
| `20261030-1300` 发行说明 | 插件仓 `docs/发行说明/20261030-1300-十四方言与采集方言无关化-发行说明.md`：十四方言与采集方言无关化内测版，含已知边界 |
| `20261031-1512` 发行说明 | 插件仓 `docs/发行说明/20261031-1512-十四方言转正与动态标签补全修复-发行说明.md`：十四方言转正版，含 GaussDB Kernel 503 与采集 attach 未闭环的口径 |
| `20261109-1705` 发行说明 | 插件仓 `docs/发行说明/20261109-1705-内测-beta.1-iBatis2支持与GoldenDB方言与SQL列表提速-发行说明.md`：GoldenDB 第 15 方言（渲染形态按厂商文档 + vendor 驱动连 MySQL 8.0 协议实例驱动级对照，384 保留字全量 PASS）与增强捕获三面登记 |
| `DialectH2VerificationTest` | 插件仓 `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectH2VerificationTest.kt`：H2 2.3.232 嵌入式引擎执行 TC 套件与保留字扫描 |
| `DialectSqliteVerificationTest` | 插件仓 `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectSqliteVerificationTest.kt`：SQLite 3.50.3 嵌入式引擎执行 TC 套件与保留字扫描 |

:::

> 对方言支持有建议或遇到问题？[直达需求反馈池](/about/feedback?category=other)

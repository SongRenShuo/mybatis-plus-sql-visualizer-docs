# 数据库方言支持矩阵

插件内置 14 种数据库方言，用于 Wrapper、XML / 注解动态 SQL、JPA / Hibernate 等来源的 SQL 渲染（分页、标识符引用、UPSERT、批量插入等），以及执行计划与增强捕获的方言识别。

本页列出每种方言的验证等级、已验证能力与依据。等级只按实际执行过的验证标注，不做推定。

## 等级定义

| 等级 | 含义 |
|------|------|
| 真机引擎级 | 在真实数据库引擎上执行插件渲染的 SQL 套件（分页 / 引用 / UPSERT / 批量 / 逐保留字扫描）并全部通过 |
| 社区镜像级 | 仅在社区版或社区第三方镜像实例上完成上述验证；不是厂商官方商业版本 |
| 文档级 | 只按官方文档实现，未在真实引擎上执行 |

表格中「渲染」列的词数，是该方言保留字集合的全量扫描词数——每个词都作为标识符建列，并执行 SELECT / INSERT / UPDATE。「EXPLAIN」列是该方言执行计划模板的验证档位，逐方言依据见依据索引中的 `ExplainSupport.kt` 行（每个表项自带 evidence 文案）。「采集」列是增强捕获（字节码 agent）的验证深度，三档含义见表格下方。

## 支持矩阵

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

采集列的三种深度：

- **attach 端到端**：真实应用挂载 agent 后，SQL 事件回流 IDE 有读数。
- **织入 + 冒烟**：真实驱动字节织入通过 JVM 链接期校验，并在真实 JVM 上做过 premain / attach 冒烟（`matched` / `woven` 计数、宿主无强转异常）；IDE 事件回流未验证。
- **字节织入**：真实驱动字节织入通过 JVM 链接期校验，未做 attach 冒烟。

## 已知边界

- 等级口径：「真机引擎级」指在独立数据库实例（含厂商官方镜像部署的实例）上执行渲染套件；「社区镜像级」只用于社区版或社区第三方镜像（非厂商商业版实例）。H2 / SQLite 为嵌入式引擎，验证在本进程内执行，同样按「在真实引擎上执行」计入真机引擎级。
- 14 种方言的渲染套件都有真机或镜像实例读数，但「全部方言都在厂商官方实例上验证」不成立：瀚高、海量为社区第三方镜像（瀚高为 V6.0.1，非 V9 线）；OceanBase 的验证实例为社区版 OB CE 镜像；GaussDB 与 openGauss 的读数都取自 GaussDB Kernel 503.1.0（2023 年内核，兼容命名 A/B/C/PG，不等于 openGauss 5.x / 6.x 的新命名与关键字表），官方 openGauss 5.0.0 实例因 public schema 无 CREATE 权限未能建夹具表；GaussDB 商用版需华为授权或云实例，未验证。
- 增强捕获的金仓 / 瀚高 / 海量三族 attach 端到端尚无读数，这三族的「增强捕获已验证」不成立。
- SQL Server 的 `OFFSET … FETCH` 必须跟在 `ORDER BY` 之后，无排序分页时插件补 `ORDER BY (SELECT NULL)` 占位（`b0e79325`，真机实证）。
- OceanBase 的 `EXPLAIN` 返回 OB 自有的 ASCII 计划树（单列 `Query Plan`），按文本档接收（`58b8b5f3`，社区镜像实证）。
- 方言清单以插件仓 `DialectRegistry.dialects` 为准，共 14 种；设置页下拉顺序与本表一致。

## 依据索引

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
| `DialectH2VerificationTest` | 插件仓 `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectH2VerificationTest.kt`：H2 2.3.232 嵌入式引擎执行 TC 套件与保留字扫描 |
| `DialectSqliteVerificationTest` | 插件仓 `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectSqliteVerificationTest.kt`：SQLite 3.50.3 嵌入式引擎执行 TC 套件与保留字扫描 |

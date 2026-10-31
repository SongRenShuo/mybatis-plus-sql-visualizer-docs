# Database Dialect Support Matrix

The plugin ships with 14 SQL dialects, used for rendering SQL from Wrappers, XML / annotation dynamic SQL, JPA / Hibernate and other sources (pagination, identifier quoting, UPSERT, batch inserts), as well as dialect detection for execution plans and enhanced capture.

This page lists each dialect's verification level, verified capabilities and evidence. Levels only reflect verifications that were actually executed; nothing is inferred.

## Level definitions

| Level | Meaning |
|-------|---------|
| Real-engine | The plugin-rendered SQL suite (pagination / quoting / UPSERT / batch / per-keyword sweep) was executed on a real database engine and passed in full |
| Community-image | The same verification was done only on a community-edition or community third-party image instance; not a vendor commercial release |
| Documentation-only | Implemented from official documentation only; never executed on a real engine |

The word count in the "Rendering" column is the dialect's full reserved-word sweep — every word is used as an identifier to create a column, then exercised with SELECT / INSERT / UPDATE. The "EXPLAIN" column is the verification level of that dialect's execution-plan template; per-dialect evidence is in the `ExplainSupport.kt` row of the evidence index (each entry carries its own evidence note). The "Capture" column is the verification depth of enhanced capture (bytecode agent); the three depths are explained below the table.

## Support matrix

| Dialect | Display name | Verification level | Rendering | EXPLAIN | Capture | Evidence |
|---------|--------------|--------------------|-----------|---------|---------|----------|
| MySql | MySQL | Real-engine | PASS, 262 words | Real engine | attach end-to-end | `afd3d091`, `20260828` report |
| PostgreSQL | PostgreSQL | Real-engine | PASS, 86 words | Real engine | attach end-to-end | `afd3d091`, `20261010-1535` release notes |
| Oracle | Oracle | Real-engine | PASS, 109 words | Real engine | attach end-to-end | `afd3d091`, `20260828` report, `20261010-1535` release notes |
| SqlServer | SQL Server | Real-engine | PASS, 180 words | Official image | attach end-to-end | `afd3d091`, `b0e79325`, `44c50cd2` |
| H2 | H2 | Real-engine | PASS, TC suite (H2 2.3.232) | Engine unit test | Byte weaving | `DialectH2VerificationTest`, `20260828` report |
| Sqlite | SQLite | Real-engine | PASS, TC suite (SQLite 3.50.3) | Engine unit test | Weaving + smoke test | `DialectSqliteVerificationTest`, `20260828` report |
| MariaDb | MariaDB | Real-engine | PASS, 281 words | Real engine | Weaving + smoke test | `afd3d091`, `e767edc7`, `9409993a` |
| DM | DM (Dameng) | Real-engine | PASS, 254 words | Real engine | attach end-to-end | `afd3d091`, `20260828` report, `d14b15a` |
| KingBase | KingBase | Real-engine | PASS, 118 words | Real engine | Weaving + smoke test | `b29ca61e`, `427f69c9` |
| OceanBase | OceanBase | Community-image | PASS, 262 words | Community image | Weaving + smoke test | `afd3d091`, `58b8b5f3`, `9409993a` |
| OpenGauss | openGauss | Real-engine | PASS, 186 words | Real engine | Byte weaving | `e767edc7`, `afd3d091` |
| GaussDb | GaussDB | Real-engine (Kernel 503) | PASS, 197 words | Documentation-only | Byte weaving | `e767edc7`, `afd3d091`, `20261031-1512` release notes |
| HighGo | HighGo | Community-image | PASS, 153 words | Community image | Weaving + smoke test | `b29ca61e`, `427f69c9`, `20261030-1300` release notes |
| Vastbase | Vastbase | Community-image | PASS, 201 words | Community image | Weaving + smoke test | `b29ca61e`, `427f69c9`, `d9f9262e` |

Capture depths:

- **attach end-to-end**: after attaching the agent to a real application, SQL events flowing back to the IDE have been observed.
- **Weaving + smoke test**: real driver bytes passed weaving and JVM link-time verification, and a premain / attach smoke test ran on a real JVM (`matched` / `woven` counts, no host cast exception); IDE event round-trip is not verified.
- **Byte weaving**: real driver bytes passed weaving and JVM link-time verification; no attach smoke test was run.

## Known limitations

- Level scope: "Real-engine" means the rendering suite was executed on a standalone database instance (including instances deployed from official vendor images); "Community-image" is used only for community-edition or community third-party images (not a vendor commercial instance). H2 and SQLite are embedded engines — verification runs in-process but still counts as execution on a real engine.
- Every one of the 14 dialects has a real-engine or image-instance rendering reading, but "all dialects verified on vendor official instances" does not hold: HighGo and Vastbase are community third-party images (HighGo is V6.0.1, not the V9 line); OceanBase was verified on a community-edition (OB CE) image; the GaussDB and openGauss readings both come from GaussDB Kernel 503.1.0 (a 2023 kernel with the legacy A/B/C/PG naming, not the new naming and keyword tables of openGauss 5.x / 6.x), and the official openGauss 5.0.0 instance could not create fixture tables because the public schema lacks CREATE privilege; commercial GaussDB requires Huawei authorization or a cloud instance and is not verified.
- Enhanced capture has no attach end-to-end reading for KingBase, HighGo or Vastbase, so "enhanced capture verified" does not hold for these three.
- SQL Server requires `OFFSET … FETCH` to follow `ORDER BY`; for pagination without sorting the plugin adds an `ORDER BY (SELECT NULL)` placeholder (`b0e79325`, verified on a real engine).
- OceanBase `EXPLAIN` returns an OceanBase-specific ASCII plan tree (a single `Query Plan` column), which is handled as text (`58b8b5f3`, verified on a community image).
- The dialect list is defined by `DialectRegistry.dialects` in the plugin repository — 14 entries; the settings dropdown order matches this table.

## Evidence index

| Reference | Content |
|-----------|---------|
| `afd3d091` | T-DialectExternalGate: dialect verification moved to an external-instance gate. First matrix run: 13 entries, 12 PASS / 1 SKIP. Readings: MySQL 262 words, PostgreSQL 86, Oracle 109, SQL Server 180, MariaDB 281, Dameng 254, KingBase 118, OceanBase 262, HighGo 153, Vastbase 201, GaussDB 197, openGauss 186. See `docs/变更记录.md` in the plugin repository, 2026-10-31 entry |
| `e767edc7` | T-DialectDriverGap: three driver families added and six verification-scaffolding defects fixed; real-engine readings closed for Dameng 254 / openGauss 186 / GaussDB 197 / MariaDB 281 |
| `b29ca61e` | T-XcDialects3 §7.6b: the plugin-rendered SQL suite passed on all three instances — HighGo (153 words), Vastbase (201 words), KingBase (118 words) |
| `427f69c9` | T-XcDialects3 merge: KingBase promoted to real-engine level, HighGo / Vastbase to community-image level (rendering suite included); attach end-to-end left open for all three |
| `58b8b5f3` | OceanBase EXPLAIN output format changed from TABLE to TEXT (real-engine evidence: a single-column ASCII plan tree) |
| `b0e79325` | SQL Server rendered invalid T-SQL for pagination without ORDER BY; fixed with `ORDER BY (SELECT NULL)` (real-engine evidence) |
| `44c50cd2` | SQL Server EXPLAIN promoted to official-image engine-level evidence (SQL Server 2022 CU27-GDR on Linux) |
| `9409993a` | T-CaptureCoverage: byte-level hard assertions and real-JVM premain / attach smoke tests for the MariaDB / SQLite / OceanBase capture surface |
| `d14b15a` | T-DmWeave: Dameng statement / prepare capture faces registered; real-database E2E went from red to green |
| `d9f9262e` | T-XcDialects3 Vastbase decisions for upsert and DELETE LIMIT based on mode-A real-engine evidence; Vastbase EXPLAIN community-image evidence |
| `ExplainSupport.kt` | Plugin repository `src/main/kotlin/cn/song/mybatisplus/visualizer/sql/ExplainSupport.kt`: EXPLAIN templates and per-entry evidence notes for all 14 dialects (MySQL / MariaDB / PostgreSQL / KingBase / DM on real engines; SQL Server on the official image; H2 / SQLite engine-level unit tests; OceanBase / HighGo / Vastbase on community images; GaussDB documentation-only) |
| `20260828` report | Plugin repository `docs/调研报告/20260828-2000-P-立项-05-方言输出真实验证-报告.md`: Tier 2 real-engine matrix (MySQL / PostgreSQL / Oracle / SQL Server / MariaDB / Dameng / KingBase / H2 / SQLite) |
| `20261010-1535` release notes | Plugin repository `docs/发行说明/20261010-1535-编码期能力补齐与增强捕获方言扩面-发行说明.md`: enhanced capture attach weaving expanded to running PostgreSQL / Oracle / SQL Server / Dameng DM8 applications |
| `20261030-1300` release notes | Plugin repository `docs/发行说明/20261030-1300-十四方言与采集方言无关化-发行说明.md`: beta release for the 14 dialects and dialect-independent capture, including known limitations |
| `20261031-1512` release notes | Plugin repository `docs/发行说明/20261031-1512-十四方言转正与动态标签补全修复-发行说明.md`: official 14-dialect release, including the GaussDB Kernel 503 and capture attach caveats |
| `DialectH2VerificationTest` | Plugin repository `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectH2VerificationTest.kt`: TC suite and reserved-word sweep on the embedded H2 2.3.232 engine |
| `DialectSqliteVerificationTest` | Plugin repository `src/test/kotlin/cn/song/mybatisplus/visualizer/sql/verify/DialectSqliteVerificationTest.kt`: TC suite and reserved-word sweep on the embedded SQLite 3.50.3 engine |

---
prev:
  text: Changelog
  link: /en/about/changelog
next: false
---

# Roadmap

Planned features and progress.

## Completed

Completed capabilities are grouped by module — click a title to expand.

::: details Preview & Diagnostics (30)
- [x] Wrapper → SQL static parsing (Lambda / String / MPJ / Kotlin)
- [x] XML / annotation dynamic SQL preview (OGNL panel)
- [x] HQL / JPQL / JPA Criteria preview (entity-alias expansion)
- [x] `.hbm.xml` named-query preview
- [x] JPA Repository CRUD write paths & derived queries (Specification / QueryByExample)
- [x] Embedded value objects (@Embedded) flattened into owner-table columns
- [x] Other ORM chain-framework preview (xbatis / Easy-Query / Querydsl, etc.)
- [x] Custom-DAO string SQL method anchors
- [x] Gutter anchor: left-click preview, right-click recent executions
- [x] Auto-fold long field lists in SQL preview
- [x] INSERT target-column inlay hints
- [x] SQL embedded in generic XML
- [x] Real EXPLAIN plans
- [x] JOIN relationship diagram
- [x] SQL performance analysis hints
- [x] Wrapper chain complexity scoring
- [x] Interceptor simulation (logic delete / tenant / dynamic table name / data permission)
- [x] 11-dialect pagination / upsert rendering
- [x] Dialect auto-inference
- [x] Preview reliability enhancements (cross-namespace include, `${}` injection gate)
- [x] Execution guardrails (timeout / unbounded-write check / empty-parameter placeholder)
- [x] Preview panel remembers debug parameters
- [x] Preview parameter presets
- [x] mapper XML syntax-highlight injection
- [x] Gutter SQL icon group switches
- [x] IPage pagination interceptor simulation
- [x] EXPLAIN full-dialect support with structured rendering
- [x] Dynamic SQL condition-evaluation probe
- [x] Preview interaction details
- [x] Preview panel data-source binding indicator
:::

::: details Conversion & Completion (7)
- [x] SQL → Java reverse conversion (five forms, multi-table JOIN)
- [x] SQL code completion (table columns / comments / parameter names)
- [x] Wrapper method-chain smart completion
- [x] Batch operation parameter panel (column-level toggle)
- [x] Right-click CRUD SQL generation from entity classes / tables
- [x] One-click rollback SQL from the preview
- [x] Portable export of CRUD / rollback SQL
:::

::: details Log & History (30)
- [x] SQL log tool window (multi-framework capture, Log → SQL restore)
- [x] Duration display & slow-query detection
- [x] Precise jump to source (interceptor-marked call sites)
- [x] Auto-open log tool window on first SQL
- [x] Auto-start listening on project launch
- [x] SQL log entry sequence numbers (#N)
- [x] Click preview / double-click full dialog
- [x] Three display modes
- [x] Multi-select batch copy & copy timestamps
- [x] Log list search (row number / time)
- [x] Log original-time recording with display switch
- [x] JdbcTemplate collection-parameter restore & concurrent-log bucketing
- [x] CRUD type color markers
- [x] Stop capture when tool window closes
- [x] SQL history two-level navigation + favorites
- [x] History parameter memory & literal-parameter recovery
- [x] Log capture pipeline performance optimization
- [x] Performance red-line hardening
- [x] Enhanced capture at startup (premain)
- [x] Log panel focus & navigation (method / request-level focus tabs)
- [x] SQL log suppression
- [x] Jump-landing fixes & JAR business-frame registration
- [x] Full-width parenthesis tolerance in splitting
- [x] History pinning & regex search
- [x] History / log export
- [x] ShardingSphere two-segment log capture
- [x] History SQL diff
- [x] N+1 same-template count badge
- [x] Data-source context badge
- [x] Clipboard read button in Log → SQL
:::

::: details Platform & Ecosystem (11)
- [x] Native Database console execution in SQL → Java panel
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel
- [x] No-restart self-update
- [x] Local HTML help page
- [x] Renamed to SQL Visualizer
- [x] One-click error / feedback reporting
- [x] Ten read-only MCP Server tools
- [x] MCP history-search tool (sqlv_history_search)
- [x] Settings & onboarding discoverability polish
:::

> Everything above has shipped with v2026.9.8 ~ v2026.10.7; see the [changelog](./changelog) for version details. Highlights of v2026.9.23: the ten MCP Server tools, premain capture at startup, method-level / request-level focus tabs, one-click rollback SQL, dialect auto-inference, cross-namespace include resolution, and more; highlights of v2026.10.6: embedded value objects (@Embedded) support, SQL log suppression, SQL embedded in generic XML, alias-free HQL mapping, the OceanBase / openGauss dialects, empty parameters defaulting to a `?` placeholder, enhanced-capture consent moved ahead of any run (asked on enable or project open), JAR business-frame registration and jump-landing fixes, and more; highlights of v2026.10.7: SQL log scroll-to-bottom with tail following, JPA setParameter auto-prefill (literals / enum constants) with fill-by-name, and loading performance improvements under concurrent log storms. Preview parameter presets, mapper XML syntax highlighting, full-dialect EXPLAIN with structured rendering, IPage pagination simulation, ShardingSphere log capture, the MCP history-search tool, history diff & export, full-width parenthesis tolerance, the preview data-source binding indicator, preview parameter memory and more have landed on the dev branch first and will ship with a later release.

## Planned

- MPJ `fill` association rendering
- Second batch of other ORM support (candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready)
- Remaining long-tail JPA derived-query shapes
- Ongoing performance work on large Wrapper chain parsing and log rendering
- MyBatis-Flex support (research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback).

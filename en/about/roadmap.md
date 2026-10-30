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

::: details Preview & Diagnostics (46)
- [x] Wrapper → SQL static parsing (Lambda / String / MPJ / Kotlin)
- [x] XML / annotation dynamic SQL preview (OGNL panel)
- [x] HQL / JPQL / JPA Criteria preview (entity-alias expansion)
- [x] `.hbm.xml` named-query preview
- [x] JPA Repository CRUD write paths & derived queries (Specification / QueryByExample)
- [x] Embedded value objects (@Embedded) flattened into owner-table columns
- [x] Other ORM chain-framework preview (xbatis / Easy-Query / Querydsl, etc.)
- [x] Custom-DAO string SQL method anchors
- [x] Gutter anchor: left-click preview, right-click recent executions
- [x] Recent Executions as a dialog (editable pane / multi-select / context menu)
- [x] Auto-fold long field lists in SQL preview
- [x] INSERT target-column inlay hints
- [x] SQL embedded in generic XML
- [x] Real EXPLAIN plans
- [x] JOIN relationship diagram
- [x] SQL performance analysis hints
- [x] Wrapper chain complexity scoring
- [x] Interceptor simulation (logic delete / tenant / dynamic table name / data permission)
- [x] 14-dialect pagination / upsert rendering
- [x] Standalone GaussDB dialect plus new HighGo / Vastbase dialects (total 11 → 14)
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
- [x] Read-only side channel for preview actions (affected rows / EXPLAIN / snapshot query never replace the editor SQL)
- [x] Copy SQL and Close (blue primary action at the bottom of the panel)
- [x] DML impact estimate (read-only COUNT probe before an UPDATE / DELETE)
- [x] One-click diagnostic report (five-section Markdown / self-contained HTML)
- [x] Pre-execution schema check and dialect capability self-check
- [x] Cross-session EXPLAIN plan history and cross-run comparison
- [x] In-place exits when the dialect does not match the data source
- [x] Rollback snapshot table / text dual view and open-in-CSV-editor
- [x] Replay script export (executable .sql with parameters filled in)
- [x] Copy as AI Context (including a with-identifiers variant)
- [x] Two-way navigation between Mapper interface methods and XML statements (yielding to peer navigation plugins)
- [x] Mapper XML editing support (completion / reference navigation / dynamic-tag folding / color settings page)
- [x] Execution console reused by binding data-source identity
- [x] Dialect inference scoped per module with active-profile priority
:::

::: details Conversion & Completion (8)
- [x] SQL → Java reverse conversion (five forms, multi-table JOIN)
- [x] SQL → Java coverage & dialect tolerance (grouping / aggregation / union / free-form return type)
- [x] SQL code completion (table columns / comments / parameter names)
- [x] Wrapper method-chain smart completion
- [x] Batch operation parameter panel (column-level toggle)
- [x] Right-click CRUD SQL generation from entity classes / tables
- [x] One-click rollback SQL from the preview
- [x] Portable export of CRUD / rollback SQL
:::

::: details Log & History (41)
- [x] SQL log tool window (multi-framework capture, Log → SQL restore)
- [x] Duration display & slow-query detection
- [x] Precise jump to source (interceptor-marked call sites)
- [x] SQL log call-stack popup with click-a-frame-to-jump
- [x] SQL History tab always present (same directory resolution for reads and writes)
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
- [x] Two-channel capture status bar (the pause entry is implemented but currently hidden)
- [x] Display and export masking (list / preview / export / MCP)
- [x] History search regex and case-sensitivity toggles
- [x] Jump to the last entry in the history list
- [x] Join-the-community entry point
- [x] DDL statement-type coloring and filtering
- [x] Scheduler-thread call stacks (thread name in the popup title)
- [x] Enhanced-capture JDBC-interface matching fallback (three guards, capture surface decoupled from dialects)
- [x] Enhanced-capture coverage for OceanBase / MariaDB / SQLite plus liveness fallback
:::

::: details Platform & Ecosystem (10)
- [x] Native Database console execution in SQL → Java panel
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel
- [x] No-restart self-update
- [x] Local HTML help page
- [x] Renamed to SQL Visualizer
- [x] One-click error / feedback reporting
- [x] Eleven read-only MCP Server tools (incl. the history-search tool sqlv_history_search)
- [x] Settings & onboarding discoverability polish
:::

> Everything above has shipped with v2026.9.8 ~ v2026.10.31; see the [changelog](./changelog) for version details.
>
> Per-version highlights: **v2026.9.23** the ten MCP Server tools, premain capture at startup, method-level / request-level focus tabs, one-click rollback SQL, dialect auto-inference, cross-namespace include resolution; **v2026.10.6** embedded value objects (@Embedded) support, SQL log suppression, SQL embedded in generic XML, alias-free HQL mapping, the OceanBase / openGauss dialects, empty parameters defaulting to a `?` placeholder, JAR business-frame registration and jump-landing fixes; **v2026.10.7** SQL log scroll-to-bottom with tail following, JPA setParameter auto-prefill (literals / enum constants) with fill-by-name, loading performance under concurrent log storms; **v2026.10.9** the SQL-log call-stack popup with click-a-frame-to-jump, the always-present SQL History tab, Recent Executions as a dialog, SQL → Java coverage expansion and a free-form return type; **v2026.10.13** capture-channel attribution and per-bucket merging, mapper XML syntax highlighting plus highlighter/completion/navigation gap closure, the dialect quote-mismatch static warning, the independent pagination COUNT switch, history regex / case-sensitivity toggles, data-source badges defaulting to database type only; **v2026.10.16** entity reverse-look-up in dependency libraries (background scan plus explicit trigger), native-feel rewrite of the SQL log and history lists, business-frame-first call stacks, the join-the-community entry; **v2026.10.23** parameter presets and parameter history isolated per declaring method, the read-only preview side channel with Copy SQL and Close, DML impact estimate, one-click diagnostic report, pre-execution schema check and dialect capability self-check, cross-session EXPLAIN plan history with cross-run comparison, replay-script export, Copy as AI Context, display and export masking, FieldFill safe simulation, in-place dialect-gate exits, rollback snapshot dual view with CSV editor, enhanced capture on by default; **v2026.10.26** host-module cascade for embedded-column naming of JAR / lib entities; **v2026.10.28** two-way navigation between Mapper interface methods and XML statements, DDL statement-type coloring and filtering, dialect mismatch warns without blocking execution, zero-replacement JDBC capture; **v2026.10.29** dialect inference scoped per module with active-profile priority, the IDEA 2026.1.x MCP compatibility fix, scheduler-thread call stacks; **v2026.10.30** yielding the two-way navigation icons to peer navigation plugins; **v2026.10.31 (beta)** the standalone GaussDB dialect plus HighGo / Vastbase (14 in total), enhanced-capture JDBC-interface matching fallback with OceanBase / MariaDB / SQLite coverage, automatic `ORDER BY (SELECT NULL)` for SQL Server pagination without sorting, the preview PSI fix for GaussDB / DM / HighGo / Vastbase, and the agent console going silent by default.
>
> An earlier batch (preview parameter presets, mapper XML syntax highlighting, full-dialect EXPLAIN with structured rendering, IPage pagination simulation, ShardingSphere log capture, history diff and export, full-width parenthesis tolerance, the preview data-source binding indicator, preview parameter memory, three-state update-failure diagnosis, history parameter snapshots restored to the preview, the dialect capability matrix, the independent pagination COUNT switch, history / log SQL script export, `--` line comments in the preview editor, the dedup fix for the first events after enhanced-capture takeover, the generated-frame fallback for source locations, and the mapper XML completion dispatch fix) has also shipped with the versions above.

## Planned

- MPJ `fill` association rendering
- Second batch of other ORM support (candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready)
- Remaining long-tail JPA derived-query shapes
- Ongoing performance work on large Wrapper chain parsing and log rendering
- MyBatis-Flex support (research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback).

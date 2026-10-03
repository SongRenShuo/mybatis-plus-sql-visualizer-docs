---
prev:
  text: Changelog
  link: /en/about/changelog
next: false
---

# Roadmap

Planned features and progress.

## Completed

### Preview & Diagnostics

- [x] Wrapper → SQL static parsing (Lambda / String / MPJ JOIN / Kotlin)
- [x] XML / annotation dynamic SQL preview (OGNL panel, `maintainPage` XML)
- [x] HQL / JPQL / JPA Criteria preview, with HQL `SELECT entity alias` auto-expansion to column lists, and alias-free HQL bare-property-to-column mapping
- [x] `.hbm.xml` named-query preview (`<query>` / `<sql-query>`, with `createNamedQuery` falling back to the hbm definition)
- [x] JPA Repository CRUD write-path preview (save / findById / findAllById / delete family / flush semantics), derived-query deepening (six prefixes, Pageable / Sort, Page / Slice / Stream returns), Specification and QueryByExample
- [x] Embedded value objects (@Embedded / @Embeddable / @EmbeddedId) flattened into owner-table columns for preview (nested dot-path overrides, Spring Data prefix & shortcut annotations, camel-case embedded paths in derived queries, MyBatis-Plus mixed-annotation entities)
- [x] First batch of other ORM chain frameworks: xbatis, Easy-Query, MyBatis Dynamic SQL, Querydsl, Spring Data JDBC / R2DBC
- [x] Custom-DAO string SQL method-definition anchors (gutter icon on the method-name line, shortcut works at method definitions)
- [x] Gutter anchor left-click instant preview, right-click lookup of recent executions
- [x] Auto-folding of long field lists in SQL preview (SELECT / INSERT column lists, VALUES groups and UPDATE SET collapse into a "… N columns" placeholder; threshold adjustable, off by default)
- [x] INSERT target-column inlay hints in the preview (each VALUES expression / SELECT projection labeled with its column name — column-value misalignment visible at a glance)
- [x] SQL embedded in generic XML (a fallback channel for in-house framework XML with CDATA/text inside custom tags; `type="hql"` goes through the HQL conversion pipeline; switchable in settings)
- [x] Real EXPLAIN plans (dialect-wrapped, run on the native database console; MySQL / PostgreSQL / KingBase / DM verified; MySQL / MariaDB aligned with IDEA's native plan table shape)
- [x] JOIN relationship diagram (IDEA-native Diagrams rendering with automatic fallback to the built-in renderer; column types / comments from the database when a data source is available)
- [x] SQL performance analysis hints (20 rules: missing index, full table scan, etc.)
- [x] Wrapper chain complexity scoring
- [x] Interceptor simulation: logic delete / tenant / dynamic table name / data permission
- [x] 11-dialect pagination / upsert rendering (reserved words calibrated against official docs, H2 upsert as native `MERGE INTO ... KEY`; the XC-family dialects OceanBase / openGauss grounded in real-engine evidence — openGauss's upsert is actually the MySQL-style `ON DUPLICATE KEY UPDATE`)
- [x] Dialect auto-inference (follows the data source by default: enhanced-capture connection URL first, IDE data source next, MySQL fallback, with a status line showing the inference basis; a manual pick always wins)
- [x] Preview reliability enhancements (cross-namespace include resolution, expression-support precheck annotations, `${}` injection confirmation gate, parameter type contract incl. signature-driven multi-value splitting of collection parameters, `${table}` quick templates)
- [x] Execution guardrails (execution timeout setting, unbounded-write findings in the execution confirmation, `DELIMITER` custom-delimiter awareness, empty parameters defaulting to a `?` placeholder against NULL silently filtering rows)
- [x] Preview panel remembers debug parameters (values filled for the same SQL are recalled automatically on the next preview; table-less plain-text / custom-DAO previews persist by a normalized SQL-text fingerprint, so parameters are no longer lost)
- [x] Preview parameter presets (save the filled parameters as a named preset and switch with one click — values and OGNL toggles restored as a group; the manage dialog covers save-as / rename / delete, and the presets row is collapsible)
- [x] mapper XML syntax-highlight injection (SQL keyword coloring in statement text, `#{}`/`${}` placeholder background, `test`/`value` expression coloring, `#`/`$` auto-closing `{}`, resultMap column-name completion; yields automatically when platform injection or CodeHelperPro is present; switchable in settings)
- [x] Gutter SQL icon group switches (toggle visibility per statement source: mapper XML / annotation SQL / JPA·HQL / JdbcTemplate etc., all on by default)
- [x] IPage pagination interceptor simulation (queries with an IPage parameter get a dialect-appended LIMIT plus a parallel COUNT statement; a hand-written LIMIT is never doubled)
- [x] EXPLAIN coverage extended to 11 dialects with structured rendering (Oracle / SQL Server added; MySQL tables / PostgreSQL JSON plan trees render inside the preview panel as a table / collapsible tree, falling back to the native console on failure)
- [x] Dynamic SQL condition-evaluation probe (each XML condition line annotated with this round's evaluation — true / false / unevaluated; read-only)
- [x] Preview interaction details (Ctrl+A select-all restored in the column info table, configurable row count for the `${table}` sampling quick template)
- [x] Preview panel data-source binding indicator (a persistent gray line in the parameter area showing the bound data source in three states — no data source bound (run a query in the console once to bind) / associated (last used): name / bound: name; it mirrors the data source actually used by "Execute SQL" and EXPLAIN, remembers the last-used source per project across restarts, and refreshes instantly once an execution attaches the console)

### Conversion & Completion

- [x] SQL → Java reverse conversion (AUTO / QueryWrapper / Lambda / Wrappers / MPJ, multi-table JOIN)
- [x] SQL code completion (table columns, comment hints, `collection` shortcut-alias candidates for `<foreach>`)
- [x] Wrapper method chain smart completion (suggest next methods and fields after `.eq(`)
- [x] Batch operation parameter panel (column-level toggle, batch import)
- [x] Right-click CRUD SQL generation from entity classes / database tables (candidate popup for INSERT / UPDATE / SELECT / DELETE, then into the preview; auto-increment keys unchecked by default, `@Version` optimistic-lock column appended automatically, logic-delete entities get a dedicated variant; SQL Server identity-column INSERTs auto-wrapped in `SET IDENTITY_INSERT` for direct replay; Community has entity-side entries only)
- [x] One-click rollback SQL from the preview (generates the inverse SQL for the INSERT / UPDATE / DELETE being previewed — INSERT to DELETE by primary key, UPDATE restoring original values, DELETE re-inserting by WHERE; shown in a dialog with one-click copy)
- [x] Portable export of CRUD / rollback SQL (export the current statements plus the rollback chain from the "More" menu, each statement annotated in a comment with dialect / kind / UPSERT form, through the CSV / TSV / TXT formats)

### Log & History

- [x] SQL log tool window (MyBatis / Hibernate / JdbcTemplate capture incl. multi-line statements and duplicate dual-path print merging, Log → SQL batch restore)
- [x] Duration display & slow-query detection (threshold coloring, sort by duration)
- [x] Precise jump to source — runtime `InnerInterceptor` marks the call site for exact `file:line` jumps; one-click interceptor injection from settings (multi-module projects pick modules in a dialog); jumps rely only on the real captured position; multi-module source-root fallback
- [x] Auto-open log tool window on first captured SQL (on by default, debounced and focus-friendly, suppressed for the session after a manual close — lifted again on the next project run)
- [x] Auto-start listening on project launch (captures on project open / run, resumes automatically on the next run after a manual stop)
- [x] SQL log entry sequence numbers (`#N` per-session capture order, reset on each project run; history lists show numbers by in-file entry order)
- [x] Click preview (lightweight syntax-highlighted popup, editable inline, copy button with check-mark feedback; double-click still opens the full dialog)
- [x] Three display modes for the SQL log / history list (single line / keyword wrap / formatted, keyword wrap by default, instant switching from settings)
- [x] Multi-select batch copy for SQL lists (one right-click copies every selected SQL, semicolon-terminated) and right-click copy timestamps (plain time text, line by line)
- [x] Log list search by row number and time (`#N` matches entry N exactly, time text searched as displayed)
- [x] Log original-time recording with a display switch (shows the time parsed from the log line by default, switchable to capture time; history files stay backward compatible)
- [x] JdbcTemplate collection parameters restored element-wise (`IN (:p)` no longer leaks square brackets into the SQL) and per-thread bucketing of interleaved concurrent logs
- [x] CRUD type color markers for SQL lists (left color bar / full-row tint / off, four customizable colors, selection keeps the type tint)
- [x] Stop capture when the log tool window closes
- [x] SQL history two-level navigation + favorites (file list → entries, auto-save)
- [x] History SQL parameter memory (v2 history files save parameters per entry, older files still readable) and literal parameter recovery for zero-placeholder SQL
- [x] Log capture pipeline performance optimization (EDT overhead reduction)
- [x] Performance red-line hardening (inline error reporting instead of modal dialogs, streaming log rendering, parameter-input debounce, backgrounded large-file reads, memory-leak cleanup)
- [x] Enhanced capture at startup via premain (startup-phase SQL is no longer lost, no dynamic-attach warning; falls back to attach on failure)
- [x] Log panel focus and navigation enhancements (method-level / request-level focus tabs, jump to mapper XML from log entries, execution errors shown inline with their entries)
- [x] SQL log suppression (right-click one-click suppression of keep-alive heartbeat SQL; management dialog with rule list / hit counters / optional structural matching, capped at 500 rules, resizable dialog)
- [x] Jump-landing fixes and JAR business-frame reverse allowlist (execution points inside in-house tool classes no longer climb to the caller line; business tool libraries running as dependency JARs are treated as business frames once their package prefixes are registered, with both prefix fields validated as you type and one-click fix)
- [x] Full-width parenthesis tolerance in multi-statement splitting (IME-stray full-width parentheses count on the same depth stack as half-width ones, so mixed-pair statements are no longer split into two or swallow the statements after them)
- [x] History entry pinning and regex search (pin entries against eviction; `regex:` prefix matches SQL / summary / source file, falling back to substring on invalid patterns)
- [x] History / log export (right-click export to CSV / TSV / plain text, written on a background thread)
- [x] ShardingSphere two-segment log capture (a fourth parser with `Logic SQL` as the main entry and `Actual SQL` lines folded as notes, on by default)
- [x] History SQL diff (right-click exactly two entries for a line-by-line diff plus a structure-fingerprint equivalence verdict, presented in IDEA's native Diff window)
- [x] N+1 same-template count badge (templates appearing ≥3 times get an "×N same template" badge, right-click to focus all entries of that template)
- [x] Data-source context badge (entry badges upgraded to "dialect · db@host", parsed from the JDBC URL; credentials never surface anywhere)
- [x] Clipboard read button in Log → SQL (paste in and convert in one click)

### Platform & Ecosystem

- [x] Native Database console execution in SQL → Java panel (Ultimate)
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel + ignore-this-version
- [x] No-restart self-update ("Install" hot-swaps the new version into the running IDE instantly, with automatic fallback to the restart script where dynamic install isn't available)
- [x] Local HTML help page (zero network dependency, dark mode)
- [x] Renamed to SQL Visualizer (full MyBatis-Plus / MPJ / JPA / Hibernate support unchanged)
- [x] One-click error / feedback reporting to the website feedback pool (Help menu, settings and the IDE's internal error dialog; optional stack attachment, 24-hour dedup; multi-select errors merge into one post with automatic staggered sending beyond the rate limit, and a rejected submission shows the server's exact reason for an in-place retry)
- [x] Ten read-only MCP Server tools (an AI-agent tool surface: render SQL / schema context / EXPLAIN / log restore / rollback plan and more, gated per tool in settings; requires IDEA 2025.2+)
- [x] Eleventh MCP tool sqlv_history_search (lets AI agents search the local SQL history: keyword / regex / time range / source-file filters, read-only, no execution)
- [x] Settings & onboarding discoverability polish (a readiness banner on the MCP settings page, an "Enhanced Capture" hint in the empty SQL log panel, a pointer line for the frame-filter prefix entry, a capability matrix on the settings landing page, and a one-click action on the first-run notification)

> Everything above has shipped with v2026.9.8 ~ v2026.9.23; see the [changelog](./changelog) for version details. Highlights of v2026.9.23: the ten MCP Server tools, premain capture at startup, method-level / request-level focus tabs, one-click rollback SQL, dialect auto-inference, cross-namespace include resolution, and more. The next batch (embedded value objects (@Embedded) support, SQL log suppression, SQL embedded in generic XML, alias-free HQL mapping, the OceanBase / openGauss dialects, empty parameters defaulting to a `?` placeholder, JAR business-frame registration and jump-landing fixes, etc.) has landed on master and will ship with v2026.10.6; preview parameter presets, mapper XML syntax highlighting, full-dialect EXPLAIN with structured rendering, IPage pagination simulation, ShardingSphere log capture, the MCP history-search tool, history diff & export, full-width parenthesis tolerance, the preview data-source binding indicator, preview parameter memory and more have landed on the dev branch first and will ship with a later release.

## Planned

- MPJ `fill` association rendering
- Second batch of other ORM support (candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready)
- Remaining long-tail JPA derived-query shapes
- Ongoing performance work on large Wrapper chain parsing and log rendering
- MyBatis-Flex support (research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback).

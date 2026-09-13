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
- [x] HQL / JPQL / JPA Criteria preview, with HQL `SELECT entity alias` auto-expansion to column lists
- [x] `.hbm.xml` named-query preview (`<query>` / `<sql-query>`, with `createNamedQuery` falling back to the hbm definition)
- [x] JPA Repository CRUD write-path preview (save / findById / findAllById / delete family / flush semantics), derived-query deepening (six prefixes, Pageable / Sort, Page / Slice / Stream returns), Specification and QueryByExample
- [x] First batch of other ORM chain frameworks: xbatis, Easy-Query, MyBatis Dynamic SQL, Querydsl, Spring Data JDBC / R2DBC
- [x] Custom-DAO string SQL method-definition anchors (gutter icon on the method-name line, shortcut works at method definitions)
- [x] Gutter anchor left-click instant preview, right-click lookup of recent executions
- [x] Auto-folding of long field lists in SQL preview (SELECT / INSERT column lists, VALUES groups and UPDATE SET collapse into a "… N columns" placeholder; threshold adjustable, off by default)
- [x] Real EXPLAIN plans (dialect-wrapped, run on the native database console; MySQL / PostgreSQL / KingBase / DM verified)
- [x] JOIN relationship diagram (IDEA-native Diagrams rendering with automatic fallback to the built-in renderer; column types / comments from the database when a data source is available)
- [x] SQL performance analysis hints (20 rules: missing index, full table scan, etc.)
- [x] Wrapper chain complexity scoring
- [x] Interceptor simulation: logic delete / tenant / dynamic table name / data permission
- [x] 9-dialect pagination / upsert rendering (reserved words calibrated against official docs, H2 upsert as native `MERGE INTO ... KEY`)

### Conversion & Completion

- [x] SQL → Java reverse conversion (AUTO / QueryWrapper / Lambda / Wrappers / MPJ, multi-table JOIN)
- [x] SQL code completion (table columns, comment hints)
- [x] Wrapper method chain smart completion (suggest next methods and fields after `.eq(`)
- [x] Batch operation parameter panel (column-level toggle, batch import)
- [x] Right-click CRUD SQL generation from entity classes / database tables (candidate popup for INSERT / UPDATE / SELECT / DELETE, then into the preview; auto-increment keys unchecked by default, `@Version` optimistic-lock column appended automatically, logic-delete entities get a dedicated variant; Community has entity-side entries only)

### Log & History

- [x] SQL log tool window (MyBatis / Hibernate / JdbcTemplate capture incl. multi-line statements and duplicate dual-path print merging, Log → SQL batch restore)
- [x] Duration display & slow-query detection (threshold coloring, sort by duration)
- [x] Precise jump to source — runtime `InnerInterceptor` marks the call site for exact `file:line` jumps; one-click interceptor injection from settings; multi-module source-root fallback
- [x] Auto-open log tool window on first captured SQL (on by default, debounced and focus-friendly, suppressed for the session after a manual close — lifted again on the next project run)
- [x] Auto-start listening on project launch (captures on project open / run, resumes automatically on the next run after a manual stop)
- [x] SQL log entry sequence numbers (`#N` per-session capture order, reset on each project run)
- [x] Click preview (lightweight syntax-highlighted popup, editable inline, copy button with check-mark feedback; double-click still opens the full dialog)
- [x] Three display modes for the SQL log / history list (single line / keyword wrap / formatted, keyword wrap by default, instant toolbar dropdown)
- [x] CRUD type color markers for SQL lists (left color bar / full-row tint / off, four customizable colors, selection keeps the type tint)
- [x] Stop capture when the log tool window closes
- [x] SQL history two-level navigation + favorites (file list → entries, auto-save)
- [x] History SQL parameter memory (v2 history files save parameters per entry, older files still readable) and literal parameter recovery for zero-placeholder SQL
- [x] Log capture pipeline performance optimization (EDT overhead reduction)
- [x] Performance red-line hardening (inline error reporting instead of modal dialogs, streaming log rendering, parameter-input debounce, backgrounded large-file reads, memory-leak cleanup)

### Platform & Ecosystem

- [x] Native Database console execution in SQL → Java panel (Ultimate)
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel + ignore-this-version
- [x] No-restart self-update ("Install" hot-swaps the new version into the running IDE instantly, with automatic fallback to the restart script where dynamic install isn't available)
- [x] Local HTML help page (zero network dependency, dark mode)
- [x] Renamed to SQL Visualizer (full MyBatis-Plus / MPJ / JPA / Hibernate support unchanged)
- [x] One-click error / feedback reporting to the website feedback pool (Help menu, settings and the IDE's internal error dialog; optional stack attachment, 24-hour dedup)

> Everything above has shipped with v2026.9.8 ~ v2026.9.11 — update via JetBrains Marketplace; see the [changelog](./changelog) for version details. CRUD SQL generation, field-list auto-folding, display modes, type color markers and one-click error reporting have landed on master and ship first with the v2026.9.14-beta releases on the Gitee early-access channel (enable "Auto-check on startup" in settings to get them); they merge into the same version number on the Marketplace once the 2026.9.14 stable release ships.

## Planned

- Rollback SQL — generate rollback statements from a pre-execution snapshot in the preview window, INSERT derivation first
- Agent bytecode enhancement — non-intrusive JDBC-level hooks covering 9 framework families (proof of concept first)
- MPJ `fill` association rendering
- Second batch of other ORM support (candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready)
- Remaining long-tail JPA derived-query shapes
- Ongoing performance work on large Wrapper chain parsing and log rendering
- MyBatis-Flex support (research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback).

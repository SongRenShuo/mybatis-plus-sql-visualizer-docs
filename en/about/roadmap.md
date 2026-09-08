---
prev:
  text: Changelog
  link: /en/about/changelog
next: false
---

# Roadmap

Planned features and progress.

## ✅ Completed

### Preview & Diagnostics

- [x] Wrapper → SQL static parsing (Lambda / String / MPJ JOIN / Kotlin)
- [x] XML / annotation dynamic SQL preview (OGNL panel, `maintainPage` XML)
- [x] HQL / JPQL / JPA Criteria preview, with HQL `SELECT entity alias` auto-expansion to column lists
- [x] `.hbm.xml` named-query preview (`<query>` / `<sql-query>`, with `createNamedQuery` falling back to the hbm definition)
- [x] JPA Repository CRUD write-path preview (save / findById / findAllById / delete family / flush semantics), derived-query deepening (six prefixes, Pageable / Sort, Page / Slice / Stream returns), Specification and QueryByExample
- [x] First batch of other ORM chain frameworks: xbatis, Easy-Query, MyBatis Dynamic SQL, Querydsl, Spring Data JDBC / R2DBC
- [x] Custom-DAO string SQL method-definition anchors (gutter icon on the method-name line, shortcut works at method definitions)
- [x] Gutter anchor left-click instant preview, right-click lookup of recent executions
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

### Log & History

- [x] SQL log tool window (MyBatis / Hibernate / JdbcTemplate capture, Log → SQL batch restore)
- [x] Duration display & slow-query detection (threshold coloring, sort by duration)
- [x] Precise jump to source — runtime `InnerInterceptor` marks the call site for exact `file:line` jumps; one-click interceptor injection from settings; multi-module source-root fallback
- [x] Auto-open log tool window on first captured SQL (on by default, debounced and focus-friendly, suppressed for the session after a manual close)
- [x] Auto-start listening on project launch (captures on project open / run, resumes automatically on the next run after a manual stop)
- [x] SQL history two-level navigation + favorites (file list → entries, auto-save)
- [x] Log capture pipeline performance optimization (EDT overhead reduction)
- [x] Performance red-line hardening (inline error reporting instead of modal dialogs, streaming log rendering, parameter-input debounce, backgrounded large-file reads, memory-leak cleanup)

### Platform & Ecosystem

- [x] Native Database console execution in SQL → Java panel (Ultimate)
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel + ignore-this-version
- [x] Local HTML help page (zero network dependency, dark mode)
- [x] Renamed to SQL Visualizer (full MyBatis-Plus / MPJ / JPA / Hibernate support unchanged)

> The M37 competitor-best fusion, JPA deepening, first batch of other ORM frameworks, the performance red-line hardening, hbm named queries and auto-start listening above are all merged into the dev branch (full test suite green) and ship with the next release.

## 💡 Under Consideration

- [ ] MPJ `fill` association rendering
- [ ] Second batch of other ORM support (candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready)
- [ ] Remaining long-tail JPA derived-query shapes
- [ ] Ongoing performance optimization for large Wrapper chain parsing
- [ ] MyBatis-Flex support (research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues).

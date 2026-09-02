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
- [x] JOIN relationship diagram (PlantUML / Mermaid rendering)
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
- [x] Precise jump to source — runtime `InnerInterceptor` marks the call site for exact `file:line` jumps; one-click interceptor injection from settings
- [x] SQL history two-level navigation + favorites (file list → entries, auto-save)
- [x] Log capture pipeline performance optimization (EDT overhead reduction)

### Platform & Ecosystem

- [x] Native Database console execution in SQL → Java panel (Ultimate)
- [x] SQL sharing (Markdown / HTML / executable SQL)
- [x] Settings import/export + per-project override
- [x] Gitee early-access update channel + ignore-this-version
- [x] Local HTML help page (zero network dependency, dark mode)
- [x] Renamed to SQL Visualizer (full MyBatis-Plus / MPJ / JPA / Hibernate support unchanged)

## 🔜 In Progress (M37 competitor-best fusion, started 2026-09)

| Milestone | Item | Description |
|-----------|------|-------------|
| M37.0 | Description revamp + parameter concat regression suite | Marketplace description rebranding; regression cases for parameter concatenation edge cases |
| M37.1 | Log ↔ source bidirectional deep link (P0) | Look up log execution records from source code |
| M37.2 | Real EXPLAIN integration (P0) | Plug database EXPLAIN into the preview loop |
| M37.3 | Session-aware capture + panel UX (P1) | Auto-capture on Run/Debug sessions, visible capture state |
| M37.4 | Wrapper → test asset generation (P1) | Generate test SQL cases from Wrapper chains |
| M37.5 | MyBatis-Flex support research | Research concluded, on hold pending ecosystem demand |
| Ongoing | New IDE version adaptation | Adapt to new IDEA releases promptly, no untilBuild lock |

## 💡 Under Consideration

- [ ] MPJ `fill` association rendering
- [ ] Ongoing performance optimization for large Wrapper chain parsing
- [ ] More ORM framework extensions (MyBatis-Flex research on hold, re-evaluate on demand)

---

Feature suggestions welcome via [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues).

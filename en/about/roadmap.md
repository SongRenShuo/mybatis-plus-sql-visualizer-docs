---
prev:
  text: Changelog
  link: /en/about/changelog
next: false
---

# Roadmap

Planned features and progress.

## ✅ Completed

- [x] Wrapper → SQL static parsing (Lambda / String / MPJ JOIN)
- [x] XML dynamic SQL preview
- [x] Annotation SQL preview
- [x] SQL → Java reverse conversion (4 forms)
- [x] SQL log tool window (auto capture / batch restore)
- [x] Batch operation panel (column-level toggle)
- [x] Logic delete / optimistic lock injection
- [x] 9 database dialect pagination / upsert rendering
- [x] SQL code completion
- [x] Update check & auto install
- [x] M28 Internal update channel (Gitee early access + ignore version + local testing tools)

## 🔜 Planned (2026-08-22)

| ID | Feature | Description |
|----|---------|-------------|
| F2 | SQL Performance Analysis | SQL execution time statistics & visualization |
| F3 | Complexity Scoring | Wrapper chain complexity evaluation |
| F4 | Kotlin Support | Kotlin coroutines / extensions |
| F5 | Wrapper Completion | Smart code completion enhancement |
| F6 | Interceptor Simulation | Tenant / DataPermission / DynamicTableName interceptor simulation |
| F7 | SQL History Favorites | SQL history favorites |
| F8 | Team Collaboration | Team config sharing |
| O1 | Log Window Differentiation | Log tool window differentiation |
| O4 | Dialog UX Enhancement | Preview dialog UX optimization |
| O5 | Settings Import/Export | Plugin config import/export |

## 💡 Under Consideration

- [ ] `${ew.customSqlSegment}` engine ready, awaiting Java↔XML association
- [ ] `selectAll` dual-icon collision fix
- [ ] fill association
- [ ] Dialect real-world testing coverage
- [ ] Performance optimization (large Wrapper chain parsing speed)
- [ ] More ORM framework extensions (JPA Criteria etc.)

---

Feature suggestions welcome via [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues).

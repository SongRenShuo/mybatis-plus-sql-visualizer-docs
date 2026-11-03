# Roadmap

What's shipped and what's next. Per-feature details live in [Features](/en/features/wrapper-preview); full per-release notes are in the [Changelog](./changelog).

## Planned

| Area | Notes |
| --- | --- |
| MPJ `fill` association rendering | Render the results of `fill`-populated associations |
| Second batch of ORM support | Candidates: jOOQ / Jimmer / Fluent MyBatis / dbVisitor — research matrix ready |
| Remaining JPA derived-query shapes | Wrapping up the long tail |
| Large Wrapper chains and log rendering | Ongoing performance work |
| MyBatis-Flex support | Research on hold; re-evaluate on demand |

## Done

### Preview & diagnostics

- Wrapper → SQL static parsing (Lambda / string / MPJ / Kotlin), plus XML and annotation dynamic-SQL preview (OGNL panel)
- HQL / JPQL / JPA Criteria preview, `.hbm.xml` named queries, JPA Repository derived queries and CRUD write paths
- Gutter anchor: left-click preview, right-click recent executions (editable / multi-select in a dialog)
- Real EXPLAIN plans, cross-session plan history and side-by-side comparison
- JOIN relationship diagram, SQL performance advice, Wrapper chain complexity score
- Paging / upsert rendering for 14 database dialects, with dialect inference
- Logical delete / multi-tenancy / dynamic table name / data-permission simulation
- DML impact rehearsal, execution guardrails (timeout / unbounded-write confirmation), rollback snapshots and replay-script export
- One-click diagnostic report, pre-execution schema check with dialect capability self-test, copy as AI context

See [Wrapper preview](/en/features/wrapper-preview) · [XML preview](/en/features/xml-preview) · [Annotation preview](/en/features/annotation-preview) · [JPA preview](/en/features/jpa-preview) · [Dialect support](/en/features/dialect-support)

### Conversion & completion

- SQL → Java reverse conversion (five default forms, multi-table JOIN)
- SQL completion (table / column names, comments, parameter names) and Wrapper chain completion
- Right-click CRUD SQL generation from an entity class or database table
- Batch-operation parameter panel with per-column checkboxes
- One-click rollback SQL from the preview, portable CRUD / rollback SQL export

See [SQL → Java](/en/features/sql-to-java) · [Code completion](/en/features/code-completion) · [CRUD SQL](/en/features/crud-sql) · [Batch operations](/en/features/batch-operation)

### Logs & history

- Multi-framework log capture (Log → SQL restoration), including ShardingSphere two-segment logs
- Duration display with slow-query detection, N+1 same-template counter badge
- Precise source jump, call-stack popup with click-to-frame navigation, scheduled-task thread stacks
- Persistent SQL history tab: two-level navigation, favorites and pins, regex search, history diff
- Three display modes, multi-select bulk copy, masking on display and export
- Enhanced capture (premain capture-from-start, JDBC interface matching as fallback)

See [SQL log](/en/features/sql-log)

### Platform & ecosystem

- MCP Server with eleven read-only tools
- SQL sharing (Markdown / HTML / executable SQL)
- Settings import / export with per-project overrides
- Gitee early-access channel, restart-free self-update
- One-click error and feedback reporting to the feedback pool

See [MCP tools](/en/features/mcp)

---

Feature suggestions welcome via the [Feedback Pool](/en/about/feedback).

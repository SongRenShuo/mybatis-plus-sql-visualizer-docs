# FAQ

## Which IDE versions are supported?

IntelliJ IDEA 2024.3 and above (`since-build=243`). Compatible with 2024.3 / 2025.3 / 2026.2 series. Both Community and Ultimate are supported, but "Execute SQL" requires Ultimate + Database plugin.

## Why isn't the gutter icon showing?

The gutter icon appears only at:

- Wrapper chain end lines (where `.eq()` or other terminal calls are)
- mapper XML `<select>` / `<update>` statement lines
- Java Mapper interface `@Select` annotation lines
- Hibernate HQL call lines (`session.createQuery(...)`) and JPA `@Query` annotation lines, Repository derived method lines

Ensure the cursor is at one of these positions. If still not showing, check "Show preview SQL icon in gutter" in settings. HQL strings split across multiple lines with `+` are supported too.

## Does it support MyBatis-Plus-Join (MPJ) JOIN queries?

Yes. `MPJLambdaWrapper` and `MPJQueryWrapper` JOIN preview, as well as MPJ-form SQL → Java reverse conversion are all implemented. When selecting MPJ form for reverse conversion, the project needs `mybatis-plus-join` dependency (1.5.6+).

## Why doesn't `findAllById` get a preview?

The first batch of JPA derived queries doesn't include `findAllById`-style IN expansion yet, so there is no preview for now. It will be filled in a later version — see the [roadmap](../about/roadmap.md).

## Is there a difference between preview SQL and actual runtime SQL?

The preview aims to align with MP runtime semantics. The following differences are inherent to static evaluation — semantically equivalent, textually different:

| Difference | Description |
|------------|-------------|
| **Static Constant Inline** | `in(col, DicConstants.A)` static final constants are evaluated inline (preview `IN (1)`); MP runtime renders `IN (?)` |
| **Collection Single Placeholder** | `in(col, collectionVar)` runtime size cannot be statically expanded → preview `IN (?)`; panel supports comma-separated fill-in |
| **Page Literal Calculation** | `page(new Page<>(1, 10), wrapper)` directly calculates `LIMIT 0, 10`; runtime renders `LIMIT ?, ?` |

## Can `?` placeholders be replaced with actual values?

Yes. The left panel input supports comma-separated multi-value fill-in (input `1,2,3` → renders `(1, 2, 3)`). LIKE params auto-append `%`. Quote wrapping is type-aware. "Replace `?` placeholders" is enabled by default; turning off renders variables as `?` too.

## EXPLAIN click fails or does nothing?

The most common cause is a missing data source: like "Execute SQL", "EXPLAIN" relies on the Database tool window of IntelliJ IDEA Ultimate — configure a data source there first. Oracle / SQL Server don't support EXPLAIN yet; clicking shows a hint in the panel. Execution errors are reported inline in the panel, never as a popup dialog.

## SQL log not capturing SQL?

Troubleshooting steps:

1. Confirm "Capture" button clicked (button changes to "Stop")
2. Confirm app logs contain `Preparing:` / `Parameters:` format
3. If log format is `==> Preparing:`, enable "Mixed prefix" in settings
4. Check if hit by "Remove lines containing" filter rule
5. Confirm logs output to run console (not separate log file)

## The gutter right-click "Recent Executions" item is empty?

"Recent Executions" looks up executions near that spot from logs captured this session, which requires log capture to be on and to have captured executions at that spot before. An empty menu item right after a fresh session start — no SQL run yet — is normal. If logs aren't being captured at all, go through the steps in the previous section.

## "Jump to Source" in realtime logs misses — how to fix?

SQL logs contain no call-site info, so without configuration the plugin does an approximate search by table name, which may miss. To jump precisely to the Service / Controller line that fired the SQL, copy the self-contained `SqlSourceInterceptor` shipped with the plugin (see `docs/instrumentation/SqlSourceInterceptor.kt` in the plugin repository) into your project and register it as a MyBatis-Plus `InnerInterceptor` — see [Features · Jump to Source](../features/sql-log.md#jump-to-source). Nothing else is affected without it.

## Can the auto-opened log window be turned off for good?

Yes. "Auto-open log window on SQL found" is on by default: capturing the first SQL auto-expands the log window. Once you close it manually, it won't auto-open again in the current session. To disable it permanently, turn off "Auto-open log window on SQL found" in settings; re-enabling the switch or restarting the IDE restores auto-open.

## Where did my SQL history go after upgrading?

Since v2026.9.2 the plugin's in-project data directory is renamed from `.idea/mybatis-plus-sql-visualizer/` to `.idea/sql-visualizer/` (history SQL and execution temp files). Old data is not migrated — history accumulates fresh in the new directory after upgrading. To keep old records, manually copy `.sql` files from the old directory's `sql-history/` into the new one.

## Can SQL → Java reverse conversion generate compilable code?

Yes. Generated code is strictly based on MyBatis-Plus public APIs (local jar decompilation as sole authority), no fictional methods. Auto-infers entity classes for Lambda type-safe code; falls back to string-column `QueryWrapper` when entity not found.

## How to switch plugin UI language?

`Settings → Tools → SQL Visualizer → UI Language`. Supports Simplified Chinese / English / Follow System. Plugin language is independent of IDE language; reopen preview dialog to apply.

## Does it work on an intranet with no internet access?

Yes — core features are entirely offline: previews, parameter substitution, reverse conversion, log restore, JOIN diagrams, formatting and CRUD generation all run locally, with no telemetry and no account validation. Only two optional entry points reach the internet (update check and feedback submission), and both merely report a failure without blocking anything.

Two things to prepare for an intranet deployment: pre-provision the JDBC drivers needed by "Execute SQL" (the IDE platform downloads them when missing), and optionally repoint the update channel to an internal URL via a system property. See [Offline & Intranet](./offline.md).

## Which database dialects are supported?

9 dialects: MySQL, PostgreSQL, Oracle, SQL Server, H2, SQLite, MariaDB, DM (Dameng), KingBase. Pagination and upsert conflict clauses render per dialect differences.

## Shortcut conflicts?

In plugin settings, click "Edit" next to the shortcut to re-record. If conflicting with another plugin, options offer "Use" (coexist) or "Force use" (override). Can also modify in `Settings → Keymap`.

## What to include when reporting issues?

Please submit feedback at [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback). Suggested info:

- Plugin version (build number in settings, one-click copy)
- IDE version (`Help → About`)
- Reproduction steps and sample code
- Related logs or screenshots

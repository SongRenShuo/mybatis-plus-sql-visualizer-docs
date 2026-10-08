# FAQ

## Which IDE versions are supported?

IntelliJ IDEA 2024.3 and above (`since-build=243`). Compatible with the full 2024.3 / 2025.3 / 2026.2 series. Both Community and Ultimate are supported, but "Execute SQL" requires Ultimate + Database plugin.

## Why isn't the gutter icon showing?

The gutter icon appears only at:

- Wrapper chain end lines (where `.eq()` or other terminal calls are)
- mapper XML `<select>` / `<update>` statement lines
- Java Mapper interface `@Select` annotation lines
- Hibernate HQL call lines (`session.createQuery(...)`) and JPA `@Query` annotation lines, Repository derived method lines

Ensure the cursor is at one of these positions. If it still doesn't show, check that "Show Preview SQL Icon in Gutter" is enabled in settings. HQL strings concatenated across multiple lines with `+` support gutter icons too.

## Does it support MyBatis-Plus-Join (MPJ) JOIN queries?

Yes. `MPJLambdaWrapper` and `MPJQueryWrapper` JOIN preview, as well as MPJ-form SQL → Java reverse conversion, are all implemented. When selecting the MPJ form for reverse conversion, the project needs the `mybatis-plus-join` dependency (1.5.6+).

## Why doesn't `findAllById` get a preview?

The first batch of JPA derived queries doesn't include `findAllById`-style IN expansion yet, so no preview can be generated for now. It will be filled in a later version — already listed on the [roadmap](../about/roadmap.md).

## Is there a difference between preview SQL and actual runtime SQL?

The preview aims to align with MP runtime semantics. The following differences are inherent to static evaluation — semantically equivalent, only textually different:

| Difference | Description |
|------------|-------------|
| **Static Constant Inline** | Static final constants like `in(col, DicConstants.A)` are evaluated and inlined (preview `IN (1)`); MP runtime renders `IN (?)` |
| **Collection Single Placeholder** | The runtime size of `in(col, collectionVar)` cannot be statically expanded → preview `IN (?)`; the panel input supports comma-separated fill-in |
| **Pagination Literal Calculation** | `page(new Page<>(1, 10), wrapper)` directly calculates `LIMIT 0, 10`; runtime renders `LIMIT ?, ?` |

## Can `?` placeholders be recognized and replaced with actual values?

Yes. The left panel input supports comma-separated multi-value fill-in (input `1,2,3` → renders `(1, 2, 3)`). LIKE params auto-append `%`. Quote wrapping is decided by the field type. "Replace `?` Placeholders" is enabled by default in settings; turning it off renders variables as `?` too.

## EXPLAIN click fails or does nothing?

The most common cause is a missing data source: like "Execute SQL", "EXPLAIN" relies on the Database tool window of IntelliJ IDEA Ultimate — configure a data source there first, then retry. Oracle / SQL Server don't support EXPLAIN yet; clicking shows a hint in the panel. Execution errors are reported inline in the panel, never as a popup dialog.

## SQL log not capturing SQL?

Start with the diagnostics the panel's empty state gives you — it shows the enhanced-capture channel's current state (off / not authorized / waiting for the app process / attached / fallen back) plus the console channel's scanned line count, and names the next step for your case.

**Enhanced capture (default channel)**

1. Injection not authorized yet: click "Agree and enable" in the dialog, or use "Re-authorize" under "Enhanced Capture" in settings; once authorized, the next project run captures fully
2. Project not run yet: enhanced capture attaches with the application process — run / debug the project once

**Console channel (the fallback when enhanced capture is unavailable)**

3. The application log must contain `Preparing:` / `Parameters:`; the `==> Preparing:` form needs "Mixed prefix" enabled in settings
4. Parameter lines may be blocked by the log level — usually TRACE is required
5. Check whether lines were hit by the "Remove Lines Containing" filter rule
6. Confirm the log goes to the run console (not a separate log file)

## The gutter right-click "Recent Executions" item is empty?

"Recent Executions" looks up executions near that spot from logs captured this session — it requires log capture to be on and to have captured executions at that spot before.

An empty state right after a fresh session start, before any SQL has run, is normal — the dialog opens and reports it. If logs aren't being captured at all, go through the steps in the previous section.

## "Jump to Source" in realtime logs misses — how to fix?

Jumps rely only on the positions the plugin actually captured — there is no table-name guessing fallback. Enhanced-capture entries carry the real call stack from execution time and land precisely; console-capture logs contain no call-site info, so they need the interceptor below for a precise landing.

For precise jumps, copy the self-contained `SqlSourceInterceptor` shipped with the plugin into your project and register it as a MyBatis-Plus `InnerInterceptor` — see [Features · Jump to Source](/en/features/sql-log#jump-to-source).

The interceptor file lives at `docs/instrumentation/SqlSourceInterceptor.kt` in the plugin repository; without it, nothing else is affected.

## Can the auto-opened log window be turned off for good?

Yes. "Auto-Open Window on SQL Found" is on by default: capturing the first SQL auto-expands the log window. Once you close it manually, it won't auto-open again for the current session. To turn it off for good, disable "Auto-Open Window on SQL Found" in settings; re-enabling the switch or restarting the IDE restores auto-open.

## Where did my SQL history go after upgrading?

Since v2026.9.2 the plugin's in-project data directory is renamed from `.idea/mybatis-plus-sql-visualizer/` to `.idea/sql-visualizer/` (history SQL and execution temp files). The rename does not migrate old data — history starts accumulating fresh in the new directory after upgrading.

To keep old records, manually copy the `.sql` files under the old directory's `sql-history/` into the new one.

## Why did my SQL dialect change after upgrading?

Since v2026.9.18 the database dialect defaults to "Auto-infer (follow the data source)": the plugin infers the dialect first from the enhanced-capture connection's JDBC URL, then from the IDE data source configuration, falling back to MySQL when neither matches. Configurations that never set a dialect manually enter inference mode automatically after upgrading (the old default was MySQL).

To pin a dialect, pick one manually in settings — pagination / upsert rendering then follows the selected dialect. You can switch back to "Auto-infer" anytime.

## Can SQL → Java reverse conversion generate directly compilable code?

Yes. Generated code is strictly based on MyBatis-Plus public APIs (local jar decompilation as the sole authority), with no fictional methods. It auto-infers entity classes and generates type-safe code in Lambda form; when no entity is found it falls back to a string-column `QueryWrapper`.

## How to switch the plugin UI language?

`Settings → Tools → SQL Visualizer → UI Language`. Supports Simplified Chinese / English / Follow System. The plugin language is independent of the IDE language setting; reopen the preview dialog to apply.

## Does it work on an intranet with no internet access?

Yes — core features are entirely offline: previews, parameter fill-in, reverse conversion, log restore, JOIN diagrams, formatting and CRUD generation all run locally, and the plugin has no telemetry or account validation. Only two optional entry points reach the internet — "Check Update" and "Submit Feedback" — and both merely report a failure without blocking anything.

Two more things to note for intranet deployment: the JDBC drivers needed by "Execute SQL" must be pre-provisioned (when missing, the IDE platform downloads them online), and a system property can repoint the update source to an intranet address. See [Offline & Intranet](./offline.md).

## Which database dialects are supported for pagination syntax?

11 dialects: MySQL, PostgreSQL, Oracle, SQL Server, H2, SQLite, MariaDB, DM (Dameng), KingBase, OceanBase, openGauss. Pagination clauses and upsert conflict clauses render per dialect differences.

## Shortcut conflicts?

In the plugin settings page, click the "Edit" button next to the shortcut to re-record it. If it conflicts with another plugin, the dialog offers "Use" (coexist) or "Force use" (override). You can also change it directly in `Settings → Keymap`.

## What to include when reporting issues?

Please submit feedback at the [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback). Suggested attachments:

- Plugin version number (the "Internal Build Number" in settings supports one-click copy)
- IDE version (`Help → About`)
- Reproduction steps and sample code
- Related logs or screenshots

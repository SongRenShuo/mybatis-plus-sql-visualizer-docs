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

## Why is there no SQL syntax highlighting or completion in mapper XML?

Syntax highlighting inside mapper XML statements (keyword / string / comment coloring, `#{}` / `${}` placeholder shading, expression coloring in attributes such as `test`) and in-statement completion are **provided by this plugin itself** (language injection + a built-in highlighter) — you do **not** need to configure an SQL dialect. If nothing shows at all, check in this order:

1. **Does your plugin version include it?** Mapper XML injection coloring is a recent capability — **releases 2026.10.9 and earlier do not have it**. It is provided from 2026.10.13 onward; upgrade to the latest version (then restart the IDE).
2. **Is the file recognized as a mapper?** The root tag must be `<mapper>` (with a `namespace`) — injection is enabled only when `mapper` is the root tag.
3. **Is another MyBatis plugin interfering?** With another MyBatis plugin installed (e.g. MyBatisCodeHelperPro), this plugin yields only on the **ranges the other one already occupies** (for example the `#{}` parameter placeholders); the rest of the statement stays colored and does not go blank.
4. **Completion depends on indexing:** candidates come from "entity classes / Mapper interfaces are resolvable", so project dependencies must be imported and indexing finished (no candidates while dependencies are missing or indexing is in progress).
5. In-statement completion is triggered manually with `Ctrl+Space`.

Highlighting is governed by the **"Syntax highlighting for mapper XML (keywords + parameter placeholders)"** toggle under **UI and Actions** in settings (on by default) — if it was turned off, the whole statement goes uncolored, so confirm it first.

## Do I need to configure an SQL dialect to get highlighting?

No. SQL highlighting and completion inside mapper XML are provided by this plugin and **do not depend on any SQL dialect configuration**.

If the editor shows `SQL dialect is not configured.`, that is an **IDE platform** message — a weak warning from Ultimate's SQL injection on the mapper XML statement text, **not an error from this plugin**. To clear it, or to use the platform's SQL features (statement parsing, object navigation, direct execution), point the project (or the mapper file's directory) at the real dialect under `Settings → Languages & Frameworks → SQL Dialects`. Configuring it is a bonus; skipping it does not affect this plugin's highlighting.

## Is configuring a data source what makes XML highlighting work?

No. A data source is a prerequisite for **execution-class** features: running SQL and EXPLAIN require a data source configured in the Database tool window first (Ultimate's Database plugin). The editor's syntax highlighting and completion do not read the data source — you get highlighting without one. Once a data source is configured, column completion additionally merges in the database's real columns and comments (see [Features · SQL Code Completion](/en/features/code-completion)), and JOIN diagram nodes carry real column comments.

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

The most common cause is a missing data source: like "Execute SQL", "EXPLAIN" relies on the Database tool window of IntelliJ IDEA Ultimate — configure a data source there first, then retry. Oracle registers the plan into the session-level `PLAN_TABLE` and the statement returns 0 rows, so follow the panel's hint and query `DBMS_XPLAN.DISPLAY` on the database side over the same connection; SQL Server returns the plan XML in an extra result tab of the native console. Execution errors are reported inline in the panel, never as a popup dialog.

## SQL log not capturing SQL?

Start with the diagnostics the panel's empty state gives you — it shows the enhanced-capture channel's current state (off / waiting for the app process / attached / fallen back) plus the console channel's scanned line count, and names the next step for your case.

**Enhanced capture (default channel)**

1. The master switch is off: re-enable "Enhanced Capture" in settings — it is on by default and ticking it is the consent, no extra confirmation
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

## Where does the COUNT statement in a paginated preview come from?

It is produced by the "simulate pagination interceptor" switch, which mirrors MyBatis-Plus `PaginationInnerInterceptor` runtime behaviour: when a mapper method / XML / annotation statement takes a `Page` / `IPage` argument, the preview **appends the pagination clause** to the original statement (e.g. `LIMIT ?, ?`) and **emits a COUNT wrapper alongside** it (`SELECT COUNT(*) FROM (...) TOTAL`, annotated with its origin). Statements with `searchCount=false` or a handwritten LIMIT produce only one of the two, and the COUNT product sits at the bottom of the panel — scroll to see it. To opt out, switch the master toggle off on the settings page's "SQL Preview" tab, or drop just the COUNT half with the "append paginated COUNT preview" sub-switch.

## Can a preview show the effect of data permissions (DataPermission)?

Data permissions are appended dynamically by the interceptor at runtime, so a static preview cannot see them. The plugin offers two aids on the settings page's "SQL Preview" tab: a **"data-permission mock condition"** where you type a WHERE fragment (e.g. `dept_id IN (1,2,3)`) that is appended to the end of SELECT / UPDATE / DELETE so you can preview the post-permission shape, and a **"show DataPermissionInterceptor runtime-difference hint"** switch that makes the preview's warning area note that the statement will be rewritten at runtime.

## Can handwritten string SQL inside JdbcTemplate be previewed?

Yes. "Enable JdbcTemplate string-SQL preview" on the settings page's "SQL Preview" tab is on by default: string SQL arguments of `queryForList` / `update` and friends get a preview icon and can be triggered with `Alt+Shift+Q`; `NamedParameterJdbcTemplate` `:name` parameters are filled in.

## Why isn't the execution plan rendered as a table inside the panel?

By default it goes to the native database console — "structured EXPLAIN rendering inside the preview panel" is an **experimental feature, off by default** (the tabular interaction was reviewed and judged worse than the native console). To render inside the panel, turn it on in settings: MySQL-family plans render as tabular rows, PostgreSQL-family as a FORMAT JSON tree with index suggestions, while other dialects (TEXT / XML, not hard-parsed) and every failure path fall back to the native console — both channels coexist.

## Do I have to retype parameter values every time?

No. The parameter area of the preview panel has **presets**: the **default preset** remembers the values you typed and recalls them the next time you preview the same declaring method (presets are scoped per method, so two methods never share values; even after you edit the SQL text it still falls back to that method's most recent save), and **Manage Presets** lets you save several named parameter sets (e.g. "staging sample", "boundary values") and switch between them; the conditions area also offers "deselect all / clear" to wipe the current conditions quickly.

## Why is the affected-row estimate unavailable?

The action only works for a single UPDATE / DELETE. These shapes report the reason instead of estimating: unparseable statement, multiple statements, not UPDATE / DELETE, JOIN / multi-table write (COUNT would count rows matched several times), no WHERE (a full-table COUNT is a full scan), and WHERE too complex (very long subquery predicate, uncontrollable cost). With no data source bound, a picker opens first and the probe retries once you choose one.

## Why does the AI context block still contain original values?

"Copy as AI Context" only masks literals that **match a rule** (password-like column names, ID-card / mobile-number shapes); ordinary strings keep their original text — `name = 'tom'` for instance is not treated as sensitive. So the block makes no promise of being entirely secret-free: read it over before pasting into an external AI. For a stricter exit, turn on "Display and export masking" or clean it up by hand before copying.

## Why isn't EXPLAIN plan history saved by default?

Raw execution plans are not redacted; predicates may contain business values, credentials or keys. "Keep raw EXPLAIN plans across sessions" is therefore off by default, which means plans are only comparable within the current session. Enabling it in settings saves plans isolated by project + data source UUID + dialect + SQL fingerprint; clearing preview history deletes them as well.

## What to include when reporting issues?

Please submit feedback at the [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback). Suggested attachments:

- Plugin version number (the "Internal Build Number" in settings supports one-click copy)
- IDE version (`Help → About`)
- Reproduction steps and sample code
- Related logs or screenshots

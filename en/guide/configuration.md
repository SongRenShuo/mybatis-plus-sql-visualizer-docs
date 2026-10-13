# Configuration

All settings are located at `Settings > Tools > SQL Visualizer`.

![SQL Visualizer main settings page (Tools > SQL Visualizer)](/demo/settings.png)

The bottom of the top-level "SQL Visualizer" settings page carries a **capability matrix** — four lines stating what the plugin does: runtime capture of real parameters and timings, static pre-execution reconstruction without a database, eleven MCP tools for AI agents, and where the compatibility matrix and docs live.

![Capability matrix at the bottom of the settings landing page (runtime capture / preview without a DB / eleven MCP tools / compatibility matrix and docs)](/demo/settings-landing.png)

No IDE restart needed: re-trigger a preview and the new settings apply.

## SQL Preview

| Setting | Default | Description |
|---------|---------|-------------|
| Database Dialect | Auto-infer | Pagination / upsert clauses render per dialect; defaults to "Auto-infer", can be pinned manually, and leaving it empty at project level follows the global setting. See [Wrapper → SQL Preview · Dialect pagination](/en/features/wrapper-preview#_11-dialect-pagination) |
| Replace `?` Placeholders | On | Off = variables also render as `?` |
| Formatted Output | On | Multi-line indent (Off = single line) |
| Vertical Layout Column Tags | On | In vertical layout, each INSERT value line end shows a pairing `-- column` annotation (the vertical-layout button tooltip likewise notes that this can be turned off here) |
| Literal Parameter Recovery | On | When log SQL has no `?` placeholders, string literals are identified as editable parameters; numeric constants are recognized only in comparison / IN / BETWEEN / VALUES contexts — `LIMIT` and projection-column constants are never mistaken for pagination parameters |
| Auto-Fold Long Field Lists in SQL Preview | Off | When enabled, preview editors collapse long field lists (SELECT / INSERT column lists, VALUES groups, UPDATE SET) into a "… N columns" placeholder — click the fold marker to expand; applies consistently across the main preview, single-click preview, history preview, Log → SQL results and the native console |
| Auto-Fold Field Threshold | 10 | A field list folds only when it has at least this many elements and spans multiple lines; editable only while auto-fold is enabled |
| Logic Delete Injection | On | `@TableLogic` auto appends `AND deleted = value` |
| Logic Delete Value | 0 | Value for the logic delete condition |
| Tenant Injection | Off | Entity queries / updates / deletes auto append `AND tenant_id = ?` (preview simulation, aligned with MP's tenant interceptor semantics) |
| Tenant Column Name | `tenant_id` | Column name used for tenant injection, adjustable per business (e.g. `org_id` / `shop_id`) |
| Tenant Column Default | 1 | Literal default appended to UPDATE SET / INSERT tenant columns |
| Append Tenant Column on INSERT | On | Sub-switch: the INSERT column list gets the tenant column appended (aligned with MP `TenantLineInnerInterceptor` INSERT semantics); INSERT only — requires Tenant Injection to be on, UPDATE / DELETE unaffected |
| Simulate Pagination Interceptor (COUNT preview) | On | For mapper methods / XML / annotation statements taking a `Page` / `IPage` argument, the preview **appends the pagination clause** and **emits a COUNT wrapper alongside** (`SELECT COUNT(*) FROM (...) TOTAL`), matching MyBatis-Plus `PaginationInnerInterceptor` runtime behaviour (skipped when `searchCount=false`). See [Wrapper → SQL Preview · pagination simulation](/en/features/wrapper-preview#_11-dialect-pagination) |
| Append paginated COUNT preview | On | Sub-switch of the simulation: when off, only `LIMIT` is appended and no COUNT statement is produced; has no effect while the master switch is off (parent wins) |
| Enable JdbcTemplate string-SQL preview | On | Shows a preview icon for string SQL arguments of `queryForList` / `update` and friends, triggerable with `Alt+Shift+Q`; named parameters (`NamedParameterJdbcTemplate` `:name` placeholders) are filled in |
| Show DataPermissionInterceptor runtime-difference hint | Off | When on, the warning area of SELECT / UPDATE / DELETE previews notes that the interceptor appends conditions dynamically at runtime |
| Data-permission mock condition | empty | A hand-written WHERE fragment (e.g. `dept_id IN (1,2,3)`) appended to the end of SELECT / UPDATE / DELETE, for previewing the statement as data permissions would shape it |
| Structured EXPLAIN rendering inside the preview panel | Off (experimental) | By default the plan goes to the native database console; when on, MySQL-family (tabular rows) and PostgreSQL-family (FORMAT JSON tree) plans render structurally inside the preview panel with index suggestions, while other dialects and any failure path fall back to the native console (both channels coexist) |
| Execution Timeout | 30 s | Timeout guard for the execute / EXPLAIN chain (0 = unlimited): a hung query no longer sits in loading forever — the statement is cancelled first, then an error is reported; multi-statement scripts get a budget scaled by statement count (capped at 8x) |
| Calibrate Column Names from the Data Source | On | When an entity field name differs from the real column name in the database, column names in the preview SQL are corrected against the data source's real column set; global and project-level switches each available. See [Wrapper → SQL Preview · Parameter Fill-in](/en/features/wrapper-preview#parameter-fill-in) |
| Empty-Parameter Fill Strategy | Placeholder `?` | How a parameter input row with signature info is filled when left empty — Placeholder `?` (default) / NULL literal / empty string, three options. See [XML / HQL Dynamic SQL Preview · Parameter Panel](/en/features/xml-preview#parameter-panel) |

::: details Full rules of dialect auto-inference (When to read: you need to pin a dialect or debug a dialect mismatch)
Inference priority: the enhanced-capture connection's JDBC URL wins first, the IDE data source configuration next, MySQL as the fallback when neither matches; "Auto-infer" is the first entry of the dialect dropdown, with a status line below showing the current inference result and its basis. Upgrade semantics: users who never touched the dialect setting enter inference mode automatically (the old default was MySQL), and manual values are preserved as-is. Reserved words of all 11 dialects are calibrated against official docs / engine tests, and H2 upsert renders as the native `MERGE INTO ... KEY` form.
:::

::: details Basis for choosing a fill strategy (When to read: execution errors or a suspected unfilled parameter)
The default keeps `?` as a to-be-filled hint, avoiding NULL silently filtering rows (e.g. `amount >= NULL` never matches, and it is easy to miss that a parameter went unfilled); switch to the NULL / empty-string option when you need directly executable SQL. Users who had persisted NULL / empty string keep their choice.
:::

## Table Name Mapping

| Setting | Default | Description |
|---------|---------|-------------|
| Table Prefix / Suffix | Empty | Auto add prefix / suffix to inferred table names |
| Remove Table Prefix / Suffix | Empty | Strip prefix / suffix from inferred table names |
| Ignored Field Names | Empty | Fields excluded from SELECT expansion and completion |
| Table Name Strategy | SNAKE | SNAKE = camelCase to snake_case / CAMEL = preserve camelCase |

## Code Generation (SQL → Java)

| Setting | Default | Description |
|---------|---------|-------------|
| Default Wrapper Form | Auto | AUTO / QUERY / LAMBDA / WRAPPERS / MPJ |
| Allow Manual Entity Selection on Auto-Infer Failure | On | Off = pure auto-inference |

## SQL Log

![Settings page, Source Location Capture group: enhanced capture switch, redaction, call-stack snapshot frame count (12–64), authorization status line and the two frame filter lists](/demo/settings-enhanced-capture.png)

![Settings page groups for List Display / CRUD color marking / slow-query threshold: SQL display mode, per-statement color markers with reset, slow-query threshold, list cache and dedup window](/demo/settings-log-list.png)

![Settings page "ORM Frameworks" group: enable Hibernate/JPA log capture (with SQL and parameter prefixes), enable Spring JdbcTemplate log capture, enable ShardingSphere log capture; the "Auto Save" group sits below](/demo/settings-orm-capture.png)

| Setting | Default | Description |
|---------|---------|-------------|
| SQL / Param Prefix | `Preparing:` / `Parameters:` | Console log recognition prefix |
| Auto-start Listening on Project Launch | Off | Starts capture automatically when the project opens or runs (same as clicking "Capture"); enabling the setting itself does not start listening immediately — it triggers on the project run. A manual stop suppresses auto-start for the session, the next project run resumes it |
| Auto-Open Window on SQL Found | On | Auto-expands the log tool window when SQL is captured (60s debounce, never steals focus); a manual close suppresses auto-open for the session, restored by re-enabling the setting, restarting the IDE, or (with auto-start listening on) running the project again |
| Stop Capture on Tool Window Close | Off | Automatically stops capture when the log tool window is closed |
| Auto-Inject Source-Capture Interceptor | Off | Trigger-style switch: checking it immediately generates the `SqlSourceInterceptor` and config class in your project once (skipped if already present); after restarting your app, live logs carry the source location. See [SQL Log Tool Window · Jump to Source](/en/features/sql-log#jump-to-source) |
| Enhanced Capture | On | Bytecode-instrumentation capture channel: the consent dialog pops when you enable enhanced capture or open the project (before any run), and once agreed the very first run captures fully with the agent attached — no SQL logging setup needed on the application side, and real parameters, millisecond-accurate durations, affected rows and true source locations come out of the box; application processes already running are picked up by the rescan when listening starts; automatic fallback to console capture on failure; stopping listening also stops in-app collection |
| Enhanced Capture Desensitization | Off | Masks parameter values that look sensitive (real values collected by default) |
| Call-Stack Snapshot Frames | 24 | Total frames kept in the preview's call stack (range 12–64); sampled at both ends — JDBC / engine-side frames at the top, 8 business-side frames always kept at the bottom, joined by an omission marker. Changes are hot-pushed to the agent on save, no application restart. See [SQL Log Tool Window · Jump from the Call Stack](/en/features/sql-log#jump-from-the-call-stack) |
| Source-Capture Frame Skip Prefixes | Empty | Framework frame prefixes skipped when tracing enhanced-capture jumps up the call stack (one per line); live list and history panel share the same resolver |
| JAR Business-Frame Prefixes | Empty | Package prefixes of in-house business tool libraries that run as dependency JARs (one per line): once registered, source jumps land on the SQL line inside the tool class instead of the upper caller line; use together with "Source-Capture Frame Skip Prefixes" |
| Timestamp Display | On | Whether the time column appears in the entry list |
| Timestamp Source | Log time | "Log time" shows the original time parsed from the log line (common formats recognized automatically, falling back to capture time when absent); "Capture time" shows when the plugin captured the log. The timestamp format setting applies to both sources alike |
| Dedup Window | 60000 ms | Same SQL (whitespace-insensitive) doesn't reappear within the window; toggling "Remove duplicate SQL" trims existing duplicates immediately |
| Duration Prefix | `Time:` | Custom prefix for parsing execution time from logs (compatible with p6spy / MyBatis-Plus timing output) |
| Slow Query Threshold | 1000 ms | Durations at or above this are flagged as slow queries in red |
| Auto-Save SQL History | Off | Captured entries are saved in full to the history file (not limited by the list's max-entry count) for the "History" tab |
| History Directory / File Name | Empty (default path) / `sql-history-$yyyy-MM-dd$.sql` | History save location and naming template, with date placeholders supported |
| History File Retention Limit | 30 | When the save directory holds more history files than this, the oldest are cleaned up automatically to keep the disk from growing without bound; 0 = keep everything |
| Remove Lines Containing | Empty | Filter log lines containing specified keywords |
| CRUD Color Markers | Left color bar | Log / history lists colored by SELECT / INSERT / UPDATE / DELETE type (default blue / green / orange / red); three styles (left color bar / full-row tint / off), four customizable colors with one-click restore to defaults; the "Type Filter" popup checkboxes carry color swatch legends |

::: details Scope of source-interceptor injection and project-type boundaries (When to read: injecting in a multi-module project or hitting an "unrecognized project type" dialog)
"Auto-Inject Source-Capture Interceptor": multi-module projects first show a dialog to pick the injection scope (all selected by default); when the project type can't be recognized (not a Spring Boot + MyBatis-Plus project), the dialog instead guides you to enable enhanced capture in one click (the enhanced channel does not depend on project type).
:::

::: details Format validation and activation of the two prefix fields (When to read: a format error appears after registering, or you want to confirm it took effect)
The "Source-Capture Frame Skip Prefixes" and "JAR Business-Frame Prefixes" fields are validated as you type (letters, digits, underscore, $ and dots only, a trailing dot recommended); invalid formats, duplicates within one field, or the same prefix registered in both fields are flagged below the inputs with a one-click fix (cross-field conflicts keep the skip side); changes take effect via hot push after save (no application restart needed).
:::

### Data Directory

History SQL and execution temp files live under `.idea/sql-visualizer/` in your project (history files in its `sql-history/` subdirectory). Since v2026.9.2 this directory is renamed from `mybatis-plus-sql-visualizer`; old directories are no longer read — history starts fresh in the new location after upgrading.

## UI & Operations

| Setting | Default | Description |
|---------|---------|-------------|
| Show Preview SQL Icon in Gutter | On | Wrapper anchor line gutter icon entry |
| Detect SQL Embedded in Generic XML (leaf tag text/CDATA) | On | In-house framework XML (root element name not fixed, SQL inside custom tags as CDATA/text) also shows the preview icon: a leaf tag whose text starts with SELECT / INSERT / UPDATE / DELETE etc. is claimed, with no reliance on root element names |
| Show Whitespace in Plugin-Built Editors | Off | Show space, tab and line-end markers in the editors the plugin builds (SQL preview, Log → SQL, click preview, rollback SQL, SQL input, parameter import, SQL → Java, etc.), handy for spotting stray blanks in dynamically assembled SQL; display-only — the SQL text is untouched, and when off (the default) the IDE-wide "show whitespace" preference applies |
| Render JOIN Diagram with IDE-Native Graph Framework | On | JOIN diagrams use IDEA's native Diagrams engine (zoom / auto layout / fold / export); falls back to the built-in renderer when the Diagrams plugin is absent or rendering fails |
| UI Language | Simplified Chinese | Plugin UI language (English / Follow System selectable) |
| Shortcuts | `Alt+Shift+Q` / `Alt+Shift+J` | SQL preview / SQL → Java respectively |

**Gutter icons grouped by source**: beyond the table above, the preview icons in the left gutter are split into six independently toggled source groups (mapper XML statements / annotation SQL (@Select family) / JPA·HQL family / JdbcTemplate string SQL / generic embedded XML fallback / Wrapper chains and method-name string SQL) — switch a group off and that kind of code stops showing gutter icons, handy when you only care about one kind of SQL in a project.

![UI and Actions page: the six gutter source-group switches plus the mapper XML syntax-highlighting master switch](/demo/settings-gutter-groups.png)

**mapper XML syntax highlighting**: the plugin injects its own syntax colouring into mapper XML — statement keywords, `#{}` / `${}` parameter placeholders and inline SQL text are coloured separately (the "mapper XML syntax highlighting (keywords + parameter placeholders)" checkbox in the screenshot above is its master switch). Turn it off and mapper XML falls back to the IDE's native XML colouring.

![Injected colouring in OrderMapper.xml: select tags and SQL keywords coloured, ${orderBy} placeholder highlighted separately](/demo/xml-syntax-highlight.gif)

## MCP Tools

![Settings page, MCP subpage: the master switch plus a per-tool enable checkbox for each of the eleven read-only tools](/demo/settings-mcp.png)

The plugin exposes 11 read-only tools to AI agents (Claude Code / Cursor / AI Assistant, etc.) through the platform's MCP Server; the "MCP Tools" subpage in settings provides the gating:

For the tool surface and version requirements, see [MCP Server Tools](/en/features/mcp).

- Master switch: enable/disable the plugin's MCP functionality as a whole
- Per-tool enable/disable for all eleven tools, plus "Enable All / Disable All" quick buttons
- Changes take effect immediately — no IDE restart needed
- These switches gate the plugin's own tools only; the IDE-wide "Enable MCP Server" toggle under Tools → MCP Server is the platform master switch (other plugins and platform tools share the same service), and the two are independent — with the plugin's switch off, the platform service keeps running, while the plugin removes the `sqlv_*` tools from the agent's tool list dynamically through the platform's tool-filter extension, no restart needed

## Project-Level Settings

`Settings > Tools > SQL Visualizer (Current Project)` offers 10 project-level controls: the enhanced-capture switch, database dialect, 3 checkboxes, logic-delete value, table prefix / suffix, table-name strategy, and ignored fields.

![SQL Visualizer project-level settings page (Tools > SQL Visualizer (Current Project)): with the master switch off, every row below grays out and shows the effective global values](/demo/settings-project.png)

- When the "Use project settings" master switch is off, the 9 override rows gray out and show the effective global values — what you see is what runs; a "Reset to follow global" button clears this project's overrides in one click
- With the dialect on "Auto-infer", the project level takes precedence over the global decision
- Settings search hits entries on both the global page and the project page
- Import / export covers global settings only; project-level settings are not included

## Update & Diagnostics

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-Check on Startup | Off | When enabled, silent check of the Gitee early-access channel on IDE launch with a notification when a new version is found; when off, stable updates come from JetBrains Marketplace |
| Ignore This Version | - | Notification action to skip startup reminders for the current version (persisted across restarts); manual checks in settings are unaffected |
| Check Update / Download & Install | - | Manual check, one-click download & install; the new version hot-swaps into the running IDE and takes effect immediately (no restart), with automatic fallback to the restart script when dynamic install isn't supported or any step fails — never left in an intermediate state |
| Plugin Cache | - | Show cache size and entry count (entity lookup / resolution / Wrapper preview, all scopes), one-click clear |
| Report a Problem / Feedback Pool | - | Manual feedback entry, opening a report dialog straight to the [feedback pool](/en/about/feedback); type / category / description required; IDE and plugin versions are attached automatically |
| Internal Build Number | - | Unique per build, one-click copy for bug reports |
| Settings Import / Export | - | Import / export settings as JSON; covers global settings only (project-level settings are not included), with the result shown inline next to the buttons |

The settings page's "Update & Diagnostics" area (`Settings > Tools > SQL Visualizer > About`) gathers these entries in one place, and "Report a Problem…" opens this dialog:

![SQL Visualizer "Report to the feedback pool" dialog: title, type, category and description are required, an exception-stack .txt can be attached, nickname and email are optional, and it supports anonymous submission or handing off to the browser](/demo/feedback-dialog.png)

::: details Privacy and dedup rules of the feedback dialog (When to read: you care about the upload scope or about duplicate reports)
"Report a Problem / Feedback Pool": by default only the exception class name and a stack-frame summary are prefilled; the full exception message and complete stack, plus the stack attachment, are opt-in checkboxes — uploaded only when checked, and they may contain local paths and class names. The same exception is deduplicated for 24 hours; the Help menu's "SQL Visualizer Feedback / Feedback Pool" entry and the IDE's internal error dialog offer one-click reporting too; reporting several entries selected in the IDE error list merges them into a single post (items beyond the rate-limit threshold are queued and sent staggered automatically); when a submission is rejected the dialog stays open and the status line shows the exact reason returned by the server — fix it and retry directly.
:::

> After a no-restart update, if the IDE shows an info-level "plugin was not completely unloaded" notice: it is a one-time notice from the IDE's GC watch window over the old classloader — the new plugin instance has fully taken over (extension points / services all rebuilt), the old instance is only transiently memory-resident and clears on the next IDE restart, with no functional impact.

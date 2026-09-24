# Configuration

All settings are located at `Settings > Tools > SQL Visualizer`.

![SQL Visualizer main settings page (Tools > SQL Visualizer)](/demo/settings.png)

No IDE restart needed: re-trigger preview to apply new settings.

## SQL Preview

| Setting | Default | Description |
|---------|---------|-------------|
| Database Dialect | Auto-infer | Pagination / upsert clause per dialect. Defaults to "Auto-infer (follow the data source)": the enhanced-capture connection's JDBC URL wins first, the IDE data source configuration next, MySQL as the fallback; "Auto-infer" is the first entry of the dialect dropdown, with a status line below showing the current inference result and its basis. Picking a dialect manually takes effect as-is and you can switch back anytime; at project level, leaving it empty follows the global setting. Upgrade note: users who never touched the dialect setting enter inference mode automatically (the old default was MySQL); manual values are preserved. Reserved words of all 11 dialects are calibrated against official docs / engine tests; H2 upsert renders as native `MERGE INTO ... KEY` |
| Replace `?` Placeholders | On | Off = variables also render as `?` |
| Formatted Output | On | Multi-line indent (Off = single line) |
| Vertical Layout Column Tags | On | In vertical layout, each INSERT value line end shows a pairing `-- column` annotation (the vertical-layout button tooltip mentions this setting) |
| Literal Parameter Recovery | On | When log SQL has no `?` placeholders, string literals are identified as editable parameters; numeric constants are recognized only in comparison / IN / BETWEEN / VALUES contexts — `LIMIT` and projection constants are never mistaken for pagination parameters |
| Auto-Fold Long Field Lists in SQL Preview | Off | When enabled, preview editors collapse long field lists (SELECT / INSERT column lists, VALUES groups, UPDATE SET) into a "… N columns" placeholder — click the fold marker to expand; applies consistently across the main preview, single-click preview, history preview, Log → SQL results and the native console |
| Auto-Fold Field Threshold | 10 | A field list folds only when it has at least this many elements across multiple lines; editable only while auto-fold is enabled |
| Logic Delete Injection | On | `@TableLogic` auto appends `AND deleted = value` |
| Logic Delete Value | 0 | Value for logic delete condition |
| Tenant Injection | Off | Entity SELECT / UPDATE / DELETE auto appends `AND tenant_id = ?` (preview simulation, aligned with MP's tenant interceptor semantics) |
| Tenant Column Name | `tenant_id` | Column name used for tenant injection, adjustable per business (e.g. `org_id` / `shop_id`) |
| Tenant Column Default | 1 | Literal default appended to UPDATE SET / INSERT tenant columns |
| Append Tenant Column on INSERT | On | Sub-switch: INSERT column list gets the tenant column (aligned with MP `TenantLineInnerInterceptor` INSERT semantics); INSERT only — requires Tenant Injection to be on, UPDATE / DELETE unaffected |
| Execution Timeout | 30 s | Timeout guard for the execute / EXPLAIN chain (0 = unlimited): a hung query no longer sits in loading forever — the statement is cancelled first, then an error is reported; multi-statement scripts get a budget scaled by statement count (capped at 8x) |
| Calibrate Column Names from the Data Source | On | When an entity field name differs from the real column name (field `orderID`, column `order_id`), column names in the preview SQL are corrected against the data source's real column set; a name is rewritten only when it maps to exactly one column — zero or ambiguous matches stay untouched; with no usable data source (Community, unconfigured, not connected) or an invisible table, behavior is identical to off; global and project-level switches each available |
| Empty-Parameter Fill Strategy | Placeholder `?` | What an empty typed parameter input row renders as: Placeholder `?` (default) / NULL literal / empty string. The default keeps the `?` as a to-be-filled hint, avoiding NULL silently filtering rows (e.g. `amount >= NULL` never matches); switch to NULL / empty string when you need directly executable SQL. Users who had persisted NULL / empty string keep their choice |

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

| Setting | Default | Description |
|---------|---------|-------------|
| SQL / Param Prefix | `Preparing:` / `Parameters:` | Console log recognition prefix |
| Auto-start Listening on Project Launch | Off | Starts capture automatically when the project opens or runs (same as clicking "Capture"); enabling the setting itself does not start listening immediately — it triggers on the project run. A manual stop suppresses auto-start for the session, the next project run resumes it |
| Auto-Open Window on SQL Found | On | Auto-open log window when SQL captured (60s debounce, never steals focus); a manual close suppresses auto-open for the session, restored by re-enabling the setting, restarting the IDE, or (with auto-start listening on) running the project again |
| Stop Capture on Tool Window Close | Off | Automatically stops capture when the log tool window is closed |
| Auto-Inject Source-Capture Interceptor | Off | Trigger-style switch: checking it immediately generates the `SqlSourceInterceptor` and config class in your project once (skipped if already present); after restarting your app, live logs carry the call site — precise jumps without manually copying interceptor files. Multi-module projects first show a dialog to pick the modules to inject (all selected by default); when the project type can't be recognized (not a Spring Boot + MyBatis-Plus project), the dialog instead guides you to enable enhanced capture in one click (the enhanced channel does not depend on project type) |
| Enhanced Capture | On | Bytecode-instrumentation capture channel: a one-time consent dialog on first project run; after agreeing, capture attaches to the application JVM directly — no SQL logging setup needed, and real parameters, millisecond-accurate durations, affected rows and true source locations come out of the box; automatic fallback to console capture on failure; stopping listening also stops in-app collection |
| Enhanced Capture Desensitization | Off | Masks parameter values that look sensitive (real values collected by default) |
| Source-Capture Frame Skip Prefixes | Empty | Framework frame prefixes skipped when tracing enhanced-capture jumps up the call stack (one per line); live list and history panel share the same resolver |
| Timestamp Display | On | Whether the time column appears in the entry list |
| Timestamp Source | Log time | "Log time" shows the original time parsed from the log line (common formats recognized automatically, falling back to capture time when absent); "Capture time" shows when the plugin captured the log. The timestamp format setting applies to both sources alike |
| Dedup Window | 60000 ms | Same SQL (whitespace-insensitive) doesn't reappear within window; toggling "Remove duplicate SQL" trims existing duplicates immediately |
| Duration Prefix | `Time:` | Custom prefix for parsing execution time from logs (supports p6spy / MyBatis-Plus timing output) |
| Slow Query Threshold | 1000 ms | Durations at or above this are flagged as slow queries in red |
| Auto-Save SQL History | Off | Captured entries are saved to history files in full (not limited by the list's max-entry count) for the "History" tab |
| History Directory / File Name | Empty (default path) / `sql-history-$yyyy-MM-dd$.sql` | History save location and file name template with date placeholders |
| History File Retention Limit | 30 | When the save directory holds more history files than this, the oldest are cleaned up automatically to keep the disk in check; 0 = keep everything |
| Remove Lines Containing | Empty | Filter log lines containing specified keywords |
| CRUD Color Markers | Left color bar | Log / history lists colored by SELECT / INSERT / UPDATE / DELETE type (default blue / green / orange / red); three styles (left color bar / full-row tint / off), four customizable colors with one-click restore to defaults; the "Type Filter" popup shows color swatch legends |

### Data Directory

History SQL and execution temp files live under `.idea/sql-visualizer/` in your project (history files in its `sql-history/` subdirectory). Since v2026.9.2 this directory is renamed from `mybatis-plus-sql-visualizer`; old directories are no longer read — history starts fresh in the new location after upgrading.

## UI & Operations

| Setting | Default | Description |
|---------|---------|-------------|
| Show Preview SQL Icon in Gutter | On | Wrapper anchor line gutter icon |
| Detect SQL Embedded in Generic XML (leaf tag text/CDATA) | On | In-house framework XML (root element name not fixed, SQL inside custom tags as CDATA/text) also shows the preview icon: a leaf tag whose text starts with SELECT / INSERT / UPDATE / DELETE etc. is claimed, with no reliance on root element names |
| Show Whitespace in Plugin-Built Editors | Off | Show space, tab and line-end markers in the editors the plugin builds (SQL preview, Log → SQL, click preview, rollback SQL, SQL input, parameter import, SQL → Java), handy for spotting stray blanks in dynamically assembled SQL; display-only, the SQL text is untouched, and when off the plugin leaves the property unset, following the IDE-wide "show whitespace" preference |
| Render JOIN Diagram with IDE-Native Graph Framework | On | JOIN diagrams use IDEA's native Diagrams engine (zoom / auto layout / fold / export); falls back to the built-in renderer when the Diagrams plugin is absent or rendering fails |
| UI Language | Simplified Chinese | Plugin UI language (English / Follow System) |
| Shortcuts | `Alt+Shift+Q` / `Alt+Shift+J` | SQL preview / SQL → Java respectively |

## MCP Tools

The plugin exposes 10 read-only tools to AI agents (Claude Code / Cursor / AI Assistant, etc.) through the platform's MCP Server — rendering executable SQL, schema context, EXPLAIN plans, log restore, rollback plans, CRUD generation and more (requires IDEA 2025.2+; environments without the MCP Server plugin are unaffected). The "MCP Tools" subpage in settings gates this surface:

- Master switch: enable/disable the plugin's MCP functionality as a whole
- Per-tool enable/disable for all ten tools, plus "Enable All / Disable All" buttons
- Changes take effect immediately — no IDE restart needed
- These switches gate the plugin's own tools only; the IDE-wide "Enable MCP Server" toggle under Tools → MCP Server is the platform master switch (other plugins and platform tools share the same service). The two are independent — switching the plugin's off leaves the service running, while the plugin removes the `sqlv_*` tools from the agent's tool list dynamically through the platform's tool-filter extension, no restart needed

## Project-Level Settings

`Settings > Tools > SQL Visualizer (Current Project)` offers 10 project-level controls: the enhanced-capture switch, database dialect, 3 checkboxes, logic-delete value, table prefix / suffix, table-name strategy, and ignored fields.

- When the "Use project settings" master switch is off, the 9 override rows gray out and show the effective global values — what you see is what runs; a "Reset to follow global" button clears this project's overrides in one click
- With the dialect on "Auto-infer", the project level takes precedence over the global setting
- Settings search hits both the global page and the project page for the same keywords
- Import / export covers global settings only; project-level settings are not included

## Update & Diagnostics

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-Check on Startup | Off | When enabled, silent check of the Gitee early-access channel on launch with update notifications; when off, stable updates come from JetBrains Marketplace |
| Ignore This Version | - | Notification action to skip startup reminders for the current version (persisted across restarts); manual checks in settings are unaffected |
| Check Update / Download & Install | - | Manual check, one-click download & install; the new version hot-swaps into the running IDE and takes effect immediately (no restart), with automatic fallback to the restart script when dynamic install isn't available or any step fails — never left in an intermediate state |
| Plugin Cache | - | Show cache size and entry count (lookup / resolution / Wrapper preview, all scopes), one-click clear |
| Report a Problem / Feedback Pool | - | Manual feedback entry opening a report dialog straight to the [feedback pool](/en/about/feedback): type / category / description required; by default only the exception class name and a stack-frame summary are prefilled (full exception message, the complete stack, and the stack attachment are all opt-in checkboxes — uploaded only when checked, may contain local paths and class names); IDE and plugin versions are attached automatically; the same exception is deduplicated for 24 hours. The Help menu's "SQL Visualizer Feedback" entry and the IDE's internal error dialog offer one-click reporting too. Reporting several entries selected in the IDE error list merges them into a single post (items beyond the rate-limit threshold are queued and sent staggered automatically); when a submission is rejected the dialog stays open and the status line shows the exact reason from the server, ready to fix and retry |
| Internal Build Number | - | Unique per build, one-click copy for bug reports |
| Settings Import / Export | - | Import / export settings as JSON; covers global settings only (project-level settings are not included), with the result shown inline next to the buttons |

> If the IDE shows an info-level "plugin was not completely unloaded" notice after a no-restart update: it is a one-time notice from the IDE's GC watch window over the old classloader — the new plugin instance has fully taken over (extension points / services rebuilt), the old instance is only transiently resident and clears on the next IDE restart, with no functional impact.

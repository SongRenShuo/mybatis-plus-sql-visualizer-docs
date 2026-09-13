# Configuration

All settings are located at `Settings > Tools > SQL Visualizer`.

![SQL Visualizer main settings page (Tools > SQL Visualizer)](/demo/settings.png)

No IDE restart needed: re-trigger preview to apply new settings.

## SQL Preview

| Setting | Default | Description |
|---------|---------|-------------|
| Database Dialect | MySQL | Pagination / upsert clause per dialect. Reserved words of all 9 dialects are calibrated against official docs / engine tests; H2 upsert renders as native `MERGE INTO ... KEY` |
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
| Auto-Inject Source-Capture Interceptor | Off | Trigger-style switch: checking it immediately generates the `SqlSourceInterceptor` and config class in your project once (skipped if already present); after restarting your app, live logs carry the call site — precise jumps without manually copying interceptor files |
| Timestamp Display | On | Show capture time in entry list |
| Dedup Window | 60000 ms | Same SQL (whitespace-insensitive) doesn't reappear within window; toggling "Remove duplicate SQL" trims existing duplicates immediately |
| Duration Prefix | `Time:` | Custom prefix for parsing execution time from logs (supports p6spy / MyBatis-Plus timing output) |
| Slow Query Threshold | 1000 ms | Durations at or above this are flagged as slow queries in red |
| Auto-Save SQL History | Off | Entries evicted from the list are written to files for the "History" tab |
| History Directory / File Name | Empty (default path) / `sql-history-$yyyy-MM-dd$.sql` | History save location and file name template with date placeholders |
| Remove Lines Containing | Empty | Filter log lines containing specified keywords |
| CRUD Color Markers | Left color bar | Log / history lists colored by SELECT / INSERT / UPDATE / DELETE type (default blue / green / orange / red); three styles (left color bar / full-row tint / off), four customizable colors with one-click restore to defaults; the "Type Filter" popup shows color swatch legends |

### Data Directory

History SQL and execution temp files live under `.idea/sql-visualizer/` in your project (history files in its `sql-history/` subdirectory). Since v2026.9.2 this directory is renamed from `mybatis-plus-sql-visualizer`; old directories are no longer read — history starts fresh in the new location after upgrading.

## UI & Operations

| Setting | Default | Description |
|---------|---------|-------------|
| Show Preview SQL Icon in Gutter | On | Wrapper anchor line gutter icon |
| Render JOIN Diagram with IDE-Native Graph Framework | On | JOIN diagrams use IDEA's native Diagrams engine (zoom / auto layout / fold / export); falls back to the built-in renderer when the Diagrams plugin is absent or rendering fails |
| UI Language | Simplified Chinese | Plugin UI language (English / Follow System) |
| Shortcuts | `Alt+Shift+Q` / `Alt+Shift+J` | SQL preview / SQL → Java respectively |

## Update & Diagnostics

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-Check on Startup | Off | When enabled, silent check of the Gitee early-access channel on launch with update notifications; when off, stable updates come from JetBrains Marketplace |
| Ignore This Version | - | Notification action to skip startup reminders for the current version (persisted across restarts); manual checks in settings are unaffected |
| Check Update / Download & Install | - | Manual check, one-click download & install; the new version hot-swaps into the running IDE and takes effect immediately (no restart), with automatic fallback to the restart script when dynamic install isn't available or any step fails — never left in an intermediate state |
| Plugin Cache | - | Show cache size and entry count (lookup / resolution / Wrapper preview, all scopes), one-click clear |
| Report a Problem / Feedback Pool | - | Manual feedback entry opening a report dialog straight to the [feedback pool](/en/about/feedback): type / category / description required; exception-stack attachment is opt-in (may contain local paths and class names); IDE and plugin versions are attached automatically; the same exception is deduplicated for 24 hours. The Help menu's "SQL Visualizer Feedback" entry and the IDE's internal error dialog offer one-click reporting too |
| Internal Build Number | - | Unique per build, one-click copy for bug reports |
| Settings Import / Export | - | Import / export settings as JSON; the result is shown inline next to the buttons |

> If the IDE shows an info-level "plugin was not completely unloaded" notice after a no-restart update: it is a one-time notice from the IDE's GC watch window over the old classloader — the new plugin instance has fully taken over (extension points / services rebuilt), the old instance is only transiently resident and clears on the next IDE restart, with no functional impact.

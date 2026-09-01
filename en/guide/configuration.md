# Configuration

All settings are located at `Settings > Tools > SQL Visualizer`.

No IDE restart needed: re-trigger preview to apply new settings.

## SQL Preview

| Setting | Default | Description |
|---------|---------|-------------|
| Database Dialect | MySQL | Pagination / upsert clause per dialect. Reserved words of all 9 dialects are calibrated against official docs / engine tests; H2 upsert renders as native `MERGE INTO ... KEY` |
| Replace `?` Placeholders | On | Off = variables also render as `?` |
| Formatted Output | On | Multi-line indent (Off = single line) |
| Logic Delete Injection | On | `@TableLogic` auto appends `AND deleted = value` |
| Logic Delete Value | 0 | Value for logic delete condition |

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
| Auto Capture | Off | Auto-start listening on IDE launch |
| Auto-Open Window on SQL Found | Off | Auto-open log window when SQL captured |
| Timestamp Display | On | Show capture time in entry list |
| Dedup Window | 60000 ms | Same SQL doesn't reappear within window; toggling "Remove duplicate SQL" trims existing duplicates immediately |
| Duration Prefix | `Time:` | Custom prefix for parsing execution time from logs (supports p6spy / MyBatis-Plus timing output) |
| Slow Query Threshold | 1000 ms | Durations at or above this are flagged as slow queries in red |
| Auto-Save SQL History | Off | Entries evicted from the list are written to files for the "History" tab |
| History Directory / File Name | Empty (default path) / `sql-history-$yyyy-MM-dd$.sql` | History save location and file name template with date placeholders |
| Remove Lines Containing | Empty | Filter log lines containing specified keywords |

### Data Directory

History SQL and execution temp files live under `.idea/sql-visualizer/` in your project (history files in its `sql-history/` subdirectory). Since v2026.9.2 this directory is renamed from `mybatis-plus-sql-visualizer`; old directories are no longer read — history starts fresh in the new location after upgrading.

## UI & Operations

| Setting | Default | Description |
|---------|---------|-------------|
| Show Preview SQL Icon in Gutter | On | Wrapper anchor line gutter icon |
| UI Language | Simplified Chinese | Plugin UI language (English / Follow System) |
| Shortcuts | `Alt+Shift+Q` / `Alt+Shift+J` | Wrapper → SQL / SQL → Java respectively |

## Update & Diagnostics

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-Check on Startup | Off | When enabled, silent check of the Gitee early-access channel on launch with update notifications; when off, stable updates come from JetBrains Marketplace |
| Ignore This Version | - | Notification action to skip startup reminders for the current version (persisted across restarts); manual checks in settings are unaffected |
| Check Update / Download & Install | - | Manual check, one-click download & install |
| Plugin Cache | - | Show cache size, one-click clear |
| Internal Build Number | - | Unique per build, one-click copy for bug reports |

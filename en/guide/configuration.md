# Configuration

All settings are located at `Settings > Tools > MyBatis-Plus SQL Visualizer`.

No IDE restart needed: re-trigger preview to apply new settings.

## SQL Preview

| Setting | Default | Description |
|---------|---------|-------------|
| Database Dialect | MySQL | Pagination / upsert clause per dialect |
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
| Dedup Window | 60000 ms | Same SQL doesn't reappear within window |
| Remove Lines Containing | Empty | Filter log lines containing specified keywords |

## UI & Operations

| Setting | Default | Description |
|---------|---------|-------------|
| Show Preview SQL Icon in Gutter | On | Wrapper anchor line gutter icon |
| UI Language | Simplified Chinese | Plugin UI language (English / Follow System) |
| Shortcuts | `Alt+Shift+Q` / `Alt+Shift+J` | Wrapper → SQL / SQL → Java respectively |

## Update & Diagnostics

| Setting | Default | Description |
|---------|---------|-------------|
| Auto-Check on Startup | On | Silent check on launch, notify if new version |
| Check Update / Download & Install | - | Manual check, one-click download & install |
| Plugin Cache | - | Show cache size, one-click clear |
| Internal Build Number | - | Unique per build, one-click copy for bug reports |

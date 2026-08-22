# SQL Log Tool Window
<GifPlayer src="/demo/placeholder.svg" alt="Demo" />

Auto-capture `Preparing:` / `Parameters:` logs from the run console, restore to executable SQL.

## Trigger Method

Sidebar "MyBatis SQL Log" tool window → click "Capture" button to start listening.

## Features

### Auto Capture

Monitor console log output, recognize `Preparing:` and `Parameters:` lines, auto-restore to complete SQL.

### Mixed Prefix Matching

Supports multiple log formats:
- `Preparing: SELECT ...` (MyBatis default)
- `==> Preparing: SELECT ...` (Spring Boot)
- Custom prefixes (configurable in settings)

### Log → SQL

Sidebar "Log → SQL" tab: paste entire log for batch restore, multi-statement auto-split.

### Dedup & Filter

| Feature | Description |
|---------|-------------|
| Dedup window | Same SQL doesn't reappear within window (default 60000ms, adjustable) |
| Keyword filter | Remove log lines containing specified keywords |
| Timestamp display | Entry list shows capture time |

### Double-Click Preview

Double-click a log entry → opens SQL preview dialog (same as Wrapper preview, supports parameter fill-in and formatting).


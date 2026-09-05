# SQL Log Tool Window
<GifPlayer src="/demo/sql-log.png" alt="SQL Log Restore Demo" />

Auto-capture `Preparing:` / `Parameters:` logs from the run console, restore to executable SQL, and jump precisely to the source line that fired the query.

## Trigger Method

Sidebar "MyBatis SQL Log" tool window → click "Capture" button to start listening.

## Features

### Auto Capture

Monitor console log output, recognize `Preparing:` and `Parameters:` lines, auto-restore to complete SQL. Hibernate (`Hibernate:` + `binding parameter`) and Spring JdbcTemplate log formats are also recognized, enabled by default.

### Auto-Open Tool Window

When the setting "Auto-open log window on SQL found" (on by default) is active, capturing the first SQL auto-opens the log tool window — debounced to once per 60 seconds, without stealing editor focus. Behavior notes:

- It only follows SQL capture: if the switch is on but capture has never started ("Auto-capture on startup" also off), nothing opens; clicking "Stop capture" disables auto-open until capture restarts
- Closing the window manually suppresses auto-open for the rest of the session — no "close and it pops back"; re-enabling the setting or restarting the IDE restores it
- Users who turned the switch off before the upgrade keep it off, unaffected by the new default

### Mixed Prefix Matching

Supports multiple log formats:
- `Preparing: SELECT ...` (MyBatis default)
- `==> Preparing: SELECT ...` (Spring Boot)
- Custom prefixes (configurable in settings)

### SQL Highlighting & Execution Time

- SQL summaries in the list are lexically colored: keywords, table names, strings, numbers and comments each in their own color; timestamps and durations are dimmed gray so they never steal focus
- Execution time is parsed from the log, supporting p6spy `elapsed`, MyBatis-Plus `Time:` output and a custom time prefix (configurable in settings, default `Time:`)
- Duration is colored by threshold: gray under 100ms, orange at 100ms+, red once the slow-query threshold is reached (default 1000ms, adjustable)
- Click the sort button to order entries by duration; a slow-query counter appears when slow queries are detected

### Jump to Source

Right-click a log entry → "Jump to Source". Three levels of behavior:

1. **Precise jump (recommended)**: SQL logs contain no call-site info, so the plugin ships an optional runtime interceptor — copy the self-contained `SqlSourceInterceptor` from the plugin repository (`docs/instrumentation/SqlSourceInterceptor.kt`) into your project and register it as a MyBatis-Plus `InnerInterceptor`:

   ```java
   @Bean
   public MybatisPlusInterceptor mybatisPlusInterceptor() {
       MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
       // Restrict to your own packages for accurate resolution
       interceptor.addInnerInterceptor(new SqlSourceInterceptor(Set.of("com.example.")));
       // Add other interceptors (pagination, etc.) as needed
       return interceptor;
   }
   ```

   The interceptor captures the real call site on the SQL execution thread and prints a `SQLVIS-SOURCE|relative-path|line` marker to the console (no impact on SQL execution, no performance overhead). The plugin parses it and jumps precisely `file:line` — straight to the Service / Controller line that fired the SQL
2. **Search by table (default fallback)**: without the interceptor, the plugin extracts table names from the SQL and searches for matching entities / wrappers — works in most cases but may miss; in multi-module projects or projects with unconventional source roots it matches module content roots one by one for a higher hit rate
3. **No table name**: statements like `SELECT 1` have no jump target and report as such

### Dedup & Filter

| Feature | Description |
|---------|-------------|
| Dedup window | Same SQL doesn't reappear within window (default 60000ms, adjustable) |
| Instant dedup | Toggling "Remove duplicate SQL" immediately trims existing duplicates in the window and shows a `⨉N` badge with the dropped count |
| Keyword filter | Remove log lines containing specified keywords |
| Timestamp display | Entry list shows capture time |

### Double-Click Preview

Double-click a log entry → opens SQL preview dialog (same as Wrapper preview, supports parameter fill-in and formatting). The preview dialog is non-modal: when a data source password expires during execution, IDEA's credential prompt is never hidden behind it.

## SQL History

Enable "Auto-save SQL history" in settings (off by default) and entries evicted from the list are written to history files, browsable any time in the History tab:

- **Level 1 (default view)**: file list — each row shows file name, size and SQL count; search box filters by file name
- **Level 2 (file content)**: double-click a file to list its SQL entries one by one (with the same highlighting, duration, timestamp and source info); double-click an entry to preview, right-click to copy SQL or jump to source; search box filters by SQL content / source file
- **Back**: "← Back" returns to the file list; switching tabs refreshes automatically without interrupting browsing

History files are saved under `.idea/sql-visualizer/sql-history/` in your project by default (renamed from `mybatis-plus-sql-visualizer` in v2026.9.2 — old directories are no longer read). Save location and file name pattern are configurable in settings.

# SQL Log Tool Window
<GifPlayer src="/demo/sql-log.gif" poster="/demo/sql-log.png" alt="SQL Log Restore Demo" />

Auto-capture `Preparing:` / `Parameters:` logs from the run console, restore to executable SQL, and jump precisely to the source line that fired the query.

## Trigger Method

Sidebar "MyBatis SQL Log" tool window → click "Capture" button to start listening.

With the setting "Auto-start listening on project launch" enabled, no button click is needed: opening the project or running / debugging it starts capture automatically. Enabling the setting itself does not start listening immediately — it triggers when the project runs. Clicking "Stop capture" suppresses auto-start for the session — it will not pop back on its own; as long as the switch stays on, the next project run starts capture again.

## Features

### Auto Capture

Monitor console log output, recognize `Preparing:` and `Parameters:` lines, auto-restore to complete SQL. Hibernate (`Hibernate:` + `binding parameter`) and Spring JdbcTemplate log formats are also recognized — statements wrapped across multiple lines are collected in full, and brackets inside string literals don't cause premature closing — enabled by default.

When both Hibernate `show_sql` and its logger print the same statement, the two paths are merged into one entry with the parameters kept together — no zero-parameter leftovers and no false "parameter count mismatch"; if a statement had no parameter-binding log captured at all, the preview says so and guides you to enable TRACE level, and only genuinely incomplete parameters report a count mismatch.

### Auto-Open Tool Window

When the setting "Auto-open log window on SQL found" (on by default) is active, capturing the first SQL auto-opens the log tool window — debounced to once per 60 seconds, without stealing editor focus. Behavior notes:

- It only follows SQL capture: if the switch is on but capture has never started ("Auto-start listening on project launch" also off), nothing opens; clicking "Stop capture" disables auto-open until capture restarts
- Closing the window manually suppresses auto-open for the rest of the session — no "close and it pops back"; re-enabling the setting, restarting the IDE, or (with "Auto-start listening on project launch" on) running the project again restores it
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

### Entry Sequence Numbers

Each list entry shows a `#N` number at the front of its meta line — the Nth SQL captured in this session, handy for referring to "entry N":

- Counting restarts from 1 on every project run (application / test run configurations — launches of unrelated processes don't reset it); clearing the list manually also resets it
- SQL dropped by dedup, capture pause or keyword filter takes no number, so the list never skips
- Numbers stay readable when sorted by duration, preserving the original capture order; entries read back from history files carry no number

### CRUD Type Color Markers

List entries get color markers by statement type (applies to the SQL log list and the History page's second-level list): SELECT blue, INSERT green, UPDATE orange, DELETE red (defaults, all customizable); OTHER types carry no marker.

- Three marker styles: **Left color bar** (default, a 3px bar on the entry's left edge; selection uses the platform highlight and keeps the bar); **Full-row tint** (row background blended with the list color, adapting to light and dark themes; the selected row keeps its type tint plus an outline, so duration coloring is no longer washed out by selection); **Off** (back to the unmarked look)
- Each checkbox in the log page's "Type Filter" popup carries a matching color swatch legend, syncing instantly with color changes (the legend hides when marking is off)
- Configure under "SQL Log" → "CRUD Color Markers" in settings — four colors and the style are adjustable, with one-click restore to defaults

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
| Dedup window | Same SQL doesn't reappear within window (default 60000ms, adjustable; dedup ignores leading / trailing and repeated whitespace differences — different parameters still count as different statements) |
| Instant dedup | Toggling "Remove duplicate SQL" immediately trims existing duplicates in the window and shows a `⨉N` badge with the dropped count |
| Keyword filter | Remove log lines containing specified keywords |
| Timestamp display | Entry list shows capture time |

### Three Display Modes

A display-mode dropdown on the list toolbar controls how SQL renders inside entries, switching instantly:

- **Single line**: one fixed row per entry, long SQL truncated
- **Keyword wrap** (default): SQL wraps at keywords, height growing with content
- **Formatted**: full pretty-print, long statements split clause by clause

The SQL log page and the History page share the same setting, which survives IDE restarts; in any mode, Ctrl+C on a selected entry copies the plain SQL, not the rendered text.

### Single-Click Preview & Double-Click Dialog

List entries use two-level previewing, consistent across the SQL log list, the History tab's second-level list and the history tool window:

- **Single-click an entry**: after a short delay a lightweight preview pops up — SQL shown with lexical highlighting, editable in place; the "Copy" button in the header takes the currently edited text and flashes a check mark when clicked, and there is a "Close" button; the popup anchors right below the clicked row without covering list content, and focuses on open so you can type immediately
- **Double-click an entry**: opens the full preview dialog (same as Wrapper preview, supports parameter fill-in and formatting). The toolbar offers layout toggles — horizontal / vertical / keyword wrap — plus a "More" menu gathering low-frequency actions (import parameters, diff, share); vertical layout annotates each INSERT value line end with a `-- column` tag (can be disabled in settings), and IN lists with fewer than 5 elements stay on one line while 5 or more expand one per line; the display mode you switch to survives parameter refill instead of being wiped by re-rendering (Refresh resets it). The dialog is non-modal: when a data source password expires during execution, IDEA's credential prompt is never hidden behind it; with no data source configured, preview prepares silently — it no longer raises the Database tool window over the sidebar, and only an explicit run guides you through configuration

How entries render is controlled by the toolbar's display-mode dropdown (see above). Long field lists can also be folded automatically: with "Auto-fold long field lists" enabled in settings (off by default, threshold adjustable, default 10), preview editors collapse long SELECT / INSERT column lists, VALUES groups and UPDATE SET lists into a "… N columns" placeholder — click the fold marker to expand. This applies consistently across the main preview dialog, single-click preview, history preview, the Log → SQL result area and the native Database console.

## SQL History

Enable "Auto-save SQL history" in settings (off by default) and entries evicted from the list are written to history files, browsable any time in the History tab:

- **Level 1 (default view)**: file list — each row shows file name, size and SQL count; search box filters by file name
- **Level 2 (file content)**: double-click a file to list its SQL entries one by one (with the same highlighting, duration, timestamp and source info); single-click an entry for a lightweight preview, double-click to open the full dialog, right-click to copy SQL or jump to source; search box filters by SQL content / source file
- **Back**: "← Back" returns to the file list; switching tabs refreshes automatically without interrupting browsing
- **Parameter recognition & refill**: history entries share the same recognition channel as the live log — double-clicking opens the dialog with parameter fill-in just the same; history files (v2 format) store parameters per entry in an inline `-- pd:` comment line next to the statement — older plugin versions ignore that line and open the file as usual, while the new version reads all older files normally

History files are saved under `.idea/sql-visualizer/sql-history/` in your project by default (renamed from `mybatis-plus-sql-visualizer` in v2026.9.2 — old directories are no longer read). Save location and file name pattern are configurable in settings.

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=sql-log)

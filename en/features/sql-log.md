# SQL Log Tool Window
<GifPlayer src="/demo/sql-log.gif" alt="SQL Log Restore Demo" />

Auto-capture SQL as it runs and restore everything into a single list of executable statements, with precise jump-to-source for every entry.

## Trigger Method

Sidebar "MyBatis SQL Log" tool window → click "Capture" button to start listening.

With the setting "Auto-start listening on project launch" enabled, no button click is needed: opening the project or running / debugging it starts capture automatically. Enabling the setting itself does not start listening immediately — it triggers when the project runs. Clicking "Stop capture" suppresses auto-start for the session — it will not pop back on its own; as long as the switch stays on, the next project run starts capture again.

## Two Capture Channels

Entries come from two channels, unified in one list with identical display and actions:

**Enhanced capture (default channel)**: bytecode-instrumentation based. The first time you run a project, a one-time consent dialog asks to inject; after agreeing, capture points attach to your application's JVM on the local machine, collecting directly at the JDBC interface layer — no SQL logging setup needed in your app, it works out of the box:

- Real parameter values (desensitization off by default, can be enabled in settings), millisecond-accurate execution durations, affected-row counts and execution error messages
- Entries carry a database badge (`[MySQL]`, `[DM (Dameng)]` etc.), inferred from the JDBC URL — all 9 dialect databases plus openGauss / GBASE covered
- Source locations come from the real call stack, jumping straight to the code line that executed the SQL (see "Jump to Source" below)
- Collected data is only displayed inside the IDE on your machine — nothing is sent to any server; turning the switch off stops collection (attached capture points remain but stay idle)
- Declining the injection skips it for this run (asked again the next time you run the project), while console capture remains fully available; if enhanced capture fails, it automatically falls back to console capture
- On JDK 21+ the application console may show a dynamic agent loading warning — expected JVM behavior (JEP 451), a warning only, no impact on your app

Stopping listening also stops in-app collection — no more capture-and-discard waste; re-enabling listening resumes it, and after the agent mounts on project startup the listening state is reconciled automatically, so a project started with listening off no longer collects for nothing.

**Console capture**: monitors the run console's log output, recognizes MyBatis `Preparing:` / `Parameters:` lines (Hibernate and JdbcTemplate formats are also supported), and fills `?` placeholders back into executable SQL. The log-format and duration-parsing descriptions in the sections below apply to this channel.

## Features

### Auto Capture

Monitor console log output, recognize `Preparing:` and `Parameters:` lines, auto-restore to complete SQL. Hibernate (`Hibernate:` + `binding parameter`) and Spring JdbcTemplate log formats are also recognized — statements wrapped across multiple lines are collected in full, and brackets inside string literals don't cause premature closing. For `NamedParameterJdbcTemplate` single-line logs, named-parameter values that are Java collections are restored element-wise (`IN (:p)` with `param=[a]` becomes `IN ('a')`, so the square brackets never leak into the SQL literal), and logs interleaved by concurrent threads are restored in per-thread buckets so parameters never get misattached or lost — enabled by default.

When both Hibernate `show_sql` and its logger print the same statement, the two paths are merged into one entry with the parameters kept together — no zero-parameter leftovers and no false "parameter count mismatch"; if a statement had no parameter-binding log captured at all, the preview says so and guides you to enable TRACE level (for JdbcTemplate it names `org.springframework.jdbc.core` specifically), and only genuinely incomplete parameters report a count mismatch.

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
- Enhanced-capture entries carry structured durations (millisecond-accurate), affected-row counts and execution error messages directly — no log parsing involved
- Console-channel durations are parsed from the log, supporting p6spy `elapsed`, MyBatis-Plus `Time:` output and a custom time prefix (configurable in settings, default `Time:`)
- Duration is colored by threshold: gray under 100ms, orange at 100ms+, red once the slow-query threshold is reached (default 1000ms, adjustable); a slow-query counter appears when slow queries are detected
- A persistent "Sort by" button on the list opens a single-choice menu: time ascending (default, i.e. capture order) / time descending / duration ascending / duration descending / line number. Entries missing duration or line number always sink to the bottom (in both directions); time sorting follows the list's time column (with "Log time" selected, entries are ordered by log time — what you see is what is sorted)

### Entry Sequence Numbers

Each list entry shows a `#N` number at the front of its meta line — the Nth SQL captured in this session, handy for referring to "entry N":

- Counting restarts from 1 on every project run (application / test run configurations — launches of unrelated processes don't reset it); clearing the list manually also resets it
- SQL dropped by dedup, capture pause or keyword filter takes no number, so the list never skips
- Numbers stay readable when sorted by duration, preserving the original capture order; the History page's second-level list also shows `#N` numbers by in-file entry order, stable under search filtering

### Timestamps & Time Source

Each entry can show a timestamp, taken from the "Timestamp source" radio option under "SQL Log" in settings:

- **Log time** (default): the original time parsed from the log line itself (common formats recognized automatically — Logback / Log4j2 / Spring Boot defaults, ISO 8601 and more); entries whose log line carries no time fall back to capture time
- **Capture time**: the moment the plugin captured the log

The "Show timestamp" switch controls whether the time column appears, and the timestamp format setting (default `yyyy-MM-dd HH:mm:ss`) applies to both sources alike; copied timestamps and the times shown on the History page all follow the same configuration.

### CRUD Type Color Markers

List entries get color markers by statement type (applies to the SQL log list and the History page's second-level list): SELECT blue, INSERT green, UPDATE orange, DELETE red (defaults, all customizable); OTHER types carry no marker.

- Three marker styles: **Left color bar** (default, a 3px bar on the entry's left edge; selection uses the platform highlight and keeps the bar); **Full-row tint** (row background blended with the list color, adapting to light and dark themes; the selected row keeps its type tint plus an outline, so duration coloring is no longer washed out by selection); **Off** (back to the unmarked look)
- Each checkbox in the log page's "Type Filter" popup carries a matching color swatch legend, syncing instantly with color changes (the legend hides when marking is off)
- Configure under "SQL Log" → "CRUD Color Markers" in settings — four colors and the style are adjustable, with one-click restore to defaults

### Jump to Source

Right-click a log entry → "Jump to Source". How the position is resolved depends on the capture channel:

**Enhanced-capture entries**: the source location comes from the real call stack at SQL execution time, straight to the code line that ran the query. Calls entering through a self-developed framework's unified entry point are traced up the stack automatically, skipping framework frames to land on your business code; frame filtering is decided by origin (business classes come from directories in dev, third-party dependencies from JARs), so framework or data-layer plugin frames cannot mislead the jump. The framework prefixes skipped during upward traversal are configurable in settings ("Source-capture frame skip prefixes", one per line), and the live list and history panel share the same resolver.

**Console-capture entries**: SQL logs contain no call-site info, so the plugin ships an optional runtime interceptor — copy the self-contained `SqlSourceInterceptor` from the plugin repository (`docs/instrumentation/SqlSourceInterceptor.kt`) into your project and register it as a MyBatis-Plus `InnerInterceptor`:

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

   The interceptor captures the real call site on the SQL execution thread and prints a `SQLVIS-SOURCE|relative-path|line` marker to the console (no impact on SQL execution, no performance overhead). The plugin parses it and jumps precisely `file:line` — straight to the Service / Controller line that fired the SQL.

Jumps rely only on the real captured position — no table-name guessing fallback, so a same-named table can never send you to an unrelated file. When a console-channel entry carries no position (no interceptor configured, or an outdated interceptor file), a guide dialog pops up with one-click "Open settings" or "Inject now"; triggering "Auto-inject source capture interceptor" in settings on a multi-module project first shows a dialog to pick the modules to inject (all selected by default). Statements like `SELECT 1` have no jump target and report as such.

### Dedup & Filter

| Feature | Description |
|---------|-------------|
| Dedup window | Same SQL doesn't reappear within window (default 60000ms, adjustable; dedup ignores leading / trailing and repeated whitespace differences — different parameters still count as different statements) |
| Instant dedup | Toggling "Remove duplicate SQL" immediately trims existing duplicates in the window and shows a `⨉N` badge with the dropped count |
| Keyword filter | Remove log lines containing specified keywords |
| List search | The search box matches SQL content, source file, `#number` (`#5` or `5` hits exactly entry 5) and time text (search what you see, matched against the displayed format); available on both the log page and the History page |
| Copy timestamps | Select entries (multi-select works), right-click → "Copy timestamp" to copy plain time text line by line (no display brackets; the menu item shows the count for multi-select); grayed out while timestamp display is off |

### Three Display Modes

The "List display" dropdown under "SQL Log" in settings controls how SQL renders inside entries, switching instantly:

- **Single line**: one fixed row per entry, long SQL truncated
- **Keyword wrap** (default): SQL wraps at keywords, height growing with content
- **Formatted**: full pretty-print, long statements split clause by clause

The SQL log page and the History page share the same setting, which survives IDE restarts; in any mode, Ctrl+C on a selected entry copies the plain SQL, not the rendered text.

### Single-Click Preview & Double-Click Dialog

List entries use two-level previewing, consistent across the SQL log list, the History tab's second-level list and the history tool window:

- **Single-click an entry**: after a short delay a lightweight preview pops up — SQL shown with lexical highlighting, editable in place; its display follows the existing "Format SQL on preview" setting (on by default), so long SQL opens multi-line indented, or as original text when off. Literal SQL with zero placeholders (values inlined in the SQL text) and IN lists are recognized into editable parameter rows as well. The "Copy" button in the header takes the currently edited text and flashes a check mark when clicked, and there is a "Close" button; the popup anchors right below the clicked row without covering list content, and focuses on open so you can type immediately. While a Ctrl / Shift multi-select is in progress, single-clicks no longer trigger the preview (any open popup closes with it); single-select resumes normal previewing
- **Multi-select batch copy**: after Ctrl / Shift multi-select, right-click → "Copy" copies all selected SQL at once (the menu item shows the count, e.g. "Copy selected SQL (3)", each statement semicolon-terminated and newline-joined); right-clicking a row already in the selection keeps the selection, while the other menu actions still apply to the right-clicked row
- **Double-click an entry**: opens the full preview dialog (same as Wrapper preview, supports parameter fill-in and formatting). The toolbar offers layout toggles — horizontal / vertical / keyword wrap — plus a "More" menu gathering low-frequency actions (import parameters, diff, share); vertical layout annotates each INSERT value line end with a `-- column` tag (can be disabled in settings), and IN lists expand vertically element by element — any list with a comma (≥2 elements) puts `(` on its own line with one element per line, while single-element forms (`IN (1)` / `IN (?)`) stay on one line, and IN subqueries and LIMIT pagination parameters are never expanded; the display mode you switch to survives parameter refill instead of being wiped by re-rendering (Refresh resets it). The dialog is non-modal: when a data source password expires during execution, IDEA's credential prompt is never hidden behind it; with no data source configured, preview prepares silently — it no longer raises the Database tool window over the sidebar, and only an explicit run guides you through configuration

How entries render is controlled by the "List display" option in settings (see above). Long field lists can also be folded automatically: with "Auto-fold long field lists" enabled in settings (off by default, threshold adjustable, default 10), preview editors collapse long SELECT / INSERT column lists, VALUES groups and UPDATE SET lists into a "… N columns" placeholder — click the fold marker to expand. This applies consistently across the main preview dialog, single-click preview, history preview, the Log → SQL result area and the native Database console.

## SQL History

Enable "Auto-save SQL history" in settings (off by default) and captured entries are saved to history files in full (not limited by the list's max-entry count), browsable any time in the History tab; when the save directory holds more history files than the retention limit (default 30, configurable, 0 = keep everything), the oldest files are cleaned up automatically to keep the disk in check:

- **Level 1 (default view)**: file list — each row shows file name, size and SQL count; search box filters by file name
- **Level 2 (file content)**: double-click a file to list its SQL entries one by one (with the same highlighting, duration, timestamp and source info — timestamps follow the format and source currently set in settings — and a `#N` number per in-file entry order); single-click an entry for a lightweight preview, double-click to open the full dialog, right-click to copy SQL, copy timestamps or jump to source; the search box matches SQL content / source file / `#number` / time text
- **Back**: "← Back" returns to the file list; switching tabs refreshes automatically without interrupting browsing
- **Parameter recognition & refill**: history entries share the same recognition channel as the live log — double-clicking opens the dialog with parameter fill-in just the same; history files (v2 format) store parameters per entry in an inline `-- pd:` comment line next to the statement, along with the original log time and database info — older plugin versions ignore the extra fields and open the file as usual, while the new version reads all older files normally

History files are saved under `.idea/sql-visualizer/sql-history/` in your project by default (renamed from `mybatis-plus-sql-visualizer` in v2026.9.2 — old directories are no longer read). Save location and file name pattern are configurable in settings.

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=sql-log)

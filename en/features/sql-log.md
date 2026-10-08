# SQL Log Tool Window

<GifPlayer src="/demo/sql-log.gif" alt="SQL Log Restore Demo" />

Auto-captures SQL as it runs, restores everything into a unified list of executable statements, and jumps precisely to the source line that fired each SQL.

## Trigger Method

| Method | How |
|--------|-----|
| Manual capture | Sidebar "MyBatis SQL Log" tool window → the "Capture" button (first in the panel toolbar) |
| Auto-listen | With "Auto-start listening on project launch" enabled in settings, capture starts automatically when you run / debug the project — no button click needed |

First-time onboarding: opening a code file that uses MyBatis-Plus pops a one-time pointer notification (once per machine, can be turned off in settings). The first successful capture in a session also pops a notification linking straight to the log panel.

A few details about auto-listen: enabling the setting does not start listening immediately — it triggers when the project runs. Clicking "Stop capture" suppresses auto-start for the rest of the session — it will not pop back on its own. As long as the switch stays on, the next project run starts capture again.

## Two Capture Channels

Entries come from two channels, unified in one list with identical display and actions:

| Channel | Source | Characteristics |
|---------|--------|-----------------|
| **Enhanced capture** (default) | Bytecode instrumentation attaches to your application's JVM on the local machine, collecting directly at the JDBC interface layer | No SQL logging setup needed in your app, works out of the box; parameters, durations, errors and source locations are all real structured data |
| **Console capture** | Monitors the run console's log output | Recognizes MyBatis `Preparing:` / `Parameters:` lines (Hibernate and JdbcTemplate formats are also supported) and fills `?` placeholders back into executable SQL |

Enhanced capture asks for injection consent before any run happens — the dialog pops as soon as you enable enhanced capture or open the project (fresh, not-yet-confirmed state), and the authorization persists ahead of any Run; once agreed, the very first run captures completely (startup-phase SQL included), no project restart needed. Core capabilities:

- Real parameter values (desensitization off by default, can be enabled in settings), millisecond-accurate execution durations, affected-row counts and execution error messages
- Entries carry a database badge (`[MySQL]`, `[DM (Dameng)]` etc.), inferred from the JDBC URL — all 11 dialect databases plus HSQL / GBASE covered
- Source locations come from the real call stack, jumping straight to the code line that executed the SQL (see "Jump to Source" below)
- Entries carry the full call-stack snapshot — hover the preview panel to see the whole call chain and click any frame to jump to that frame's source (see "Jump from the Call Stack" below)
- Collected data is only displayed inside the IDE on your machine — nothing is sent to any server; turning the switch off stops collection (attached capture points remain but stay idle)

::: details Startup injection and consent behavior (When to read: you care about JVM injection mechanics or run into an injection prompt)
- **When consent is asked**: the injection consent dialog pops as soon as you enable enhanced capture (in settings or via the guide flow) or open the project (the fresh enabled-but-not-authorized state), before any Run; burst requests milliseconds apart collapse into a single dialog.
- **Rescan of running processes**: when listening starts, application processes already running are scanned automatically — the unconfirmed get the consent dialog first, the confirmed get attached directly.
- **Capture from the very start**: with enhanced capture enabled and injection consented, `-javaagent` is written into the arguments before the Java run configuration launches, and the agent weaves in during the target JVM's premain phase — startup-phase SQL (framework init, data-source probes, Flyway / Liquibase migrations) goes straight into the enhanced channel instead of landing before the mount completes. Nothing is injected when the feature is off or consent hasn't been given; any injection failure only falls back to the existing attach path and the console bridge, leaving the run configuration untouched.
- **Honest capability boundary notice**: when injection fails and a dynamic attach (attach) succeeds instead, a notice says so plainly — "connections created before the attach are outside the capture scope; re-run the project for full coverage" (at most once per run).
- **Injection scope**: `-javaagent` only goes into real application run tasks; JVMs forked by Gradle / Maven test and IDE tasks (`test`, `runIde`, etc.) are never injected.
- **Declining the injection**: skips it for this run and silences re-asking for 24 hours (within the cooldown, "Re-authorize" in settings re-opens the consent dialog in one click), while console capture remains fully available; if enhanced capture fails, it automatically falls back to console capture so the list never runs dry.
- **About the warning**: premain startup injection is the JVM's expected loading path and no longer produces the dynamic-attach warning; only when injection fails and falls back to dynamic attach (attach) may the application console on JDK 21+ show one agent warning (JEP 451) — expected behavior, a warning only, no impact on your app.
- **Collection follows the listening state**: stopping listening also stops in-app collection — no more capture-and-discard waste; re-enabling listening resumes it, and after the agent mounts on project startup the listening state is reconciled automatically, so a project started with listening off no longer collects for nothing.
:::

The log-format, duration-parsing and similar descriptions in the sections below apply to the console capture channel; enhanced-capture entries carry structured data of their own and need no log parsing.

## Features

### Auto Capture

Monitors the run console's log output, recognizes `Preparing:` and `Parameters:` lines, and auto-restores them into complete SQL — enabled by default. Also supported:

- **Hibernate**: the `Hibernate:` + `binding parameter` log format
- **JdbcTemplate**: statements wrapped across multiple lines are collected in full, and brackets inside string literals don't cause premature truncation; for `NamedParameterJdbcTemplate` single-line logs, a named parameter whose value is a collection is restored element-wise — `IN (:p)` with `param=[a]` becomes `IN ('a')`; logs interleaved by concurrent threads are restored in per-thread buckets, so parameters never get misattached or lost

::: details Capture compatibility details (When to read: your logs look unusual or capture seems incomplete)
- When both Hibernate `show_sql` and its logger print the same statement, the two paths are merged into one entry with the parameters kept together — no zero-parameter leftovers and no false "parameter count mismatch".
- If a statement had no parameter-binding log captured at all, the preview says so and guides you to enable TRACE level (for JdbcTemplate it names `org.springframework.jdbc.core` specifically); only genuinely incomplete parameters report a count mismatch.
- Projects that only print the statement line with no parameter lines to follow (JdbcTemplate on DEBUG only, Tomcat spawning a thread per request) still produce entries: after 1 second of silence the statement is judged complete and handed over, instead of staying stuck at "N lines scanned / 0 produced".
:::

### Auto-Open Tool Window

When the setting "Auto-open log window on SQL found" (on by default) is active, capturing the first SQL auto-opens the log tool window — debounced to once per 60 seconds, without stealing editor focus.

::: details Open conditions and restore rules (When to read: the window "keeps popping back" or stops opening)
- It only follows SQL capture: if the switch is on but capture has never started ("Auto-start listening on project launch" also off), nothing opens; clicking "Stop capture" disables auto-open as well.
- Closing the window manually suppresses auto-open for the rest of the session; re-enabling the setting, restarting the IDE, or (with "Auto-start listening on project launch" on) running the project again restores it.
- Users who turned the switch off before the upgrade keep it off, unaffected by the new default.
:::

### Capture Diagnostics & Authorization

| Capability | Description |
|-----------|-------------|
| Zero-output diagnostics | When capture is running but not a single entry shows up, the panel's empty state names the blocker — the enhanced channel's current state (off / not authorized / waiting for the app process / attached / fallen back), the console channel's attached count and scanned line count — plus actionable next steps in three tiers ("waiting for the project to run / console has no output yet / output exists but no SQL matched") |
| Honest status line | The enhanced-capture status line in settings renders all five states faithfully; when not authorized it says so explicitly ("injection not authorized") with the cooldown's remaining hours, and shows blank only while enhanced capture is off |
| Re-authorize | During the 24-hour cooldown after declining, the "Re-authorize" button in settings clears the cooldown and re-opens the consent dialog in one click — no switch toggling needed |
| Three-state consent dialog | The confirmation dialog records all three outcomes faithfully — "Agree and enable / Cancel / Disable enhanced capture and don't ask again"; the third persists the opt-out in one click (re-enable any time in settings) |

### Mixed Prefix Matching

Supports multiple log formats:

- `Preparing: SELECT ...` (MyBatis default)
- `==> Preparing: SELECT ...` (Spring Boot)
- Custom prefixes (configurable in settings)

### SQL Highlighting & Execution Time

- SQL summaries in the list are lexically colored: keywords, table names, strings, numbers and comments each in their own color; timestamps and durations are dimmed gray so they never steal focus
- Console-channel durations are parsed from the log, supporting p6spy `elapsed`, MyBatis-Plus `Time:` output and a custom time prefix (configurable in settings, default `Time:`)
- Duration is colored by threshold: gray under 100ms, orange at 100ms+, red once the slow-query threshold is reached (default 1000ms, adjustable); a slow-query counter appears when slow queries are detected
- A persistent sort button on the list opens a single-choice menu: time ascending (default, i.e. capture order) / time descending / duration ascending / duration descending / line number

::: details Sorting and enhanced-channel details (When to read: sort results or duration data look wrong)
- The sort button shows the current mode, with the full label on hover; entries missing duration or line number always sink to the bottom (in both directions, so empty values never float to the top); time sorting follows the list's time column (with "Log time" selected, entries are ordered by log time — the time you see matches the sort key).
- Enhanced-capture entries carry structured durations (millisecond-accurate), affected-row counts and execution error messages directly — no log parsing involved.
:::

### Execution Errors Inline

SQL execution error lines from the console — MyBatis `###` error blocks, Spring DAO exceptions, the JDBC exception family, parameter-binding errors — are recognized and bound back to the nearest matching entry within the time window. The list row shows an error snippet, and the entry details carry the full error text (red meta info, an error banner and a copy-full-text action), so failed executions are visible at a glance.

### Entry Sequence Numbers

Each list entry shows a `#N` number at the front of its meta line — the Nth SQL captured in this session, handy for referring to "entry N":

- Counting restarts from 1 on every project run from an application / test run configuration (launches of unrelated processes don't reset it); clearing the list manually also resets it
- SQL dropped by dedup, capture pause or keyword filter takes no number, so the list never skips
- Numbers stay readable when sorted by duration, preserving the original capture order; the History page's second-level list also shows `#N` numbers by in-file entry order, stable under search filtering

### Timestamps & Time Source

Each entry can show a timestamp, taken from the "Timestamp source" radio option under the "SQL Log" group in settings:

| Time source | Description |
|------------|-------------|
| **Log time** (default) | Shows the original time parsed from the log line itself — common formats recognized automatically, such as Logback / Log4j2 / Spring Boot defaults and ISO 8601; entries whose log line carries no time fall back to capture time |
| **Capture time** | Shows the moment the plugin captured the log |

The "Show timestamp" switch controls whether the time column appears. The timestamp format setting (default `yyyy-MM-dd HH:mm:ss`) applies to both sources alike, and copied timestamps and the times shown on the History page all follow the same configuration.

### CRUD Type Color Markers

List entries get color markers by statement type (applies to the SQL log list and the History page's second-level list): SELECT blue, INSERT green, UPDATE orange, DELETE red (defaults, all customizable); OTHER types carry no marker.

Marker style is a three-way choice, configured under the "SQL Log" group's "CRUD Color Markers" in settings — the four colors and the style are adjustable, with one-click restore to defaults:

- **Left color bar** (default): a 3px bar on the entry's left edge; selection uses the platform highlight and keeps the bar
- **Full-row tint**: the row background blends with the list color, adapting to light and dark themes; the selected row keeps its type tint plus an outline, so fast / slow duration coloring is not washed out by selection
- **Off**: back to the unmarked look

Each checkbox in the log page's "Type Filter" popup carries a matching color swatch legend, syncing instantly with color changes (the legend hides when marking is off).

### Scroll to Bottom & Tail Following

The log list has tail following on by default: the view sticks to the bottom as new SQL arrives, always showing the latest entries; scrolling up to read history pauses following automatically, and scrolling back to the bottom or clicking the toolbar's "Scroll to Bottom" action resumes it — the same habit as the IDE console.

::: details Details (When to read: the list is not at the bottom, or you are looking for the action)
- The "Scroll to Bottom" action sits at the end of the toolbar's action group: one click jumps to the bottom of the list and resumes following.
- Pausing and resuming are judged by scroll direction; programmatic appends (new entries arriving) never disturb the reading position you scrolled to.
:::

### Jump to Source

Right-click a log entry → "Jump to Source". How the position is resolved depends on the capture channel.

**Enhanced-capture entries**: the source location comes from the real call stack at SQL execution time, straight to the code line that ran the query. Calls entering through a self-developed framework's unified entry point are traced up the stack automatically, skipping framework frames to land on your business code.

::: details Framework-frame filtering and business-frame registration (When to read: jumps keep landing in framework code or tool libraries)
Framework frames are filtered by origin (business classes come from directories in dev, third-party dependencies from JARs), so framework or data-layer plugin frames cannot mislead the jump. Both frame filtering and JAR business-frame ownership are configurable in settings: register your framework engine chain's packages under "Source-capture frame skip prefixes" (one per line), and your JAR-packaged business tool libraries' packages under "JAR business-frame prefixes" — registered jumps then land inside the tool class where the SQL runs, instead of the caller line above it. Both fields are validated as you type (format and cross-field conflicts) with one-click fix. The live list and history panel share the same resolver.
:::

#### Jump from the Call Stack

An enhanced-capture entry carries more than a single execution point — it carries the whole call stack. Preview such an entry and hover the "Call stack:" area on the panel's meta line; after a moment a debugger-style **Frames** popup appears:

- Frames are listed as structured rows — method name, fully-qualified class name and `:line`, with the class name middle-ellipsized when too wide so the line number always stays visible; the top frame is selected by default and the plugin's own capture frames are dimmed gray
- **Clicking any frame jumps to that frame's source line** (resolved by class name across the whole project, library classes landing in the decompiled view, just like the debugger). When a frame cannot be resolved the popup stays open — no false "jumped" impression
- Infrastructure frames at the tail (Tomcat / thread-pool tails and the like) are skipped when resolving, so the popup anchors on the deepest business frame and you see the Controller → Service path at a glance
- "Copy full call stack" at the bottom copies the raw snapshot verbatim, ready to paste into an issue or a chat

How many frames are kept is configurable — "Call-stack snapshot frames" in settings (default 24, range 12–64): sampled at both ends, the top keeps JDBC / engine-side frames and the bottom always keeps 8 business-side frames, joined by an omission marker in the middle. Changes take effect via a hot push on save — no application restart.

**Console-capture entries**: SQL logs contain no call-site info, so the plugin ships an optional runtime interceptor — copy the self-contained sample `SqlSourceInterceptor` into your project and register it as a MyBatis-Plus `InnerInterceptor` for precise resolution.

The interceptor sample file ships with the plugin repository: `docs/instrumentation/SqlSourceInterceptor.kt`.

```java
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    // Restrict to your own business packages for accurate call-site resolution
    interceptor.addInnerInterceptor(new SqlSourceInterceptor(Set.of("com.example.")));
    // Add other interceptors (pagination, etc.) as needed
    return interceptor;
}
```

The interceptor captures the real call site on the SQL execution thread and prints a `SQLVIS-SOURCE|relative-path|line` marker to the console (no impact on SQL execution, no performance overhead). The plugin parses it and jumps precisely `file:line`, just like the SQL History panel — straight to the Service / Controller line that fired the SQL.

**Jump to Mapper XML**: entries carrying mapper statement info can also right-click → "Jump to Mapper XML" — the statement id is split into namespace and fragment id, the mapper XML is located through the project index, the namespace is verified, and the jump lands on the statement node's start line.

If the XML doesn't exist (annotation SQL, MP built-in statements) or locating fails, it falls back to "Jump to Java" with no capability loss. The log page and the History page share the same entry points.

::: details Jump fallback behavior (When to read: you hit a "cannot jump" prompt or want to configure auto-injection)
- Jumps rely only on the real captured position — no table-name guessing fallback, so a same-named table can never send you to an unrelated file. Statements like `SELECT 1` have no jump target and report as such.
- When a console-channel entry carries no position (no interceptor configured, or an outdated interceptor file), a guide dialog pops up with one-click "Open settings" or "Inject now" to complete the setup.
- When interceptor auto-injection meets an unrecognized project type (not a Spring Boot + MyBatis-Plus project), the dialog instead guides you to enable enhanced capture in one click (the enhanced channel does not depend on project type), rather than leaving you to dig through the manual configuration sample (the `SqlSourceInterceptor` sample file remains in the plugin repository — the manual route is still there).
- When "Auto-inject source capture interceptor" in settings triggers on a multi-module project, a dialog first asks you to pick the modules to inject (all selected by default).
:::

### Dedup & Filter

| Feature | Description |
|---------|-------------|
| Dedup window | Same SQL doesn't reappear within window (default 60000ms, adjustable; dedup ignores leading / trailing and repeated whitespace differences — different parameters still count as different statements) |
| Instant dedup | Toggling "Remove duplicate SQL" immediately trims existing duplicates in the window and shows a `⨉N` badge with the dropped count |
| Keyword filter | Remove log lines containing specified keywords |
| List search | The search box matches SQL content, source file, `#number` (`#5` or `5` hits exactly entry 5) and time text (search what you see, matched against the displayed format); available on both the log page and the History page |
| Copy timestamps | Select entries (multi-select works), right-click → "Copy timestamp" to copy plain time text line by line (no display brackets; the menu item shows the count for multi-select); grayed out while timestamp display is off |

### SQL Suppression

When keep-alive heartbeat SQL (such as `SELECT 1`) keeps flooding the list, you can suppress it out of the list:

- Right-click an entry → "Suppress this SQL" to suppress in one click; multi-select works (different statements become separate rules, existing ones are skipped automatically). Existing rows vanish from the list immediately, a balloon notification can jump straight to the management dialog, and the management dialog shows live hit counts
- The toolbar "Manage suppression rules" (funnel icon) and the right-click "Manage suppression rules…" open the same management dialog: a rule list (pattern summary / created at / blocked N times counter) plus a read-only SQL preview with syntax highlighting and line numbers on the right; add / delete / clear take effect instantly, and the dialog is resizable with its size remembered
- Rules apply globally at application level and are stored independently (not part of settings import/export), capped at 500 rules; entries still in the buffer reappear when a rule is deleted (entries already dropped from the queue cannot be restored)

::: details Matching semantics (When to read: a rule was added but doesn't hit)
Matching = exact match after whitespace normalization of the restored SQL (trailing semicolons are stripped automatically, so a rule pasted with `;` still matches) — `SELECT 1` and `select  1` hit the same rule. An optional **structural match** (off by default, enabled per rule or all at once with one click) matches by statement shape instead — the same shape with different parameter values is suppressed together.
:::

### Focus Tabs

<GifPlayer src="/demo/sql-log-focus.gif" alt="SQL log focus tabs demo" />

The entry context menu offers two focus modes, shown as tabs at the top of the panel — several can be open at once, each can be closed, and they stack correctly with type filter and search:

- **Focus caller method**: statically approximates the source position's line range so the list shows only SQL issued from within that method
- **Focus by request**: right-click a SQL executed inside a web request → "Focus by request" to see only that request's SQL, kept in a flat timeline

::: details Focus boundaries (When to read: focus results differ from what you expect)
- Focus caller method: nested classes, overloads and lambdas resolve to the smallest containing method; entries outside the range are hidden with a count hint. Known boundary: Kotlin callers are not supported in the first batch.
- Focus by request: request tabs are deduplicated and capped at 8 (the oldest tab is evicted past the cap), so long load-test sessions can't flood the list; entries without a request tag (scheduled jobs, startup phase) are hidden under focus with a count.
:::

### Three Display Modes

The "List display" dropdown under the "SQL Log" group in settings controls how SQL renders inside entries, switching instantly:

- **Single line**: one fixed row per entry, long SQL truncated
- **Keyword wrap** (default): SQL wraps at keywords, height growing with content
- **Formatted**: full pretty-print, long statements split clause by clause

The SQL log page and the History page share the same setting, which survives IDE restarts. In any mode, Ctrl+C on a selected entry copies the plain SQL, not the rendered text.

### Single-Click Preview & Double-Click Dialog

List entries use two-level previewing, consistent across the SQL log list, the History tab's second-level list and the history tool window:

- **Single-click an entry**: after a short delay a lightweight preview pops up — SQL shown with lexical highlighting, editable in place; the "Copy" button in the header takes the currently edited text and flashes a check mark when clicked, plus a "Close" button
- **Multi-select batch copy**: after Ctrl / Shift multi-select, right-click → "Copy" copies all selected SQL at once (the menu item shows the count, e.g. "Copy selected SQL (3)", each statement semicolon-terminated and newline-joined)
- **Double-click an entry**: opens the full preview dialog (same as Wrapper preview, supports parameter fill-in and formatting). The toolbar offers layout toggles — horizontal / vertical / keyword wrap — plus a "More" menu gathering low-frequency actions (import parameters, diff, share)

::: details Preview behavior details (When to read: preview rendering or dialog behavior differs from what you expect)
- **Single-click preview**: its display follows the "Format SQL on preview" setting (on by default), so long SQL opens multi-line indented, or as original text when off. Literal SQL with zero placeholders (values inlined in the SQL text) and IN lists are recognized into editable parameter rows as well. The popup anchors right below the clicked row without covering list content, and focuses on open so you can type immediately. While a Ctrl / Shift multi-select is in progress, single-clicks no longer trigger the preview (any open popup closes with it); single-select resumes normal previewing.
- **Multi-select and right-click**: right-clicking a row already in the selection keeps the selection, while the other menu actions still apply to the right-clicked row.
- **Double-click dialog**: vertical layout annotates each INSERT value line end with a `-- column` tag (can be disabled in settings), and IN lists expand vertically element by element — any list with a comma (≥2 elements) puts `(` on its own line with one element per line, while single-element forms (`IN (1)` / `IN (?)`) stay on one line, and IN subqueries and LIMIT pagination parameters are never expanded. The display mode you switch to survives parameter refill instead of being wiped by re-rendering (Refresh resets it). The dialog is non-modal: when a data source password expires during execution, IDEA's password prompt can be raised on top as usual; with no data source configured, preview prepares silently — it no longer raises the Database tool window over the sidebar, and only an explicit run guides you through configuration.
- **Auto-fold**: with "Auto-fold long field lists" enabled in settings (off by default, threshold adjustable, default 10), preview editors collapse long SELECT / INSERT column lists, VALUES groups and UPDATE SET lists into a "… N columns" placeholder — click the fold marker to expand. This applies consistently across the main preview dialog, single-click preview, history preview, the Log → SQL result area and the native Database console.
- **Identical Ctrl+C semantics everywhere**: in every surface with a SQL editor (main preview panel, single-click preview popup, "Recent Executions", suppression rules, rollback SQL, the SQL → Java input area, parameter import) Ctrl+C means the same thing — with no selection it copies the whole SQL, with a selection it copies just the fragment (Ctrl+C and Ctrl+Insert are synonyms); Ctrl+C on a list copies the plain SQL rather than the rendered text.
:::

How entries render is controlled by the "List display" option in settings (see the section above).

## SQL History

The "SQL History" tab is always present on the panel — you don't have to enable auto-save first to see the entry point (it shows an empty state when auto-save is off and the directory holds no history files). Previously the tab was only mounted once certain conditions were met.

Enable "Auto-save SQL history" in settings (off by default) and captured entries are saved to disk in full (not limited by the list's max-entry count); when the save directory holds more history files than the retention limit (default 30, configurable, 0 = keep everything), the oldest files are cleaned up automatically to keep the disk in check. Reading and writing go through the same directory resolution: files written after you customize the save directory are visible on the History page too, and changing the save directory triggers a rescan.

- **Level 1 (default view)**: file list — each row shows file name, size and SQL count; search box filters by file name
- **Level 2 (file content)**: double-click a file to list its SQL entries one by one (with the same highlighting, duration, timestamp and source info, and a `#N` number per in-file entry order); large files load in batches as you scroll — the first 30 entries up front, more appended as you near the bottom; single-click an entry for a lightweight preview, double-click to open the full dialog, right-click to copy SQL, copy timestamps or jump to source; the search box matches SQL content / source file / `#number` / time text
- **Back**: "← Back" returns to the file list; switching tabs refreshes automatically, without interrupting browsing while the file you're viewing still exists
- **Parameter recognition & refill**: history entries share the same recognition channel as the live log — double-clicking opens the dialog with parameter fill-in just the same

::: details History storage and version compatibility (When to read: you use a custom save location or mix old and new plugin versions)
- History files are saved under `.idea/sql-visualizer/sql-history/` in your project by default (the directory was renamed from `mybatis-plus-sql-visualizer` in v2026.9.2 — old directories are no longer read). Save location and file name pattern are configurable in settings.
- History files (v2 format) store parameters per entry (inlined as a `-- pd:` comment line next to the statement), along with the original time and database info — older plugin versions ignore the extra fields and open the file as usual, while the new version reads all older files normally.
- The second-level list's timestamp format and source follow the current settings configuration.
:::

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=sql-log)

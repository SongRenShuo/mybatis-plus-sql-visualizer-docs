# Turning the ? marks in MyBatis logs into real parameters

When MyBatis prints SQL, the statement and its parameters come apart: the `Preparing:` line carries a string of `?` marks, and the values follow on the next `Parameters:` line. To copy a runnable SQL you have to fill the parameters back in, in order — strings need quoting, dates need formatting, and with many values it is easy to misalign. This page walks through the common approaches and ends with the one-click option inside the plugin.

## Why the log only shows ? and Parameters

That is how MyBatis logging is designed: with SQL logging enabled, the `Preparing:` line prints the prepared statement (placeholder form), the actual values are listed on the `Parameters:` line, and the type hints follow after. The logging framework receives two separate pieces of text, so a fully assembled SQL never appears in the log by itself.

Two common follow-up problems:

- The parameters line usually requires the log level to be raised to `TRACE`; at lower levels you get `Preparing:` without `Parameters:`
- The mainstream form carries an arrow prefix (`==> Preparing:`), while some logging wrappers emit a bare `Preparing:` — one parsing rule does not fit both

## What the generic options are

**MyBatis log configuration**: zero cost, the parameters are right there in the log. The limitation is that statement and parameters are separate and must be joined by hand; in batch execution several parameter lines map to one statement and eyeballing the alignment is error-prone; raising the log level in production also means more log volume and exposed sensitive values to weigh.

**p6spy**: steps in as a JDBC proxy driver. The application swaps the data source's driver class for p6spy's implementation; it wraps the real JDBC calls and assembles the statement with its actual arguments into a single-line complete SQL, with the output format customizable through `spy.properties`. You see the final executed form of every SQL, but the integration cost lives in the project: add a dependency, change the driver configuration, and repeat for every data source.

**A custom MyBatis interceptor**: implement an `Interceptor` around the executor and render the statement and parameter bindings from `BoundSql` yourself. The most flexible option (e.g. handling only specific mappers), but string quoting, date formatting and null handling are all on you, and the code stays in the project to maintain.

## How to choose

| Option | Touches the project | Full SQL produced | Fits when |
|--------|--------------------|-------------------|-----------|
| Log configuration | No (adjust log level) | No, join by hand | Debugging one or two statements |
| p6spy | Dependency + driver swap | Yes | The project needs long-term full SQL in its logs |
| Custom interceptor | Add code | Assembled yourself | Custom requirements, willing to maintain |
| SQL Visualizer | No | Yes, restored automatically | Watching SQL in the IDE while developing |

These are not mutually exclusive: log configuration and the plugin, p6spy and the plugin, can all coexist — combine as needed.

## Let the plugin restore it

The [SQL Log tool window](/en/features/sql-log) does this inside the IDE, on two channels:

- **Enhanced capture** (on by default): once the application starts, the plugin attaches capture points inside the application JVM on your machine; executed SQL arrives in the list with real parameters, timings and affected rows, each entry carrying a call stack that jumps precisely back to the source line that triggered it
- **Console capture** (fallback channel): parses `Preparing:` / `Parameters:` lines in the run console (including the `==> Preparing:` mixed-prefix form) and joins the parameters back into the statement automatically — no project changes required

The restored SQL is ready to use — no p6spy, no log configuration changes. Install the plugin and watch.

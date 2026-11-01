# Seeing complete SQL with real parameters without p6spy

p6spy is a common choice for observing SQL, but it asks you to swap the data source's JDBC driver for a proxy implementation. If a dependency cannot pass the audit, the multi-datasource setup is untouchable, or you only occasionally need to check one statement — there are ways that do not touch the project. This page first explains how p6spy works and what it costs to adopt, then lists the alternatives.

## How p6spy works

p6spy steps in as a JDBC proxy driver: the application swaps its driver class for p6spy's implementation (with the matching URL prefix), it wraps the real JDBC calls, and the statement together with its actual arguments is assembled into a single-line complete SQL written to the log, with the format customizable through `spy.properties`. Because it operates at the JDBC layer, what it sees is already the final call carrying real arguments — that is the fundamental reason it is more convenient than raw logs.

## What adopting p6spy changes

- Add the p6spy dependency
- Swap the driver class in the data source configuration and prefix the connection string
- Add `spy.properties` to tune the output format
- With multiple data sources / environments, repeat for each of them

Each step is small on its own, but the changes all live in the project: the dependency has to pass security review, the configuration drifts across environments, and every teammate's project carries the same setup.

## Alternatives that leave the project alone

- **Turn on MyBatis logs**: the `Preparing:` / `Parameters:` lines contain everything, at zero project cost; the drawback is joining the parameters by hand — see [Turning the ? marks in MyBatis logs into real parameters](./mybatis-log-params.md) for the full picture
- **A custom interceptor**: take the statement and bindings from `BoundSql` and render them yourself — fits custom requirements and a willingness to maintain code
- **SQL Visualizer's log restore**: an IDE plugin, ready to use once installed, zero project changes

## Let the plugin restore it

The [SQL Log tool window](/en/features/sql-log) shows complete SQL without touching your project:

- **Enhanced capture** (on by default): once the application starts, the plugin attaches capture points inside the application JVM on your machine; executed SQL arrives in the list with real parameters, timings and affected rows, each entry carrying a call stack that jumps precisely back to the source line that triggered it
- **Console capture** (fallback channel): parses `Preparing:` / `Parameters:` lines in the run console (including the `==> Preparing:` mixed-prefix form) and joins the parameters back into the statement automatically

Already using p6spy is no conflict either: its output goes to the application log, and the plugin's console channel parses MyBatis-form logs — the two travel their own separate channels.

The restored SQL is ready to use — watch it in the IDE as you develop, without adding a proxy driver to the project just to see one statement.

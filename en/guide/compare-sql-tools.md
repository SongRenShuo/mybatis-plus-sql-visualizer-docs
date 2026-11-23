---
title: "MyBatis SQL Debugging Plugins Compared"
description: 'Three families of MyBatis SQL debugging plugins for IntelliJ IDEA: log restoration, navigation and code generation, write-time preview with runtime capture.'
---

# MyBatis SQL Debugging Plugins Compared

When debugging MyBatis / JPA SQL in IntelliJ IDEA, community plugins fall into three broad families: those that restore SQL from console logs, those that speed up navigation and code generation while you write, and those that render the final SQL at coding time. They solve problems at different stages and can be combined.

## At a glance

A decision table for common needs; details and representative plugins follow in the next three sections.

| Your situation | Look at first | Why |
|----------------|---------------|-----|
| Your app already prints SQL logs; you just want the question marks filled in | Log restoration family | Works on the logs you already have — no project changes, no added dependencies |
| Your main pain is jumping between mapper XML and Java interfaces and generating CRUD templates | Navigation & generation family | Navigation, generation and completion are exactly this family's focus |
| You want to confirm the final Wrapper / XML / annotation / JPA SQL while coding, without starting the service | Write-time preview & capture family | Static parsing renders immediately; the plugin requires IDEA 2024.3 or later |
| You want real parameters, durations and affected rows at runtime, with a jump back to source | Write-time preview & capture family | The capture channel supplies real execution data; enhanced capture needs a one-time authorization in the plugin |
| You want an AI coding agent to call SQL rendering, log restoration and schema lookup directly | Write-time preview & capture family | The plugin provides 11 read-only MCP tools, requiring IDEA 2025.2 or later with a working MCP Server |
| You need EXPLAIN plans, real SQL execution or the JOIN diagram | Write-time preview & capture family | Runs through the IDE's embedded Database console, which requires Ultimate's Database Tools |
| Your team will not accept an invasive driver such as p6spy | Log restoration family or write-time preview & capture family | Neither path changes the data source or adds a driver |
| You want navigation and generation, plus the final SQL on demand | Navigation & generation family + write-time preview & capture family | The families are not mutually exclusive; when a same-kind navigation plugin is present, this plugin yields the Mapper gutter icons |

Full breakdowns of each family follow in the next three sections; this plugin's boundaries are listed under "This plugin (SQL Visualizer)".

## How each family works

### Log restoration

These plugins join the `Preparing:` and `Parameters:` lines from console logs into a complete SQL statement. They assume the app already prints SQL logs (`show_sql` or a logging framework) and answer "what did the SQL I just ran look like" — nothing happens at coding time.

| Plugin | Positioning | Pricing | Downloads (as of 2026-11) |
|------|------|------|------|
| MyBatis Log | Console SQL log restoration | Paid | ~630K |
| MyBatis Log Free | Console SQL log restoration (free edition) | Free | ~560K |
| Mybatis Log Ultra | Console log restoration | Free | thousands |
| Mybatis Sql Viewer | Log SQL viewer | Free | ~15K |

### Navigation & generation

The focus is the coding loop: jumping between mapper XML and Java interfaces, generating CRUD templates, completing SQL fragments. This family is about writing speed rather than "seeing the SQL"; many projects run one as baseline infrastructure.

| Plugin | Positioning | Pricing | Downloads (as of 2026-11) |
|------|------|------|------|
| MyBatisX | baomidou's official IDE plugin: XML↔interface navigation, code generation | Free | ~5.65M |
| MyBatisCodeHelperPro | MyBatis development toolkit: generation, navigation, completion | Free + paid license | ~1.46M |
| JPA Buddy | JPA / Hibernate visualization and code generation (maintained by the JetBrains team) | Free + paid | ~6.9M |

### Write-time preview & capture

These plugins statically parse the code and render the final SQL with parameters while you are still writing — no running app needed. Once it runs, a capture channel fills in the real execution information, joining "see it while writing" and "see it accurately while running" in one chain.

A few small plugins share this direction (such as MyBatis SQL Scanner AI and MyBatis SQL Analyzer). SQL Visualizer listed below is maintained by this page's team; the others are not expanded individually.

## Comparison dimensions

Only statements of capability, no judgments on which is better; "supported" means the typical form of that family's representative plugins — check each plugin's own Marketplace page for specifics.

| Dimension | Log restoration | Navigation & generation | Write-time preview & capture |
|------|------|------|------|
| Needs the app running | Yes (needs existing logs) | No | Static preview: no; runtime capture: yes |
| Where parameters come from | `Parameters:` line in logs | N/A | Static preview: values filled in code; runtime: real execution parameters |
| See SQL while coding | No | No | Yes |
| Real durations / affected rows | No | No | Yes (runtime capture) |
| Main output | One executable SQL | Generated code and navigation | Preview SQL, execution info, source locations |

## This plugin (SQL Visualizer)

In the write-time preview & capture family, free and Apache-2.0. Its boundaries, stated plainly:

- Static preview covers: MyBatis-Plus Wrapper chains, MPJ joins, XML / annotation / iBatis 2.x sqlMap statements, and statically derivable JPA / Hibernate queries. Kotlin DSL Wrapper chains are recognized where they can be statically resolved; fragments it cannot resolve are stated as such — no invented SQL.
- Real execution, EXPLAIN plans and the JOIN diagram go through the embedded Database console, which requires Ultimate's Database Tools. Community Edition covers the core: static preview, log capture, and SQL-to-Java conversion.
- Runtime enhanced capture requires a one-time authorization inside the plugin; MCP tools require IDEA 2025.2 or later with a working MCP Server; the plugin itself supports IDEA 2024.3 and later.
- iBatis support targets 2.x (sqlMap); MyBatis 3 mappers have their own rendering chain and are never misclassified.

## Combining families

The families are not mutually exclusive. A common combination is a navigation plugin for jumping and generation, with SQL Visualizer handling preview and runtime capture: when a navigation plugin of the same kind is present, this plugin yields the Mapper gutter icons so they do not stack on one line, while iBatis navigation arrows are unaffected.

For a finer per-capability comparison, see [Why SQL Visualizer](./comparison.md); feature pages start at [Wrapper → SQL Preview](../features/wrapper-preview.md).

## About this page

Download counts are public JetBrains Marketplace readings (as of November 2026) and change over time; each plugin's exact capabilities are defined by its own Marketplace page. This page is maintained by the SQL Visualizer team; we aim to stay factual. If a plugin's positioning here does not match reality, corrections are welcome through the [Feedback Pool](../about/feedback.md).

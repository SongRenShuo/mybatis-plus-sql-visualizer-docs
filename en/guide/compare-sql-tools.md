---
title: "MyBatis SQL Debugging Plugins Compared"
description: 'Three families of MyBatis SQL debugging plugins for IntelliJ IDEA: log restoration, navigation and code generation, write-time preview with runtime capture.'
---

# MyBatis SQL Debugging Plugins Compared

When debugging MyBatis / JPA SQL in IntelliJ IDEA, community plugins fall into three broad families: those that restore SQL from console logs, those that speed up navigation and code generation while you write, and those that render the final SQL at coding time before your app even starts. They solve problems at different stages. This page lists the representative plugins of each family, how they work, and the situations they fit, so you can pick — or combine.

Download counts below are public JetBrains Marketplace readings (as of November 2026) and change over time; each plugin's exact capabilities are defined by its own Marketplace page.

## Start here: which family fits your situation

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

Full breakdowns of each family follow in the next three sections; this plugin's boundaries are listed under "What SQL Visualizer does and does not cover".

## Log restoration family

These plugins join the `Preparing:` and `Parameters:` lines from console logs into a complete SQL statement, saving the manual work of substituting question marks.

| Plugin | Positioning | Pricing | Downloads (as of 2026-11) |
|------|------|------|------|
| MyBatis Log | Console SQL log restoration | Paid | ~630K |
| MyBatis Log Free | Console SQL log restoration (free edition) | Free | ~560K |
| Mybatis Log Ultra | Console log restoration | Free | thousands |
| Mybatis Sql Viewer | Log SQL viewer | Free | ~15K |

This family assumes the app already prints SQL logs. It fits teams that already read logs and prefer not to add anything that touches the runtime: with `show_sql` or a logging framework in place, the plugin substitutes real parameters for the question marks. It answers "what did the SQL I just ran look like".

## Navigation & generation family

The focus is the coding loop: jumping between mapper XML and Java interfaces, generating CRUD templates, completing SQL fragments.

| Plugin | Positioning | Pricing | Downloads (as of 2026-11) |
|------|------|------|------|
| MyBatisX | baomidou's official IDE plugin: XML↔interface navigation, code generation | Free | ~5.65M |
| MyBatisCodeHelperPro | MyBatis development toolkit: generation, navigation, completion | Free + paid license | ~1.46M |
| JPA Buddy | JPA / Hibernate visualization and code generation (maintained by the JetBrains team) | Free + paid | ~6.9M |

This family centers on writing speed rather than "seeing the SQL": creating mappers, generating interface methods, moving between the two. Many projects run one of these as baseline infrastructure.

## Write-time preview & capture family

These plugins statically parse the code and render the final SQL while you are still writing — the app does not need to be running. Once it runs, a capture channel fills in what actually executed.

| Plugin | Positioning | Pricing | Downloads (as of 2026-11) |
|------|------|------|------|
| SQL Visualizer (this page is maintained by its team, see the note below) | Write-time SQL preview for MyBatis-Plus / JPA / JdbcTemplate / iBatis plus runtime enhanced capture | Free (Apache-2.0) | ~1.2K |

A few small plugins share this direction (such as MyBatis SQL Scanner AI and MyBatis SQL Analyzer); they are not listed individually here.

This family fits the situation where you want to confirm the SQL without restarting the service and digging through logs: finish a Wrapper chain or mapper statement and check the SQL in place; toggling conditions and filling parameters re-renders it immediately. Once the app runs, real parameters, durations, affected rows and call sites come in on their own, and slow queries jump straight back to source.

### What SQL Visualizer does and does not cover

Stated plainly, to help you decide whether it fits:

- Static preview restores what it can resolve: MyBatis-Plus Wrapper chains, MPJ joins, XML / annotation / iBatis 2.x sqlMap statements, and statically derivable JPA / Hibernate queries. Kotlin DSL Wrapper chains are recognized where they can be statically resolved; fragments it cannot resolve are stated as such — the preview does not invent SQL.
- Real execution, EXPLAIN plans and the JOIN diagram go through the embedded Database console, which requires Ultimate's Database Tools in IntelliJ IDEA. Community Edition covers the core: static preview, log capture, and SQL-to-Java conversion.
- Runtime enhanced capture requires a one-time authorization inside the plugin.
- MCP tools require IDEA 2025.2 or later and a working MCP Server.
- iBatis support targets 2.x (sqlMap); MyBatis 3 mappers have their own rendering chain and are never misclassified.
- The plugin itself supports IDEA 2024.3 and later.

## How to choose

- You already read console logs and just want the question marks filled in: the log restoration family.
- You want faster mapper writing: the navigation & generation family.
- You want to see the final SQL while coding and get real parameters with source locations at runtime: the write-time preview & capture family.

The families are not mutually exclusive. A common combination is a navigation plugin for jumping and generation, with SQL Visualizer handling preview and runtime capture; when a navigation plugin of the same kind is present, this plugin automatically yields the Mapper gutter icons so they do not stack on one line, while iBatis navigation arrows are unaffected.

For a per-capability matrix, see [Why SQL Visualizer](./comparison.md); feature pages start at [Wrapper → SQL Preview](../features/wrapper-preview.md).

## About this page

This page is maintained by the SQL Visualizer team; we do our best to keep it factual and neutral. If a plugin's positioning here does not match reality, corrections are welcome through the [Feedback Pool](../about/feedback.md).

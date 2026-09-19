# MCP Server: SQL Tools for AI Agents

Since 2026.9.18, the plugin registers ten tools with IDEA's built-in MCP Server, letting external agents such as Claude Code, Cursor, JetBrains AI Assistant, and Junie call the plugin's SQL capabilities directly: render executable SQL, inspect table structures, fetch execution plans. You keep writing code in the IDE as usual while the agent works alongside — neither side interrupts the other.

## Verifiers Give Confidence, MCP Gives Evidence

The plugin's checks and hints produce confidence scores — "might be risky", "worth a look". The MCP tools take a different route: they hand the agent the actual executable SQL produced by the rendering chain. For example, `sqlv_mapper_check` goes beyond static contract checking and can analyze rendered output for write risks and performance issues — hard evidence no static verifier can produce. The agent doesn't have to guess; it works from facts.

## The Ten Tools

Grouped by purpose: a rendering trio, a workflow quartet, and a generation-and-checking trio.

| Tool | Purpose | Read-only |
|------|---------|-----------|
| `sqlv_render_sql` | Render the real executable SQL for a file and line (or a mapper XML fragment), with parameters filled in and degradation notes attached | Yes |
| `sqlv_schema_context` | Return the data source's actual table/column structure and comments for a table name allowlist (compact context, up to 8 tables by default, 20 max) | Yes |
| `sqlv_explain` | EXPLAIN plan text for a single SELECT across seven dialects | Yes |
| `sqlv_render_logs` | Restore MyBatis / Hibernate / JdbcTemplate logs into executable SQL | Yes |
| `sqlv_check_sql` | Static write-risk and type checks | Yes |
| `sqlv_rollback_plan` | Produce a rollback plan (generates the plan only, executes nothing) | Yes |
| `sqlv_perf_advice` | Performance advice based on 20 built-in rules | Yes |
| `sqlv_crud_sql` | Generate the four CRUD statements from an entity class | Yes |
| `sqlv_reverse_sql` | Convert SQL back into MyBatis-Plus code | Yes |
| `sqlv_mapper_check` | Mapper contract checking, with an optional simulate mode that analyzes rendered output for write risks and performance issues | Yes |

A few usage notes:

- `sqlv_render_sql` renders one statement per call; when multiple candidates exist at a location it takes the first and says so — multi-statement logs belong to `sqlv_render_logs`
- Statement headers in `sqlv_render_logs`, `sqlv_rollback_plan`, and `sqlv_mapper_check` carry statement names (taken from a leading `-- Name:` comment in the log), making multi-statement output easy to read
- `sqlv_perf_advice` returns at most 30 suggestions; over that, items are trimmed by severity with high-risk ones kept, and a "showing 30 of N" counter stays visible at the end. Overly long individual messages are truncated to keep output bounded

## Requirements

- IDEA 2025.2 or later: the MCP Server is built into the platform, nothing extra to install
- IDEA 2024.3 – 2025.1 does not support this feature set (no built-in MCP Server); all other plugin features are unaffected
- Environments without the MCP Server plugin see zero impact: the plugin's MCP registration simply never loads, everything else works as usual
- Agent-side connection: the tools live under IDEA's built-in MCP Server, so add that server's connection in any MCP-capable agent (Claude Code / Cursor / AI Assistant / Junie etc.) — `use_idea_mcp` in the case of Claude Code

## Settings and Gating

Settings → the "MCP Tools" page provides a gating area:

- A master switch that turns the plugin's MCP functionality on or off as a whole
- Per-tool enable/disable toggles for all ten tools
- "Enable all" / "Disable all" shortcuts

Every change takes effect immediately: the next tool listing or tool call follows the new configuration, no IDE restart needed.

## Read-Only and Safety

All ten tools explicitly declare themselves read-only, idempotent, and non-destructive to the agent, so handing them to automated workflows is safe. On top of that:

- Query allowlist: entry points that hit the database accept SELECT statements only — a structural parse plus a keyword sweep act as two independent guards, and anything that cannot be judged is rejected rather than let through. String literals are stripped before the check so keywords inside literals don't cause false positives
- Zero dialogs: the MCP call chain never pops a dialog in your IDE — rejected requests come back to the agent as error messages, and database connections never prompt for a password
- Audit trail: every tool call writes an `[MCP-AUDIT]` entry to the IDE log (idea.log)

## Plan and Advice Output

Output that touches the database carries a few extras:

- `sqlv_explain` drains any driver messages left on the connection before executing; PostgreSQL NOTICE / WARNING messages and the like are returned alongside the plan in a `notices` section. Common inefficient patterns (full scans of large tables, filesort / temporary, PG Seq Scan) get `index hints` appended after the plan — suggestions only, the tool never rewrites or executes SQL
- Queries against non-existent table names (AI-hallucinated table names are a frequent case) cache the negative result per data source for 30 seconds, so a long session won't repeatedly trigger full-schema scans for the same phantom table

> Have a suggestion or hit an issue with the MCP tools? [Go to the feedback pool](/en/about/feedback?category=mcp)

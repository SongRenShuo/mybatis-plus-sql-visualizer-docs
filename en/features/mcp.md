# MCP Server: SQL Tools for AI Agents

Since 2026.9.18, the plugin registers ten tools with IDEA's built-in MCP Server, letting external agents such as Claude Code, Cursor, JetBrains AI Assistant, and Codex call the plugin's SQL capabilities directly: render executable SQL, inspect table structures, fetch execution plans. You keep writing code in the IDE as usual while the agent works alongside — neither side interrupts the other.

![SQL Visualizer MCP Server: ten read-only tools grouped by agent workflow](/demo/mcp-overview.svg)

## Quick Start

1. Make sure you run IDEA 2025.2 or later — the MCP Server is built into the platform, nothing extra to install
2. Add the IDE's MCP Server connection in your MCP-capable agent (e.g. `use_idea_mcp` in Claude Code); the ten `mpsv_*` tools show up in its tool list
3. Call them. Feed a mapper XML fragment to `mpsv_render_sql` and you get real executable SQL back — parameters filled in, ready to run

No project code changes, no extra plugin configuration. To control which tools the agent can see, see "Settings and Gating" below.

## The Ten Tools

Grouped the way an agent works: get the SQL first, then understand the database, then check before execution.

### Get the SQL

| Tool | Input | Output |
|------|-------|--------|
| `mpsv_render_sql` | `filePath` + `line`, or paste a mapper XML as `xmlSnippet` | Real executable SQL — parameters filled in, with notes wherever rendering degraded |
| `mpsv_render_logs` | `logText`, the raw console log (optional custom `sqlPrefix` / `paramPrefix` etc.) | Executable SQL restored from MyBatis / Hibernate / JdbcTemplate logs |
| `mpsv_crud_sql` | `filePath` or `className` of a MyBatis-Plus entity | INSERT / UPDATE / SELECT / DELETE set |
| `mpsv_reverse_sql` | `sql`, one SQL statement | MyBatis-Plus Java code generated in reverse |

### Understand the Database

| Tool | Input | Output |
|------|-------|--------|
| `mpsv_schema_context` | `tables`, a list of table names (optional `dataSource`, `maxTables` — default 8, cap 20) | Compact context of the data source's real columns, types and comments |
| `mpsv_explain` | `selectSql`, a single SELECT (optional `dataSource`, `dialect`) | EXPLAIN plan text for seven dialects, with driver notices and index hints |

### Check Before Execution

| Tool | Input | Output |
|------|-------|--------|
| `mpsv_check_sql` | `sql`, one SQL statement | Static write-risk and type check results |
| `mpsv_mapper_check` | mapper XML as `xmlSnippet` or `filePath`, optional `simulate` | Mapper contract check; simulate mode analyzes rendered output for write risks and performance — evidence no static verifier can produce |
| `mpsv_rollback_plan` | `sql`, one INSERT / UPDATE / DELETE (optional `primaryKeyColumns`) | A rollback plan — produced only, never executed |
| `mpsv_perf_advice` | `sql`, one SQL statement | Advice from 20 built-in rules, capped at 30 entries and trimmed by severity when over |

## Verifiers Give Confidence, MCP Gives Evidence

The plugin's checks and hints produce confidence scores — "might be risky", "worth a look". The MCP tools take a different route: they hand the agent the actual executable SQL produced by the rendering chain. For example, `mpsv_mapper_check` goes beyond static contract checking and can analyze rendered output for write risks and performance issues — hard evidence no static verifier can produce. The agent doesn't have to guess; it works from facts.

## A Typical Workflow

Take "have the agent diagnose a slow SQL" as an example — the agent chains these tools as needed:

1. `mpsv_render_sql` fetches the real executable SQL by file and line (parameters filled in, not `?` placeholders)
2. `mpsv_explain` gets the plan for that SELECT — if it hits full-table scans, filesort and similar patterns, `index hints` are appended
3. `mpsv_perf_advice` runs the 20-rule advisory; `mpsv_schema_context` pulls the table's column comments and structure as supporting evidence
4. After the fix, `mpsv_render_sql` re-renders to verify; before touching a write statement, `mpsv_rollback_plan` prepares a rollback plan

Every step is deterministic output: the SQL is a real rendering-chain product, the plan comes straight from the database, the advice traces back to rules — no "gut feeling" involved.

## Usage Notes

- `mpsv_render_sql` renders one statement per call; when a location has multiple candidates it takes the first and says so — multi-statement logs belong to `mpsv_render_logs`
- `mpsv_render_logs`, `mpsv_rollback_plan` and `mpsv_mapper_check` label statement headers with statement names (from a leading `-- Name:` comment), keeping multi-statement output readable
- `mpsv_perf_advice` truncates overly long entries — no unbounded output

## Requirements

- IDEA 2025.2+: the MCP Server is built into the platform, nothing extra to install
- IDEA 2024.3 ~ 2025.1 do not support this feature set (no built-in MCP Server); all other plugin features are unaffected
- Environments without the MCP Server plugin see zero impact: the plugin's MCP registration is skipped entirely

## Settings and Gating

Settings → the "MCP Tools" page provides a gating area:

- Master switch: enable or disable the plugin's MCP functionality as a whole
- Per-tool enable / disable for all ten tools
- "Enable all" / "Disable all" shortcuts

Every change takes effect immediately: the next tool-list refresh or tool call follows the new configuration — no IDE restart needed.

## Read-Only and Safety

All ten tools declare themselves to the agent as read-only, idempotent and non-destructive — safe to let the agent call them autonomously. On top of that:

- SELECT whitelist: entry points that hit the database accept SELECT only — structural judgment plus keyword scanning as two independent checks; anything undecidable is rejected rather than allowed through. String literals are stripped before checking so keywords inside literals can't cause false passes
- Zero dialogs: the MCP call chain never pops a dialog in your IDE — non-compliant requests come back to the agent as error messages, and database connections never prompt for passwords
- Audit trail: every tool call writes an `[MCP-AUDIT]` entry to the IDE log (idea.log)

## Plan and Advice Output

Outputs that touch the database carry a few extras:

- `mpsv_explain` drains stale driver messages from the connection before executing; PostgreSQL NOTICE / WARNING messages come back alongside the plan in a `notices` section; the plan tail appends `index hints` for common inefficiency patterns (full scans on large tables, filesort / temporary, PG Seq Scan) — advisory only, never modifies or executes
- Queries against non-existent tables (AI-generated hallucinated table names are a frequent case) are negatively cached per data source for 30 seconds, so long sessions don't re-scan the whole database for the same phantom name

> Suggestions or issues with the MCP tools? [Feedback pool](/en/about/feedback?category=mcp)

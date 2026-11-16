---
title: "SQL Completion for MyBatis XML and Annotations"
description: "SQL completion in mapper XML and Java SQL annotations — Ctrl+Space for tables, columns, #{} parameters, dynamic tags; real DB columns with a data source."
---

# SQL Code Completion
<GifPlayer src="/demo/code-completion.gif" alt="SQL Code Completion Demo" />

`Ctrl+Space` completion in mapper XML and Java SQL annotation strings.

## Trigger Locations

- SQL strings in mapper XML files
- `@Select` / `@Update` and other annotation strings in Java Mapper interfaces
- Preview dialog input fields

## Completion Types

| Type | Description |
|------|-------------|
| Table names | Inferred from project entity classes |
| Column names | Suggestions by clause position: table names after FROM / JOIN, column names everywhere else; an `alias.` prefix suggests the aliased entity's columns, with comments searchable |
| `#{}` param names | Method parameter names (`@Param` values first, param1..N as fallback) |
| XML dynamic tags | `<if>` / `<where>` / `<foreach>` etc.; for the `collection` attribute of `<foreach>`, when the method takes a single collection parameter with no `@Param`, the candidates include the `collection` / `list` / `array` shortcut names (matching MyBatis parameter-naming semantics) |
| OGNL expressions | Property names in `<if test="...">` |

## Column Candidates & Casing

When the entity column is camelCase (`delFlag`) but the SQL is written in upper snake case, typing `DEL_F` still completes `DEL_FLAG` — column candidates cover all three forms (original / snake / UPPER_SNAKE) and any hit is enough.

Insertion form follows the casing you're typing: upper-case SQL gets upper-case suggestions, lower-case gets lower-case, and mixed or empty prefixes fall back to the entity's original form; every alias is registered as a findable string, so whichever form you type can be searched.

MBG-generated queries are recognized by convention: the argument of `selectByExample(XxxExample)` is a query-condition object and never becomes a fake `xxx_example` "entity" — the plugin looks up the same-package entity `Xxx` per MBG convention for columns, and skips silently when that fails (better nothing than a fake list). When the mapper interface and its generics both fail to resolve, a fallback derives columns by reverse-locating the entity from the FROM / JOIN table names in the statement text — only after both primary entity paths fail.

Opening a mapper XML warms up the table/column context in the background, so the first completion doesn't parse from scratch; the cross-file fragment-name and mybatis-config variable lists are built once per project and refreshed by index state, so long completion sessions in large projects no longer rescan file by file.

## Data-Source Column Completion

With a data source configured (IDEA Ultimate's Database tool window), column completion merges the data source's real columns into the candidate list alongside entity columns — entity columns first, data-source-only columns listed as well; for columns present in both, the comment and type come from the data source, and each candidate's tail text marks the database type. Warm-up runs in the background when the preview opens and when the console is ready, so completion never waits.

<GifPlayer src="/demo/completion-datasource.gif" alt="Inside an INSERT statement in schema.sql, right after the column-list opening parenthesis, typing a letter pops up completion whose first candidates are the data source's real columns (share_scheme_id / station_id), each labelled with its owning table car_device_info and its database type INT" />

After the embedded console runs DDL or a transaction commit (COMMIT / ROLLBACK), the table/column comment cache is invalidated automatically — previewing or completing right after an `ALTER TABLE` no longer hits the stale schema.

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=completion)


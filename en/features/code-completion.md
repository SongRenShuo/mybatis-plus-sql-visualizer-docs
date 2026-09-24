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

## Data-Source Column Completion

With a data source configured (IDEA Ultimate's Database tool window), column completion merges the data source's real columns into the candidate list alongside entity columns — entity columns first, data-source-only columns listed as well; for columns present in both, the comment and type come from the data source, and each candidate's tail text marks the database type. Warm-up runs in the background when the preview opens and when the console is ready, so completion never waits.

After the embedded console runs DDL or a transaction commit (COMMIT / ROLLBACK), the table/column comment cache is invalidated automatically — previewing or completing right after an `ALTER TABLE` no longer hits the stale schema.

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=completion)


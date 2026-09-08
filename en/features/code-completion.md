# SQL Code Completion
<GifPlayer src="/demo/code-completion.svg" alt="SQL Code Completion Demo" />

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
| XML dynamic tags | `<if>` / `<where>` / `<foreach>` etc. |
| OGNL expressions | Property names in `<if test="...">` |

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=completion)


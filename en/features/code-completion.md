# SQL Code Completion
<GifPlayer src="/demo/code-completion.svg" alt="SQL Code Completion Demo" />

`Ctrl+Space` completion in mapper XML and Java SQL annotation strings.

## Trigger Locations

- SQL strings in mapper XML files
- `@Select` / `@Update` annotation strings in Java Mapper interfaces
- Preview dialog input fields

## Completion Types

| Type | Description |
|------|-------------|
| Table names | Inferred from project entity classes |
| Column names | Smart suggestions by clause position (SELECT → column names, WHERE → condition columns) |
| `#{}` param names | Java entity property names |
| XML dynamic tags | `<if>` / `<where>` / `<foreach>` etc. |
| OGNL expressions | Property names in `<if test="...">` |


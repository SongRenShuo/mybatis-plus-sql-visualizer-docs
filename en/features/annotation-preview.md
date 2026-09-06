# Annotation SQL Preview
<GifPlayer src="/demo/annotation-preview.png" alt="Annotation SQL Preview Demo" />

Java Mapper interface annotations `@Select` / `@Update` / `@Delete` / `@Insert` are also fully supported.

## Trigger Method

Gutter icon at the annotation line. Click to preview.

## Supported Annotation Forms

| Form | Description |
|------|-------------|
| `@Select("...")` | Direct SQL string |
| `@Select("<script>...</script>")` | Dynamic SQL with `<script>` tags |
| `@SelectProvider` / `@UpdateProvider` etc. | Provider annotations (dynamic SQL building) |

## Example

```java
@Select("<script>" +
        "SELECT * FROM user " +
        "<where>" +
        "  <if test='name != null'>AND name = #{name}</if>" +
        "  <if test='status != null'>AND status = #{status}</if>" +
        "</where>" +
        "</script>")
List<User> selectByCondition(@Param("name") String name, @Param("status") Integer status);
```

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=annotation)


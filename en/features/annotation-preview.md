# Annotation SQL Preview

Java Mapper interface annotations `@Select` / `@Update` / `@Delete` / `@Insert` are also fully supported.

## Trigger Method

Gutter icon at the annotation line. Click to preview.

## Supported Annotation Forms

| Form | Description |
|------|-------------|
| `@Select("...")` | Direct SQL string |
| `@Select("<script>...</script>")` | Dynamic SQL with `<script>` tags |
| `@SelectProvider` / `@UpdateProvider` etc. | Provider annotations |

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

<GifPlayer src="/demo/annotation-preview.gif" alt="Annotation preview demo" />

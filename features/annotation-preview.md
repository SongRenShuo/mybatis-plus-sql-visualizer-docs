# 注解 SQL 预览

Java Mapper 接口中的 `@Select` / `@Update` / `@Delete` / `@Insert` 注解同样支持预览。

## 触发方式

注解行左侧 gutter 图标，点击即预览。

## 支持的注解形式

| 形式 | 说明 |
|------|------|
| `@Select("...")` | 直接 SQL 字符串 |
| `@Select("<script>...</script>")` | 含 `<script>` 标签的动态 SQL |
| `@SelectProvider` / `@UpdateProvider` 等 | Provider 注解（动态 SQL 构建） |

## 示例

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

<GifPlayer src="/demo/annotation-preview.gif" alt="注解预览演示" />

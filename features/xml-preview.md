# XML 动态 SQL 预览
<GifPlayer src="/demo/placeholder.svg" alt="Demo" />

mapper XML 文件中的动态 SQL 完整预览——按 MyBatis 语义渲染，OGNL 表达式可在面板勾选。

## 触发方式

mapper XML 的 `<select>` / `<update>` / `<delete>` / `<insert>` 行左侧 gutter 图标，点击即预览。

## 支持的动态标签

| 标签 | 说明 |
|------|------|
| `<if>` | 条件渲染，test 表达式可在面板勾选 |
| `<choose>` / `<when>` / `<otherwise>` | 分支选择 |
| `<where>` | 智能 WHERE 拼接（去 AND/OR） |
| `<set>` | 智能 SET 拼接（去逗号） |
| `<foreach>` | 集合迭代，值可在面板编辑 |
| `<bind>` | 变量绑定 |
| `<sql>` + `<include>` | SQL 片段复用 |
| `<trim>` | 自定义修剪 |

## OGNL 表达式面板

动态条件的 OGNL 表达式（如 `name != null and name != ''`）可在左侧面板勾选，对应 SQL 实时变化。

## 示例

```xml
<select id="selectActive" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE #{name}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
    ORDER BY create_time DESC
</select>
```

渲染结果（勾选 name 条件，status 不勾选）：

```sql
SELECT * FROM user
WHERE name LIKE ?
ORDER BY create_time DESC
```


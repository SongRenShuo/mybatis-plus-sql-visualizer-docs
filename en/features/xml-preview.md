# XML Dynamic SQL Preview
<GifPlayer src="/demo/xml-preview.svg" alt="XML Dynamic SQL Preview Demo" />

Complete preview of dynamic SQL in mapper XML — rendered per MyBatis semantics with OGNL expression toggles.

## Trigger Method

Gutter icon at `<select>` / `<update>` / `<delete>` / `<insert>` lines in mapper XML. Click to preview.

## Supported Dynamic Tags

| Tag | Description |
|-----|-------------|
| `<if>` | Conditional rendering, test expressions toggleable in panel |
| `<choose>` / `<when>` / `<otherwise>` | Branch selection |
| `<where>` | Smart WHERE concatenation (strips AND/OR) |
| `<set>` | Smart SET concatenation (strips commas) |
| `<foreach>` | Collection iteration, values editable in panel |
| `<bind>` | Variable binding |
| `<sql>` + `<include>` | SQL fragment reuse |
| `<trim>` | Custom trimming |

## OGNL Expression Panel

OGNL expressions in dynamic conditions (e.g. `name != null and name != ''`) can be toggled in the left panel, with SQL updating in real time.

## Example

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

Rendered result (name toggled on, status off):

```sql
SELECT * FROM user
WHERE name LIKE ?
ORDER BY create_time DESC
```


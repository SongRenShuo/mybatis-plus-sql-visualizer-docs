# XML / HQL Dynamic SQL Preview
<GifPlayer src="/demo/xml-preview.png" alt="XML Dynamic SQL Preview Demo" />

Complete preview of dynamic SQL in mapper XML — rendered per MyBatis semantics with OGNL expression toggles. Hibernate HQL and JPA JPQL previews are supported as well (see below).

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

## HQL / JPQL Preview

The plugin also previews Hibernate HQL and JPA JPQL statically. The most common entry points appear as gutter icons in Java source lines:

| Entry | Location |
|-------|----------|
| Hibernate HQL calls (`session.createQuery(hql)`) | The HQL string line |
| `@Query("...")` annotations (JPQL, incl. `@Modifying` DML) | The annotation line |
| JPA Repository derived methods and CRUD calls | Method declaration / call line |

HQL strings split across multiple lines with `+`, or concatenated via chained assignments, are recognized as well — the gutter icon still appears.

The remaining entry points (`@NamedQuery` / `@NamedQueries` entity-level queries, JPA CriteriaQuery chains, custom DAO HQL query methods) and the full JPA / Hibernate capability set (Repository CRUD write paths, derived queries, Specification, QueryByExample, pagination & sorting) are covered in [JPA / Hibernate SQL Preview](/en/features/jpa-preview).

### SELECT Entity Alias Expansion

In HQL semantics, `SELECT u` means "fetch the whole entity `u`", but emitting it verbatim makes MySQL fail with `[1054] Unknown column 'u' in 'field list'`. The plugin expands bare entity aliases into the entity's column list automatically:

```sql
-- HQL: SELECT u FROM User u WHERE u.status = 1
-- After expansion:
SELECT u.id, u.name, u.status, ... FROM user u WHERE u.status = 1
```

Expansion rules:

- Only bare aliases registered in FROM / JOIN are expanded; DELETE / DISTINCT / subqueries / aggregates / explicit column lists are untouched
- When the query has no SELECT clause, the column list is added automatically
- Falls back to `alias.*` when a JOIN side table or entity metadata is missing

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=xml)


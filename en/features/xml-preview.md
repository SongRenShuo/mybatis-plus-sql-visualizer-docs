# XML / HQL Dynamic SQL Preview
<GifPlayer src="/demo/xml-preview.gif" alt="XML Dynamic SQL Preview Demo" />

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
| `<sql>` + `<include>` | SQL fragment reuse, fully-qualified cross-namespace refid supported |
| `<trim>` | Custom trimming |

### Cross-Namespace Includes

Fully-qualified `refid="other.namespace.fragmentId"` includes expand across files — the preview finds the mapper file whose root `<mapper namespace>` matches and merges the `<sql id>` fragment in at the reference site: dynamic tags inside the fragment (`<if>` / `<foreach>` etc.) render as usual, `${}` dynamic refids are supported, and property substitution plus cycle detection apply the same. When the target can't be resolved the preview continues, with the warning naming the concrete reason: no mapper file for the namespace / no such fragment under that namespace / the same fragment id declared in multiple files (ambiguous — the difference is reported as-is). Bare ids still resolve within the current file only, matching MyBatis runtime behavior.

## OGNL Expression Panel

OGNL expressions in dynamic conditions (e.g. `name != null and name != ''`) can be toggled in the left panel, with SQL updating in real time.

Test expressions beyond the restricted OGNL surface get a dimmed annotation on the condition line: syntax outside the subset (ternaries, static method calls, `new`, etc.) is marked "unsupported expression form", while resolvable syntax containing runtime-degraded calls is marked "contains runtime-degraded calls"; hover for the concrete reason. Common shapes like `list.size()` and `isEmpty()` are never flagged — annotations are hints only, and neither the expansion behavior nor the toggle semantics change.

When an `if` test fails to evaluate, the preview no longer silently expands it as true — a visible error is recorded ("expanded as true; override with the panel toggle"), putting the divergence between preview and runtime on the table.

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

## ${} Injection Banner & Execution Gate

When a preview contains `${}` raw substitution, the panel shows a non-modal banner ("preview contains N ${} direct substitutions — the text is not escaped, mind the SQL injection surface"); it can be dismissed and stays dismissed for the IDE session. "Execute SQL" and "EXPLAIN" pop a confirmation first, noting that raw segments are currently filled with mock values — choosing No aborts; after confirming once, the same panel won't ask again. Copying executable SQL doesn't prompt; instead the output carries a `-- contains ${} raw segments (mock values)` header comment so the risk travels with the artifact.

## Parameter Panel Type Contract

Parameters are typed by signature into categories (text / number / temporal / collection / object), and input rows show matching placeholders — number `42`, date `2026-01-01 12:00:00`, collection `[1, 2, 3]`, object `{"id": 1}`. Invalid number or temporal input gets a dimmed warning at the end of the row — a hint, not a gate; the value still goes into the SQL as typed. Mock placeholder values are dispatched per category. The "Empty parameter fill strategy" radio under "SQL Preview" in settings (NULL literal / empty string, default NULL) decides what a signature-typed parameter row yields when left empty.

## Execution Guards

- **Unbounded-write findings list**: the UPDATE / DELETE execution confirmation lists static-analysis findings when unbounded-write patterns hit — full-table without WHERE, always-true conditions (`1=1` etc.), bare-wildcard `LIKE '%'` and more; with no findings the confirmation text stays unchanged
- **Execution timeout**: the "Execution timeout" setting (seconds, default 30, 0 = unlimited) cancels the statement before reporting the error, so hung queries no longer sit in loading forever
- **Error localization**: execution errors are enriched with SQLState / driver error codes and the reported error position, and a "Locate failing statement" button jumps straight to that statement's start line in the preview source
- **Disconnected DDL probing**: when the connection drops while a CREATE-type DDL runs, the plugin probes in the background whether the object now exists and reports honestly ("exists" / "not detected") — "couldn't check" is never dressed up as "didn't take effect"
- **Multi-statement confirmation**: one-click execution of Log → SQL output runs a single statement directly, while multiple statements pop a candidate-selection overlay
- **`\G` suffix stripping**: a MySQL CLI `\G` suffix (e.g. `SELECT 1\G`) pasted into the preview or console is stripped before execution; `\G` inside comments and string literals is untouched, history keeps the original text, and non-MySQL data sources are never stripped
- **Sessions & data sources**: multiple same-named data sources no longer silently pick the first one; last-used memory matches by UUID exactly (renames don't break it), and shared consoles are identity-probed before reuse

Preview execution, Log → SQL execution and rollback execution share the same confirmation and guard chain.

## Rollback SQL

<GifPlayer src="/demo/xml-preview-rollback.gif" poster="/demo/xml-preview-rollback.png" alt="XML preview rollback SQL demo" />
A "Rollback" button in the preview panel generates inverse SQL for the current INSERT / UPDATE / DELETE: INSERT becomes a primary-key DELETE, UPDATE restores original SET values, DELETE re-inserts by WHERE — shown in a dialog with one-click copy.

## SQL Quick Templates

Select text in a mapper XML or the preview editor and use the "SQL quick templates" context-menu group to run EXPLAIN / COUNT / a 10-row sample in one click (Alt+Shift+E / C / T), going through the native Database console chain.

## Render Annotations & Degradation Banners

- In vertical layout, each UPDATE SET item gets a trailing "column (new) = expression" annotation (self-referencing forms like `a = a + 1` read as the new value as-is), making old-vs-new comparison easier
- The preview panel and the Log → SQL panel embed non-modal degradation banners saying which part wasn't restored, why, and what you can do about it — no more silent truncation

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


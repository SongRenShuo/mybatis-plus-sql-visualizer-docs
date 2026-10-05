# XML / HQL Dynamic SQL Preview

<GifPlayer src="/demo/xml-preview.gif" alt="XML Dynamic SQL Preview Demo" />

Complete preview of dynamic SQL in mapper XML — rendered per MyBatis semantics with OGNL expression toggles. Hibernate HQL and JPA JPQL previews are supported as well (see below).

## Trigger Method

Gutter icon at `<select>` / `<update>` / `<delete>` / `<insert>` lines in mapper XML. Click to preview.

Mapper XMLs from in-house frameworks (root element name not fixed, SQL written inside custom tags as CDATA or text — RFListPage and the like) preview as well: once the first text segment of a leaf tag starts with SELECT / INSERT / UPDATE / DELETE / WITH / REPLACE, the gutter icon appears, with no reliance on tag or root element names.

Settings → "Interface & actions" has a master switch, "Detect SQL embedded in generic XML (leaf tag text/CDATA)", on by default.

::: details HQL carriers in generic XML (When to read: your custom tags contain HQL)
When the carrier tag itself or an ancestor carries `type="hql"` / `"jpql"`, the HQL conversion pipeline handles it (alias-scoped property-to-column mapping applies as usual); if the entity can't be resolved or conversion fails it falls back to showing the original text. The right-click and `Alt+Shift+Q` entries plus the multi-statement picker behave the same as for mapper XML.
:::

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

Fully-qualified `refid="other.namespace.fragmentId"` includes expand across files — the preview finds the mapper file whose namespace matches, takes the `<sql id>` fragment content out and merges it in at the reference site.

Dynamic tags inside the fragment (`<if>` / `<foreach>` etc.) render as usual, `${}` dynamic refids are supported, and property substitution plus cycle detection apply the same.

When the target can't be resolved the preview continues, with the warning naming the concrete reason: no mapper file for the namespace / no such fragment under that namespace / the same fragment id declared in multiple files (ambiguous — the difference is reported as-is). Bare ids still resolve within the current file only, matching MyBatis runtime behavior.

## OGNL Expression Panel

OGNL expressions in dynamic conditions (e.g. `name != null and name != ''`) can be toggled in the left panel, with SQL updating in real time.

When an `if` test fails to evaluate, the preview no longer silently expands it as true — a visible error is recorded ("expanded as true; override with the panel toggle"), putting the divergence between preview and runtime on the table.

::: details Expression annotations (When to read: a dimmed annotation appears on a condition line)
Test expressions beyond the restricted OGNL surface get a dimmed annotation on the condition line: syntax outside the subset (ternaries, static method calls, `new`, etc.) is marked "unsupported expression form", while resolvable syntax containing runtime-degraded calls is marked "contains runtime-degraded calls"; hover for the concrete reason. Common shapes like `list.size()` and `isEmpty()` are never flagged — annotations are hints only, and neither the expansion behavior nor the toggle semantics change.
:::

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

## ${} Direct-Substitution Banner & Execution Confirmation

- When a preview contains `${}` raw substitution, the panel shows a dismissible non-modal banner at the top ("preview contains N ${} direct substitutions — the text is not escaped, mind the SQL injection surface"); once dismissed it stays dismissed for the IDE session
- "Execute SQL" and "EXPLAIN" pop a confirmation first, noting that raw segments are currently filled with mock values — choosing No aborts; after confirming once, the same panel won't ask again
- Copying executable SQL doesn't prompt; instead the output carries a `-- contains ${} raw segments (mock values)` header comment so the risk travels with the artifact

## Parameter Panel

Parameters are typed by signature into categories, and input rows show matching placeholder hints:

| Category | Placeholder hint |
|---------|---------|
| Number | `42` |
| Temporal | `2026-01-01 12:00:00` |
| Collection | `[1, 2, 3]` |
| Object | `{"id": 1}` |

Collection parameters split into multiple values by signature: for a direct `IN (#{taskTypeList})` written without `<foreach>` on a `@Param("taskTypeList") List<String>` parameter, typing `PI,WP` renders `IN ('PI', 'WP')` instead of one lump value.

The "Empty parameter fill strategy" radio under "SQL Preview" in settings (Placeholder `?` (default) / NULL literal / empty string) decides what a signature-typed parameter row yields when left empty. The default keeps the `?` as a to-be-filled hint — NULL silently filters rows away (e.g. `amount >= NULL` never matches), which is easy to miss; switch to NULL / empty string when you need directly executable SQL.

::: details Type recognition boundaries (When to read: a warning shows up or a mock value looks wrong)
- Invalid number or temporal input gets a dimmed warning at the end of the row — a hint, not a gate; the value still goes into the SQL as typed.
- Mock placeholder values are dispatched per category; `BigInteger` counts as a number and `UUID` as text, and when a parameter's type can't be recognized you get a one-time notice before Execute / EXPLAIN (preview itself is not blocked).
- Quoting follows the element kind (`List<String>` quoted, `List<Long>` bare), and newlines or extra spaces between `IN` and `(` are recognized as an IN shape too.
:::

## Execution Guards

- **Unbounded-write findings list**: the UPDATE / DELETE execution confirmation lists static-analysis findings when unbounded-write patterns hit — full-table without WHERE, always-true conditions (`1=1` etc.), bare-wildcard `LIKE '%'` and more; with no findings the confirmation text stays unchanged
- **Execution timeout**: the "Execution timeout" setting (seconds, default 30, 0 = unlimited) cancels the statement before reporting the error, so hung queries no longer sit in loading forever
- **Error localization**: execution errors are enriched with SQLState / driver error codes and the reported error position, and a "Locate failing statement" button jumps straight to that statement's start line in the preview source
- **Disconnected DDL probing**: when the connection drops while a CREATE-type DDL runs, the plugin probes in the background whether the object now exists and reports honestly ("exists" / "not detected") — "couldn't check" is never dressed up as "didn't take effect"
- **Multi-statement confirmation**: one-click execution of Log → SQL output runs a single statement directly, while multiple statements pop a candidate-selection overlay
- **`\G` suffix stripping**: a MySQL CLI `\G` suffix (e.g. `SELECT 1\G`) pasted into the preview or console is stripped before execution; non-MySQL data sources are never stripped
- **Sessions & data sources**: multiple same-named data sources no longer silently pick the first one; last-used memory matches by UUID exactly (renames don't break it), and shared consoles are identity-probed before reuse

::: details Multi-statement and delimiter details (When to read: a stored-procedure script or multi-statement split goes wrong)
Stored-procedure scripts with custom delimiters (`DELIMITER $$`) are collected per delimiter instead of being split at every top-level `;`; IME-stray full-width parentheses (`（` / `）`) in a statement count on the same depth stack as half-width ones, so mixed-pair statements are no longer split into two or merged with the statements after them. `\G` suffix stripping leaves comments and string literals untouched, and history keeps the original text.
:::

Preview execution, Log → SQL execution and rollback execution share the same confirmation and guard chain.

## Rollback SQL

<GifPlayer src="/demo/xml-preview-rollback.gif" alt="Rollback SQL demo" />

"Rollback SQL" (the first item in the preview panel's "More" menu) derives inverse SQL for the currently previewed statement; the dialog states up front whether that derivation can be trusted, then shows the output to copy.

### INSERT: Auto-Generated Rollback

INSERT is the only statement type that gets an automatic rollback: each VALUES row yields `DELETE FROM table WHERE …` with an equality predicate on every column of that row (`NULL` renders as `IS NULL`).

The plugin reads no database metadata, so it has no primary key and the predicate is the whole row — which can match more than one row. The dialog warns about that and offers a `SELECT COUNT(*) FROM table WHERE …` check to run before executing, and flags any `?` placeholders left unfilled separately.

INSERTs without a column list (column names unknown), INSERT … SELECT (pre-execution data unknown) and upserts (they may have modified existing rows, so a DELETE cannot undo them) are refused outright.

### UPDATE / DELETE: Generated from Pasted Query Results

UPDATE and DELETE get no automatic rollback. The plugin has only the SQL text, never the pre-execution values (no before-image), so a derived statement would also wipe out later changes by others.

The dialog says so plainly ("UPDATE cannot be auto-rolled back: original values are unknowable." / "DELETE cannot be auto-rolled back: the deleted data is unknowable."), points to binlog, flashback or backup restore for manual recovery, and offers a snapshot query `SELECT * FROM table [WHERE original WHERE]`:

1. Click "Run snapshot query" to execute it directly — the result lands in the panel's console grid, the row image fetched by your own hands
2. Copy the whole result grid back into the dialog (TSV, first line is the column names)
3. Click "Generate rollback from pasted result": a DELETE original becomes an INSERT that backfills every column, an UPDATE original becomes a reverse UPDATE that also puts the written new values into the WHERE clause as an optimistic-lock check — it only rolls back while the database still holds the written state

Primary-key columns can be filled comma-separated in the input box and apply to UPDATE originals: fill them to locate rows by primary key, leave them empty to mirror the whole old row. Rows or statement volume beyond the limits are truncated with a notice, and "Execute rollback" and "Copy" stay disabled until something has been generated.

### Other Statements and Multi-Statement Judgement

Other statements (SELECT, MERGE, DDL and so on) do not open the dialog at all — they get a message box explaining why. A multi-statement preview is judged as a whole: if any statement is not derivable, no partial rollback is produced, since a half rollback is more dangerous than none.

## SQL Quick Templates

Select text in a mapper XML or the preview editor and use the "SQL quick templates" context-menu group to run EXPLAIN / COUNT / a 10-row sample in one click, going through the native Database console chain. These three actions ship without default shortcuts; bind your own in Settings > Keymap or in the plugin's "Shortcuts" settings section.

## Render Annotations & Degradation Banners

- In vertical layout, each UPDATE SET item gets a trailing "column (new) = expression" annotation (self-referencing forms like `a = a + 1` read as the new value as-is), making old-vs-new comparison easier
- For multi-column dynamic INSERT, the preview labels each VALUES expression / SELECT projection with inlay hints showing the target column name — column-value misalignment is visible at a glance (suppressed when the projection already carries a same-name alias, or when it can't be judged statically)
- The preview panel and the Log → SQL panel embed non-modal degradation banners saying which part wasn't restored, why, and what you can do about it — no more silent truncation

## HQL / JPQL Preview

The plugin also previews Hibernate HQL and JPA JPQL statically. Entries appear as gutter icons on the left of Java source lines:

| Entry | Location |
|-------|----------|
| Hibernate HQL calls (`session.createQuery(hql)` etc.) | The HQL string line |
| `@Query("...")` annotations (JPQL, incl. `@Modifying` DML) | The annotation line |
| JPA Repository derived methods and CRUD methods | Method declaration / call line |

HQL strings split across multiple lines with `+`, or concatenated via chained assignments, are recognized as well — the gutter icon still appears.

The remaining entry points (`@NamedQuery` named queries, JPA CriteriaQuery chains, custom DAO HQL query methods, `.hbm.xml` mapped entities) trigger previews too.

For the full trigger surface and capability set (Repository CRUD write paths, derived queries, Specification, QueryByExample, pagination & sorting), see [JPA / Hibernate SQL Preview](/en/features/jpa-preview).

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

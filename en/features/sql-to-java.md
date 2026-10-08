# SQL → Java Reverse Conversion
<GifPlayer src="/demo/sql-to-java.gif" alt="SQL → Java Reverse Conversion Demo" />

Select SQL text and one-click generate compilable MyBatis-Plus code — supports four Wrapper forms.

## Trigger Methods

| Method | Action |
|--------|--------|
| Right-click menu | Select SQL text → Right-click → `Convert SQL to MP Java Code` |
| Shortcut | `Alt+Shift+J` |
| Sidebar | "SQL → Java" tab, paste and convert |

## Four Wrapper Forms

| Form | Description | Example |
|------|-------------|---------|
| AUTO | Auto-select (default) | Based on SQL complexity |
| QueryWrapper | String columns | `.eq("id", 1001)` |
| LambdaQueryWrapper | Type-safe Lambda | `.eq(DeviceInfoEntity::getId, 1001)` |
| Wrappers | Factory method | `Wrappers.lambdaQuery(...)` |
| MPJLambdaWrapper | JOIN form | `new MPJLambdaWrapper<Entity>().leftJoin(...)` |

Default form is configurable in settings.

## Supported Statement Types

- SELECT (incl. multi-table JOIN, subqueries, aggregation)
- UPDATE (incl. multi-field SET)
- DELETE (incl. multi-condition WHERE)
- INSERT (incl. batch VALUES, `NULL` values)

## Statement Coverage

Beyond JOIN / subqueries / aggregation, the SELECT side also covers shapes that used to lose their semantics:

- `GROUP BY` → `.groupBy(...)`; `HAVING` → `.having("...")` (aggregate expressions passed through verbatim)
- `SELECT DISTINCT` → `.select("DISTINCT ...")`
- `FOR UPDATE` → `.last("FOR UPDATE")` (merged into a single `last` when pagination is also present)
- Aggregate / function columns (`COUNT(*) AS cnt`, `MAX(price)`, …) keep their source text in `.select("COUNT(*) AS cnt")` instead of being expanded into all columns and losing the aggregation
- `INSERT ... NULL` values generate a Java `null`
- `UNION / UNION ALL`: the SQL layer round-trips; MyBatis-Plus core has no `union()` method, so the Java generation layer degrades to a source-text comment

## Dialect Tolerance

Parsing doesn't get blocked by dialect spellings — double-quoted identifiers (`"member"`), `0x` hex literals, backslash string escapes (`'a\'b'`) and `DATE` / `TIMESTAMP '...'` type literals are all recognized. Forms that cannot be mapped statically — arithmetic expressions, `<=>` null-safe comparison, `ILIKE` and the like — degrade to an `apply()` pass-through instead of blocking the conversion; condition values are parameterized too, so `DATE_FORMAT(...) = '2024'` generates `apply("... = {0}", "2024")`, keeping the value separate from the expression.

## Call Class & Return Type

Optional generation context:

- **Call class** (Service / Mapper) — decides the generated call family, e.g. `service.list(wrapper)`, `mapper.selectList(wrapper)`
- **Return type** — one editable field carries every return shape; type any return declaration freely:
  - contains `Map` → the `selectJoinMaps(wrapper)` / paged `selectJoinMapsPage(page, wrapper)` family (JOIN, MPJ) or `selectMaps` / `listMaps` (single table)
  - contains `Object` → the `selectObjs` / `listObjs` family (single table; there is no such method for JOIN, and the error points the way)
  - a class name (VO) → VO semantics via `selectJoinList(Vo.class, wrapper)` + `selectAs` alias driving
  - left empty = auto: an entity is inferred when one exists, otherwise a Map list

The class-picker button beside the field fills in a class from your project, and the fixed candidates include common declarations such as `List<Map<String, Object>>` and `Page<Map<String, Object>>`.

Generated code compiles directly.

## Example

Input SQL:

```sql
SELECT t.id, t.station_id, t.share_scheme_id
FROM device_info t
LEFT JOIN station_info t1 ON t1.device_id = t.id
WHERE t.id = 1001
ORDER BY t1.create_time DESC
```

Generated code (MPJ form):

```java
MPJLambdaWrapper<DeviceInfoEntity> wrapper = new MPJLambdaWrapper<DeviceInfoEntity>()
    .selectAll(DeviceInfoEntity.class)
    .leftJoin(StationInfoEntity.class, StationInfoEntity::getDeviceId, DeviceInfoEntity::getId)
    .eq(DeviceInfoEntity::getId, 1001L)
    .orderByDesc(StationInfoEntity::getCreateTime);
```

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=sql-to-java)


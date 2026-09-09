# SQL → Java Reverse Conversion
<GifPlayer src="/demo/sql-to-java.gif" poster="/demo/sql-to-java.png" alt="SQL → Java Reverse Conversion Demo" />

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
- INSERT (incl. batch VALUES)

## Call Class & VO

Optionally specify:
- Call class (Service / Mapper)
- Return VO type
- Generated code compiles directly

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


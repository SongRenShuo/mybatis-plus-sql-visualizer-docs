# Wrapper → SQL Preview
<GifPlayer src="/demo/placeholder.svg" alt="Demo" />

Statically parse MyBatis-Plus / MPJ calls in Java source code into previewable SQL — no need to launch the project or connect to a database.

## Trigger Methods

| Method | Action |
|--------|--------|
| Right-click menu | Place cursor on Wrapper → Right-click → `Convert to SQL` |
| Shortcut | `Alt+Shift+Q` (macOS `Option+Shift+Q`) |
| Gutter icon | Click the icon at the Wrapper anchor line |

## Supported Wrapper Types

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- String-based `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` JOIN queries
- `service.lambdaQuery()` / `service.lambdaUpdate()` service chains

## Features

### Dynamic Condition Toggles

Boolean-overloaded conditions like `.eq(true, ...)` can be toggled in the left panel, re-rendering SQL in real time.

### Parameter Fill-in

- `?` placeholders replaced with actual values
- LIKE params auto-append `%`
- Quote wrapping based on type (numbers unquoted, strings quoted)

### 9-Dialect Pagination

| Dialect | Syntax |
|---------|--------|
| MySQL / MariaDB / SQLite / H2 | `LIMIT n OFFSET m` |
| PostgreSQL | `LIMIT n OFFSET m` |
| Oracle | `ROWNUM` / `FETCH FIRST` |
| SQL Server | `OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| DM (Dameng) | `LIMIT n OFFSET m` |
| KingBase | `LIMIT n OFFSET m` |

### Safety Warning

UPDATE / DELETE without WHERE shows a red warning:

> ⚠ No WHERE clause — will update/delete all rows in the table!

### Logic Delete Injection

Entities with `@TableLogic` auto-append `AND deleted = value` (configurable, default 0).

### Execute SQL

With IntelliJ IDEA Ultimate + Database plugin, auto-creates a temporary `.sql` file, `Ctrl+Enter` to execute.

## Example

```java
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

Generated SQL:

```sql
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```


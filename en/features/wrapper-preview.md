# Wrapper → SQL Preview
<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper → SQL Preview Demo" />

Statically parse MyBatis-Plus / MPJ calls in Java source code into previewable SQL — no need to launch the project or connect to a database.

## Trigger Methods

| Method | Action |
|--------|--------|
| Gutter icon | **Left-click** the icon at the Wrapper anchor line to preview instantly; **right-click** for a menu with "Preview SQL" and "Recent Executions" |
| Right-click menu | Place cursor on Wrapper → Right-click → `Convert to SQL` |
| Shortcut | `Alt+Shift+Q` (macOS `Option+Shift+Q`) |

Other preview icons (annotation SQL, XML, JPA/HQL, and more) keep the single-click-to-preview behavior.

## Supported Wrapper Types

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- String-based `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` JOIN queries
- `service.lambdaQuery()` / `service.lambdaUpdate()` and similar service chains

## Other ORM / JDBC Styles Supported

Also triggered by inline gutter icons, with the same preview experience:

| Style | Example |
|-------|---------|
| JdbcTemplate string SQL | `jdbcTemplate.queryForList("select * from user where id = ?", 1L)` — named params `:name` filled by name, `StringBuilder` chains aggregated |
| Custom DAO string SQL | gutter icon on call lines with string arguments like `beanCruder.selectList(User.class, "select ...")`; method-name lines whose body contains such calls show one too |
| xbatis (formerly mybatis-mp) | `QueryChain.of(userDao, UserEntity.class).eq(UserEntity::getStatus, 1).toList()` |
| Easy-Query (proxy style) | `easyEntityQuery.queryable(Topic.class).where(o -> o.id().eq("123")).toList()` |
| MyBatis Dynamic SQL | `SelectDSL.select(...).from(userTable).where(id, isEqualTo(1)).build().render(...)` |
| Querydsl | `queryFactory.selectFrom(QUser.user).where(QUser.user.status.eq(1)).fetch()` |

This is the first batch (MVP): common chain queries are covered; rarer method shapes follow what the plugin actually recognizes.

## Features

### Dynamic Condition Toggles

Boolean-overloaded conditions like `.eq(true, ...)` can be toggled in the left panel, re-rendering SQL in real time.

### Parameter Fill-in

- `?` placeholders replaced with actual values
- LIKE params auto-append `%`, producing `LIKE '%value%'`
- Quote wrapping based on field type (numbers unquoted, strings quoted)
- With a data source configured, column names can be calibrated against the data source's real columns (the "Calibrate column names from the data source" setting, on by default)

::: details Column-name calibration boundaries (When to read: entity field names differ from database column names)
When an entity field name differs from the real column name (field `orderID`, column `order_id`), the name is rewritten only when it maps to exactly one column — ambiguous matches stay untouched. With no usable data source, the behavior is identical to having the option off.
:::

### 11-Dialect Pagination

| Dialect | Syntax |
|---------|--------|
| MySQL / MariaDB / SQLite / H2 | `LIMIT n OFFSET m` |
| PostgreSQL / openGauss | `LIMIT n OFFSET m` |
| OceanBase (MySQL mode) | `LIMIT [offset,] n` |
| Oracle | `ROWNUM` / `FETCH FIRST` |
| SQL Server | `OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| DM (Dameng) / KingBase | `LIMIT n OFFSET m` |

Upsert conflict clauses for OceanBase and openGauss also render in their real forms (openGauss uses the MySQL-style `ON DUPLICATE KEY UPDATE`, not PG's `ON CONFLICT`).

### JOIN Diagram

JOIN query previews ship with a relationship diagram rendered by IDEA's native Diagrams engine (the built-in renderer can be restored in settings).

::: details Node column scope and rendering behavior (When to read: diagram nodes show incomplete columns or rendering misbehaves)
JOIN tables are drawn with the same full entity column list as the main table — wide tables over 50 columns keep only primary-key columns, and columns referenced by the SQL are appended after the entity columns. Columns that exist in the data source but are not mapped by the entity are added to the node as well, with the database COMMENT and real type. Column comments come from two sources — entity comments and database COMMENTs — falling back to the database when the entity has none. A loading indicator is visible while rendering; if rendering fails, an error page shows a summary of the cause.
:::

### Safety Warning

UPDATE / DELETE without WHERE shows a red warning:

> ⚠ No WHERE clause — will update/delete all rows in the table!

### Logic Delete Injection

Entities with `@TableLogic` auto-append `AND deleted = value` (the value is configurable in settings, default 0).

### Execute SQL

With IntelliJ IDEA Ultimate + Database plugin, a temporary `.sql` file is created automatically after preview, then executed with `Ctrl+Enter`. The preview dialog is non-modal: when a data source password expires during execution, IDEA's credential prompt is never hidden behind it, so you can type right away. Execution failures are reported inline in the panel instead of a modal dialog interrupting you.

### Real EXPLAIN Plan

The "EXPLAIN" button in the preview panel's button row: pick a data source, click, and the plugin wraps the SQL into an EXPLAIN statement for the current dialect and submits it to the native database console — the real execution plan sits side by side with the panel's static performance-rule annotations. EXPLAIN counts as confirmation-free, so there is no DML confirm dialog.

| Dialect | Rendered Form | Verification |
|---------|---------------|--------------|
| MySQL / MariaDB | `EXPLAIN <sql>` (native table rows) | verified on real DB |
| PostgreSQL | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>` | verified on real DB |
| KingBase | `EXPLAIN (FORMAT JSON) <sql>` | verified on real DB |
| DM (Dameng) | `EXPLAIN <sql>` | verified on real DB |
| H2 | `EXPLAIN PLAN FOR <sql>` | engine-level unit tests |
| SQLite | `EXPLAIN QUERY PLAN <sql>` | engine-level unit tests |
| OceanBase (MySQL mode) | `EXPLAIN <sql>` (table rows) | verified against official docs (real-DB check pending) |
| openGauss | `EXPLAIN (FORMAT JSON) <sql>` | verified on real DB |
| Oracle / SQL Server | not supported yet; clicking shows a fallback hint | — |

Like "Execute SQL", EXPLAIN requires a configured data source (Ultimate's Database tool window); without one you'll be asked to configure it first.

### Recent Executions

Reading a Wrapper chain and wondering what its latest actual execution looked like — right-click the anchor icon and choose "Recent Executions". The plugin searches the log entries captured this session for executions near that spot (same file first, lines within ±30 ranked higher); picking one opens the full SQL preview with parameters filled in.

Prerequisite: log capture is on and has captured executions at that spot; an empty menu item is normal when nothing was captured. See [SQL Log Tool Window](/en/features/sql-log).

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

> Have a suggestion or hit an issue with this feature? [Go to the feedback pool](/en/about/feedback?category=wrapper)

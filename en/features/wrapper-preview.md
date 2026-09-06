# Wrapper → SQL Preview
<GifPlayer src="/demo/wrapper-preview.png" alt="Wrapper → SQL Preview Demo" />

Statically parse MyBatis-Plus / MPJ calls in Java source code into previewable SQL — no need to launch the project or connect to a database.

## Trigger Methods

| Method | Action |
|--------|--------|
| Gutter icon | **Left-click** the icon at the Wrapper anchor line to preview instantly; **right-click** for a menu with "Preview SQL" and "Recent Executions" |
| Right-click menu | Place cursor on Wrapper → Right-click → `Convert to SQL` |
| Shortcut | `Alt+Shift+Q` (macOS `Option+Shift+Q`) |

Other preview icons (annotation SQL, XML, JPA/HQL) keep the single-click-to-preview behavior.

## Supported Wrapper Types

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- String-based `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` JOIN queries
- `service.lambdaQuery()` / `service.lambdaUpdate()` service chains

## Other ORM / JDBC Styles Supported

Also triggered by inline gutter icons, with the same preview experience:

| Style | Example |
|-------|---------|
| JdbcTemplate string SQL | `jdbcTemplate.queryForList("select * from user where id = ?", 1L)` — named params `:name` filled by name, `StringBuilder` chains aggregated |
| Custom DAO string SQL | `beanCruder.selectList(User.class, "select ...")` and other string arguments |
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

With IntelliJ IDEA Ultimate + Database plugin, auto-creates a temporary `.sql` file, `Ctrl+Enter` to execute. The preview dialog is non-modal: when a data source password expires during execution, IDEA's credential prompt is never hidden behind it. Execution failures are reported inline in the panel instead of a modal dialog.

### Real EXPLAIN Plan

The "EXPLAIN" button in the preview panel button row: pick a data source, click, and the plugin wraps the SQL into an EXPLAIN statement for the current dialect and submits it to the native database console — the real execution plan sits side by side with the panel's static performance-rule annotations. EXPLAIN counts as confirmation-free, so there is no DML confirm dialog.

| Dialect | Rendered Form | Verification |
|---------|---------------|--------------|
| MySQL / MariaDB | `EXPLAIN FORMAT=JSON <sql>` | verified on real DB |
| PostgreSQL | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>` | verified on real DB |
| KingBase | `EXPLAIN (FORMAT JSON) <sql>` | verified on real DB |
| DM (Dameng) | `EXPLAIN <sql>` | verified on real DB |
| H2 | `EXPLAIN PLAN FOR <sql>` | engine-level unit tests |
| SQLite | `EXPLAIN QUERY PLAN <sql>` | engine-level unit tests |
| Oracle / SQL Server | not supported yet; clicking shows a fallback hint | — |

Like "Execute SQL", EXPLAIN requires a configured data source (Ultimate's Database tool window); without one you'll be asked to configure it first.

### Test Asset Generation

The "Generate Test" button in the preview panel button row, two shapes to choose from:

1. **SQL regression script**: a `.sql` file with the target SQL and an assertion-query skeleton, written to `<project>/src/test/resources/sql-visualizer/` with a timestamped name — commit it as a regression baseline;
2. **JUnit test skeleton**: a compilable `@Test` method (embedded SQL constant + assertion placeholders) shown in a dialog; copy it into your test class and fill in assertions.

Neither shape generates business Java code or INSERT fixture data; assertions are yours to complete.

### Recent Executions

Reading a Wrapper chain and wondering what its latest actual execution looked like — right-click the anchor icon and choose "Recent Executions". The plugin searches SQL captured this session near that spot (same file first, lines within ±30 ranked higher); picking one opens the full preview with parameters filled in.

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


# FAQ

## Which IDE versions are supported?

IntelliJ IDEA 2024.3 and above (`since-build=243`). Compatible with 2024.3 / 2025.3 / 2026.2 series. Both Community and Ultimate are supported, but "Execute SQL" requires Ultimate + Database plugin.

## Why isn't the gutter icon showing?

The gutter icon appears only at:

- Wrapper chain end lines (where `.eq()` or other terminal calls are)
- mapper XML `<select>` / `<update>` statement lines
- Java Mapper interface `@Select` annotation lines

Ensure the cursor is at one of these positions. If still not showing, check "Show preview SQL icon in gutter" in settings.

## Does it support MyBatis-Plus-Join (MPJ) JOIN queries?

Yes. `MPJLambdaWrapper` and `MPJQueryWrapper` JOIN preview, as well as MPJ-form SQL → Java reverse conversion are all implemented. When selecting MPJ form for reverse conversion, the project needs `mybatis-plus-join` dependency (1.5.6+).

## Is there a difference between preview SQL and actual runtime SQL?

The preview aims to align with MP runtime semantics. The following differences are inherent to static evaluation — semantically equivalent, textually different:

| Difference | Description |
|------------|-------------|
| **Static Constant Inline** | `in(col, DicConstants.A)` static final constants are evaluated inline (preview `IN (1)`); MP runtime renders `IN (?)` |
| **Collection Single Placeholder** | `in(col, collectionVar)` runtime size cannot be statically expanded → preview `IN (?)`; panel supports comma-separated fill-in |
| **Page Literal Calculation** | `page(new Page<>(1, 10), wrapper)` directly calculates `LIMIT 0, 10`; runtime renders `LIMIT ?, ?` |

## Can `?` placeholders be replaced with actual values?

Yes. The left panel input supports comma-separated multi-value fill-in (input `1,2,3` → renders `(1, 2, 3)`). LIKE params auto-append `%`. Quote wrapping is type-aware. "Replace `?` placeholders" is enabled by default; turning off renders variables as `?` too.

## SQL log not capturing SQL?

Troubleshooting steps:

1. Confirm "Capture" button clicked (button changes to "Stop")
2. Confirm app logs contain `Preparing:` / `Parameters:` format
3. If log format is `==> Preparing:`, enable "Mixed prefix" in settings
4. Check if hit by "Remove lines containing" filter rule
5. Confirm logs output to run console (not separate log file)

## Can SQL → Java reverse conversion generate compilable code?

Yes. Generated code is strictly based on MyBatis-Plus public APIs (local jar decompilation as sole authority), no fictional methods. Auto-infers entity classes for Lambda type-safe code; falls back to string-column `QueryWrapper` when entity not found.

## How to switch plugin UI language?

`Settings → Tools → MyBatis-Plus SQL Visualizer → UI Language`. Supports Simplified Chinese / English / Follow System. Plugin language is independent of IDE language; reopen preview dialog to apply.

## Which database dialects are supported?

9 dialects: MySQL, PostgreSQL, Oracle, SQL Server, H2, SQLite, MariaDB, DM (Dameng), KingBase. Pagination and upsert conflict clauses render per dialect differences.

## Shortcut conflicts?

In plugin settings, click "Edit" next to the shortcut to re-record. If conflicting with another plugin, options offer "Use" (coexist) or "Force use" (override). Can also modify in `Settings → Keymap`.

## What to include when reporting issues?

Please submit feedback at [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues). Suggested info:

- Plugin version (build number in settings, one-click copy)
- IDE version (`Help → About`)
- Reproduction steps and sample code
- Related logs or screenshots

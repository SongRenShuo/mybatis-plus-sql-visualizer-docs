# Getting Started

Get up and running with SQL Visualizer in 3 minutes.

## What do you want to do?

Jump straight to your goal — each path pays off in at most three steps:

1. **Preview a Wrapper chain** — install the plugin (see "Installation" below), put the caret on the Wrapper chain's variable declaration line, click the gutter icon or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>, and the popup shows the SQL. The full walkthrough is right below on this page; for advanced usage see [Wrapper → SQL Preview](../features/wrapper-preview.md)
2. **Preview XML dynamic SQL** — open a mapper XML and click the gutter icon next to a `<select>` (or other SQL statement) tag line. See [XML / HQL Dynamic SQL Preview](../features/xml-preview.md)
3. **Preview JPA / HQL** — open the line holding a Repository method, a `@Query` annotation or an HQL string and click the gutter icon. See [JPA / Hibernate SQL Preview](../features/jpa-preview.md)
4. **Watch runtime SQL logs** — with your project running, open the SQL Log tool window and captured SQL arrives with real parameters. See [SQL Log Tool Window](../features/sql-log.md)

## Installation

<Steps :title="''">

### Method 1: Install via IDE Plugin System (Recommended)

1. Open <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd>
2. Search for `SQL Visualizer`
3. Click <kbd>Install</kbd>
4. If the plugin entry does not appear right after install, restart IDEA once; later version updates usually hot-swap without a restart (the offline update channel supports hot-swap as well)

![Searching "SQL Visualizer" in the Marketplace: the first result is this plugin (author SongRenShuo), and the detail pane on the right carries the Install button and the version number](/demo/install-marketplace.png)

### Method 2: Manual Download & Install

1. Download the plugin from [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) or [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)
2. In IDE, open <kbd>Settings</kbd> > <kbd>Plugins</kbd> > <kbd>⚙</kbd> > <kbd>Install Plugin from Disk...</kbd>
3. Select the downloaded plugin package (no extraction needed)
4. If the plugin entry does not appear right after install, restart IDEA once; later version updates usually hot-swap without a restart (the offline update channel supports hot-swap as well)

</Steps>

## First Preview

Once installed, on any MyBatis-Plus Wrapper code:

1. Click the plugin icon in the gutter on the left (it sits on the **variable declaration line**, e.g. the `queryWrapper` line); or put the caret **on any identifier in the chain** (a variable or method name) and use the shortcut
2. Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd> (macOS <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>)
3. Dialog shows the generated SQL

::: tip The caret must sit on an identifier — not on leading indentation
The shortcut requires the caret to be **on a concrete code element** — a variable name such as `queryWrapper`, a method name such as `eq`, or the chain call `.list()` all count; Parking it in the leading whitespace only yields a "no previewable SQL source at caret" notice; and the `.eq/.ge` in-chain lines carry **no gutter icon by design** (icons mark the variable declaration line only), so clicking the icon is the more forgiving entry point.
:::


<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper preview demo: cursor on a Wrapper chain, SQL generated in a popup" />

<code-group>
<div title="Java Code">

```java
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

</div>
<div title="Generated SQL">

```sql
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```

</div>
</code-group>

Once you can see the SQL, there is a bit more to try in the preview panel: the "EXPLAIN" button wraps the SQL into an EXPLAIN statement for the current dialect and submits it to the native database console, showing the real execution plan (requires IntelliJ IDEA Ultimate with a configured data source).

## Next Steps

- [Configuration](./configuration.md) — Learn all configurable options
- [Features](../features/wrapper-preview.md) — Deep dive into each feature
- [FAQ](./faq.md) — Troubleshoot common issues

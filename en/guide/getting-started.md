# Getting Started

Get up and running with SQL Visualizer in 3 minutes.

## Installation

<Steps :title="''">

### Method 1: Install via IDE Plugin System (Recommended)

1. Open <kbd>Settings/Preferences</kbd> > <kbd>Plugins</kbd> > <kbd>Marketplace</kbd>
2. Search for `SQL Visualizer`
3. Click <kbd>Install</kbd>
4. Restart IDE

### Method 2: Manual Download & Install

1. Download the plugin from [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) or [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)
2. In IDE, open <kbd>Settings</kbd> > <kbd>Plugins</kbd> > <kbd>⚙</kbd> > <kbd>Install Plugin from Disk...</kbd>
3. Select the downloaded plugin package (no extraction needed)
4. Restart IDE

</Steps>

## First Preview

Once installed, on any MyBatis-Plus Wrapper code:

1. Place cursor on the Wrapper chain (e.g. the line with `.eq()`)
2. Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd> (macOS <kbd>Option</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd>)
3. Dialog shows the generated SQL

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

## Next Steps

- [Configuration](./configuration.md) — Learn all configurable options
- [Features](../features/wrapper-preview.md) — Deep dive into each feature
- [FAQ](./faq.md) — Troubleshoot common issues

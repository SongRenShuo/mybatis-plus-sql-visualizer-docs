---
layout: home
title: MyBatis-Plus SQL Visualizer
titleTemplate: false

hero:
  name: MyBatis-Plus SQL Visualizer
  text: IntelliJ IDEA Plugin
  tagline: "Wrapper chain, XML/annotation dynamic SQL live preview (incl. MPJ JOIN), console log restore, SQL to Java reverse conversion. No more log digging."
  image:
    src: /logo.svg
    alt: MyBatis-Plus SQL Visualizer
  actions:
    - theme: brand
      text: "Install — Free"
      link: https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer
    - theme: alt
      text: "View Docs"
      link: /en/guide/getting-started

features:
  - icon: ⚡
    title: Wrapper → SQL Live Preview
    details: Full static parsing of LambdaQueryWrapper / MPJLambdaWrapper without launching the project. Toggle dynamic conditions, fill parameters, 9 database dialects
    link: /en/features/wrapper-preview
  - icon: 📄
    title: XML / Annotation Dynamic SQL Preview
    details: mapper XML dynamic tags (if / choose / foreach) rendered per MyBatis semantics. @Select / @Update annotations fully supported with OGNL toggles
    link: /en/features/xml-preview
  - icon: 🔗
    title: MPJ JOIN Reverse Parsing
    details: Complete MPJLambdaWrapper support — 8 JOIN forms, selectAll / selectAs / union, main-table logic-delete auto injection
    link: /en/features/wrapper-preview
  - icon: 🔄
    title: SQL → Java Reverse Conversion
    details: One-click SQL to compilable MyBatis-Plus code (QueryWrapper / Lambda / Wrappers / MPJ). Supports CRUD and multi-table JOIN
    link: /en/features/sql-to-java
  - icon: 🪵
    title: Console Log One-Click Restore
    details: Auto-capture Preparing / Parameters logs from run console, restore executable SQL. Paste entire log blocks for batch restore
    link: /en/features/sql-log
  - icon: 📊
    title: Batch Operation Panel
    details: save / updateBatchById SQL expanded by column with per-column toggles. saveOrUpdate conflict clause rendered per dialect (MySQL ON DUPLICATE KEY / PG ON CONFLICT)
    link: /en/features/batch-operation

style:
  padding: 48px 0
---

<script setup>
import BadgeBar from '../.vitepress/theme/components/BadgeBar.vue'
import CodeTabs from '../.vitepress/theme/components/CodeTabs.vue'

const codeExamples = [
  {
    label: 'Query',
    lang: 'java',
    code: `LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);

// Press Alt+Shift+Q to preview SQL
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL`
  },
  {
    label: 'Update',
    lang: 'java',
    code: `LambdaUpdateWrapper<DeviceInfoEntity> update = new LambdaUpdateWrapper<DeviceInfoEntity>()
    .set(DeviceInfoEntity::getStationId, 101L)
    .eq(DeviceInfoEntity::getId, 1001L);

// Red warning if no WHERE clause
UPDATE device_info_entity
SET station_id = 101
WHERE id = 1001`
  },
  {
    label: 'JOIN',
    lang: 'java',
    code: `MPJLambdaWrapper<DeviceInfoEntity> wrapper = new MPJLambdaWrapper<DeviceInfoEntity>()
    .selectAll(DeviceInfoEntity.class)
    .leftJoin(StationInfoEntity.class, StationInfoEntity::getDeviceId, DeviceInfoEntity::getId)
    .eq(DeviceInfoEntity::getId, 1001L)
    .orderByDesc(StationInfoEntity::getCreateTime);

SELECT t.id, t.station_id, t.share_scheme_id
FROM device_info t
LEFT JOIN station_info t1 ON t1.device_id = t.id
WHERE t.id = 1001
ORDER BY t1.create_time DESC`
  },
  {
    label: 'Reverse',
    lang: 'sql',
    code: `-- Select SQL -> Right-click -> Convert SQL to MP Java Code
-- Alt+Shift+J or sidebar "SQL -> Java" tab

SELECT t.id, t.station_id, t.share_scheme_id
FROM device_info t
LEFT JOIN station_info t1 ON t1.device_id = t.id
WHERE t.id = 1001
ORDER BY t1.create_time DESC

// -> Generates MPJLambdaWrapper code (configurable default form)`
  }
]
</script>

<BadgeBar />

<CodeTabs :tabs="codeExamples" />

## Feature Matrix

### SQL Preview

| Feature | Trigger | Scope |
|---------|---------|-------|
| Wrapper → SQL | gutter icon / right-click / `Alt+Shift+Q` | `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper` / `QueryWrapper` / `MPJLambdaWrapper` JOIN / `service.lambdaQuery()` chains |
| XML Dynamic SQL | gutter icon on `<select>` etc. | `if` / `choose` / `where` / `set` / `foreach` / `bind` / `sql`+`include`; OGNL toggles |
| Annotation SQL | gutter icon on annotation | `@Select` / `@Update` / `@Delete` / `@Insert` (incl. `<script>` & Provider) |
| Parameter Replace | panel input | `?` placeholder → actual value; LIKE auto `%`; type-aware quoting |

### SQL Log & Reverse

| Feature | Trigger | Description |
|---------|---------|-------------|
| Auto Capture | sidebar "Capture" button | Monitor console `Preparing:` / `Parameters:`; mixed-prefix tolerant matching |
| Log → SQL | sidebar "Log → SQL" tab | Paste entire log for batch restore; multi-statement auto-split |
| SQL → Java | right-click / `Alt+Shift+J` / sidebar | 4 forms (QueryWrapper / Lambda / Wrappers / MPJ); configurable default |

### Other

| Feature | Description |
|---------|-------------|
| SQL Completion | panel + mapper XML/annotation `Ctrl+Space`: table/column names, `#{}` params, XML tags |
| Logic Delete Injection | `@TableLogic` entity auto appends `AND deleted = value` (configurable) |
| UPDATE/DELETE Warning | Red warning when no WHERE clause — full-table operation risk |
| Update Check | Settings page one-click check, background download & install |

---

## Get Started

<div style="text-align: center; padding: 48px 0 24px;">
  <p style="font-size: 18px; color: var(--vp-c-text-2); margin-bottom: 24px;">
    Supports IntelliJ IDEA 2024.3+, install and go
  </p>
  <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
    <a href="https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer" class="mp-cta mp-cta--primary">
      🚀 Install from Marketplace
    </a>
    <a href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer" class="mp-cta mp-cta--secondary">
      ⭐ Gitee Repo
    </a>
  </div>
</div>

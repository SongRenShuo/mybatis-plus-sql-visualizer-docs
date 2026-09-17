---
layout: home
title: SQL Visualizer
titleTemplate: false

hero:
  name: SQL Visualizer
  text: IntelliJ IDEA Plugin
  tagline: "See the exact SQL your code will run — before the server starts. Wrapper chain, XML/annotation/HQL dynamic SQL live preview (incl. MPJ JOIN), real EXPLAIN plans, console log restore with precise jump-to-source, SQL to Java reverse conversion. No more log digging. Updates hot-swap into the running IDE — no restart; fully offline-capable for intranet environments."
  image:
    src: /logo.svg
    alt: SQL Visualizer
  actions:
    - theme: brand
      text: "Install — Free"
      link: https://plugins.jetbrains.com/plugin/33633-sql-visualizer
    - theme: alt
      text: "View Docs"
      link: /en/guide/getting-started

# Feature cards moved to .vitepress/theme/data/homeHighlights.js (enCards), rendered by EnHomeFeatures
---

<script setup>
import BadgeBar from '../.vitepress/theme/components/BadgeBar.vue'
import CodeTabs from '../.vitepress/theme/components/CodeTabs.vue'
import EnHomeFeatures from '../.vitepress/theme/components/home/EnHomeFeatures.vue'
import EnFeatureMatrix from '../.vitepress/theme/components/home/EnFeatureMatrix.vue'

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

<!-- Feature cards render before the badge bar, matching the original home layout order (VPFeatures preceded all body content) -->
<EnHomeFeatures />

<BadgeBar />

<CodeTabs :tabs="codeExamples" />

## Feature Matrix

<!-- Three matrix groups (SQL Preview / SQL Log & Reverse / Other) come from homeHighlights.js (enFeatureMatrix) -->
<EnFeatureMatrix />

---

## Get Started

<div style="text-align: center; padding: 48px 0 24px;">
  <p style="font-size: 18px; color: var(--vp-c-text-2); margin-bottom: 24px;">
    Supports IntelliJ IDEA 2024.3+, install and go
  </p>
  <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
    <a href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer" class="mp-cta mp-cta--primary">
      🚀 Install from Marketplace
    </a>
    <a href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer" class="mp-cta mp-cta--secondary">
      ⭐ Gitee Repo
    </a>
  </div>
</div>

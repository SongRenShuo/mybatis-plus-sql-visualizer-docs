---
layout: home
title: MyBatis-Plus SQL Visualizer
titleTemplate: false

hero:
  name: MyBatis-Plus SQL Visualizer
  text: IntelliJ IDEA 插件
  tagline: "Wrapper 链、XML/注解动态 SQL 实时预览（含 MPJ 联表 JOIN），控制台日志一键还原，SQL 反向转 Java 代码。告别翻日志、手拼参数。"
  image:
    src: /logo.svg
    alt: MyBatis-Plus SQL Visualizer
  actions:
    - theme: brand
      text: "获取插件 — 免费"
      link: https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer
    - theme: alt
      text: "查看文档"
      link: /guide/getting-started

features:
  - icon: ⚡
    title: Wrapper → SQL 实时预览
    details: LambdaQueryWrapper / MPJLambdaWrapper 等全类型静态解析，无需启动项目。动态条件勾选、参数回填、9 种方言分页渲染
    link: /features/wrapper-preview
  - icon: 📄
    title: XML / 注解动态 SQL 预览
    details: mapper XML 的 if / choose / foreach 等全动态标签按 MyBatis 语义渲染，@Select / @Update 等注解同样支持，OGNL 表达式面板勾选
    link: /features/xml-preview
  - icon: 🔗
    title: MPJ 联表 JOIN 反向解析
    details: MPJLambdaWrapper 联表查询完整支持，join 8 形态、selectAll / selectAs / union 全覆盖，联表主表逻辑删除自动注入
    link: /features/wrapper-preview
  - icon: 🔄
    title: SQL → Java 反向转换
    details: 选中 SQL 一键生成可编译的 MyBatis-Plus 代码（QueryWrapper / Lambda / Wrappers / MPJ 四形态），支持增删改查与多表 JOIN
    link: /features/sql-to-java
  - icon: 🪵
    title: 控制台日志一键还原
    details: 自动捕获运行控制台 Preparing / Parameters 日志，还原成可执行 SQL。粘贴整段日志批量还原，多组语句自动分隔
    link: /features/sql-log
  - icon: 📊
    title: 批量操作参数面板
    details: save / updateBatchById 等批量 SQL 按列展开逐列勾选。saveOrUpdate 冲突子句按方言差异渲染（MySQL ON DUPLICATE KEY / PG ON CONFLICT）
    link: /features/batch-operation

style:
  padding: 48px 0
---

<script setup>
import CodeTabs from './.vitepress/theme/components/CodeTabs.vue'

const codeExamples = [
  {
    label: '查询',
    lang: 'java',
    code: `LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);

// 按 Alt+Shift+Q 预览 SQL
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL`
  },
  {
    label: '更新',
    lang: 'java',
    code: `LambdaUpdateWrapper<DeviceInfoEntity> update = new LambdaUpdateWrapper<DeviceInfoEntity>()
    .set(DeviceInfoEntity::getStationId, 101L)
    .eq(DeviceInfoEntity::getId, 1001L);

// 无 WHERE 时红色警示全表更新
UPDATE device_info_entity
SET station_id = 101
WHERE id = 1001`
  },
  {
    label: '联表',
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
    label: '反向转换',
    lang: 'sql',
    code: `-- 选中 SQL → 右键 → Convert SQL to MP Java Code
-- 按 Alt+Shift+J 或侧边栏 "SQL → Java" tab

SELECT t.id, t.station_id, t.share_scheme_id
FROM device_info t
LEFT JOIN station_info t1 ON t1.device_id = t.id
WHERE t.id = 1001
ORDER BY t1.create_time DESC

// → 生成 MPJLambdaWrapper 代码（可配置默认形态）`
  }
]
</script>

<CodeTabs :tabs="codeExamples" />

## 功能对照矩阵

### SQL 预览

| 功能 | 触发方式 | 支持范围 |
|------|---------|---------|
| Wrapper → SQL | gutter 图标 / 右键 / `Alt+Shift+Q` | `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper` / 字符串版 `QueryWrapper` / `MPJLambdaWrapper` 联表 / `service.lambdaQuery()` 等服务链 |
| XML 动态 SQL | `<select>` 等行 gutter 图标 | `if` / `choose` / `where` / `set` / `foreach` / `bind` / `sql`+`include` 等全动态标签；OGNL 表达式面板勾选 |
| 注解 SQL | 注解行 gutter 图标 | `@Select` / `@Update` / `@Delete` / `@Insert`（含 `<script>` 与 Provider 注解） |
| 参数替换 | 面板左侧输入框 | `?` 占位符替换为实际值；LIKE 自动拼百分号；按字段类型加引号 |

### SQL 日志与反向转换

| 功能 | 触发方式 | 说明 |
|------|---------|------|
| 自动捕获 | 侧边栏「捕捉」按钮 | 监听控制台 `Preparing:` / `Parameters:` 还原可执行 SQL；混合前缀宽容匹配 |
| 日志 → SQL | 侧边栏「Log → SQL」tab | 粘贴整段日志批量还原；多组语句自动分隔 |
| SQL → Java | 右键 / `Alt+Shift+J` / 侧边栏 | 四形态输出（QueryWrapper / Lambda / Wrappers / MPJ）；默认形态可配置 |

### 其他能力

| 功能 | 说明 |
|------|------|
| SQL 代码补全 | 预览面板 + mapper XML/注解 SQL 内 `Ctrl+Space` 补全：表名、列名、`#{}` 参数名、XML 动态标签 |
| 逻辑删除注入 | 实体含 `@TableLogic` 时自动追加 `AND deleted = 值`（值可配置） |
| UPDATE/DELETE 警示 | 无 WHERE 条件时红色警示全表操作风险 |
| 检查更新 | 设置页一键检查更新，后台下载安装（重启生效） |

---

## 开始使用

<div style="text-align: center; padding: 48px 0 24px;">
  <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 24px;">
    支持 IntelliJ IDEA 2024.3 及以上版本，安装即用
  </p>
  <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
    <a href="https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer" class="mp-cta mp-cta--primary">
      🚀 获取插件
    </a>
    <a href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer" class="mp-cta mp-cta--secondary">
      ⭐ Gitee 仓库
    </a>
  </div>
</div>

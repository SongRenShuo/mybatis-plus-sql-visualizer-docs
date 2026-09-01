# Wrapper → SQL 预览

<GifPlayer src="/demo/wrapper-preview.svg" alt="Wrapper → SQL 预览演示" />

把 Java 源码中的 MyBatis-Plus / MPJ 调用**静态解析为可预览 SQL**——无需启动项目、无需连接数据库。

## 触发方式

| 方式 | 操作 |
|------|------|
| 右键菜单 | 光标置于 Wrapper 上 → 右键 → `Convert to SQL` |
| 快捷键 | `Alt+Shift+Q`（macOS `Option+Shift+Q`） |
| gutter 图标 | Wrapper 锚点行左侧图标，点击弹窗 |

## 支持的 Wrapper 类型

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- 字符串版 `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` 联表查询
- `service.lambdaQuery()` / `service.lambdaUpdate()` 等服务链

## 功能特性

### 动态条件勾选

`.eq(true, ...)` 等布尔重载条件可在左侧面板勾选/取消，SQL 实时重渲染。

### 参数回填

- `?` 占位符替换为实际值
- LIKE 参数自动拼百分号
%` → ` LIKE '%value%'`
- 按字段类型决定是否加引号（数值类型不加引号，字符串加引号）

### 9 种方言分页渲染

| 方言 | 分页语法 |
|------|---------|
| MySQL / MariaDB / SQLite / H2 | `LIMIT n OFFSET m` |
| PostgreSQL | `LIMIT n OFFSET m` |
| Oracle | `ROWNUM` / `FETCH FIRST` |
| SQL Server | `OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| DM（达梦） | `LIMIT n OFFSET m` |
| KingBase（金仓） | `LIMIT n OFFSET m` |

### 安全警示

UPDATE / DELETE 无 WHERE 条件时，弹窗红色警示：

> ⚠ 无 WHERE 条件，将更新/删除全表数据！

### 逻辑删除注入

实体含 `@TableLogic` 时自动追加 `AND deleted = 值`（值可在设置页配置，默认 0）。

### 执行 SQL

IntelliJ IDEA Ultimate + Database 插件环境下，预览后自动创建临时 .sql 文件，`Ctrl+Enter` 执行。预览弹窗为非模态窗口，执行时如数据源密码过期，IDEA 的密码输入框不会被弹窗遮挡，可直接输入。

## 示例

```java
LambdaQueryWrapper<DeviceInfoEntity> wrapper = new LambdaQueryWrapper<DeviceInfoEntity>()
    .eq(DeviceInfoEntity::getId, 1001L)
    .isNotNull(DeviceInfoEntity::getStationId);
```

生成的 SQL：

```sql
SELECT id, station_id, share_scheme_id
FROM device_info_entity
WHERE id = 1001
    AND station_id IS NOT NULL
```

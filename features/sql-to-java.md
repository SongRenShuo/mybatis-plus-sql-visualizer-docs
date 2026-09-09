# SQL → Java 反向转换
<GifPlayer src="/demo/sql-to-java.gif" poster="/demo/sql-to-java.png" alt="SQL → Java 反向转换演示" />

选中 SQL 文本一键生成可编译的 MyBatis-Plus 代码——支持四种 Wrapper 形态。

## 触发方式

| 方式 | 操作 |
|------|------|
| 右键菜单 | 选中 SQL 文本 → 右键 → `Convert SQL to MP Java Code` |
| 快捷键 | `Alt+Shift+J` |
| 侧边栏 | 「SQL → Java」tab 粘贴即转 |

## 四种 Wrapper 形态

| 形态 | 说明 | 示例 |
|------|------|------|
| AUTO | 自动选择（默认） | 根据 SQL 复杂度自动判断 |
| QueryWrapper | 字符串列 | `.eq("id", 1001)` |
| LambdaQueryWrapper | 类型安全 Lambda | `.eq(DeviceInfoEntity::getId, 1001)` |
| Wrappers | 工厂方法 | `Wrappers.lambdaQuery(...)` |
| MPJLambdaWrapper | 联表形态 | `new MPJLambdaWrapper<Entity>().leftJoin(...)` |

默认形态可在设置页配置。

## 支持的语句类型

- SELECT（含多表 JOIN、子查询、聚合）
- UPDATE（含多字段 SET）
- DELETE（含多条件 WHERE）
- INSERT（含批量 VALUES）

## 调用类与 VO

可选指定：
- 调用类（Service / Mapper）
- 返回 VO 类型
- 生成的代码可直接编译

## 示例

输入 SQL：

```sql
SELECT t.id, t.station_id, t.share_scheme_id
FROM device_info t
LEFT JOIN station_info t1 ON t1.device_id = t.id
WHERE t.id = 1001
ORDER BY t1.create_time DESC
```

生成代码（MPJ 形态）：

```java
MPJLambdaWrapper<DeviceInfoEntity> wrapper = new MPJLambdaWrapper<DeviceInfoEntity>()
    .selectAll(DeviceInfoEntity.class)
    .leftJoin(StationInfoEntity.class, StationInfoEntity::getDeviceId, DeviceInfoEntity::getId)
    .eq(DeviceInfoEntity::getId, 1001L)
    .orderByDesc(StationInfoEntity::getCreateTime);
```

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=sql-to-java)

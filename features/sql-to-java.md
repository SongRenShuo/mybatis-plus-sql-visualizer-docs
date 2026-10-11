# SQL → Java 反向转换
<GifPlayer src="/demo/sql-to-java.gif" alt="SQL → Java 反向转换演示" />

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
- INSERT（含批量 VALUES、`NULL` 值）

## 覆盖的语句能力

SELECT 侧除 JOIN / 子查询 / 聚合之外，还覆盖这些此前会丢失语义的写法：

- `GROUP BY` → `.groupBy(...)`；`HAVING` → `.having("...")`（聚合表达式原样透传）
- `SELECT DISTINCT` → `.select("DISTINCT ...")`
- `FOR UPDATE` → `.last("FOR UPDATE")`（与分页同时存在时合并为单个 `last`）
- 聚合 / 函数列（`COUNT(*) AS cnt`、`MAX(price)` 等）收集原文生成 `.select("COUNT(*) AS cnt")`，不再整列展开把聚合丢掉
- `INSERT ... NULL` 值生成 Java 的 `null`
- `UNION / UNION ALL`：SQL 层往返可还原；MyBatis-Plus 核心没有 `union()` 方法，Java 生成层降级为原文注释提示

## 方言宽容

解析不因方言写法挡路——双引号标识符（`"member"`）、`0x` 十六进制字面量、反斜杠字符串转义（`'a\'b'`）、`DATE` / `TIMESTAMP '...'` 类型字面量都可识别。算术表达式、`<=>` 空安全比较、`ILIKE` 等静态无法映射的形态一律降级成 `apply()` 透传，不阻断转换；条件值也做参数化——`DATE_FORMAT(...) = '2024'` 这类形态生成 `apply("... = {0}", "2024")`，值与会变化的表达式分离。

## 调用类与返回类型

可选的生成上下文：

- **调用类**（Service / Mapper）——决定生成的调用族，如 `service.list(wrapper)`、`mapper.selectList(wrapper)`
- **返回类型**——一个可编辑字段承载全部返回形态，自由键入任意返回声明：
  - 含 `Map` → `selectJoinMaps(wrapper)` / 分页 `selectJoinMapsPage(page, wrapper)`（JOIN，MPJ）或单表 `selectMaps` / `listMaps` 族
  - 含 `Object` → `selectObjs` / `listObjs` 族（单表；JOIN 场景没有对应方法，会报错指路）
  - 写类名（VO）→ `selectJoinList(Vo.class, wrapper)` + `selectAs` 别名驱动
  - 留空 = 自动：有实体推断实体 / VO，无实体推断 Map 列表

字段右侧的选类按钮可从项目里挑一个类填入；固定候选里还带了 `List<Map<String, Object>>`、`Page<Map<String, Object>>` 等常用声明。

生成的代码可直接编译。

<GifPlayer src="/demo/sql-to-java-return-type.gif" alt="贴入 GROUP BY 聚合 SQL 转换生成 Wrapper 链，返回类型选 List<Map<String, Object>> 后调用行变为 this.listMaps(wrapper)" />

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

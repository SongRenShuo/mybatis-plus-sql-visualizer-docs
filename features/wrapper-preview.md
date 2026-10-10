# Wrapper → SQL 预览

<GifPlayer src="/demo/wrapper-preview.gif" alt="Wrapper → SQL 预览演示" />

把 Java 源码中的 MyBatis-Plus / MPJ 调用**静态解析为可预览 SQL**——无需启动项目、无需连接数据库。

## 触发方式

| 方式 | 操作 |
|------|------|
| gutter 图标 | Wrapper 锚点行左侧图标，**左键**直接弹出 SQL 预览；**右键**弹菜单可选「预览 SQL」或「最近执行记录」 |
| 右键菜单 | 光标置于 Wrapper 上 → 右键 → `Convert to SQL` |
| 快捷键 | `Alt+Shift+Q`（macOS `Option+Shift+Q`） |

其他预览图标（注解 SQL、XML、JPA/HQL 等）仍是单击直接预览。

## 支持的 Wrapper 类型

- `LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper`
- 字符串版 `QueryWrapper` / `UpdateWrapper` / `DeleteWrapper`
- `MPJLambdaWrapper` / `MPJQueryWrapper` 联表查询
- `service.lambdaQuery()` / `service.lambdaUpdate()` 等服务链

## 支持的其他 ORM / JDBC 写法

同样以行内 gutter 图标触发，预览体验一致：

| 写法 | 示例 |
|------|------|
| JdbcTemplate 字符串 SQL | `jdbcTemplate.queryForList("select * from user where id = ?", 1L)`，命名参数 `:name` 按名回填，`StringBuilder` 拼接自动聚合 |
| 自研 DAO 字符串 SQL | `beanCruder.selectList(User.class, "select ...")` 等字符串实参调用行出图标；方法定义名行（方法体内有此类调用）同样出图标 |
| xbatis（原 mybatis-mp） | `QueryChain.of(userDao, UserEntity.class).eq(UserEntity::getStatus, 1).toList()` |
| Easy-Query（proxy 风格） | `easyEntityQuery.queryable(Topic.class).where(o -> o.id().eq("123")).toList()` |
| MyBatis Dynamic SQL | `SelectDSL.select(...).from(userTable).where(id, isEqualTo(1)).build().render(...)` |
| Querydsl | `queryFactory.selectFrom(QUser.user).where(QUser.user.status.eq(1)).fetch()` |

以上均为第一阶段支持（MVP）：常见链式查询已覆盖，个别冷门方法形态以插件实际识别为准。

## 功能特性

### 动态条件勾选

`.eq(true, ...)` 等布尔重载条件可在左侧面板勾选/取消，SQL 实时重渲染。

### 参数回填

- `?` 占位符替换为实际值
- LIKE 参数自动拼百分号，`LIKE '%value%'`
- 按字段类型决定是否加引号（数值类型不加引号，字符串加引号）
- 配置数据源后可按数据源真实列集合校正列名（设置页「按数据源校正列名」，默认开）

::: details 列名校正边界（何时看：实体字段名与库列名不一致时）
实体字段名与库真实列名不一致（字段 `orderID`、列为 `order_id`）时，仅在能唯一确定是哪一列才改写，歧义保持原样；无可用数据源时与关闭该开关完全一致。
:::

### 11 种方言分页渲染

| 方言 | 分页语法 |
|------|---------|
| MySQL / MariaDB / SQLite / H2 | `LIMIT n OFFSET m` |
| PostgreSQL / openGauss | `LIMIT n OFFSET m` |
| OceanBase（MySQL 模式） | `LIMIT [offset,] n` |
| Oracle | `ROWNUM` / `FETCH FIRST` |
| SQL Server | `OFFSET m ROWS FETCH NEXT n ROWS ONLY` |
| DM（达梦）/ KingBase（金仓） | `LIMIT n OFFSET m` |

OceanBase 与 openGauss 的 upsert 冲突子句亦按各自真实形态渲染（openGauss 实为 `ON DUPLICATE KEY UPDATE` MySQL 形态，非 PG 的 `ON CONFLICT`）。

### JOIN 关系图

联表查询预览附带 JOIN 关系图，走 IDEA 原生 Diagrams 引擎渲染（设置页可切回自绘渲染）。

::: details 节点列口径与渲染行为（何时看：关系图节点列不全或渲染异常时）
JOIN 表与主表同口径绘制实体整表列——超过 50 列的宽表只留主键列，SQL 引用到的列追加在实体列之后；数据源里存在而实体未映射的列也会补进节点，带数据库 COMMENT 与真实类型。列注释来自实体注释与数据库 COMMENT 两路，实体没写注释时取数据库。渲染期间显示加载指示，渲染失败时落错误页并显示原因摘要。
:::

### 安全警示

UPDATE / DELETE 无 WHERE 条件时，弹窗红色警示：

> ⚠ 无 WHERE 条件，将更新/删除全表数据！

### 逻辑删除注入

实体含 `@TableLogic` 时自动追加 `AND deleted = 值`（值可在设置页配置，默认 0）。

### 执行 SQL

IntelliJ IDEA Ultimate + Database 插件环境下，预览后自动创建临时 .sql 文件，`Ctrl+Enter` 执行。预览弹窗为非模态窗口，执行时如数据源密码过期，IDEA 的密码输入框不会被弹窗遮挡，可直接输入。执行失败时错误直接显示在面板内，不再弹模态框打断操作。

### EXPLAIN 真实执行计划

预览面板按钮行的「执行计划」（英文界面 EXPLAIN）按钮：选中数据源后点击，插件按当前方言把 SQL 包装成 EXPLAIN 语句提交原生数据库控制台执行，真实执行计划与面板顶部的静态性能规则标注同屏对照。EXPLAIN 属免确认类操作，无 DML 二次确认弹窗。

| 方言 | 渲染形态 | 验证程度 |
|------|----------|----------|
| MySQL / MariaDB | `EXPLAIN <sql>`（原生表格行） | 真机通过 |
| PostgreSQL | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>` | 真机通过 |
| KingBase（金仓） | `EXPLAIN (FORMAT JSON) <sql>` | 真机通过 |
| DM（达梦） | `EXPLAIN <sql>` | 真机通过 |
| H2 | `EXPLAIN PLAN FOR <sql>` | 引擎级单测 |
| SQLite | `EXPLAIN QUERY PLAN <sql>` | 引擎级单测 |
| OceanBase（MySQL 模式） | `EXPLAIN <sql>`（表格行） | 官方文档级验证（真机留账） |
| openGauss | `EXPLAIN (FORMAT JSON) <sql>` | 真机通过 |
| Oracle | `EXPLAIN PLAN FOR <sql>`（计划写入会话级 `PLAN_TABLE`） | 真机通过（Free 23 / XE 11g） |
| SQL Server | `SET STATISTICS XML ON; <sql>; SET STATISTICS XML OFF` | 官方文法落地，真机未验证 |

Oracle 的计划行落在会话级 `PLAN_TABLE` 里、语句本身返回 0 行，面板会给出指引：在同一连接的数据库端另执行 `SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY)` 查看。SQL Server 的计划 XML 是语句执行后的附加结果集，在原生控制台的多结果页签里可见。

「执行计划」与「执行 SQL」一样依赖已配置的数据源（Ultimate 的 Database 工具窗），未配置时会提示先配置。

### 最近执行记录

看着 Wrapper 链源码，想知道它最近一次实际执行长什么样——锚点图标右键选「最近执行记录」，插件从本次会话捕获的日志条目里反查这个位置附近的执行记录（同文件优先、行号 ±30 内排前），并打开一个浏览对话框：

- **左侧列表**直接复用 SQL 日志面板的条目渲染（两行形态、类型色条、耗时与来源角标与日志页一致），支持 **Ctrl / Shift 多选**，状态行显示「已选 N 条」
- **右侧编辑器**展示参数还原后的可执行 SQL，**可直接编辑**——临时改字段值再复制，复制按钮与 Ctrl+C 都取改动后的文本；显示恒为格式化排版（长 SQL 不再挤成一行），编辑器上方两枚图标按钮分别是格式化（幂等重排）与复制
- **多选时**右侧按行序拼接显示全部选中项（所见即复制），Ctrl+C 一次复制多段
- **打开预览**取最后交互的那一行；双击条目同样打开完整预览，且预览后对话框保持在场，便于连续对比多条
- **右键菜单**与 SQL 日志页同源六件：复制时间戳（受「显示时间戳」开关门禁，关闭时置灰）、屏蔽此 SQL、发送到 SQL → Java、发送到日志转 SQL、跳转到 Java、跳转到 Mapper XML（定位不到即隐藏）；**不含删除**——对话框是浏览视图，不改动全局日志缓冲
- 对话框为非模态、可拖拽、尺寸位置记忆；**空命中也弹对话框**，由状态行给出空态文案（不再是一闪而过的通知）

前置条件：日志捕获处于开启状态且已捕获过该位置的执行。详见 [SQL 日志工具窗口](./sql-log)。

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

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback?category=wrapper)

# Wrapper → SQL 预览

<GifPlayer src="/demo/wrapper-preview.png" alt="Wrapper → SQL 预览演示" />

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
| 自研 DAO 字符串 SQL | `beanCruder.selectList(User.class, "select ...")` 等字符串实参 |
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

IntelliJ IDEA Ultimate + Database 插件环境下，预览后自动创建临时 .sql 文件，`Ctrl+Enter` 执行。预览弹窗为非模态窗口，执行时如数据源密码过期，IDEA 的密码输入框不会被弹窗遮挡，可直接输入。执行失败时错误直接显示在面板内，不再弹模态框打断操作。

### EXPLAIN 真实执行计划

预览面板按钮行的「EXPLAIN」按钮：选中数据源后点击，插件按当前方言把 SQL 包装成 EXPLAIN 语句提交原生数据库控制台执行，真实执行计划与面板顶部的静态性能规则标注同屏对照。EXPLAIN 属免确认类操作，无 DML 二次确认弹窗。

| 方言 | 渲染形态 | 验证程度 |
|------|----------|----------|
| MySQL / MariaDB | `EXPLAIN FORMAT=JSON <sql>` | 真机通过 |
| PostgreSQL | `EXPLAIN (FORMAT JSON, VERBOSE) <sql>` | 真机通过 |
| KingBase（金仓） | `EXPLAIN (FORMAT JSON) <sql>` | 真机通过 |
| DM（达梦） | `EXPLAIN <sql>` | 真机通过 |
| H2 | `EXPLAIN PLAN FOR <sql>` | 引擎级单测 |
| SQLite | `EXPLAIN QUERY PLAN <sql>` | 引擎级单测 |
| Oracle / SQL Server | 暂不支持，点击后提示降级 | — |

「EXPLAIN」与「执行 SQL」一样依赖已配置的数据源（Ultimate 的 Database 工具窗），未配置时会提示先配置。

### 生成测试资产

预览面板按钮行的「生成测试」按钮，两种形态二选一：

1. **SQL 回归脚本**：生成含目标 SQL 与断言查询骨架的 `.sql` 文件，落盘到项目 `src/test/resources/sql-visualizer/`（文件名带时间戳），直接纳入版本管理做回归基线；
2. **JUnit 用例骨架**：生成可编译的 `@Test` 方法（内嵌 SQL 常量 + 断言占位），弹窗展示，复制到自己的测试类补断言即可。

两种形态都不生成业务 Java 代码，也不自动推导 INSERT 前置数据，断言部分需自行补充。

### 最近执行记录

看着 Wrapper 链源码，想知道它最近一次实际执行长什么样——锚点图标右键选「最近执行记录」，插件从本次会话捕获的日志条目里反查这个位置附近的执行记录（同文件优先、行号 ±30 内排前），选中一条即打开带参数的完整 SQL 预览。

前置条件：日志捕获处于开启状态且已捕获过该位置的执行；没捕获到时菜单项为空，属正常。详见 [SQL 日志工具窗口](./sql-log)。

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

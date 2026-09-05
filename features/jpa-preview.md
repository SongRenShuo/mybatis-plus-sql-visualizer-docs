# JPA / Hibernate SQL 预览
<GifPlayer src="/demo/jpa-preview.svg" alt="JPA / Hibernate SQL 预览演示" />

面向 Spring Data JPA 与 Hibernate 项目的静态 SQL 预览——Repository 方法、JPQL / HQL、Criteria 查询链、`.hbm.xml` 映射，不启动 Spring 容器、不连数据库，光标所在行左侧 gutter 图标点击即出 SQL。

## 触发面

| 入口 | 位置 |
|------|------|
| Repository 派生方法（`findByXxx...`） | 方法声明行 |
| Repository CRUD 方法（`save` / `findById` / `deleteById` 等） | 方法调用行 |
| `@Query("...")` 注解（JPQL / 原生 SQL，含 `@Modifying` DML） | 注解行 |
| `@NamedQuery` / `@NamedQueries` 实体命名查询 | 注解行 |
| JPA CriteriaQuery 调用链（`cq.from` / `cb.equal` 等） | 调用链所在行 |
| `session.createQuery(hql)` 等 Hibernate HQL 调用 | HQL 字符串所在行 |
| 自定义 DAO 的 HQL 查询方法（如 `commonDao.findByQuery`） | 调用行 |
| `.hbm.xml` 映射实体 | 映射解析自动参与 |

预览快捷键 `Alt+Shift+Q` 对上述入口全部生效（光标置于目标行按快捷键，效果同点击图标）。

## Repository CRUD 写路径

与 MyBatis-Plus 的 `save` 对齐，JPA Repository 的 CRUD 方法同样直接解析出 SQL：

| 方法 | 呈现 |
|------|------|
| `save` / `saveAll` / `saveAndFlush` | 新实体出 INSERT，有主键实体出 UPDATE（isNew 判定） |
| `findById` / `existsById` | 主键等值查询 / `SELECT 1 ... LIMIT 1` |
| `findAll` / `count` | 全表 SELECT / `SELECT COUNT(*)` |
| `deleteById` / `delete` / `deleteAll` | 逐实体 `em.remove` 语义（先查后删，非 bulk DELETE） |
| `deleteAllInBatch` 及变体 | 唯一 bulk DELETE 形态（无级联、不触发回调） |
| `flush` | 标注形态（脏检查批量刷写，无独立 SQL） |
| `getReferenceById` | 标注「无查询」（延迟代理默认不发 SQL） |

## 派生查询深化

- 六种方法名前缀全部支持：`find` / `read` / `get` / `query` / `search` / `stream...By`
- `Top N` / `First N` / `Distinct` / `OrderBy<prop>Asc|Desc` 多字段排序
- 条件关键字：`Between`、`Like` 系列（`StartingWith` / `Containing` 等，参数自动补 `%`）、`In` / `NotIn`（面板多值编辑）、`IsNull`、`True/False`、`IgnoreCase`（生成 `LOWER(col)=LOWER(?)`）
- 返回类型感知：`Page<T>` 出 count SQL 与数据 SQL 两条、`Slice<T>` 多取一条判断、`Stream<T>` 标注事务内消费提示

## 分页与排序参数

`Pageable` / `Sort` 实参参与渲染：`PageRequest.of(0, 20, Sort.by(...))` 解析为 `LIMIT 20 OFFSET 0` 与 `ORDER BY` 子句，按当前方言输出分页语法。

## Specification 与 QueryByExample

- `JpaSpecificationExecutor` 的 `findAll(Specification)` 链：`root.get` / `cb.equal` / `cb.and` 组合解析为 WHERE 条件
- `QueryByExampleExecutor`：`Example.of(probe)` 按 probe 实体非空字段生成等值条件（`ExampleMatcher` 定制器参与解析）

## JPQL / HQL 深化

- JOIN 关系解析：关联路径按实体映射展开为真实 ON 条件，JOIN 图可视化可用
- 子查询、聚合、`UPDATE` / `DELETE` JPQL（含 `@Modifying`）完整支持
- `SELECT u` 裸实体别名自动展开为列清单（详见 [XML / HQL 动态 SQL 预览](./xml-preview)）

## 已知边界

- `findAllById`（IN 展开）暂未支持，后续版本补齐
- `JpaSort.unsafe` 函数注入形态不做转换（安全边界，标注提示）
- 异步返回（`CompletableFuture`）与 Repository 实现类 SPI（如 Envers 审计）不在预览范围

相关页面：[Wrapper → SQL 预览](./wrapper-preview)、[SQL 日志工具窗口](./sql-log)（Hibernate / JdbcTemplate 日志捕获）。

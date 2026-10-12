# JPA / Hibernate SQL 预览
<GifPlayer src="/demo/jpa-preview.gif" alt="JPA / Hibernate SQL 预览演示" />

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
| `.hbm.xml` 命名查询（`<query>` / `<sql-query>`） | 查询名所在行 |

预览快捷键 `Alt+Shift+Q` 对上述入口全部生效（光标置于目标行按快捷键，效果同点击图标）。

## Repository CRUD 写路径

与 MyBatis-Plus 的 `save` 对齐，JPA Repository 的 CRUD 方法同样直接解析出 SQL：

<GifPlayer src="/demo/jpa-write-path.gif" alt="Repository CRUD 写路径预览：save 出 INSERT（左侧「参数列」勾选面板，取消勾选 user.age 后 INSERT 列清单实时少一列），deleteById 出 DELETE 并附「逐实体 EntityManager.remove 语义（非 bulk DELETE）」注释" />

| 方法 | 呈现 |
|------|------|
| `save` / `saveAll` / `saveAndFlush` | 新实体出 INSERT，有主键实体出 UPDATE（isNew 判定） |
| `findById` / `existsById` | 主键等值查询 / `SELECT 1 ... LIMIT 1` |
| `findAllById` | 主键 `IN (?, ?, ...)` 集合展开 |
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

<GifPlayer src="/demo/jpa-criteria.gif" alt="CriteriaBuilder 组合条件的静态预览：光标压在 cq.where(cb.and(...)) 调用行上唤起预览，左侧列出 #username / #ageStart / #ageEnd / #statuses 参数框，右侧 SQL 把 cb.like / cb.between / cb.in / cb.isNull / cb.not 与 cb.and/or 逐条翻译成 WHERE username LIKE ? AND age BETWEEN ? AND ? AND status IN (?) AND email IS NULL AND NOT (status = 0) …" />

## JPQL / HQL 深化

- JOIN 关系解析：关联路径按实体映射展开为真实 ON 条件，JOIN 图可视化可用
- 子查询、聚合、`UPDATE` / `DELETE` JPQL（含 `@Modifying`）完整支持
- `SELECT u` 裸实体别名自动展开为列清单（详见 [XML / HQL 动态 SQL 预览](./xml-preview)）
- 无别名形态的 HQL 同样映射：`WHERE stationCode = ?` 这类裸属性转列名（`STATION_CODE = ?`），嵌入段（如 `updateInfo.BE_DELETE`）占限定符位时按嵌入映射产出裸列名，与 Hibernate 真实语义一致

## JPA 参数链（setParameter）

<GifPlayer src="/demo/jpa-param-chain.gif" alt="setParameter 链预览：字面量与枚举常量已自动预填参数框、同名参数多次设置给出灰字提示，往形参填值后 SQL 里的占位即时变成实值" />

`em.createQuery(...).setParameter(...)` 链式调用完整参与预览，参数面板与渲染结果保持一致：

- **字面量与枚举常量自动预填**：实参为字面量或枚举常量的调用（`setParameter("status", OrderStatus.PAID)`）自动把值预填进参数框，无需手动录入
- **按名回填**：命名占位（`:status` 等）按参数名配值，同名占位复用同值；渲染与「复制可执行 SQL」均与 `setParameter` 书写顺序解耦，混入位置参数时保守按序回填
- **同名写重提示**：同名参数被多次 `setParameter` 时，参数区尾部出现灰字提示（运行时以最后一次为准）

## 嵌入值对象（@Embedded）

嵌入值对象字段（`@Embedded` / `@Embeddable` / `@EmbeddedId`）按宿主表列展平参与预览。

派生查询方法名里的嵌入段驼峰路径（`findByUpdateInfoCreatedTimeAfter` 这类）也能解析到真实展平列——WHERE / ORDER BY 不再产出 `update_info_created_time` 这类伪列。

<GifPlayer src="/demo/jpa-embedded.gif" alt="嵌套嵌入派生查询预览：address.zipcode.zip 逐段穿透展平为 cust_zip，bizAddress.street 按 prefix 展平为 biz_street（前缀只拼一次、不出现 biz_biz_street）" />

::: details 展平规则细节（何时看：嵌入字段列名不符预期时）
- 嵌套嵌入的 `@AttributeOverride` 支持 JPA 规范的点路径覆写（`name="zipcode.zip"`）——点路径优先、裸名兜底，类级覆写键随嵌套链传递
- Spring Data 形态：裸 `@Embedded` 按 `prefix` 前缀展平列名，`@Embedded.Nullable` / `@Embedded.Empty` 捷径注解正确识别（同一值对象多处嵌入各按前缀展开，防撞车）
- 派生查询的嵌入段解析覆盖 WHERE / ORDER BY（含 `Sort.by` 字面量属性）；SELECT 全列展开与 `@Query` JPQL 链本就正确
- 嵌套点路径按**逐段累积**解析（`address.zipcode.zip` → 覆写列 `cust_zip`），中间段（`Zipcode`）参与匹配，不再退化成下划线拼接的伪列
- `prefix` 与 `@AttributeOverride` 同时出现时，**覆写名即最终列名**——`prefix` 只拼在没有覆写声明的列上，不会出现 `biz_biz_street` 这类双拼
- MyBatis-Plus 与 jakarta 嵌入注解共存的混合注解实体（`@TableName` + `@Embedded`）在 Wrapper 预览、批量模板与 CRUD 生成里同样展平为宿主表列，不再出现值对象伪列
:::

## 继承链实体列解析

实体继承父类（含抽象类）时，HQL / JPQL 预览照常解析出完整列清单——父类映射的列一并纳入，不会因列清单暂时为空而降级为 `x.*`；`@Entity(name = "...")` 自定义实体名同样能反查到实体类。

::: details 继承策略与降级说明（何时看：JOINED / TABLE_PER_CLASS 映射或降级注释出现时）
`@Inheritance(JOINED)` / `TABLE_PER_CLASS` 策略下父类字段实际存于父表或各子类独立表，预览按单表口径合并列清单并附边界说明注释。实体确实解析不了时，降级注释分两档——「实体不可解析」与「实体可解析但列为空（提示检查继承链父类映射）」，诊断方向可区分。
:::

## hbm 命名查询

Hibernate XML 映射（`.hbm.xml`）里的命名查询同样可预览：`<query>`（HQL）按实体到表的映射转换出 SQL，`<sql-query>`（原生 SQL）把 `:param` 命名参数回填为 `?` 占位。查询名所在行左侧出 gutter 图标，点击或按快捷键预览。

Java 侧 `session.createNamedQuery("实体.方法名")` 在 `@NamedQuery` 注解里未命中时，自动回落到 `.hbm.xml` 里的同名定义，HQL 与原生 SQL 都能出预览。

## 已知边界

- `JpaSort.unsafe` 函数注入形态不做转换（安全边界，标注提示）
- 异步返回（`CompletableFuture`）与 Repository 实现类 SPI（如 Envers 审计）不在预览范围

相关页面：[Wrapper → SQL 预览](./wrapper-preview)、[SQL 日志工具窗口](./sql-log)（Hibernate / JdbcTemplate 日志捕获）。

> 对这个功能有建议或遇到问题？[直达需求反馈池](/about/feedback)

# XML / HQL 动态 SQL 预览
<GifPlayer src="/demo/xml-preview.png" alt="XML 动态 SQL 预览演示" />

mapper XML 文件中的动态 SQL 完整预览——按 MyBatis 语义渲染，OGNL 表达式可在面板勾选。同样支持 Hibernate HQL 与 JPA JPQL 预览（见下文）。

## 触发方式

mapper XML 的 `<select>` / `<update>` / `<delete>` / `<insert>` 行左侧 gutter 图标，点击即预览。

## 支持的动态标签

| 标签 | 说明 |
|------|------|
| `<if>` | 条件渲染，test 表达式可在面板勾选 |
| `<choose>` / `<when>` / `<otherwise>` | 分支选择 |
| `<where>` | 智能 WHERE 拼接（去 AND/OR） |
| `<set>` | 智能 SET 拼接（去逗号） |
| `<foreach>` | 集合迭代，值可在面板编辑 |
| `<bind>` | 变量绑定 |
| `<sql>` + `<include>` | SQL 片段复用 |
| `<trim>` | 自定义修剪 |

## OGNL 表达式面板

动态条件的 OGNL 表达式（如 `name != null and name != ''`）可在左侧面板勾选，对应 SQL 实时变化。

## 示例

```xml
<select id="selectActive" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE #{name}
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
    </where>
    ORDER BY create_time DESC
</select>
```

渲染结果（勾选 name 条件，status 不勾选）：

```sql
SELECT * FROM user
WHERE name LIKE ?
ORDER BY create_time DESC
```

## HQL / JPQL 预览

除 mapper XML 外，插件同样支持 Hibernate HQL 与 JPA JPQL 的静态预览，入口均在 Java 源码行左侧 gutter 图标：

| 入口 | 位置 |
|------|------|
| `session.createQuery(hql)` 等 Hibernate HQL 调用 | HQL 字符串所在行 |
| `@Query("...")` 注解（JPQL） | 注解行 |
| JPA Repository 推导方法（`findByXxx...`） | 方法声明行 |
| JPA CriteriaQuery 调用链（`cq.from` / `cb.equal` 等） | 调用链所在行 |
| 自定义 DAO 的 HQL 查询方法（如 `commonDao.findByQuery`） | 调用行 |

HQL 字符串被 `+` 拆分到多行、或经链式赋值拼接时同样可识别，gutter 图标正常出现。

### SELECT 实体别名自动展开

HQL 语义中 `SELECT u` 表示取整个实体 `u`，但照原样输出到 SQL 会在 MySQL 报 `[1054] Unknown column 'u' in 'field list'`。插件会自动把裸实体别名展开为该实体的列清单：

```sql
-- HQL: SELECT u FROM User u WHERE u.status = 1
-- 展开后：
SELECT u.id, u.name, u.status, ... FROM user u WHERE u.status = 1
```

展开规则：

- 裸别名且登记在 FROM / JOIN 中才展开，DELETE / DISTINCT / 子查询 / 聚合 / 显式列清单不受影响
- 没有 SELECT 子句时自动补列清单
- JOIN 副表或实体元数据缺失时降级为 `alias.*`



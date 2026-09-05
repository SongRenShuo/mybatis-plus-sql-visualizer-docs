# 为什么选择 SQL Visualizer

解决同一个问题——看清 MyBatis 到底执行了什么 SQL——市面上还有几种常见方案。这里只陈述能力差异，供选型参考。

## 方案对比

| 能力 | SQL Visualizer | MyBatis Log Plugin 类 | 手拼 / 翻日志 |
|------|:---:|:---:|:---:|
| 不运行项目即可预览 SQL（静态解析） | 支持 | 不支持 | 不支持 |
| Wrapper 链（Lambda / 字符串）转 SQL | 支持 | 不涉及 | 手工 |
| MPJ 联表（JOIN）转 SQL | 支持 | 不涉及 | 手工 |
| XML 动态标签（if/choose/foreach 等）按 MyBatis 语义渲染 | 支持 | 部分 | 手工 |
| 注解 SQL / `<script>` / Provider 预览 | 支持 | 不涉及 | 手工 |
| JPA / Hibernate（派生方法、CRUD 写路径、JPQL、HQL、Criteria、Specification、QBE） | 支持 | 不涉及 | 手工 |
| 其他 ORM 链式框架预览（xbatis / Easy-Query / MyBatis Dynamic SQL / Querydsl 等） | 支持 | 不涉及 | 手工 |
| 真实 EXPLAIN 执行计划（按方言包装提交数据库） | 支持 | 不支持 | 手工 |
| 从预览 SQL 生成回归脚本 / JUnit 用例骨架 | 支持 | 不支持 | 手工 |
| 控制台日志还原 SQL 并回填参数 | 支持 | 支持 | 手工 |
| 日志 SQL 跳转回源码位置 | 支持 | 部分 | 不支持 |
| SQL 反向转 Wrapper Java 代码 | 支持 | 不支持 | 不支持 |
| 动态条件勾选实时重渲染 | 支持 | 不支持 | 不支持 |
| UPDATE / DELETE 无 WHERE 警示 | 支持 | 不支持 | 靠人工 |
| 9 种方言分页渲染 | 支持 | 不支持 | 手工 |

## 两条路线的定位差异

**静态预览**（本插件的核心）：光标放在 Wrapper 链或 mapper 语句上，不启动 Spring 容器、不连数据库，直接得到带真实参数的 SQL。适合写代码时确认逻辑、review 时核对 SQL、给新人演示 API 对应的 SQL 形态。

**日志还原**（MyBatis Log Plugin 类工具的路线）：应用跑起来之后，从控制台里把 `Preparing:` 与 `Parameters:` 两行拼成完整 SQL。适合排查线上或联调环境的实际执行。

两者不互斥。SQL Visualizer 的 SQL 日志工具窗口覆盖了日志还原路线的能力，并额外提供日志到源码的跳转；如果你的工作流只需要还原日志，继续用原有工具也没问题。

## 什么时候特别合适

- 项目大、启动慢，只是想确认一个条件拼接的写法
- MPJ 联表查询逻辑复杂，想快速验证 JOIN 形态
- 批量更新 / 删除前想确认 WHERE 条件，避免全表误操作
- 接手 JPA / Hibernate 老项目，想看派生方法和 HQL 最终生成的 SQL

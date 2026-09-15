# Compatibility & Requirements

## IDE versions

- IntelliJ IDEA **2024.3 or later** (build 243+), no upper bound — always adapted to the latest release
- Other IntelliJ Platform IDEs (PyCharm, WebStorm, GoLand, etc. 2024.3+) install fine, but MyBatis / JPA capabilities need a Java context — IDEA Ultimate or Community is recommended
- Ultimate-only capability: executing SQL straight from the preview popup with `Ctrl+Enter` (requires the bundled Database plugin)

## Runtime

- The plugin runs on the IDE's bundled JBR (JetBrains Runtime) — no extra JDK or environment setup needed
- No project dependencies required: the plugin works by static analysis, it does not modify bytecode or inject interceptors

## Framework coverage

| Framework | Supported |
|------|---------|
| MyBatis-Plus | Lambda / string Wrappers, service chains, logical delete, optimistic locking |
| MyBatis-Plus-Join | `MPJLambdaWrapper` / `MPJQueryWrapper` joins |
| MyBatis | XML dynamic SQL, annotation SQL (including `<script>` and Provider), JdbcTemplate string SQL |
| Spring Data JPA | Derived queries, Repository CRUD write paths (save / findById / delete family), `@Query` (JPQL / native SQL), `@NamedQuery`, CriteriaBuilder, Specification, QueryByExample, Pageable / Sort |
| Hibernate | HQL, `.hbm.xml` mappings and `<query>` / `<sql-query>` named queries |
| Other ORM (MVP) | xbatis (formerly mybatis-mp) chain APIs, Easy-Query (proxy style), MyBatis Dynamic SQL (SelectDSL), Querydsl (JPAQueryFactory), Spring Data JDBC / R2DBC (`@Query` / `@Modifying`) |

## Installation channels

- **JetBrains Marketplace** (recommended): in the IDE, `Settings` > `Plugins` > `Marketplace`, search `SQL Visualizer`; with the IDE running you can also one-click install from the [Marketplace page](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)
- **Offline**: download the plugin package from [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases), then `Settings` > `Plugins` > ⚙ > `Install Plugin from Disk...`
- Early-access builds ship through the Gitee internal update channel — see the [About page](../about/)
- **Intranet / no internet**: core features work entirely offline; see [Offline & Intranet](./offline.md) for network behavior, JDBC driver preparation and an internal update channel

## If something does not work

First confirm the IDE version is ≥ 2024.3, then check the [FAQ](./faq.md). If the problem persists, please open a [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback) with your IDE version and the error output.

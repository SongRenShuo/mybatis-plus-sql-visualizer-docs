# Compatibility & Requirements

## IDE versions

- [IntelliJ IDEA](https://www.jetbrains.com/idea/) **2024.3 or later** (build 243+), no upper bound — always adapted to the latest release
- Other IntelliJ Platform IDEs (PyCharm, WebStorm, GoLand, etc. 2024.3+) install fine, but MyBatis / JPA capabilities need a Java context — IDEA Ultimate or Community is recommended
- Ultimate-only capability: executing SQL straight from the preview popup with `Ctrl+Enter` (requires the bundled Database plugin)

## Runtime

- The plugin runs on the IDE's bundled JBR (JetBrains Runtime) — no extra JDK or environment setup needed
- No project dependencies required; preview, restore and reverse conversion are local static analysis. The optional enhanced-capture channel, when enabled, attaches capture points to your application's JVM on the local machine (on by default, no confirmation dialog; switch it off in settings) — data stays in the local IDE

## Framework coverage

| Framework | Supported |
|------|---------|
| [MyBatis-Plus](https://baomidou.com/) | Lambda / string Wrappers, service chains, logical delete, optimistic locking |
| [MyBatis-Plus-Join](https://mybatis-plus-join.github.io/) | `MPJLambdaWrapper` / `MPJQueryWrapper` joins |
| [MyBatis](https://mybatis.org/mybatis-3/) | XML dynamic SQL, annotation SQL (including `<script>` and Provider) |
| [Spring JdbcTemplate](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html) | String SQL, `NamedParameterJdbcTemplate` named parameters |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | Derived queries, Repository CRUD write paths (save / findById / delete family), `@Query` (JPQL / native SQL), `@NamedQuery`, CriteriaBuilder, Specification, QueryByExample, Pageable / Sort |
| [Hibernate](https://hibernate.org/orm/) | HQL, `.hbm.xml` mappings and `<query>` / `<sql-query>` named queries |

### Other ORM (MVP)

First-stage support: common chain and annotation styles are covered; rarer shapes follow what the plugin actually recognizes.

| Framework | Supported |
|------|---------|
| [xbatis](https://xbatis.cn/) (formerly mybatis-mp) | chain APIs |
| [Easy-Query](https://www.easy-query.com/) | proxy style |
| [MyBatis Dynamic SQL](https://mybatis.org/mybatis-dynamic-sql/) | `SelectDSL` |
| [Querydsl](https://github.com/querydsl/querydsl) | `JPAQueryFactory` |
| [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc) / [R2DBC](https://spring.io/projects/spring-data-r2dbc) | `@Query` / `@Modifying` |

## Installation channels

- **JetBrains Marketplace** (recommended): in the IDE, `Settings` > `Plugins` > `Marketplace`, search `SQL Visualizer`; with the IDE running you can also one-click install from the [Marketplace page](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)
- **Offline**: download the plugin package from [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases), then `Settings` > `Plugins` > ⚙ > `Install Plugin from Disk...`
- Early-access builds ship through the Gitee internal update channel — see the [About page](../about/)
- **Intranet / no internet**: core features work entirely offline; see [Offline & Intranet](./offline.md) for network behavior, JDBC driver preparation and an internal update channel

## If something does not work

First confirm the IDE version is ≥ 2024.3, then check the [FAQ](./faq.md). If the problem persists, please open a [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback) with your IDE version and the error output.

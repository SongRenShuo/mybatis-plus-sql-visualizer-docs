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
| MyBatis | XML dynamic SQL, annotation SQL (including `<script>` and Provider) |
| Spring Data JPA | Derived queries, `@Query` (JPQL / native SQL), CriteriaBuilder |
| Hibernate | HQL, `.hbm.xml` mappings, named queries |

## Installation channels

- **JetBrains Marketplace** (recommended): in the IDE, `Settings` > `Plugins` > `Marketplace`, search `SQL Visualizer`; with the IDE running you can also one-click install from the [Marketplace page](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)
- **Offline**: download the plugin package from [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases), then `Settings` > `Plugins` > ⚙ > `Install Plugin from Disk...`
- Early-access builds ship through the Gitee internal update channel — see the [About page](../about/)

## If something does not work

First confirm the IDE version is ≥ 2024.3, then check the [FAQ](./faq.md). If the problem persists, please open a [Gitee Issue](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) with your IDE version and the error output.

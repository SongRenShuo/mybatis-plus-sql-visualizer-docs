# 版本兼容与安装要求

## IDE 版本

- 支持 [IntelliJ IDEA](https://www.jetbrains.com/idea/) **2024.3 及以上**（构建号 243+），不设上限，持续适配最新版
- 同时兼容 IntelliJ 平台的其他 IDE（PyCharm、WebStorm、GoLand 等 2024.3+），MyBatis / JPA 相关能力依赖 Java 语境，建议在 IDEA Ultimate / Community 中使用
- Ultimate 版专属能力：预览弹窗内 `Ctrl+Enter` 直接执行 SQL（依赖内置 Database 插件）

## 运行环境

- 插件运行在 IDE 自带的 JBR（JetBrains Runtime）上，无需额外安装 JDK 或配置环境
- 项目侧无需引入任何依赖；预览、还原与反向转换均为本地静态分析。可选的增强捕获通道开启后会在本机运行的应用 JVM 内挂载采集点（默认开启、无需确认，可在设置页关闭），数据仅本机展示

## 框架支持范围

| 框架 | 支持内容 |
|------|---------|
| [MyBatis-Plus](https://baomidou.com/) | Lambda / 字符串版 Wrapper、service 链、逻辑删除、乐观锁 |
| [MyBatis-Plus-Join](https://mybatis-plus-join.github.io/) | `MPJLambdaWrapper` / `MPJQueryWrapper` 联表 |
| [MyBatis](https://mybatis.org/mybatis-3/) | XML 动态 SQL、注解 SQL（含 `<script>` 与 Provider） |
| [Spring JdbcTemplate](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html) | 字符串 SQL、`NamedParameterJdbcTemplate` 命名参数 |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | 派生方法、Repository CRUD 写路径（save / findById / delete 家族）、`@Query`（JPQL / 原生 SQL）、`@NamedQuery`、CriteriaBuilder、Specification、QueryByExample、Pageable / Sort 分页排序 |
| [Hibernate](https://hibernate.org/orm/) | HQL、`.hbm.xml` 映射与 `<query>` / `<sql-query>` 命名查询 |

### 其他 ORM（MVP）

第一阶段支持：常见链式与注解写法已覆盖，冷门形态以插件实际识别为准。

| 框架 | 支持内容 |
|------|---------|
| [xbatis](https://xbatis.cn/)（原 mybatis-mp） | 链式 API |
| [Easy-Query](https://www.easy-query.com/) | proxy 风格 |
| [MyBatis Dynamic SQL](https://mybatis.org/mybatis-dynamic-sql/) | `SelectDSL` |
| [Querydsl](https://github.com/querydsl/querydsl) | `JPAQueryFactory` |
| [Spring Data JDBC](https://spring.io/projects/spring-data-jdbc) / [R2DBC](https://spring.io/projects/spring-data-r2dbc) | `@Query` / `@Modifying` |

## 安装渠道

- **JetBrains Marketplace**（推荐）：IDE 内 `Settings` > `Plugins` > `Marketplace` 搜索 `SQL Visualizer`；IDE 运行时也可直接在[插件市场页面](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)一键安装
- **离线安装**：从 [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases) 下载插件包，`Settings` > `Plugins` > ⚙ > `Install Plugin from Disk...`
- 抢先体验版本通过 Gitee 内部更新通道分发，见 [关于页](../about/) 说明
- **内网 / 无外网环境**：插件核心功能完全离线可用；网络行为、JDBC 驱动预置与内网私有更新通道见[内网与离线环境](./offline.md)

## 遇到兼容性问题

先确认 IDE 版本 ≥ 2024.3，再参考 [FAQ](./faq.md) 排查；仍无法解决的，欢迎到 [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) 反馈，附上 IDE 版本号与报错信息。

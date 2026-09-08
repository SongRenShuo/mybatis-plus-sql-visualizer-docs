# 版本兼容与安装要求

## IDE 版本

- 支持 IntelliJ IDEA **2024.3 及以上**（构建号 243+），不设上限，持续适配最新版
- 同时兼容 IntelliJ 平台的其他 IDE（PyCharm、WebStorm、GoLand 等 2024.3+），MyBatis / JPA 相关能力依赖 Java 语境，建议在 IDEA Ultimate / Community 中使用
- Ultimate 版专属能力：预览弹窗内 `Ctrl+Enter` 直接执行 SQL（依赖内置 Database 插件）

## 运行环境

- 插件运行在 IDE 自带的 JBR（JetBrains Runtime）上，无需额外安装 JDK 或配置环境
- 项目侧无需引入任何依赖，插件以静态分析方式工作，不修改字节码、不注入拦截器

## 框架支持范围

| 框架 | 支持内容 |
|------|---------|
| MyBatis-Plus | Lambda / 字符串版 Wrapper、service 链、逻辑删除、乐观锁 |
| MyBatis-Plus-Join | `MPJLambdaWrapper` / `MPJQueryWrapper` 联表 |
| MyBatis | XML 动态 SQL、注解 SQL（含 `<script>` 与 Provider）、JdbcTemplate 字符串 SQL |
| Spring Data JPA | 派生方法、Repository CRUD 写路径（save / findById / delete 家族）、`@Query`（JPQL / 原生 SQL）、`@NamedQuery`、CriteriaBuilder、Specification、QueryByExample、Pageable / Sort 分页排序 |
| Hibernate | HQL、`.hbm.xml` 映射与 `<query>` / `<sql-query>` 命名查询 |
| 其他 ORM（MVP） | xbatis（原 mybatis-mp）链式 API、Easy-Query（proxy 风格）、MyBatis Dynamic SQL（SelectDSL）、Querydsl（JPAQueryFactory）、Spring Data JDBC / R2DBC（`@Query` / `@Modifying`） |

## 安装渠道

- **JetBrains Marketplace**（推荐）：IDE 内 `Settings` > `Plugins` > `Marketplace` 搜索 `SQL Visualizer`；IDE 运行时也可直接在[插件市场页面](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)一键安装
- **离线安装**：从 [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases) 下载插件包，`Settings` > `Plugins` > ⚙ > `Install Plugin from Disk...`
- 抢先体验版本通过 Gitee 内部更新通道分发，见 [关于页](../about/) 说明

## 遇到兼容性问题

先确认 IDE 版本 ≥ 2024.3，再参考 [FAQ](./faq.md) 排查；仍无法解决的，欢迎到 [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) 反馈，附上 IDE 版本号与报错信息。

---
title: "MyBatis SQL 调试方案对比"
description: "盘点 IntelliJ IDEA 里三类 MyBatis SQL 调试插件：日志还原、生成导航、写前预览与运行期捕获——各自的工作方式、代表插件与适用场景，供选型参考。"
---

# MyBatis SQL 调试方案对比

在 IDEA 里调 MyBatis / JPA 的 SQL，社区插件大体可以分成三类：从控制台日志里还原 SQL 的，在写代码时做跳转与代码生成的，以及在编码期直接预览最终 SQL 的。三类解决的是不同环节的问题，本页逐一盘点各自的代表插件、工作方式与适用场景，供选型参考。

文中下载量均为 JetBrains Marketplace 公开读数（截至 2026-11），会随时间变化；各插件的具体能力以各自 Marketplace 页面为准。

## 日志还原族

从控制台日志里把 `Preparing:` 与 `Parameters:` 两行拼成完整 SQL，省去手工拼接问号参数的功夫。

| 插件 | 定位 | 收费 | 公开下载量级（截至 2026-11） |
|------|------|------|------|
| MyBatis Log | 控制台 SQL 日志还原 | 付费 | 约 63 万 |
| MyBatis Log Free | 控制台 SQL 日志还原（免费版） | 免费 | 约 56 万 |
| Mybatis Log Ultra | 控制台日志还原 | 免费 | 数千 |
| Mybatis Sql Viewer | 日志 SQL 查看 | 免费 | 约 1.5 万 |

这一族的工作前提是应用已经打出 SQL 日志。适合「已有日志习惯、不想装侵入工具」的场景：应用开着 `show_sql` 或日志框架输出，装上插件就能把问号替换成真实参数。它回答的是「刚才跑过的 SQL 长什么样」。

## 生成导航族

重心在写码环节：mapper XML 与 Java 接口之间双向跳转、生成 CRUD 模板、SQL 片段补全。

| 插件 | 定位 | 收费 | 公开下载量级（截至 2026-11） |
|------|------|------|------|
| MyBatisX | baomidou 官方 IDE 插件：XML↔接口跳转、代码生成 | 免费 | 约 565 万 |
| MyBatisCodeHelperPro | MyBatis 开发辅助：生成、跳转、补全 | 免费 + 付费授权 | 约 146 万 |
| JPA Buddy | JPA / Hibernate 可视化与代码生成（JetBrains 团队维护） | 免费 + 付费 | 约 690 万 |

这一族的重心在写码效率，不在「看见 SQL」：适合建 mapper、生成接口方法、来回跳转这些高频动作。不少项目会装其中一款作为基础设施。

## 写前预览捕获族

在编码期静态解析代码并渲染最终 SQL，应用还没启动就能看到带真实参数的语句；应用跑起来后再由捕获通道补齐真实执行信息。

| 插件 | 定位 | 收费 | 公开下载量级（截至 2026-11） |
|------|------|------|------|
| SQL Visualizer（本页即其团队维护，见文末声明） | MyBatis-Plus / JPA / JdbcTemplate / iBatis SQL 写前预览 + 运行期增强捕获 | 免费（Apache-2.0） | 约 1200 |

同一方向上还有若干小体量插件（如 MyBatis SQL Scanner AI、MyBatis SQL Analyzer），此处不逐一展开。

这一族适合「调 SQL 时不想重启服务翻日志」的场景：写完一段 Wrapper 或 mapper 就地确认 SQL 形态，改条件、填参数即时重渲染；应用运行后拿到真实参数、耗时、影响行数与调用位置，慢查询可以直接跳回源码。

### SQL Visualizer 的能力边界

如实列出，方便判断是否合用：

- 静态预览按可解析的调用还原：MyBatis-Plus Wrapper 链、MPJ 联表、XML / 注解 / iBatis 2.x sqlMap、JPA / Hibernate 可静态推导的语句都在覆盖范围内。Kotlin DSL 的 Wrapper 链按可静态解析的调用识别，解析不到的片段如实标注，不生成猜测 SQL。
- 真实执行、EXPLAIN 执行计划与 JOIN 关系图走内嵌 Database 控制台，需要 IntelliJ IDEA Ultimate 的 Database Tools；Community 版可用静态预览、日志捕获与 SQL 转 Java 代码等核心能力。
- 运行期增强捕获需要在插件内完成一次授权后生效。
- MCP 工具需要 IDEA 2025.2 及以上，并要求有可用的 MCP Server。
- iBatis 面向 2.x（sqlMap）；MyBatis 3 mapper 有独立渲染链，不会被误判。
- 插件本体支持 IDEA 2024.3 及以上版本。

## 怎么选

- 已经习惯看控制台日志，只是嫌问号难拼：日志还原族。
- 想提升 mapper 的写码效率：生成导航族。
- 想在编码期就确认最终 SQL、运行期拿到真实参数与源码定位：写前预览捕获族。

三类并不互斥。常见的组合是生成导航族负责跳转与生成，SQL Visualizer 负责预览与运行期捕获；本插件检测到同类导航插件在位时，会自动让出 Mapper 跳转图标，避免图标叠在一行，iBatis 的跳转箭头不受让位影响。

逐项能力差异的更细对照见[为什么选择 SQL Visualizer](./comparison.md)；各功能的说明从[功能详解](../features/wrapper-preview.md)进入。

## 关于本页

本页由 SQL Visualizer 团队维护，尽力保持客观；如发现某款插件的定位描述与实际不符，欢迎通过[需求反馈池](../about/feedback.md)指正。

---
title: "MyBatis SQL 调试方案对比"
description: "盘点 IntelliJ IDEA 里三类 MyBatis SQL 调试插件：日志还原、生成导航、写前预览与运行期捕获——先看一眼选型表，再按工作方式与维度逐项对比，供选型参考。"
---

# MyBatis SQL 调试方案对比

在 IDEA 里调 MyBatis / JPA 的 SQL，社区插件大体分三类：从控制台日志还原 SQL 的、在写码环节做跳转与生成的、在编码期直接预览最终 SQL 的。三类解决的是不同环节的问题，可以组合使用。

## 一眼选型

先按你眼下最想解决的问题对号入座，再往下看具体差异：

| 你现在的情况 | 直接选 |
|------|------|
| 服务已在跑，只是嫌控制台日志里的 `?` 难拼 | 日志还原族 |
| 想提升 mapper 的写码效率：跳转、生成、补全 | 生成导航族 |
| 想不启动服务就在编码期看到最终 SQL，运行后再拿真实参数与源码定位 | 写前预览捕获族 |

## 三类方案怎么工作

### 日志还原族

把控制台里 `Preparing:` 与 `Parameters:` 两行拼成完整 SQL，省去手工替换问号。前提是应用已经打出 SQL 日志（`show_sql` 或日志框架输出）；它回答的是「刚才跑过的 SQL 长什么样」，不涉及编码期。

| 插件 | 定位 | 收费 | 公开下载量级（截至 2026-11） |
|------|------|------|------|
| MyBatis Log | 控制台 SQL 日志还原 | 付费 | 约 63 万 |
| MyBatis Log Free | 控制台 SQL 日志还原（免费版） | 免费 | 约 56 万 |
| Mybatis Log Ultra | 控制台日志还原 | 免费 | 数千 |
| Mybatis Sql Viewer | 日志 SQL 查看 | 免费 | 约 1.5 万 |

### 生成导航族

重心在写码效率：mapper XML 与 Java 接口双向跳转、生成 CRUD 模板、SQL 片段补全。它不负责「看见 SQL」，适合建 mapper、生成接口方法这类高频动作，不少项目会装一款作为基础设施。

| 插件 | 定位 | 收费 | 公开下载量级（截至 2026-11） |
|------|------|------|------|
| MyBatisX | baomidou 官方 IDE 插件：XML↔接口跳转、代码生成 | 免费 | 约 565 万 |
| MyBatisCodeHelperPro | MyBatis 开发辅助：生成、跳转、补全 | 免费 + 付费授权 | 约 146 万 |
| JPA Buddy | JPA / Hibernate 可视化与代码生成（JetBrains 团队维护） | 免费 + 付费 | 约 690 万 |

### 写前预览捕获族

编码期静态解析代码、渲染出带参数的最终 SQL——应用还没启动就能确认语句形态；应用跑起来后，再由捕获通道补齐真实执行信息。它把「写的时候看清」和「跑的时候看准」接在同一条链上。

这一方向上还有若干小体量插件（如 MyBatis SQL Scanner AI、MyBatis SQL Analyzer），下面单列的 SQL Visualizer 是本页维护团队的作品，其余不作逐一展开。

## 对比维度

只列能力层面可陈述的事实，不对插件优劣下评价；「支持」指该族代表插件的通常形态，具体以各自 Marketplace 页为准。

| 维度 | 日志还原族 | 生成导航族 | 写前预览捕获族 |
|------|------|------|------|
| 是否需要应用已启动 | 需要（要先有日志） | 不需要 | 静态预览不需要；运行期捕获需要 |
| 参数从哪里来 | 日志里的 `Parameters:` 行 | 不涉及 | 静态预览取代码里的填值；运行期取真实执行参数 |
| 能否在写码时看到 SQL | 不能 | 不能 | 能 |
| 能否拿到真实耗时 / 影响行数 | 不能 | 不能 | 能（运行期捕获） |
| 主要产出 | 一条可执行 SQL | 跳转、生成的代码 | 预览 SQL、执行信息、源码定位 |

## 本插件定位（SQL Visualizer）

属于写前预览捕获族，免费、Apache-2.0。把它的能力边界如实列出，方便判断是否合用：

- 静态预览覆盖：MyBatis-Plus Wrapper 链、MPJ 联表、XML / 注解 / iBatis 2.x sqlMap、可静态推导的 JPA / Hibernate 语句。Kotlin DSL 的 Wrapper 链按可静态解析的调用识别，解析不到的片段如实标注，不生成猜测 SQL。
- 真实执行、EXPLAIN 执行计划与 JOIN 关系图走内嵌 Database 控制台，需要 IntelliJ IDEA Ultimate 的 Database Tools；Community 版可用静态预览、日志捕获与 SQL 转 Java 代码等核心能力。
- 运行期增强捕获需在插件内完成一次授权；MCP 工具需要 IDEA 2025.2 及以上并有可用的 MCP Server；插件本体支持 IDEA 2024.3 及以上。
- iBatis 面向 2.x（sqlMap）；MyBatis 3 mapper 有独立渲染链，不会被误判。

## 组合使用

三类并不互斥。常见组合是生成导航族负责跳转与生成，SQL Visualizer 负责预览与运行期捕获：检测到同类导航插件在位时，本插件会自动让出 Mapper 跳转图标，避免图标叠在一行，iBatis 的跳转箭头不受影响。

逐项能力的更细对照见[为什么选择 SQL Visualizer](./comparison.md)；各功能说明从[功能详解](../features/wrapper-preview.md)进入。

## 关于本页

文中下载量均为 JetBrains Marketplace 公开读数（截至 2026-11），会随时间变化；各插件的具体能力以各自 Marketplace 页面为准。本页由 SQL Visualizer 团队维护，尽力保持客观；如发现某款插件的定位描述与实际不符，欢迎通过[需求反馈池](../about/feedback.md)指正。

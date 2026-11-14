---
title: "怎么看 MyBatis 最终执行的 SQL？（5 种场景与对应做法）"
description: "写代码时看 Wrapper/XML/注解会生成什么 SQL、日志里的问号怎么还原真实参数、不引 p6spy 看完整 SQL、SQL 反向转 Wrapper 代码——按场景给出做法与取舍。"
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "怎么看 MyBatis-Plus Wrapper 最终会生成什么 SQL？",
            "acceptedAnswer": { "@type": "Answer", "text": "在 Wrapper 链或 Mapper 方法所在行点击预览图标，SQL Visualizer 静态解析调用链即时渲染出 SQL，参数可勾选回填，不启动项目、不连数据库。" }
          },
          {
            "@type": "Question",
            "name": "MyBatis 日志里全是问号，怎么还原成带真实参数的 SQL？",
            "acceptedAnswer": { "@type": "Answer", "text": "插件在 IDE 内捕获 MyBatis / Hibernate / JdbcTemplate 日志，自动把 ? 替换为真实参数值，附带耗时、影响行数与源码跳转。" }
          },
          {
            "@type": "Question",
            "name": "不引入 p6spy，能看到带参数的完整 SQL 吗？",
            "acceptedAnswer": { "@type": "Answer", "text": "可以。SQL Visualizer 走 IDE 内捕获与静态预览两条路，不要求改数据源配置或引入 p6spy 依赖。" }
          },
          {
            "@type": "Question",
            "name": "写完的 SQL 能反向生成 MyBatis-Plus Java 代码吗？",
            "acceptedAnswer": { "@type": "Answer", "text": "可以。选中 SQL 一键生成 QueryWrapper / LambdaQueryWrapper 代码，JOIN、子查询、聚合均可还原。" }
          }
        ]
      }
---

# 怎么看 MyBatis 最终执行的 SQL？（5 种场景与对应做法）

「MyBatis 到底执行了什么 SQL」这个问题，答案取决于你处在哪个阶段：代码还没跑、应用跑着、还是手里只有一段日志。下面按场景给出做法。

## 写代码时：Wrapper 链太长，想知道它会生成什么 SQL

不用启动应用。在 Wrapper 链或 Mapper 方法所在行点预览图标，[Wrapper → SQL 预览](/features/wrapper-preview) 会静态解析调用链，即时渲染出最终 SQL；条件可勾选、参数可回填，动态 SQL 按 MyBatis 语义拼接。

## 日志里全是 `?`：怎么替换成真实参数

运行期捕获会把 [MyBatis 日志转成完整 SQL](/features/sql-log)：`?` 自动替换为实际值（LIKE 自动加百分号、按字段类型加引号），同一行还带毫秒耗时、影响行数与「跳回源码」。原理与手工做法见 [MyBatis 日志里的问号怎么变成真实参数](/guide/mybatis-log-params)。

## 不想引入 p6spy

p6spy 不是必需品。[不用 p6spy 的完整方案](/guide/without-p6spy) 里对比了几条路的差别：SQL Visualizer 的两条路（IDE 内捕获、静态预览）都不要求改数据源配置或加依赖。

## 老项目：iBatis 2.x 或 JPA / Hibernate

[iBatis 2.x（sqlMap）预览](/features/ibatis-preview) 按 `#name#` 占位与 14 种动态条件标签的官方引擎语义渲染；[JPA / Hibernate 预览](/features/jpa-preview) 覆盖 Repository 派生方法、JPQL / HQL、Criteria 与 `.hbm.xml`，是 `show_sql` 只有问号时的替代。

## 手里有一段 SQL：想改成 MyBatis-Plus 代码

反向也可以：[SQL 转 QueryWrapper](/features/sql-to-java) 选中 SQL 一键生成可编译的 Wrapper Java 代码，JOIN、子查询、聚合都能还原。

## 各方案的整体对比

如果想横向看 SQL Visualizer 与 MyBatis Log 类插件、手拼日志的差别，见 [方案对比](/guide/comparison)。

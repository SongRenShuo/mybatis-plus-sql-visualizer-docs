---
title: "How to See the SQL MyBatis Actually Runs — by Scenario"
description: "Preview Wrapper/XML/annotation SQL while coding, restore real parameters from question-mark logs, skip p6spy, and convert SQL back to Wrapper Java code — the right approach for each scenario."
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
            "name": "How do I see what SQL my MyBatis-Plus Wrapper will generate?",
            "acceptedAnswer": { "@type": "Answer", "text": "Click the preview icon on the Wrapper chain or Mapper method line. SQL Visualizer statically resolves the call chain and renders the final SQL with selectable conditions and fillable parameters — no app launch, no database connection." }
          },
          {
            "@type": "Question",
            "name": "My MyBatis log only shows question marks — how do I get real parameters?",
            "acceptedAnswer": { "@type": "Answer", "text": "The plugin captures MyBatis / Hibernate / JdbcTemplate logs inside the IDE and substitutes each ? with the real parameter value, alongside duration, affected rows and jump-to-source." }
          },
          {
            "@type": "Question",
            "name": "Can I see complete SQL with parameters without p6spy?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. SQL Visualizer works through in-IDE capture and static preview, neither of which requires p6spy or datasource configuration changes." }
          },
          {
            "@type": "Question",
            "name": "Can I convert SQL back into MyBatis-Plus Java code?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. Select the SQL and generate compilable QueryWrapper / LambdaQueryWrapper code — joins, subqueries and aggregates are covered." }
          }
        ]
      }
---

# How to See the SQL MyBatis Actually Runs — by Scenario

"What SQL did MyBatis actually produce?" depends on where you are: before the code runs, while the app is running, or with nothing but a log in hand. Here is the right approach for each.

## While coding: my Wrapper chain is long — what SQL will it produce?

No app launch needed. Click the preview icon on the Wrapper chain or Mapper method line — [Wrapper → SQL preview](/en/features/wrapper-preview) statically resolves the call chain and renders the final SQL, with conditions toggleable and parameters fillable.

## The log is full of `?`: how do I get real parameters?

Runtime capture turns [MyBatis logs into complete SQL](/en/features/sql-log): each `?` is substituted with the actual value (LIKE gets its wildcards, quotes follow column types), and the same row carries duration, affected rows and jump-to-source. See [turning question marks into real parameters](/en/guide/mybatis-log-params) for how it works.

## Without p6spy

p6spy is not required. The [no-p6spy guide](/en/guide/without-p6spy) compares the options; both SQL Visualizer routes (in-IDE capture and static preview) need no datasource changes or extra dependencies.

## Legacy projects: iBatis 2.x or JPA / Hibernate

[iBatis 2.x (sqlMap) preview](/en/features/ibatis-preview) renders `#name#` placeholders and 14 dynamic condition tags with official-engine semantics; [JPA / Hibernate preview](/en/features/jpa-preview) covers repository derived methods, JPQL / HQL, Criteria and `.hbm.xml` — the alternative when `show_sql` only prints question marks.

## I have a SQL string: turn it into MyBatis-Plus code

The reverse works too: [SQL to QueryWrapper](/en/features/sql-to-java) converts a selected SQL into compilable Wrapper Java code, including joins, subqueries and aggregates.

## Comparing all approaches

For a side-by-side of SQL Visualizer vs MyBatis-log-style plugins vs manual log reading, see [the comparison page](/en/guide/comparison).

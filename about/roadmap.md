# 开发路线

插件能力的完成情况与下一步方向。逐项能力说明见[功能详解](/features/wrapper-preview)，每个版本的完整更新明细见[更新日志](./changelog)。

## 规划中

| 方向 | 说明 |
| --- | --- |
| MPJ `fill` 关联填充渲染 | 关联填充结果的渲染支持 |
| 其他 ORM 支持第二批 | 候选 jOOQ / Jimmer / Fluent MyBatis / dbVisitor，调研矩阵已备 |
| JPA 派生查询长尾形态 | 剩余派生查询形态收尾 |
| 大型 Wrapper 链解析与日志渲染 | 性能持续优化 |
| MyBatis-Flex 支持 | 调研暂缓，视生态需求再评估 |

## 已完成

### 预览与诊断

- Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ / Kotlin），XML 与注解动态 SQL 预览（OGNL 面板）
- iBatis 2.x sqlMap 预览、参数交互与双向跳转（独立渲染链，按官方引擎保真对照）
- MBG Example 语句预览按调用点还原条件（列名与操作符自调用点反推，左栏按条件文本可填）
- 运行期拼接 SQL 填值，自研框架 `<pages>` 数据源 HQL 识别
- HQL / JPQL / JPA Criteria 预览、`.hbm.xml` 命名查询、JPA Repository 派生查询与 CRUD 写路径
- gutter 锚点左键预览、右键最近执行记录（弹框内可编辑 / 多选）
- 真实 EXPLAIN 执行计划、跨会话计划历史与跨次对比
- JOIN 关系可视化图、SQL 性能分析建议、Wrapper 链复杂度评分
- 15 种数据库方言的分页 / upsert 渲染，方言智能推断
- 逻辑删除 / 多租户 / 动态表名 / 数据权限模拟
- DML 影响面预演、执行护栏（超时 / 无界写确认 / 全表写风险横幅）、回滚快照与回放脚本导出
- 一键诊断报告、执行前 Schema 校验与方言能力自检、复制为 AI 上下文

详见[Wrapper 预览](/features/wrapper-preview) · [XML 预览](/features/xml-preview) · [注解预览](/features/annotation-preview) · [JPA 预览](/features/jpa-preview) · [方言支持](/features/dialect-support)

### 转换与补全

- SQL → Java 反向转换（五种默认形态，多表 JOIN）
- SQL 代码补全（表列名 / 注释 / 参数名）与 Wrapper 方法链智能补全
- 实体类 / 数据库表右键生成 CRUD SQL
- 批量操作参数面板（列级勾选）
- 预览一键生成回滚 SQL，CRUD 与回滚 SQL 可移植导出

详见[SQL → Java](/features/sql-to-java) · [代码补全](/features/code-completion) · [CRUD SQL](/features/crud-sql) · [批量操作](/features/batch-operation)

### 日志与历史

- 多框架日志捕获（Log → SQL 还原），含 ShardingSphere 双段日志与 iBatis 2.x 三行组日志
- 来源位置可选显示类名#方法名、跨通道去重折叠、风暴期追赶与丢弃计数
- 耗时显示与慢查询检测、N+1 同模板计数徽章
- 精确跳转源码、调用栈弹层点击帧跳转、定时任务线程调用栈
- SQL 历史常驻页签：两级导航、收藏与钉住、正则检索、历史对比
- 三种显示模式、多选批量复制、展示与导出脱敏
- 增强捕获（premain 启动即捕获，按 JDBC 接口匹配兜底）

详见[SQL 日志](/features/sql-log)

### 平台与生态

- MCP Server 十一个只读工具
- SQL 分享（Markdown / HTML / 可执行 SQL）
- 设置导入导出与按项目覆盖
- Gitee 抢先体验更新通道、自更新免重启、本地安装包目录（内网 zip 目录识别安装）
- 错误与反馈一键上报需求池

详见[MCP 工具](/features/mcp)

---

欢迎通过[需求池](/about/feedback)提交功能建议。

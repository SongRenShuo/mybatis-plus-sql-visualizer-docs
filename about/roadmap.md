---
prev:
  text: 更新日志
  link: /about/changelog
next: false
---

# 开发路线

插件功能的计划与进度。

## 已完成

已完成能力按模块分组，点标题展开查看明细。

::: details 预览与诊断（30 项）
- [x] Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ / Kotlin）
- [x] XML / 注解动态 SQL 预览（OGNL 面板）
- [x] HQL / JPQL / JPA Criteria 预览（实体别名自动展开）
- [x] `.hbm.xml` 命名查询预览
- [x] JPA Repository CRUD 写路径与派生查询深化（Specification / QueryByExample）
- [x] 嵌入值对象（@Embedded）按宿主表列展平
- [x] 其他 ORM 链式框架预览（xbatis / Easy-Query / Querydsl 等）
- [x] 自研 DAO 字符串 SQL 方法定义锚点
- [x] gutter 锚点左键预览、右键最近执行记录
- [x] SQL 预览字段列表自动折叠
- [x] 预览 INSERT 目标列 inlay 提示
- [x] 通用 XML 内嵌 SQL 识别
- [x] 真实 EXPLAIN 执行计划
- [x] JOIN 关系可视化图
- [x] SQL 性能分析建议
- [x] Wrapper 链复杂度评分
- [x] 逻辑删除 / 多租户 / 动态表名 / 数据权限模拟
- [x] 11 种数据库方言分页 / upsert 渲染
- [x] 方言智能推断
- [x] 预览可靠性增强（跨命名空间 include、`${}` 注入确认闸门）
- [x] 执行护栏（超时 / 无界写确认 / 空参数占位）
- [x] 预览参数面板记忆调试参数
- [x] 预览参数预设
- [x] mapper XML 语法高亮注入
- [x] gutter SQL 图标分组开关
- [x] IPage 分页拦截器模拟
- [x] EXPLAIN 全方言支持与结果结构化渲染
- [x] 动态 SQL 条件求值探镜
- [x] 预览交互细节
- [x] 预览面板数据源绑定指示行
:::

::: details 转换与补全（7 项）
- [x] SQL → Java 反向转换（五形态，多表 JOIN）
- [x] SQL 代码补全（表列名 / 注释 / 参数名）
- [x] Wrapper 方法链智能补全
- [x] 批量操作参数面板（列级勾选）
- [x] 实体类 / 数据库表右键生成 CRUD SQL
- [x] 预览一键生成回滚 SQL
- [x] CRUD / 回滚 SQL 可移植导出
:::

::: details 日志与历史（30 项）
- [x] SQL 日志工具窗口（多框架日志捕获，Log → SQL 还原）
- [x] 耗时显示与慢查询检测
- [x] 精确跳转源码（拦截器标记调用点）
- [x] 首条 SQL 自动展开日志工具窗
- [x] 项目启动时自动开始监听
- [x] SQL 日志列表行号（#N）
- [x] 单击预览 / 双击完整弹窗
- [x] 三种显示模式
- [x] 多选批量复制与复制时间戳
- [x] 日志列表搜索（行号 / 时间）
- [x] 日志原始时间记录与显示切换
- [x] JdbcTemplate 集合参数还原与并发日志分桶
- [x] CRUD 类型颜色标记
- [x] 关闭工具窗口时自动停止监听
- [x] SQL 历史两级导航 + 收藏
- [x] 历史 SQL 参数记忆与字面量参数恢复
- [x] 日志捕捉链路性能优化
- [x] 性能红线全面治理
- [x] 增强捕获启动即捕获（premain）
- [x] 日志面板聚焦与定位增强（方法 / 请求级聚焦页签）
- [x] SQL 日志屏蔽
- [x] 源码跳转落点双修复与 JAR 业务帧登记
- [x] 多语句切分全角括号容错
- [x] 历史条目钉住与正则检索
- [x] 历史 / 日志导出
- [x] ShardingSphere 双段日志捕获
- [x] 历史 SQL 对比
- [x] N+1 同模板计数徽章
- [x] 数据源上下文角标
- [x] 日志转 SQL 剪贴板读取按钮
:::

::: details 平台与生态（11 项）
- [x] SQL → Java 面板原生数据库控制台执行
- [x] SQL 分享（Markdown / HTML / 可执行 SQL）
- [x] 设置导入导出 + 按项目覆盖
- [x] Gitee 抢先体验更新通道
- [x] 自更新免重启
- [x] 帮助页面本地 HTML
- [x] 插件更名 SQL Visualizer
- [x] 错误 / 反馈一键上报需求池
- [x] MCP Server 十个只读工具
- [x] MCP 历史检索工具 sqlv_history_search
- [x] 设置页与引导可发现性打磨
:::

> 以上功能已随 v2026.9.8 ~ v2026.10.6 发行，版本明细见[更新日志](./changelog)。v2026.9.23 代表功能：MCP Server 十工具、增强捕获启动即捕获（premain）、方法级 / 请求级聚焦页签、预览一键回滚 SQL、方言智能推断、跨命名空间 include 解析等；v2026.10.6 代表功能：嵌入值对象 @Embedded 识别补全、SQL 日志屏蔽、通用 XML 内嵌 SQL 识别、无别名 HQL 映射、信创方言 OceanBase / openGauss、空参数默认 `?` 占位、增强捕获确认前置（开启或打开项目时确认，先于任何运行）、JAR 业务帧登记与跳转落点修复等。预览参数预设、mapper XML 语法高亮、EXPLAIN 全方言支持与结构化渲染、IPage 分页模拟、ShardingSphere 日志捕获、MCP 历史检索工具、历史对比与导出、多语句全角括号容错、预览数据源绑定指示行、预览参数记忆等已先行合入 dev 分支，将随后续版本发行。

## 规划中

- MPJ `fill` 关联填充渲染
- 其他 ORM 支持第二批（候选：jOOQ / Jimmer / Fluent MyBatis / dbVisitor，调研矩阵已备）
- JPA 派生查询长尾形态收尾
- 大型 Wrapper 链解析与日志渲染性能持续优化
- MyBatis-Flex 支持（调研已暂缓，视生态需求再评估）

---

欢迎通过 [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) 提交功能建议。

---
prev:
  text: 更新日志
  link: /about/changelog
next: false
---

# 开发路线

插件功能的计划与进度。

## ✅ 已完成

### 预览与诊断

- [x] Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ 联表 / Kotlin）
- [x] XML / 注解动态 SQL 预览（OGNL 面板、`maintainPage` XML）
- [x] HQL / JPQL / JPA Criteria 预览，HQL `SELECT 实体别名` 自动展开为列清单
- [x] `.hbm.xml` 命名查询预览（`<query>` / `<sql-query>`，`createNamedQuery` 自动回落 hbm 定义）
- [x] JPA Repository CRUD 写路径预览（save / findById / findAllById / delete 家族 / flush 语义），派生查询深化（六前缀、Pageable / Sort、Page / Slice / Stream 返回），Specification 与 QueryByExample
- [x] 其他 ORM 链式框架预览第一批：xbatis、Easy-Query、MyBatis Dynamic SQL、Querydsl、Spring Data JDBC / R2DBC
- [x] 自研 DAO 字符串 SQL 方法定义锚点（方法名行 gutter 图标，快捷键在方法定义处生效）
- [x] gutter 锚点左键直接预览、右键反查最近执行记录
- [x] 真实 EXPLAIN 执行计划（按方言包装提交原生数据库控制台，MySQL / PostgreSQL / 金仓 / 达梦真机验证）
- [x] JOIN 关系可视化图（IDEA 原生 Diagrams 引擎渲染，Diagrams 缺席自动回退自绘；数据源可用时列类型 / 注释取 DB 真实值）
- [x] SQL 性能分析建议（索引缺失 / 全表扫描等 20 条规则）
- [x] Wrapper 链复杂度评分
- [x] 逻辑删除 / 多租户 / 动态表名 / 数据权限拦截器模拟
- [x] 9 种数据库方言分页 / upsert 渲染（保留字按官方文档全量校准，H2 upsert 为原生 `MERGE INTO ... KEY`）

### 转换与补全

- [x] SQL → Java 反向转换（AUTO / QueryWrapper / Lambda / Wrappers / MPJ 五形态，多表 JOIN）
- [x] SQL 代码补全（表列名、注释提示）
- [x] Wrapper 方法链智能补全（`.eq(` 后提示后续方法与字段）
- [x] 批量操作参数面板（列级勾选、批量导入）

### 日志与历史

- [x] SQL 日志工具窗口（MyBatis / Hibernate / JdbcTemplate 日志捕获含多行语句，Log → SQL 批量还原）
- [x] 耗时显示与慢查询检测（阈值着色、按耗时排序）
- [x] 精确跳转源码——运行期 `InnerInterceptor` 标记调用点，精确 `file:line` 跳转；支持设置页一键自动注入拦截器；多模块源根跳转容错
- [x] 首条 SQL 自动展开日志工具窗（默认开、防抖不抢焦点，手动关闭后本会话抑制，再次运行项目解除抑制）
- [x] 项目启动时自动开始监听（打开项目 / 运行项目自动捕捉，手动停止后再次运行项目自动恢复）
- [x] SQL 日志列表行号（`#N` 会话内捕获序号，启动项目重新计数）
- [x] 单击预览（SQL 高亮轻量预览可直接编辑，复制带对号反馈；双击仍开完整弹窗）
- [x] 关闭工具窗口时自动停止监听
- [x] SQL 历史两级导航 + 收藏（文件列表 → 逐条 SQL，自动保存）
- [x] 日志捕捉链路性能优化（EDT 开销治理）
- [x] 性能红线全面治理（执行失败面板内报错、日志流式增量渲染、参数输入防抖、历史大文件后台读取、内存泄漏清理）

### 平台与生态

- [x] SQL → Java 面板原生 Database 控制台执行（Ultimate）
- [x] SQL 分享（Markdown / HTML / 可执行 SQL 三格式）
- [x] 设置导入导出 + 按项目覆盖
- [x] Gitee 抢先体验更新通道 + 忽略此版本
- [x] 帮助页面本地 HTML（零网络依赖，暗色模式适配）
- [x] 插件更名 SQL Visualizer（MyBatis-Plus / MPJ / JPA / Hibernate 全面支持不变）

> 以上功能已随 v2026.9.8 / v2026.9.9 正式发行，可在 JetBrains Marketplace 更新获取；版本明细见[更新日志](./changelog)。

## 💡 待立项

- [ ] MPJ `fill` 关联填充渲染
- [ ] 其他 ORM 支持第二批（候选：jOOQ / Jimmer / Fluent MyBatis / dbVisitor，调研矩阵已备）
- [ ] JPA 派生查询长尾形态收尾
- [ ] 大型 Wrapper 链解析性能持续优化
- [ ] MyBatis-Flex 支持（调研已暂缓，视生态需求再评估）

---

欢迎通过 [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) 提交功能建议。

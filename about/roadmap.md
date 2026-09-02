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
- [x] JOIN 关系可视化图（PlantUML / Mermaid 渲染）
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

- [x] SQL 日志工具窗口（MyBatis / Hibernate / JdbcTemplate 日志捕获，Log → SQL 批量还原）
- [x] 耗时显示与慢查询检测（阈值着色、按耗时排序）
- [x] 精确跳转源码——运行期 `InnerInterceptor` 标记调用点，精确 `file:line` 跳转；支持设置页一键自动注入拦截器
- [x] SQL 历史两级导航 + 收藏（文件列表 → 逐条 SQL，自动保存）
- [x] 日志捕捉链路性能优化（EDT 开销治理）

### 平台与生态

- [x] SQL → Java 面板原生 Database 控制台执行（Ultimate）
- [x] SQL 分享（Markdown / HTML / 可执行 SQL 三格式）
- [x] 设置导入导出 + 按项目覆盖
- [x] Gitee 抢先体验更新通道 + 忽略此版本
- [x] 帮助页面本地 HTML（零网络依赖，暗色模式适配）
- [x] 插件更名 SQL Visualizer（MyBatis-Plus / MPJ / JPA / Hibernate 全面支持不变）

## 🔜 进行中（M37 竞品精华融合，2026-09 立项）

| 里程碑 | 内容 | 说明 |
|--------|------|------|
| M37.0 | 描述改版 + 参数拼接回归集 | Marketplace 描述改版立品牌锚点；参数拼接边界沉淀回归用例集 |
| M37.1 | 日志 ↔ 源码双向深链（P0） | 源码侧反查日志执行记录，补齐双向定位 |
| M37.2 | 真实 EXPLAIN 联动（P0） | 预览闭环接入数据库 EXPLAIN，直出执行计划 |
| M37.3 | 会话感知捕获 + 面板体验（P1） | Run/Debug 会话自动捕获、捕获状态外显、自动进入捕获态 |
| M37.4 | Wrapper → 测试资产生成（P1） | 从 Wrapper 链一键生成测试 SQL 用例 |
| M37.5 | MyBatis-Flex 支持调研 | 已出调研结论，暂缓实施，视生态需求再评估 |
| 持续 | 新版 IDE 适配保障 | 新 IDEA 版本发布即适配，无 untilBuild 锁定 |

## 💡 待立项

- [ ] MPJ `fill` 关联填充渲染
- [ ] 大型 Wrapper 链解析性能持续优化
- [ ] 更多 ORM 框架扩展（MyBatis-Flex 调研已暂缓，视需求评估）

---

欢迎通过 [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) 提交功能建议。

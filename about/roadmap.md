---
prev:
  text: 更新日志
  link: /about/changelog
next: false
---

# 开发路线

插件功能的计划与进度。

## ✅ 已完成

- [x] Wrapper → SQL 静态解析（Lambda / 字符串 / MPJ 联表）
- [x] XML 动态 SQL 预览
- [x] 注解 SQL 预览
- [x] SQL → Java 反向转换（四形态）
- [x] SQL 日志工具窗口（自动捕获 / 批量还原）
- [x] 批量操作参数面板（列级勾选）
- [x] 逻辑删除 / 乐观锁注入
- [x] 9 种数据库方言分页 / upsert 渲染
- [x] SQL 代码补全
- [x] 更新检查与自动安装
- [x] M28 内部更新通道改造（Gitee 抢先体验通道 + 忽略此版本 + 本地测试工具）

## 🔜 计划中（2026-08-22 立项）

| 编号 | 功能 | 说明 |
|------|------|------|
| F2 | SQL 性能分析 | SQL 执行耗时统计与可视化 |
| F3 | 复杂度评分 | Wrapper 链复杂度评估 |
| F4 | Kotlin 支持 | Kotlin 协程 / 扩展支持 |
| F5 | Wrapper 补全 | 智能代码补全增强 |
| F6 | 拦截器模拟增强 | Tenant / DataPermission / DynamicTableName 拦截器模拟 |
| F7 | SQL 历史收藏 | SQL 历史记录收藏功能 |
| F8 | 团队协作 | 团队间配置共享 |
| O1 | 日志窗口差异化 | 日志工具窗口差异化功能 |
| O4 | 弹窗 UX 增强 | 预览弹窗用户体验优化 |
| O5 | 设置导入导出 | 插件配置导入导出 |

## 💡 待立项

- [ ] `${ew.customSqlSegment}` 引擎就绪待 Java↔XML 关联实施
- [ ] `selectAll` 双图标撞车修复
- [ ] fill 关联填充
- [ ] 方言实测覆盖
- [ ] 性能优化（大型 Wrapper 链解析速度）
- [ ] 更多 ORM 框架扩展（JPA Criteria 等）

---

欢迎通过 [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) 提交功能建议。

# 更新日志

每个版本的详细变更记录。

## v2026.8.21

**HQL/JPA SQL 日志捕获双解析器架构 + 子查询 JOIN 反向解析 + Pageable LIMIT + @Query 路由 + JPQL IN 三层修复 + 测试体系加固**

- HQL 日志 multiline SQL 解析修复
- 双框架并发干扰隔离

## v2026.8.17

- XML 动态 SQL 预览引擎（M24）
- 批量操作参数面板列级勾选（M23.1）
- 批量参数面板（M23）
- 弹窗关闭按钮文案 bundle 化

## v2026.8.14

- 运行配置改为 GradleRunConfiguration 类型
- 运行配置移回 .run 目录
- 双 JSON 内容交换

## v2026.8.22

**M28 内部更新通道改造**

- 内部更新机制从自更新转为「Gitee 抢先体验通道」，稳定版由 Marketplace 推送
- `autoCheckUpdate` 默认关闭，新增「忽略此版本」功能
- 双 JSON 文件：`update/update.json`（检查源）+ `update/preview.update.json`（草稿）
- 通知弹窗优化：标题精简 + 版本号行 + 3 按钮（立即安装/忽略此版本/稍后）
- 本地测试工具就绪（`local-manifest-server.py` + `Run IDE (Local Manifest)` 沙盒配置）

## 更早版本

详见 [Gitee Releases](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases)。

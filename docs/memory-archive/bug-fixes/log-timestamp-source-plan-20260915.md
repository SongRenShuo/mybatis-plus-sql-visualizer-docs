---
name: log-timestamp-source-plan-20260915
description: 插件 20260915-1530 开发计划待实施——日志原始时间记录与显示切换（LogSqlEntry 新增 logTimestamp
  字段，默认显示日志时间，设置可切换捕获时间，时间戳格式统一生效）
metadata:
  node_type: memory
  type: project
  originSessionId: sess_62dec8ae-bd45-4f04-aaa9-4524c6c1501e
---

2026-09-15 用户提出新需求：当前 SQL 日志捕获时 `timestamp` 记录的是捕获时间（`System.currentTimeMillis()`），需要同时记录日志行中的原始时间戳，默认显示日志时间，可在设置中切换为捕获时间，且时间戳格式设置（`logTimestampFormat`）同时作用于两种时间。开发计划已立项（docs 仓库 `docs/开发计划/20260915-1530-日志原始时间记录与显示切换-开发计划.md`，**未实施**，实施在插件仓库 [[plugin-source-repo]]）。

**核心方案**：
- 数据模型：`LogSqlEntry` 新增 `logTimestamp: Long?`（可空，解析失败为 null），与现有 `timestamp`（捕获时间）并存
- 解析：新增 `LogTimestampParser`，预定义 5 种常见格式正则（Logback/Log4j2/Spring Boot 默认 `yyyy-MM-dd HH:mm:ss.SSS`、无毫秒版、ISO 8601 `T` 分隔符+时区），行首优先匹配，失败回退捕获时间
- 设置：新增 `logTimestampSource`（`log`/`capture`，默认 `log`），UI 为单选组
- 显示：`formatTimestampFragment` 改为接收整个 entry，根据设置选择时间源；历史页硬编码问题（F3）合并修复
- 历史兼容：文件条目新增 `|logTime=<ms>` 字段，旧文件无该字段时回退为捕获时间

**Why:** 用户需要区分「日志打印时间」和「插件捕获时间」，默认关注日志时间（与日志框架时间戳对齐），但保留捕获时间作为 fallback。时间格式多样性通过预定义正则覆盖常见格式 + fail-open 策略解决。

**How to apply:** 实施时注意与 [[log-parser-fix-plan-20260915]] 的 F3 修复合并（HistorySqlLogPanel 硬编码问题）；JdbcTemplate 并发场景时间戳解析应在分桶后按线程独立解析；验收需覆盖格式切换、历史文件向后兼容、无时间戳行回退。
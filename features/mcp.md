# MCP Server：给 AI Agent 的 SQL 工具

从 2026.9.18 起，插件向 IDEA 内置 MCP Server 注册了十个工具，让 Claude Code、Cursor、JetBrains AI Assistant、Junie 这类外部 agent 能直接调用插件的 SQL 能力：渲染可执行 SQL、查表结构、拿执行计划。你在 IDE 里照常写代码，agent 在旁边干活，两边互不打扰。

## 校验给置信度，这里给证据

插件里的各类校验与提示，给出的是置信度评分——「可能有风险」「建议关注」；MCP 工具走的是另一条路：把渲染链真实产出的可执行 SQL 本体交给 agent。比如 `sqlv_mapper_check` 除了静态契约核查，还能对渲染产物做写风险与性能分析——这是静态校验器产不出的实证形态。agent 不用猜，拿着证据改代码。

## 十个工具

按用途分三组：渲染三件套、工作流四件套、生成与核查三件套。

| 工具 | 用途 | 只读 |
|------|------|------|
| `sqlv_render_sql` | 按文件与行号（或 mapper XML 片段）渲染真实可执行 SQL，参数已回填，附降级说明 | 是 |
| `sqlv_schema_context` | 按表名白名单返回数据源真实的表列结构与注释（紧凑上下文，默认最多 8 张表、上限 20） | 是 |
| `sqlv_explain` | 单条 SELECT 的七方言 EXPLAIN 执行计划文本 | 是 |
| `sqlv_render_logs` | 把 MyBatis / Hibernate / JdbcTemplate 日志还原成可执行 SQL | 是 |
| `sqlv_check_sql` | 静态写风险与类型核查 | 是 |
| `sqlv_rollback_plan` | 生成回滚预案（只产出预案，不执行任何语句） | 是 |
| `sqlv_perf_advice` | 按 20 条内置规则给出性能建议 | 是 |
| `sqlv_crud_sql` | 从实体类生成 CRUD 四件套 SQL | 是 |
| `sqlv_reverse_sql` | SQL 反向转 MyBatis-Plus 代码 | 是 |
| `sqlv_mapper_check` | mapper 契约核查，可选 simulate 模式对渲染产物做写风险与性能分析 | 是 |

几点使用口径：

- `sqlv_render_sql` 一次渲染一条语句；同一位置有多个候选时取第一个并注明，多语句日志请交给 `sqlv_render_logs`
- `sqlv_render_logs`、`sqlv_rollback_plan`、`sqlv_mapper_check` 的语句头会带上语句名（取自日志前导 `-- Name:` 注释），多语句输出一目了然
- `sqlv_perf_advice` 最多返回 30 条建议，超限按严重级别裁剪、保留高危项，尾部带「showing 30 of N」计数；单条文案超长会被截断，避免无上限输出

## 使用前提

- IDEA 2025.2 及以上：MCP Server 为平台内置，无需另装
- IDEA 2024.3 ~ 2025.1 不支持此功能面（平台没有内置 MCP Server），插件其余功能不受影响
- 环境里没有 MCP Server 插件时零影响：插件的 MCP 注册整份不加载，其余功能照常
- agent 侧连接：工具挂在 IDEA 内置 MCP Server 下，在支持 MCP 的 agent（Claude Code / Cursor / AI Assistant / Junie 等）里添加当前 IDE 的 MCP Server 连接即可，如 Claude Code 的 `use_idea_mcp`

## 设置页门控

设置 → 「MCP 工具」子页提供门控区：

- 总开关：整体启停插件的 MCP 功能
- 十个工具逐项启用 / 禁用
- 「全部启用」「全部禁用」快捷切换

所有变更即时生效：下一次工具列表刷新或工具调用就按新配置走，无需重启 IDE。

## 只读与安全

十个工具全部向 agent 显式声明只读、幂等、非破坏性，可以放心交给 agent 自动调用。除此之外还有几道防线：

- 查询白名单：需要连库执行的入口只接受 SELECT——语句结构判定加关键字粗扫两道保险，判不了的一律拒绝而不是放行；判定前会剥离字符串字面量，避免字面量里的关键字造成误判
- 全程零弹窗：MCP 调用链不会在 IDE 里弹任何对话框打断你——不合规的请求以错误消息返回给 agent，数据库建连也不会弹密码询问
- 审计留痕：每次工具调用都会在 IDE 日志（idea.log）写一条 `[MCP-AUDIT]` 审计记录

## 计划与建议类输出

涉及连接数据库的输出还带几类附加信息：

- `sqlv_explain` 执行前会先清掉连接上残留的驱动消息，PostgreSQL 的 NOTICE / WARNING 等驱动消息会以 `notices` 节随计划一并返回；计划末尾对高频低效模式（大表全表扫描、filesort / temporary、PG Seq Scan 等）追加 `index hints` 建议——只提示，不改 SQL 也不执行
- 查询不存在的表名（AI 生成的幻觉表名是高频场景）时，负结果按数据源缓存 30 秒，长会话里同一个幻觉表名不会反复触发全库扫描

> 对 MCP 工具有建议或遇到问题？[直达需求反馈池](/about/feedback?category=mcp)

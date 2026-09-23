# MCP Server：给 AI Agent 的 SQL 工具

从 2026.9.18 起，插件向 IDEA 内置 MCP Server 注册了十个工具，让 Claude Code、Cursor、JetBrains AI Assistant、Codex 这类外部 agent 能直接调用插件的 SQL 能力：渲染可执行 SQL、查表结构、拿执行计划。你在 IDE 里照常写代码，agent 在旁边干活，两边互不打扰。

![SQL Visualizer MCP Server：十个只读工具按 agent 工作流分组](/demo/mcp-overview.svg)

## 快速上手

1. 确认 IDEA 为 2025.2 及以上——MCP Server 为平台内置，无需另装插件
2. 在支持 MCP 的 agent 里添加当前 IDE 的 MCP Server 连接（如 Claude Code 的 `use_idea_mcp`），工具列表里即可看到 `sqlv_*` 十个工具
3. 直接调用。比如把一段 mapper XML 丢给 `sqlv_render_sql`，拿回来的就是参数已回填、可直接执行的真 SQL

不需要改一行项目代码，也不用在插件里做额外配置；想控制哪些工具对 agent 可见，见下文「设置页门控」。

## 十个工具

按 agent 的工作流分三组：先拿到 SQL，再了解数据库，最后执行前把关。

### 拿 SQL

| 工具 | 输入 | 产出 |
|------|------|------|
| `sqlv_render_sql` | `filePath` + `line`（项目相对路径或项目内绝对路径，配行号），或直接贴 `xmlSnippet`（mapper XML 片段） | 真实可执行 SQL——参数已回填，渲染降级处附说明 |
| `sqlv_render_logs` | `logText` 整段控制台日志原文（可选自定义 `sqlPrefix` / `paramPrefix` 等前缀） | MyBatis / Hibernate / JdbcTemplate 日志还原成的可执行 SQL |
| `sqlv_crud_sql` | `filePath` 或 `className`（MyBatis-Plus 实体类） | INSERT / UPDATE / SELECT / DELETE 四件套 |
| `sqlv_reverse_sql` | `sql` 一条 SQL | 反向生成的 MyBatis-Plus Java 代码 |

### 看库

| 工具 | 输入 | 产出 |
|------|------|------|
| `sqlv_schema_context` | `tables` 表名清单（可选 `dataSource`、`maxTables`，默认最多 8 张、上限 20） | 数据源真实的表列结构、类型与注释，紧凑上下文 |
| `sqlv_explain` | `selectSql` 单条 SELECT（可选 `dataSource`；`dialect` 可省略，按数据源 URL 自动识别） | 七方言 EXPLAIN 执行计划文本，附驱动 notices 与 index hints 建议 |

### 执行前把关

| 工具 | 输入 | 产出 |
|------|------|------|
| `sqlv_check_sql` | `sql` 一条 SQL | 静态写风险与类型核查结论 |
| `sqlv_mapper_check` | mapper XML（`xmlSnippet` 或 `filePath`），可选 `simulate` | mapper 契约核查；simulate 模式对渲染产物做写风险与性能分析——校验器给不出的证据形态 |
| `sqlv_rollback_plan` | `sql` 一条 INSERT / UPDATE / DELETE（可选 `primaryKeyColumns`） | 回滚预案——只产出预案，不执行任何语句 |
| `sqlv_perf_advice` | `sql` 一条 SQL | 按 20 条内置规则给性能建议，最多 30 条、超限按严重级别裁剪保留高危 |

## 校验给置信度，这里给证据

插件里的各类校验与提示，给出的是置信度评分——「可能有风险」「建议关注」；MCP 工具走的是另一条路：把渲染链真实产出的可执行 SQL 本体交给 agent。比如 `sqlv_mapper_check` 除了静态契约核查，还能对渲染产物做写风险与性能分析——这是静态校验器产不出的实证形态。agent 不用猜，拿着证据改代码。

## 典型工作流

<GifPlayer src="/demo/mcp-agent.gif" alt="AI Assistant 的 Codex agent 经 ACP 调用插件 MCP 工具并留痕" />
以「让 agent 查一条慢 SQL 的病根」为例，agent 会按需串起这些工具：

1. `sqlv_render_sql` 按文件与行号拿到真实可执行 SQL（参数已回填，不是源码里的 `?` 占位）
2. `sqlv_explain` 对这条 SELECT 拿执行计划——末尾如果命中全表扫描、filesort 之类模式，还会附 `index hints` 建议
3. `sqlv_perf_advice` 按 20 条规则拿性能建议；`sqlv_schema_context` 顺带取回表的列注释与结构佐证
4. 改完代码再用 `sqlv_render_sql` 复验渲染产物；写操作改动前可用 `sqlv_rollback_plan` 备好回滚预案

每一步都是确定性输出：SQL 是渲染链的真实产物，计划是数据库真实返回，建议有规则出处——不掺杂「我觉得」。

## 使用口径

- `sqlv_render_sql` 一次渲染一条语句；同一位置有多个候选时取第一个并注明，多语句日志请交给 `sqlv_render_logs`
- 带 `filePath` 的三个工具（`sqlv_render_sql` / `sqlv_crud_sql` / `sqlv_mapper_check`）路径口径一致：项目相对路径（相对项目根，如 `src/main/resources/mapper/UserMapper.xml`）或项目内绝对路径都收；项目外路径与 `..` 上跳一律拒绝
- 配置了多个数据源时，给 `sqlv_schema_context` / `sqlv_explain` 显式指名 `dataSource`——目标数据源未在 Database 工具窗连接并内省时，同名表可能改从其他数据源解析
- `sqlv_render_logs`、`sqlv_rollback_plan`、`sqlv_mapper_check` 的语句头会带上语句名（取自日志前导 `-- Name:` 注释），多语句输出一目了然
- `sqlv_perf_advice` 单条文案超长会被截断，避免无上限输出

## 使用前提

- IDEA 2025.2 及以上：MCP Server 为平台内置，无需另装
- IDEA 2024.3 ~ 2025.1 不支持此功能面（平台没有内置 MCP Server），插件其余功能不受影响
- 环境里没有 MCP Server 插件时零影响：插件的 MCP 注册整份不加载，其余功能照常

## 设置页门控

<GifPlayer src="/demo/mcp.gif" alt="插件设置页 MCP 工具门控与平台 Exposed Tools 注册面" />
设置 → 「MCP 工具」子页提供门控区：

- 总开关：整体启停插件的 MCP 功能
- 十个工具逐项启用 / 禁用
- 「全部启用」「全部禁用」快捷切换

所有变更即时生效：下一次工具列表刷新或工具调用就按新配置走，无需重启 IDE。

这里的开关只管插件的十个工具对 agent 是否可见，与 IDE「工具 → MCP 服务器」页的「启用 MCP 服务器」相互独立——后者是平台内置 MCP 服务（127.0.0.1:64342）的总开关，其他插件与平台自带的工具都挂在同一个服务下。关掉插件开关不会动平台开关：服务照常，插件经平台的工具过滤扩展（`mcpToolFilterProvider`）把 `sqlv_*` 从 agent 的工具清单摘掉——下一次列表刷新或新会话即生效，已连接的客户端刷新后可见。

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

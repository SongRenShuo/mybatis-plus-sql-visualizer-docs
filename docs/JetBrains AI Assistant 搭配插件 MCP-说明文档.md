---
search: false
---

# JetBrains AI Assistant 搭配插件 MCP 使用说明

> 本文是文档站「MCP Server」页面的**取材源**：记录 AI Assistant 侧接入插件 MCP 工具的路径，重点是**如何用本地自定义端点与模型、全程不需要任何认证**。
> 事实来源：2026-09-19 在本机 IDEA 2026.2.1（262）实测，以及 `ml-llm` 插件资源包（`AcpBundle.properties` 三语 bundle）实证。凡标「实测」的均有日志或界面原文支撑。

## 一、前提与组件归属

| 组件 | 插件 id | 是否 IDE 内置 | 说明 |
| --- | --- | --- | --- |
| MCP Server | `com.intellij.mcpServer` | **内置**（2025.2+） | 插件的十个只读工具经 `mcp-optional.xml` 注册到这里 |
| Agent Client Protocol | `com.intellij.platform.acp` | **内置** | 只提供「启动 ACP agent 进程 / 发现可用 agent」的 API，不含 UI |
| AI Assistant | `com.intellij.ml.llm` | **非内置** | 需从 Marketplace 安装；ACP 的对话面板在它里面 |

要点：**ACP 的协议底座是 IDE 自带的，但承载 ACP agent 的界面在 AI Assistant 里**。所以要用 ACP 路线，AI Assistant 必须装。

插件的 MCP 工具在 `com.intellij.mcpServer` 在场时自动注册，共十个，全部只读：`sqlv_render_sql`、`sqlv_schema_context`、`sqlv_explain`、`sqlv_render_logs`、`sqlv_check_sql`、`sqlv_rollback_plan`、`sqlv_perf_advice`、`sqlv_crud_sql`、`sqlv_reverse_sql`、`sqlv_mapper_check`。

## 二、官方文档参考（中文版）

JetBrains 对 MCP 功能有专门的帮助文档，**中文版地址**：

> **https://www.jetbrains.com/zh-cn/help/idea/mcp-server.html**
> 标题「MCP 服务器 | IntelliJ IDEA 文档」，对应 IDEA 2026.2。

它的章节与要点：

| 官方小节 | 要点 |
| --- | --- |
| 启用 MCP 服务器插件 | 该功能依赖 MCP 服务器插件，默认已集成并启用；不可用时到 `设置 → 插件 → 已安装` 勾选 |
| 启用 MCP 服务器 | `设置 \| 工具 \| MCP Server` 勾选「启用 MCP 服务器」→ 确认第三方访问提示 → 应用 |
| 外部客户端设置 | 三个入口：「客户端自动配置」（逐个客户端点「自动配置」，可另选传输方式，之后重启客户端）、项目级配置（写入项目配置文件）、手动配置（复制 SSE / Stdio / HTTP 流配置） |
| 无需确认执行操作 | 关闭执行前的确认弹窗 |
| 支持的工具 | 按类别列出平台自带工具：分析、代码洞察、数据库、调试器、开发者工具包、执行、文件、格式设置、检查生成器、检查 KTS、单仓库开发者工具包、读取、重构、运行 Notebook、搜索、终端、文本、VCS 等 |

**「暴露工具」的路径值得注意**：官方给的是 `设置 | 工具 | MCP 服务器 | 暴露工具`——这就是逐工具启用/禁用清单所在的页面，也是本插件十个 `sqlv_*` 工具出现的地方。

**关于终端横幅**：英文版文档有独立小节 “Show setup suggestions in terminal sessions”，对应的就是第六节那条「Enable the IntelliJ IDEA MCP Server and connect it to Claude Code…」横幅。

**官方文档没有覆盖、属于本文增量的部分**：官方页面讲的是 MCP 服务器本身与「怎么把客户端接上去」，**不含 AI Assistant 的 ACP 路线**。「使用智能体继续 / 由智能体管理」这套免认证用法、`acpAgents.xml` 的认证状态存储、以及「传递 IntelliJ MCP 服务器」开关，都是 AI Assistant 侧的机制，官方 MCP 页面不涉及——写文档站页面时，这部分与官方内容互补而非重复。

## 三、核心路径：用本地自定义端点与模型，无需认证

这一节是本文重点。目标是：**让 ACP agent 用你自己配的端点和模型跑，不买 JetBrains AI 订阅、不填 Anthropic API Key**。

### 3.1 为什么可以免认证

AI Assistant 的 ACP 面板会先问用哪种认证方式，三个选项的性质完全不同：

| 选项 | 需要什么凭据 | 能否用本地自定义配置 |
| --- | --- | --- |
| JetBrains | JetBrains AI 订阅（要登录账号） | 否——由 JetBrains 提供模型 |
| Anthropic Console | Anthropic API Key | 否——固定走 Anthropic 官方 |
| **使用智能体继续** | **不需要任何凭据** | **是**——认证与模型全交给 agent 自己 |

第三项的内部值是 `MANAGED_EXTERNALLY`，设置完成后界面显示为「**由智能体管理**」。它的含义是：IDE 完全不参与认证，agent 进程按自己的配置文件取端点与密钥。

以 Claude Agent（`acp.registry.claude-acp`，即 Claude Code CLI）为例，它读用户目录的 `~/.claude/settings.json`：

```
env.ANTHROPIC_BASE_URL   = <任意 OpenAI 兼容端点：自建网关、第三方方舟等>
env.ANTHROPIC_AUTH_TOKEN = <该端点的密钥>
env.ANTHROPIC_MODEL      = <模型名>
```

只要这份配置本来就能在终端里跑通 Claude Code，ACP 面板里就同样能跑通——**不需要 JetBrains 账号，也不需要 Anthropic 密钥**。

### 3.2 三步操作

1. **装好 AI Assistant**（Marketplace，插件名 JetBrains AI Assistant）。ACP 面板来自它，IDE 自带的 `com.intellij.platform.acp` 只有 API 没有界面。
2. **在 AI Assistant 面板里添加并选中目标 agent**（如 Claude Agent）。首次会弹「**选择身份验证方式**」。
3. **选「使用智能体继续」**——不要选 JetBrains 或 Anthropic Console。选完即完成，无需登录、无需填 Key。

**如果面板没给出「使用智能体继续」这一项**，有两种补法：

- **UI 上没有 per-agent 认证开关**——`Settings → Tools | AI Assistant → Agents` 页上**只有 MCP 传递开关**（见第四节），没有认证项。认证入口就是上面那个聊天面板弹窗本身。
- **直接写配置文件**（推荐，确定有效）：编辑 IDE 配置目录下的 `options/acpAgents.xml`，Windows 路径为 `%APPDATA%\JetBrains\<产品><版本>\options\`：

  ```xml
  <entry key="acp.registry.claude-acp" value="MANAGED_EXTERNALLY" />
  ```

  两个取值的区别：`MANAGED_EXTERNALLY` = 由智能体管理（免认证，agent 读自己的配置）；`EXPLICIT_SELECTION` = 每次都要显式选认证方式（面板会反复要求认证）。改完**重启 IDE** 生效。

### 3.3 怎么确认已经生效

面板上应显示：

- 认证行：**`Configured authentication: Managed by agent`**（中文界面为「由智能体管理」）
- 模型选择器：**显示你 `~/.claude/settings.json` 里配的模型名**，而不是 JetBrains 或 Anthropic 的模型

实测记录：配好前是「选择身份验证方式：JetBrains / Anthropic Console」，配好后两项都如上变化。

### 3.4 如果想让别的 IDE 实例也免认证

认证状态按 IDE 实例存（见第五节），换实例要重选。把配置目录里的 `options/acpAgents.xml` 复制过去即可免去重选——**该文件是纯设置、不含任何凭据**。

## 四、MCP 传递设置：两个开关，别只改一个

要让 agent 拿到插件的十个 `sqlv_*` 工具，**必须让 IDE 把内置 MCP 服务器传给 agent**。这里有**两个独立的开关**，缺一个都不行——这是最容易踩的地方。

### 4.1 开关一：IDE 设置页

`Settings → 智能体` 页里的 MCP 传递项，落盘在 `options/acpAgents.xml`：

| 设置项 | 配置键 | 取值 | 默认 |
| --- | --- | --- | --- |
| 传递 IntelliJ MCP 服务器 | `global_use_idea_mcp` | `OFF` / `ON` / `ON_DEMAND` | **`ON_DEMAND`** |
| 传递自定义 MCP 服务器 | `global_use_custom_mcp` | 布尔 | `true` |

`ON_DEMAND` 的语义是「有活跃 MCP 工具时才传」——代码原文：

```java
if (config.getUseIdeaMcp() == IdeaMcpMode.ON_DEMAND
        && !McpServerService.hasActiveMcpTools(toolFilter, invocationMode)) {
    trace("No active MCP tools available for agent ... in ON_DEMAND mode, skipping IJ MCP server");
    return null;   // 跳过，agent 拿不到任何工具
}
```

所以**默认值 `ON_DEMAND` 在插件工具未被判定为「活跃」时会静默跳过**。要稳定生效，把它设为 **`ON`**。

### 4.2 开关二：`~/.jetbrains/acp.json`（更容易被忽略）

除设置页外，ACP 还有一份**独立的配置文件**，路径写死在插件代码里：

```java
Path userHomeAcpJson = SystemProperties.getUserHome()
    .resolve(".jetbrains").resolve("acp.json").normalize();
```

即 **`~/.jetbrains/acp.json`**（Windows：`C:\Users\<你>\.jetbrains\acp.json`）。它带 JSON Schema 校验，可在 IDE 编辑器里直接编辑。结构：

```json
{
  "default_mcp_settings": {
    "use_idea_mcp": true,
    "use_custom_mcp": true,
    "idea_mcp_allowed_tools": []
  },
  "agent_servers": { },
  "remote": { }
}
```

| 字段 | 含义 | 默认 |
| --- | --- | --- |
| `use_idea_mcp` | 是否把 IntelliJ MCP 服务器暴露给 agent | **`false`** |
| `use_custom_mcp` | 是否把用户自配的 MCP 服务器暴露给 agent | `true` |
| `idea_mcp_allowed_tools` | 允许的工具名清单；**不写 = 全部工具** | 不写 |

官方 schema 对 `use_idea_mcp` 的描述原文是：*"If true, expose the IntelliJ MCP server to agents by default. Default: false."* ——**默认关**。而 `default_mcp_settings` 的作用范围是 *"applied to all local agents unless overridden by agent-specific configuration"*。

**优先级**（`LocalAcpAgentConfig.fromServerConfig` 原文）：`agent_servers.<名称>.use_idea_mcp`（per-agent 覆盖）> `default_mcp_settings.use_idea_mcp` > 都为空则回落到设置页那个开关。

所以最小可用配置就是在该文件里写：

```json
{ "default_mcp_settings": { "use_idea_mcp": true } }
```

改完**重启 IDE 或新建聊天**生效。

### 4.3 开启后会发生什么

两个开关都到位后，IDE 会为该 agent 起一个**私有 MCP 会话**并放进 ACP 的 `session/new` 参数，日志可见：

```
AcpIdeaMcpProviderImpl - Running private IJ MCP session for agent acp.registry.claude-acp over Stdio
```

传输方式由扩展点 `com.intellij.ml.llm.agents.acp.ideaMcpTransportProvider` 决定；agent 不支持 SSE 时回落到 **Stdio**。

这是 ACP 路线相对终端路线的最大好处：**不用端口、不用鉴权 token、不用手工接入**。

### 4.4 另一条更直接的路：把 IDE MCP 服务器加进「Model Context Protocol (MCP)」页

除上面两个开关外，还有一条**不依赖 `use_idea_mcp`** 的路径，实测更容易成：**`Settings → Tools | AI Assistant → Model Context Protocol (MCP)`**。

这个页面是 AI Assistant 的 **MCP 客户端清单**（落盘在 `options/llm.mcpServers.xml`）。ACP 在组装会话参数时会读它：

```java
Map clients = MapsKt.plus(McpClientRegistry.getConfigurations(null),      // 应用级
                          McpClientRegistry.getConfigurations(project));  // 项目级
// → 转成 McpServer 放进 session/new
```

这条路径由 `use_custom_mcp` 控制，**默认 true**。页面为空时，日志里会出现这一行且冒号后**没有任何内容**：

```
AcpLocalSessionLifecycleManager - Exposing configured MCP servers for agent acp.registry.claude-acp:
```

**做法**：在页面上点 **「Import from Claude」**（从 `~/.claude.json` 导入，里面通常已有终端路线写入的 `idea` 条目），或用 **「Add server (Alt+Insert)」** 手动添加，配置从 `Settings → Tools | MCP Server → Copy SSE Config / Copy HTTP Stream Config` 复制。

两个注意点：

1. **勾选页面底部的「Automatically enable new and changed MCP servers」**，并确认列表 Status 列是启用态，否则新加的服务器可能不生效。
2. 从 Claude 导入的 `idea` 条目是**按端口**的 URL（如 `http://127.0.0.1:64342/stream`），**IDE 重启后端口变化即失效**，需要重新导入或更新 URL——这一点与终端路线同源（见第六节坑一）。

## 五、认证状态与 agent 凭据分别存在哪

两者的存储位置不同，这决定了「什么会随 IDE 实例变化、什么不会」：

**认证方式（按 IDE 实例存）**：`options/acpAgents.xml`

```xml
<application>
  <component name="AcpAgentSettings">
    <option name="agent_auth">
      <map>
        <entry key="acp.registry.claude-acp" value="MANAGED_EXTERNALLY" />
      </map>
    </option>
    <option name="agent_config_options">
      <map>
        <entry key="acp.registry.claude-acp">
          <value>
            <AgentConfigOptionsState>
              <option name="values">
                <map>
                  <entry key="mode" value="auto" />
                  <entry key="model" value="opus" />
                  <entry key="fast" value="off" />
                </map>
              </option>
            </AgentConfigOptionsState>
          </value>
        </entry>
      </map>
    </option>
  </component>
</application>
```

Windows 下配置目录为 `%APPDATA%\JetBrains\<产品><版本>\options\acpAgents.xml`（例如 `IntelliJIdea2026.2`）。**纯设置，不含凭据。**

**agent 注册表与凭据（机器级，不随 IDE 实例变）**：

- 注册表：`%APPDATA%\JetBrains\acp-agents\installed.json`（在 JetBrains 共享目录下，**不在产品配置目录里**）
- agent 自身凭据：用户家目录，例如 Claude Code 的 `~/.claude/`、Codex 的 `~/.codex/`

所以新建 IDE 实例时，**已装的 agent 与它们的登录态会被自动识别**，不需重装或重登；需要重设的只有上一条「认证方式」这一项开关。

## 六、终端路线（Claude Code CLI，备选）

不想走 ACP 面板、想直接用 Claude Code CLI 时，可以在 **IDE 内置 Terminal** 里跑 `claude`，让它连 IDE 内置的 MCP Server。这条路同样**不需要任何认证**（Claude Code 读同一份 `~/.claude/settings.json`）。

### 6.1 接入

跑起 `claude` 后，IDE 会在 Terminal 顶部弹出横幅：

> Enable the IntelliJ IDEA MCP Server and connect it to Claude Code so it can use IDE features from this terminal session.
> 按钮：Set up IntelliJ IDEA MCP ｜ Open MCP Settings ｜ Do not show again

点 **Set up IntelliJ IDEA MCP** 即完成。也可走设置页：`Settings → Tools → MCP Server → Clients Auto-Configuration`，对 Claude Code 点 **Auto-Configure**。

接入会往 Claude Code 的**全局**配置 `~/.claude.json` 的 `mcpServers` 写一条：

```json
{ "idea": { "type": "http", "url": "http://127.0.0.1:<端口>/stream" } }
```

### 6.2 验证

终端里执行 `claude mcp list`，`idea` 一行显示 `✓ Connected` 即成功。要看工具清单，可直接按 MCP Streamable HTTP 协议查服务端：向 `/stream` POST `initialize` 拿 `mcp-session-id`，再带该头 POST `tools/list`，返回结果里应包含十个 `sqlv_*`（服务端自报 `IntelliJ IDEA MCP Server`）。

### 6.3 两个已知坑

**端口每次会话都变**（实测同一台机器上 64342 与 64442 交替出现）。IDE 在启用 MCP 时会自动把当前端点写回 `~/.claude.json`，所以：

- **不要手工再往配置里加一条 `idea`**。手工加会与 IDE 自动写入的条目形成 **user / local 作用域冲突**，Claude Code 可能取到过期端点并报 401。诊断原文：`Server "idea" is defined in multiple scopes with different endpoints ... Keep the correct endpoint and remove the others`。遇到就按提示 `claude mcp remove idea -s <scope>` 删掉多余那条。

**restricted 模式端口要鉴权**。部分端口返回 `MCP server is running in restricted mode. Please, provide valid authorization token`。该 token 只在 IDE 凭据 holder 里，**不会注入终端会话的环境变量**（实测 `IJ_MCP_AUTH_TOKEN` 未设置），只能由上面的接入流程写入配置。

## 七、Codex 路线（ACP，实测可用）

**这是目前唯一实测跑通「ACP 面板内原生调用插件工具」的路线**（2026-09-19 实测，会话记录里可见 `mcp__idea/sqlv_check_sql` 原生调用 + `[MCP-AUDIT]` 落盘）。

### 7.1 为什么是它

Claude Agent（`claude-agent-acp`）当前不可用——上游实现缺陷会**静默丢弃 stdio 类型的 MCP 服务器**（根因见第九节第 5 条）。Codex 的 ACP 包装器（`codex-acp`）对同一份 server 描述能正确解析。

### 7.2 前提：provider 必须接受 `reasoning.summary`

`codex-acp` 每一轮对话都**无条件**带上该字段（其 `dist/index.js`：`summary: disableSummary ? "none" : "auto"`），所以所选 provider 的 Responses API 必须接受它：

| 端点 | 带 `reasoning.summary` 的请求 |
| --- | --- |
| `api.deepseek.com/responses` | **200** ✓ |
| `ark.cn-beijing.volces.com/api/v3/responses` | **400 `unknown field "summary"`** ✗ |

注意是**键**不认、不是值不认——把 Codex 的 `model_reasoning_summary` 设成 `none` 对 CLI 有效，但 ACP 那行代码绕过配置，仍会发出去。

自测一行（`<base>` 换成 provider 的 Responses 基址）：

```bash
curl -s -X POST "<base>/responses" -H "Authorization: Bearer <key>" -H "Content-Type: application/json" \
  -d '{"model":"<model>","input":"hi","max_output_tokens":16,"reasoning":{"effort":"high","summary":"auto"}}'
```

返回 400 `unknown field` 就说明该 provider 不能用于 codex-acp。

### 7.3 配置

`~/.codex/config.toml`：

```toml
model_provider = "custom"
model = "<你的模型>"

  [model_providers.custom]
    name = "<供应商名>"
    base_url = "<Responses API 基址>"
    wire_api = "responses"          # Codex 已移除 chat，只认 responses
    requires_openai_auth = true

  [mcp_servers.idea]
    url = "http://127.0.0.1:<MCP 端口>/stream"
```

密钥放 `~/.codex/auth.json` 的 `OPENAI_API_KEY`。

`[mcp_servers.idea]` 是可选的**兜底**：即使 AI Assistant 侧的 MCP 传递没生效，Codex 也能从自己的配置拿到 IDE 的 MCP 服务器。端口从 `Settings → Tools | MCP Server` 页取，或看 `idea.log` 的 `[BuiltInMcpStartup] ... port=`。

### 7.4 验证

面板切到 Codex，发一句：

```
调用 sqlv_check_sql 检查 UPDATE sys_user SET nickname='x' WHERE id=1
```

成功的判据有两条：

- 会话记录里出现**原生 MCP 调用**形态（Codex 会话存于 `~/.codex/sessions/<年>/<月>/<日>/rollout-*.jsonl`）：
  ```json
  {"type":"function_call","name":"sqlv_check_sql","namespace":"mcp__idea","arguments":"{...}"}
  ```
  界面上表现为 `mcp: idea/sqlv_check_sql started` / `completed`；
- `idea.log` 出现 `[MCP-AUDIT] tool=sqlv_check_sql status=OK ...`。

若调用出现但报 `Unable to determine the target project`，是调用没带 `projectPath` 参数所致，补齐即可，不是缺陷。

## 八、键名与文案速查

| 用途 | 键名 | 中文文案 |
| --- | --- | --- |
| ACP 设置页显示名 | `settings.acp.agents.display.name` | 智能体 |
| 认证弹窗标题 | `acp.agent.auth.request.title` | 选择身份验证方式 |
| 认证：交给 agent（免认证） | `acp.agent.auth.option.continue` | 使用智能体继续 |
| 认证：JetBrains | `acp.agent.auth.option.jetbrains` | JetBrains |
| 认证已托管的状态 | `acp.settings.auth.managed.externally` | 由智能体管理 |
| MCP：传递 IDE 服务器 | `settings.acp.agents.mcp.pass.idea` | 传递 IntelliJ MCP 服务器（开 / 关 / 按需） |
| MCP：传递自定义服务器 | `settings.acp.agents.mcp.pass.custom` | 传递自定义 MCP 服务器 |

## 九、已知限制

1. **AI Assistant 不是 IDE 内置插件**，需从 Marketplace 安装；`Settings → 智能体` 页与 ACP 面板都来自它。仅装 `com.intellij.platform.acp` 只有 API，没有界面。
2. **ACP 认证方式按 IDE 实例存**（`options/acpAgents.xml`），换实例需重选或复制该文件；agent 本身与其凭据是机器级的，不用动。
3. **终端路线端口漂移**：每次会话端点可能变化，接入动作需随会话重做（IDE 通常会自动写回，但不要手工叠加条目）。
4. 依赖 Database 工具的能力（如 `sqlv_explain` 取执行计划）需要 Ultimate 及其数据库支持；社区版环境下相关工具不可用属预期。
5. **Claude Agent 的 ACP 路线拿不到 IDE 的 MCP 工具——根因已定位到上游 agent（2026-09-19 反编译实证，非本插件问题）**：

   IDE 侧已逐项验证无误：`use_idea_mcp` 与 `use_custom_mcp` 两个开关都能让 server 进入 ACP 的 `session/new` 参数（日志 `Exposing configured MCP servers for agent ...: Stdio(name=jetbrains, ...)`）；私有 IJ MCP 会话的 stdio 命令是 `StdioRunnerUtil.createStdioMcpServerCommandLine()` 现拼的 `<IDE 启动器> stdioMcpServer` + `IJ_MCP_SERVER_PORT` / `IJ_MCP_SERVER_PROJECT_PATH` / token 三个环境变量，**手动执行该命令实测可正常桥接**（stderr：`Proxy transports started`）。

   **问题出在 `@agentclientprotocol/claude-agent-acp`（0.66 / 0.76 / 0.79 三个版本同样）**：其 `dist/acp-agent.js` 处理传入 `mcpServers` 时——

   ```js
   if ("type" in server && (server.type === "http" || server.type === "sse")) { /* http/sse */ }
   else if (!("type" in server)) {   // ← 要求【没有】type 字段
       // 注释原文：Stdio type MCP server (with or without explicit type field)
       mcpServers[server.name] = { type: "stdio", command: server.command, ... };
   }
   ```

   而 ACP 的 `McpServer` 是多态 sealed 类、`Stdio` 标了 `@SerialName("stdio")`，**序列化必然带 `"type": "stdio"`** → 两个分支都不进 → **该 server 被静默丢弃**。注释与代码自相矛盾，属实现缺陷。

   后果：ACP 会话里 agent 的工具列表**一个 MCP 服务器都没有**（连用户自配的也没进来），于是它只能退回用 Bash + curl 手工调 MCP——这正是本机实测观察到的现象。

   **可行的规避（2026-09-19 已实测验证其中两条）**：① **换用 Codex**——实测可用，agent 以 `mcp__idea/sqlv_check_sql` 原生调用并落审计行，配置见第七节（前提是 provider 接受 `reasoning.summary`）；② 让 IDE 以 **SSE 传输**下发（agent 对 `type === "sse"` 的分支实现正确）——传输由扩展点 `com.intellij.ml.llm.agents.acp.ideaMcpTransportProvider` 决定，agent 未声明 SSE 能力时回落 Stdio，插件侧绕行方案已立项；③ **终端路线**（第六节，已验证可用）；④ 向 JetBrains 报 issue（证据即上述两段代码：注释与实现自相矛盾）。

---
name: admin-security-audit
description: 20260905 管理后台安全审计实测结论——生产 JWT 密钥是公开 dev
  值(伪造token已验证200)、账号无KV命名空间(限流/去重全失效+用户通知链路必500)、hashPassword缺$分隔符
metadata:
  node_type: memory
  type: project
  originSessionId: sess_2335f4fe-8fae-4db3-964f-c7538ee647ce
---

2026-09-05 对 `sql-visualizer-admin` 做的代码审计 + 线上实测（只读，未改任何生产数据），均通过 `sql-visualizer-docs.pages.dev/api/v1` 代理验证（本机直连 workers.dev/api 子域 TLS 失败，见 [[feedback-pool-cloudflare]]）：

1. **生产 JWT 密钥泄露（已实测确认，最严重）**：`wrangler.toml` `[vars]` 里 `ADMIN_TOKEN_SECRET = "dev-secret-change-in-production"` 提交在 git，用它伪造的 role:2 JWT 打线上 `GET /api/v1/admin/me` 返回 200。**从未执行过 `wrangler secret put ADMIN_TOKEN_SECRET`**（若已 put，同名 var 在 deploy 时会冲突报错，而历次 deploy 都成功）。修复须两步：`wrangler secret put` 注入随机密钥 + **从 [vars] 删除该行**（留着会继续以 var 兜底）。
2. **账号不存在任何 KV 命名空间**（`wrangler kv namespace list` = `[]`，wrangler.toml 里 KV 绑定被注释）→ 登录限流 `if (!kv) return next()` 静默失效（实测 6 连发错误密码无 429）；`shouldSendNotification`/`checkEmailRateLimit` 无 `!kv` 守卫，`kv.get` 直接抛 TypeError → 给留了邮箱的反馈改状态/回复/合并时：DB 已更新但响应 500，通知不发。
3. **线上 fb_notifications 只有 2 条 test 记录，零 user_notify**——[[feedback-pool-cloudflare]] 里「四个场景都实际写入」的说法有误（admin_notify 在反馈提交路径、不依赖 KV，可能也没落库），用户通知链路从未跑通过。
4. **`hashPassword` 生成的哈希无法通过验证**：少了 salt 与 hash 之间的 `$`，产出 3 段而非种子数据的 4 段格式，`verifyPassword` 因 `parts.length !== 4` 恒 false。当前无创建管理员入口所以是潜伏 bug，做「修改密码/新增管理员」功能前必须先修。
5. 线上管理员仅 `admin/admin123`（种子明文弱口令在 git）；`notification.user_enabled` 与 `pushplus.enabled` 均为 true。
6. 次要：审计只覆盖 status/pin/merge/delete/settings 六个 action（官方回复/pushplus 配置与测试/ship/登录均不记）；分页 `size` 无上限、notifications/audit-logs 不返回 total；CORS `origin.includes('localhost')` 子串误匹配、`.endsWith('.pages.dev')` 放行任意人站点（无 cookie 认证故危害有限）；JWT 签名比较非常数时间、无 exp 的 token 永久有效；`PUT /settings/:key` 接受任意 key（含 pushplus.token 绕过掩码接口）。

**Why:** 这些结论全部经线上实测/账号 API 证实，不是推测；修复涉及生产密钥轮换与 KV 创建，属敏感操作，后续会话要能直接引用。

**How to apply:** 用户要求修复时按序：KV 创建+绑定 → wrangler secret put + 删 [vars] 行 → 换 admin123（先修 hashPassword）→ 补守卫/审计/分页上限。改完 `wrangler deploy` 后用同样方法复测（伪造 token 应 401、6 连发应 429）。

### ✅ 2026-09-05 当天已全部修复并部署验收（详见 admin 仓库 docs/开发计划/20260905-1222）
- KV 命名空间 `sql-visualizer-admin-KV`（id `6852e966d4d445a2a67e451095772330`）已创建并绑定；`wrangler kv namespace create` 会报 10000，**用 OAuth 令牌直接调 REST API `POST /accounts/{acc}/storage/kv/namespaces` 成功**。
- ADMIN_TOKEN_SECRET 已轮换（64 字节随机，`wrangler secret put`；须先部署去掉 var 的配置再 put，否则报 10053 同名冲突）；伪造 dev 密钥 token 复测 401。
- admin/admin123 已通过新上线的 `POST /admin/change-password` 轮换为强密码（仅会话交付用户，不入库不入 git）；新密码登录 200 验证 hashPassword 修复。
- 连发登录 429 生效，KV 出现 `rate:*` 键；分页 size 钳制 100、notifications/audit-logs 返回 total；审计补 login_success/failed/password_change/official_reply/ship/pushplus_*。
- **修复中发现的两个新坑**：(1) 通知推送是裸 Promise 未挂 `c.executionCtx.waitUntil`，响应返回后 Worker 冻结导致 user_notify 永不落库——三处已包 waitUntil；(2) **两个 Pages 代理（docs+admin）都不转发查询串**，生产筛选/分页参数静默失效，已加 `new URL(request.url).search` 透传（docs 仓库 commit 6319f06）。
- `change-password` 路由必须注册在 `router.use('/*', authMiddleware)` 之后，否则拿不到登录态恒 401。
- 20260905-1402 《安全预警模块》已实施上线（见 [[alert-module]]，其 T0 来源 IP 透传解决了：Pages 代理下 cf-connecting-ip 是 CF 共享出口 IP，限流/审计按 IP 区分失真，验收时实测撞上）。

### ✅ 2026-09-05 下午用户报障修复（commit 9eee658 / docs 0b07fc1）
1. **邮件详情 404**：pushplus 通知里的链接是路径式 `/about/feedback/FR-xxx`，VitePress 无此路由。已改 `?postNo=FR-xxx` 深链（pushplus.ts 四处统一走 `feedbackDetailUrl()`），docs `FeedbackPage.vue` 挂载时解析查询串直开详情、返回时 replaceState 同步清理。
2. **邮件乱码**：根因是测试用 Windows Git Bash curl 直发中文请求体（arg 编码变 GBK），非产品缺陷；数据库字段均正常。已在公开 `POST /feedback/posts` 加 UTF-8 守卫（原始体含 U+FFFD → 400 明确报错，顺带补了 JSON.parse 400）。
3. **限流共享桶 bug**（复测时发现）：`rate-limit.ts` 用 `c.req.routePath`（中间件里=挂载模式 `/api/*`）拼计数键 → 所有 POST 接口共用一个 5次/h 的桶，登录+提交+投票合计就 429。已改为匹配具体路由分别计数，旧共享键已删。
- 测试中文请求体的正确姿势：JSON 写文件（Write 工具保证 UTF-8）+ `curl --data-binary @file`，不要把中文放命令行参数里。

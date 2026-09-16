---
name: sql-visualizer-admin
description: sql-visualizer-admin 是通用管理后台（Cloudflare Workers + D1），Phase 1 已部署上线，含需求反馈池 + 管理后台全部功能；推送加配置/测试发送已上线（SDK+sys_settings）
metadata:
  node_type: memory
  type: project
  originSessionId: sess_08b26f61-8e18-478f-a8e3-0cec4197f294
---

`sql-visualizer-admin` 是 SQL Visualizer 插件的**云端管理后台**，Phase 1 已完整实现并部署上线。

- 项目路径：`F:\code\Java\Gitee\SongRenShuo\sql-visualizer-admin`（本地 git 仓库，4 个提交）
- 语言：TypeScript（Cloudflare Workers **不支持 Java**，仅支持 JS/TS、Python beta、Rust via WASM）
- 框架：Hono（专为边缘运行时设计的轻量 Web 框架）
- 数据库：Cloudflare D1（SQLite 兼容，非 MySQL；不支持 `COMMENT` 子句，用 `--` 注释）
- 存储：**R2 桶 `sql-visualizer-attachments`**（binding `BUCKET`）已启用，存反馈附件字节；D1 `fb_attachments` 表（迁移 `migrations/0003_attachments.sql`）存附件元数据
- KV：Workers KV（限流计数、通知去重、Session）
- 部署：`wrangler deploy` 用 OAuth 令牌；R2 操作用 `.cf-token`（见 [[feedback-pool-frontend]]）
- 成本：免费额度内 $0/月（10 万 Workers 请求/天，500MB D1 存储）
- Worker URL：`https://sql-visualizer-admin.3064597532.workers.dev`
- D1 数据库 ID：`a46f41d5-21f2-4728-8e25-670f235974bd`
- 管理员账号：`admin` / `admin123`（开发用，生产需修改）
- 自定义域名（已配置）：`api.sql-visualizer.jvtools.cn`（wrangler.toml 路由 `api.sql-visualizer.jvtools.cn/*`）
- API 版本化：所有接口 `/api/v1/` 前缀
- 开发计划：`docs/开发计划/20260903-1700-需求反馈池-开发计划.md`

### Phase 1 已实现并验证

**反馈池模块（公开）**：列表/详情/提交/投票/评论/标签/分类/统计
**管理后台模块（JWT 认证）**：登录/状态变更/官方回复/置顶/合并/删除/通知日志/审计日志/系统配置

**公开「需求池动态」日志数据（2026-09-04 计划待做）**：给公开页面做动态 feed 的数据现成——`fb_status_logs`（状态变更日志，已建索引 `idx_fb_status_logs_post_id`）+ `fb_posts`（新增反馈，过滤 `is_deleted=0`）join 出「某反馈 状态A→状态B，操作人，时间」；`sys_user_activity`（action=vote/comment/submit）可补充行为流。当前**无公开 feed 接口**——`GET /api/v1/admin/changelog`（已完成反馈按版本）和 `/admin/user-activity` 都要 `getAdminUser` JWT 鉴权，不能给公开页用。计划新增公开 `GET /api/v1/feedback/activity?limit=20`（默认 20、上限 50，倒序，复用 `PostStatusLabels` 返回 `statusFromLabel/statusToLabel`，不鉴权）。详见 [[feedback-pool-frontend]]。

### 管理后台 SPA（admin/ 独立部署，易滞后源码）

管理后台前端是 `admin/`（Vite + Vue + Element Plus），**独立部署到 Cloudflare Pages**（`wrangler pages deploy`，与 Worker 分开部署）。**线上 SPA 常是旧构建、滞后于源码**——2026-09-04 用户报的「状态/类型显示英文」「系统设置显示 true/false」「点系统设置跳总览」，核对源码后发现**都已改对**（`admin/src/api/index.ts` 的 `STATUS_MAP`/`TYPE_MAP` 已中文、`Settings.vue` 已用 `el-switch`、`/settings` 路由+菜单 `index="/settings"` 都正确），只是**没重新构建部署**。➡️ 排查管理后台 UI「bug」前，**先怀疑线上 SPA 是旧构建**：`admin/` 下 `npm run build` + 重新 `wrangler pages deploy` 再判断，别急着把已正确的源码当 bug 改。

~~管理后台真正待做~~ **已全部完成并部署（2026-09-04 晚）**：详情抽屉、管理端 `GET /api/v1/admin/posts`（昵称/邮箱 LIKE+分页+total，JWT 鉴权已线上验证 401/200）、总览 ECharts（vue-echarts 按需引入，Dashboard chunk ~574KB 路由懒加载）。同批部署 Worker+SPA+文档站，SPA dist 与本地重建逐字节一致（线上不再是旧构建）。另有本地网络坑：**api.sql-visualizer.jvtools.cn 与 workers.dev 从用户本机 curl 直连 TLS 握手失败**（SEC_E_ILLEGAL_MESSAGE，文档主域正常）——验证后端接口改走 `*.pages.dev` 部署 URL 的 `/api/v1` Pages 函数代理。

### 技术实现

- **认证**：JWT (HS256, Web Crypto API)，密码用 PBKDF2-SHA256（Workers 不支持 bcrypt）
- **投票防重复**：IP+UA 的 SHA-256 指纹 + D1 联合唯一约束
- **限流**：KV 计数，按接口配置不同阈值（提交 5次/h，投票 50次/h，评论 10次/h）
- **推送通知**：**pushplus**（管理员→微信/webhook，用户→邮件渠道）
  - API: `POST http://www.pushplus.plus/send`，token 通过 `wrangler secret put PUSHPLUS_TOKEN` 注入
  - 通知去重：同一事件 5min 内不重复；频率限制：同一邮箱 24h 最多 5 条
- **审计日志**：`sys_audit_logs` 表记录所有管理操作（状态变更/删除/配置修改等）
- **模块化架构**：`src/core/registry.ts` 注册中心，新模块即插即用
- **表命名**：`fb_` = feedback，`sys_ = system`，未来 `an_` = analytics, `cm_` = content

### 后端踩坑（Hono 路由）

- **`*` splat 不捕获**：Hono 的 `c.req.param('*')` 在子路由/前缀挂载（`app.route('/api/v1/feedback', router)`）下**返回空**。`GET /files/*` 读附件 key 时改为从 `c.req.path` 里剥 `/files/` 前缀取 key（已部署修复）。
- **Content-Type 被覆盖**：全局 `/api/*` CORS 中间件会 `c.header('Content-Type','application/json')` 覆盖一切响应头，导致附件回读变成 json（`<img>` 渲染不了）。已对 `c.req.path` 以 `/api/v1/feedback/files/` 开头的路径跳过该覆盖。

### 模块化架构

- 表命名规范：`fb_` = feedback（反馈池），`sys_` = system（系统通用）
- 已创建模块：`modules/feedback/`（完整实现）、`modules/admin/`（完整实现）
- 数据库迁移：`migrations/0001_init.sql`（全量表 10 张）、`migrations/0002_seed.sql`（初始标签+配置+管理员）
- 服务层：`services/pushplus.ts`、`services/jwt.ts`、`services/bcrypt.ts`、`services/fingerprint.ts`
- 中间件：`middleware/rate-limit.ts`、`middleware/auth.ts`、`middleware/audit.ts`

### 推送通知设计

- **新反馈提交** → pushplus 微信/webhook → 通知管理员
- **状态变更 / 官方回复 / 合并** → pushplus 邮件渠道 → 通知用户（需用户填写邮箱）
- 用户提交时昵称和邮箱均为**非必填**，邮箱不公开，仅用于通知；创建接口校验邮箱格式（`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`，400 拒绝），前端 FeedbackForm 同步校验（i18n `tipEmailInvalid`）
- `fb_notifications` 表记录推送状态（status: 0 待发/1 成功/2 失败）。~~2026-09-05 起四个场景都实际写入~~ **2026-09-05 审计更正：线上只有 2 条 test 记录，user_notify 从未落库**——账号无 KV 命名空间，依赖 KV 的去重/频控直接抛错，用户通知链路没跑通，详见 [[admin-security-audit]]

### 推送分类中文化与线上验收（2026-09-07）

- 管理员推送里分类已中文化：`constants.ts` 新增 `CategoryLabels`（slug→中文，与文档站 i18n `cat.*` 逐一对齐），创建反馈通知与通知日志统一转换；库内仍存 slug（筛选/看板/深链依赖），只改展示层，未知 slug 兜底显示原值。类型/状态/分类标签都是前端 i18n 与后端 constants **双份维护**，改文案须两处同步
- **本机 curl 发中文 JSON 必踩坑**：Windows Git Bash 下 `curl -d '{中文...}'` 会被后端 UTF-8 编码校验 400 拒绝（「请求体编码错误：请使用 UTF-8 编码提交」）——须把 JSON 写入临时文件再 `--data-binary @file`
- 验证接口的可用代理再确认：**文档站主域 `https://sql-visualizer.jvtools.cn/api/v1/*` 本机 curl 直连可用**（TLS 失败的仍只有 api 子域/workers.dev，不必特意绕 pages.dev）；20260913 补充：workers.dev 域名走本机代理（`https_proxy=http://127.0.0.1:7890` + `--ssl-no-revoke`）curl 也可通，浏览器（iab）访问文档站是最贴近用户的验收路径
- **wrangler 非交互环境**（ZCode Bash）无 OAuth 登录态，须 `export CLOUDFLARE_API_TOKEN=$(cat .cf-token)`（token 在 sql-visualizer-admin 仓库根）；`npx wrangler d1 execute ... --remote --json` 只读查生产 D1 很适合验收/取数
- **wrangler deploy「部分失败」假象**：deploy 末尾报 zone route 认证错误（token 无 jvtools.cn zone 的 Workers Routes 权限）+ "Trigger configuration was only partially updated"，但 Worker 代码已上传成功（"Uploaded ..." 在前）；route 绑定的是 Worker 名而非版本，**现有 route 自动服务新代码，线上已生效**，别误判为部署失败
- 推送验收看不到管理员微信消息：用 `npx wrangler d1 execute sql-visualizer-admin --remote` 查 `fb_notifications.content/status` 验收（该表只有 `post_id`，按 post_no 查须 JOIN `fb_posts`）；推送走 waitUntil 异步，创建后等几秒再查

### 推送加配置（2026-09-05 已上线，计划 20260905-0200）

- **管理后台可视化配置**：Settings.vue 顶部「推送加」卡片，存 `sys_settings` 的 `pushplus.*` 六键（enabled/token/topic/channel/template/option），优先级 **sys_settings > 环境变量 > 默认**；`GET /admin/settings` 已过滤 pushplus.*，通用设置页不重复展示
- **三个管理接口**（JWT）：`GET/PUT /admin/pushplus/config`（token 只回掩码，永不回明文；PUT token 留空=保持不变）、`POST /admin/pushplus/test`（body 可选，传了就用表单当前值；结果写 fb_notifications type=test）
- **发送走 `@perk-net/perk-pushplus-sdk` 1.2.2**：零运行时依赖、fetch、Workers 兼容；`client.send()` 成功 resolve 流水号，失败抛 `PushPlusError`（业务 code）。**安装需 `--legacy-peer-deps`**（仓库原有 wrangler4 要 workers-types v5 的 peer 冲突，与 SDK 无关）
- pushplus code=200 仅代表受理，不等于送达；真实消息 token 已通过管理接口写入线上 sys_settings（不进 git）；线上测试发送两次 code=200 已验证
- 用户邮件通知固定 mail 渠道，不受管理员渠道配置影响；邮件实际收件人由 pushplus 账号绑定邮箱或 option 渠道编码决定（反馈者邮箱仅去重/频控）


### 后续待办

- 配置自定义域名 `api.sql-visualizer.jvtools.cn`
- 通过 `wrangler secret put` 注入生产环境密钥（ADMIN_TOKEN_SECRET、PUSHPLUS_TOKEN）
- VitePress 前端组件集成（`about/feedback.md` 嵌入反馈池）
- Phase 2：数据统计面板、通知中心、内容管理
- Phase 3：用户画像、运营配置、插件市场

**Why:** 用户原计划用 Spring Boot + MySQL，调研后发现 Cloudflare Workers 不支持 Java；Workers + D1 方案零运维、零成本、全球加速、内置 DDoS 防护。项目从「需求反馈池」扩展为「通用管理后台」，反馈池作为首个模块。

**How to apply:** 后续开发在 `sql-visualizer-admin` 目录下进行，后端用 TypeScript + Hono + D1。新功能以模块方式注册到 `registry.ts`。前端组件在 VitePress 中用 Vue 3 编写，通过 `/api/v1/*` 代理到 Worker。推送配置通过 `wrangler secret put` 注入。
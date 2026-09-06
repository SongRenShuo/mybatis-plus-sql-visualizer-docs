---
search: false
---

# 站点域名更名 SQL Visualizer — 开发计划

> 创建：2026-09-02
> 用途：插件已更名 SQL Visualizer，文档站的线上域名和 Cloudflare Pages 项目随之更新为新名
> 关联：`docs/开发计划/20260902-0015-同步插件v2026.9.2功能到文档站-开发计划.md`（该计划决定更名以显示名为限、域名不变，本计划推翻其中「域名不变」一条，其余决策不受影响）

---

## 1. 现状分析

### 1.1 需要更新的对象

| 对象 | 现值 | 拟改为 | 说明 |
|------|------|--------|------|
| 自定义域名 | `mybatis-plus-sql-visualizer.jvtools.cn` | `sql-visualizer.jvtools.cn` | 用户访问入口，核心变更 |
| Cloudflare Pages 项目名 | `mybatis-plus-sql-visualizer-docs` | `sql-visualizer-docs` | 项目名在 Cloudflare 不可重命名，只能新建项目 |
| pages.dev 默认域名 | `mybatis-plus-sql-visualizer-docs.pages.dev` | `sql-visualizer-docs.pages.dev` | 随新项目自动获得 |
| config.mts ld+json url | 旧域名 | 新域名 | 结构化数据里的站点 URL |
| config.mts sitemap hostname | 旧域名 | 新域名 | 影响生成的 sitemap.xml 全部链接 |
| package.json deploy 脚本 | `--project-name mybatis-plus-sql-visualizer-docs` | `--project-name sql-visualizer-docs` | wrangler 部署目标 |

### 1.2 不需要改的（重要边界）

全仓检索确认，旧域名只出现在 `.vitepress/config.mts` 两处和历史文档中。其余 `mybatis-plus-sql-visualizer` 字样全部属于插件身份，沿用上一轮更名决策继续保留：

- Marketplace 链接（`plugins.jetbrains.com/plugin/33633-...`）：按插件 ID 跳转，改不改 slug 都能访问
- Gitee 仓库地址（`gitee.com/songrenshuo/mybatis-plus-sql-visualizer`）：仓库本身未改名
- Vue 组件（BadgeBar / HeroSection / NavBarGitee 等）里的链接全部是上述两类，无一引用站内域名
- `docs/开发计划/`、`docs/发行说明/` 是历史记录，不回写

也就是说仓库内的代码改动只有 config.mts 和 package.json 两个文件，工作量大头在 Cloudflare 侧操作。

### 1.3 部署链路现状

部署走 wrangler CLI 直传静态文件（Cloudflare Pages 不支持 Gitee Git 连接），与 Git 仓库解耦，所以新建项目不需要任何仓库迁移。自定义域名通过 API 添加，DNS CNAME 因 token 权限不足需在 Dashboard 手动加。

## 2. 待确认决策

- 新域名：按现有命名风格取 `sql-visualizer.jvtools.cn`，如想用其他子域（如 `sqlviz.jvtools.cn`）在 Phase 2 前定即可
- 旧域名处置：旧域名 301 跳转到新域名并保留一段时间（推荐），还是直接弃用不跳转。推荐跳转——旧链接（含搜索引擎收录）不断流

## 3. 任务拆分

### Phase 1 仓库改动（本地先行，一次提交）

- `.vitepress/config.mts`：ld+json `url`、sitemap `hostname` 两处替换为新域名
- `package.json`：deploy 脚本 `--project-name` 改为 `sql-visualizer-docs`
- 检查构建产物无需人工干预：og/meta 均无旧域名硬编码，其余由 sitemap hostname 派生

### Phase 2 Cloudflare 侧（wrangler + API + Dashboard）

1. 创建新项目：`wrangler pages project create sql-visualizer-docs --production-branch main`
2. `npm run deploy`（此时脚本已指向新项目），确认 `sql-visualizer-docs.pages.dev` 可访问
3. API 添加自定义域名：`POST /accounts/{account_id}/pages/projects/sql-visualizer-docs/domains`，body 为 `{"name":"sql-visualizer.jvtools.cn"}`
4. Dashboard 手动添加 DNS CNAME：`sql-visualizer` → `sql-visualizer-docs.pages.dev`（开启代理小黄云），等待证书签发（通常几分钟内）
5. curl 验证 `https://sql-visualizer.jvtools.cn` 返回 200 且证书有效

### Phase 3 旧域名 301 跳转

- 在 jvtools.cn zone 加 Redirect Rule（Dashboard → Rules → Redirect Rules，或 API）：匹配 `http.host eq "mybatis-plus-sql-visualizer.jvtools.cn"`，301 到 `concat("https://sql-visualizer.jvtools.cn", http.request.uri.path)`，保留路径和查询串
- zone 级重定向在请求进入 Pages 之前生效，旧项目是否还活着不影响跳转
- 验证：旧首页、旧功能页（如 `/features/sql-log`）各 curl 一次，确认 301 且路径无损

### Phase 4 收尾与观察期

- 搜索引擎：向 Google Search Console / Bing Webmaster 提交新域名的 sitemap.xml，旧域名在站长平台做地址变更（如已收录）
- 旧项目 `mybatis-plus-sql-visualizer-docs` 已删除（2026-09-02，旧域名 DNS CNAME 保留并指向本项目，301 正常）

## 4. 验证清单

- [ ] 新域名首页 200，证书有效
- [ ] 中英文切换、搜索、更新日志接口（Marketplace changelog）正常
- [ ] `https://sql-visualizer.jvtools.cn/sitemap.xml` 内链接全部为新域名
- [ ] 页面源码 ld+json 的 url 为新域名
- [ ] 旧域名任意路径 301 到新域名对应路径
- [ ] `npm run deploy` 幂等（重复执行无副作用）

## 5. 风险与回滚

- 回滚成本极低：把 deploy 脚本的 project-name 改回旧项目重新部署即回到原状，旧项目在整个观察期内原样保留
- 新域名 DNS 未生效前的窗口期：旧域名照常服务，无停机
- 301 跳转规则若写错路径保留逻辑，最坏情况是旧链接落到新域名首页而非对应页，随时可在 Dashboard 修正规则
- pages.dev 旧子域 `mybatis-plus-sql-visualizer-docs.pages.dev` 无法重定向（属旧项目），随旧项目删除自然消失，无 SEO 价值需迁移

---

## 6. 实施记录（2026-09-02）

与计划的差异和落地情况：

- 仓库改动照 Phase 1 完成（config.mts 两处 + deploy 脚本），另有新增 `functions/_middleware.js`，提交 daefa11
- 新项目 `sql-visualizer-docs` 已创建并部署，`https://sql-visualizer-docs.pages.dev` 可访问（200）
- 自定义域名已通过 API 挂到新项目：新域名 `sql-visualizer.jvtools.cn` 新增；旧域名从旧项目删除后迁入新项目
- **旧域名 301 未用 zone Redirect Rule**，改为 Pages 根级中间件 `functions/_middleware.js`：wrangler OAuth token 只有 `pages:write` 没有 zone 写权限，中间件方案 API 即可完成，且顺带覆盖旧 pages.dev 主机（这个 zone 规则做不了，pages.dev 不在自己 zone 里）
- DNS 两处需 Dashboard 手动（token 无 dns_records 权限，DoH/nslookup 复核确认）：
  1. 新增 CNAME：`sql-visualizer` → `sql-visualizer-docs.pages.dev`（新增，代理开启）
  2. 修改旧记录：`mybatis-plus-sql-visualizer` 的 CNAME 目标从 `mybatis-plus-sql-visualizer-docs.pages.dev` 改为 `sql-visualizer-docs.pages.dev`（API 验证报 `CNAME record not set`，指向旧项目导致验证 pending；改指向前旧域名短暂 522）
- CNAME 生效后证书由 Google CA 自动签发（validation method http），旧域名 301 随中间件生效，无需再操作
- **验证结果（2026-09-02）**：两域名均 active；新域名首页与功能页 200；旧域名 / 与 /features/sql-log?x=1 均 301 到新域名且路径查询串无损；旧 pages.dev 200（旧项目仍服务，观察期后删除）；sitemap 38 条全为新域名、0 条旧；ld+json url 与 name 均正确

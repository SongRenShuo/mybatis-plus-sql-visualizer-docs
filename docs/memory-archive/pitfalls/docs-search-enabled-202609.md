---
name: docs-search-enabled-202609
description: 文档站搜索 20260906 已切换 Pagefind 1.5.2（原生中文分词、静态索引、自研弹窗全页覆盖），P0 的 MiniSearch patch 已移除
metadata:
  node_type: memory
  type: project
  originSessionId: sess_dd6a2354-80e6-4149-a7b8-8e473a4a67b7
---

文档站搜索演进（2026-09-06 当天两轮）：先发现搜索因 search 配置写在 `locales.*.themeConfig`（VitePress 只认顶层）从未生效，做了 P0 修复（顶层配置 + CJK bigram + 客户端 MiniSearch.loadJSON patch）；当天即按推荐升级 **P1：整体切换 Pagefind 1.5.2**，P0 的 patch、cjkTokenize、themeConfig.search 已全部移除。

现行架构（线上 = 源码）：

- 构建链 `vitepress build && node scripts/prepare-pagefind.mjs && pagefind --site .vitepress/dist --exclude-selectors "[data-nosnippet], .VPNav, .VPSidebar, .VPFooter, .VPBackToTop, .pf-trigger, .VPLocalNav, .VPSkipLink"`（build 与 deploy 脚本都带）
- UI：`PagefindSearch.vue` 自研弹窗懒加载 CLI 产物 `/pagefind/pagefind-ui.js|css`（npm 无独立 pagefind-ui 包），挂三处：nav-bar-content-after、nav-screen-content-after、zh 首页 NavHeader（layout:false 自绘顶栏）；Ctrl/Cmd+K、`/` 开，Esc 关
- 内部页排除：prepare-pagefind.mjs 给 docs/** 与 README.html 的 `<body>` 加 `data-pagefind-ignore`（**`.pagefindignore` 文件在 1.5.2 不生效**）；docs md 里 P0 时代加的 frontmatter `search: false` 仍在，对 pagefind 无害
- 1.5.2 Extended 索引格式：`pagefind-entry.json` + `index/*.pf_index` + `fragment/*.pf_fragment`（旧式 `/zh-cn/pagefind.json` 路径不存在，curl 探测 404 是预期）；索引 40 页（zh-cn 20 + en-us 20）约 1.2MB

陷阱备忘：`bundlePath` 必须 `/pagefind/` 带尾斜杠；`display:none` 的 llms 插件提示块会被索引，须 exclude-selectors；SSR 的导航/侧栏/页脚会泄进摘要，同样靠 exclude-selectors；手动重跑 pagefind 后 sirv preview 必须重启否则 "invalid gzip data"。**结果卡片仅标题行是 `<a>`**（摘要 excerpt 在链接外），组件里 onResultClick 点击委托补整卡可点；SPA 链接点击走 pushState 无 popstate 且 `<script setup>` watch `route.data` 实测不回调，改点击后 `setTimeout(closeModal, 0)` 关窗；**键盘 Enter 的合成 click 捕获阶段即 defaultPrevented=true，不能用它做守卫短路**（只排中键/修饰键）；pagefind-ui 1.5.2 无方向键导航，↑↓ 移焦为组件自实现；pagefind 搜索在途时 `.pagefind-ui__result` 是骨架占位（无链接），自动化等待须数 result-link 而非 result。完整踩坑表在 `docs/开发计划/20260906-1400-文档站搜索能力优化-调研报告.md` P1 实施记录与补丁节。

**手机端「搜索弹窗闪现即关」根因 + 索引未上线（2026-09-09 修复并部署，commit 22d4ee2 在 fix/mobile-search-flash 分支，已 --no-ff 合回 master 为 fb53a57）**：现象是手机端点搜索弹窗闪一下就消失。两处独立根因：
1. `openModal()` 先开窗再 `await loadPagefindUI()`，UI 脚本加载失败走 catch 直接 `closeModal()`，刚开的弹窗被瞬间关掉。修复：失败不再关窗，改为弹窗内落地降级提示「搜索组件加载失败，请刷新页面后重试」，并加一次性 `uiLoadAttempted` 标记避免反复挂 script。
2. 排查发现线上 `/pagefind/` 整目录 404（`pagefind-ui.js`/`.css`/`pagefind-entry.json` 全 404，而 `assets/*`、`hashmap.json`、`llms.txt` 等正常 200）——即**索引产物从未随 wrangler deploy 上传**（历史多次部署是「本地 build + 单独 wrangler deploy」拆分执行，跳过了 pagefind 一步，或上传的 dist 不含 pagefind）。这不是代码 bug，是部署流程缺了一步，搜索在桌面端其实同样一直不可用。

修复手段：完整跑 `npm run deploy`（`vitepress build → prepare-pagefind → pagefind → wrangler pages deploy` 一条链）后 `/pagefind/` 全部恢复 200，移动端（390×844）实测弹窗稳定驻留、输入框聚焦、输入「wrapper」返回 5 条真实结果。教训：**验证搜索是否真上线必须 curl 生产 `/pagefind/pagefind-ui.js` 的 HTTP 状态，不能只信本地 preview 或 build 产物**；`.pages.dev` 历史部署子域整个 404/被接管，不能作为排查证据（会用「生产主域普通静态资源 200、唯独 /pagefind 404」来坐实索引缺失）。

**Why:** 搜索是站长最重视的功能；pagefind 原生分词解决了 P0 bigram 的内容用词盲区（"需求池"→top1 需求反馈池）。
**How to apply:** 新增文档页自动进索引无需配置；新增 docs/ 内部页确认落在 `dist/docs/**` 或 `dist/README.html`（prepare 脚本的覆盖范围）；升级 pagefind 版本时重点回归 bundlePath 与 UI 文件名；升级 VitePress 回归三个挂载点类名。部署搜索相关改动后必 curl 生产 `/pagefind/pagefind-ui.js` 确认为 200 而非 404。相关 [[dev-branch-sync-202609]]

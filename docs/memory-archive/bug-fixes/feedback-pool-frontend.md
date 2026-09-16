---
name: feedback-pool-frontend
description: 需求反馈池前后端分属两仓库；看板+首页入口+中文标签+提交弹窗+附件上传(R2)+布局优化+跟随全站中英文均已上线；含 Vue 响应式/Hono splat/docs Pages 代理/VitePress 级联踩坑
metadata:
  node_type: memory
  type: project
  originSessionId: sess_41b651bd-3047-4afc-9754-3f9d449f82ad
---

需求反馈池是**前后端分属两个 git 仓库**：公开前端组件在 `mybatis-plus-sql-visualizer-docs/.vitepress/theme/components/feedback/`（`FeedbackPool/FeedbackPage/RoadmapBoard/StatusBadge/FeedbackForm/FeedbackDetail/i18n`），通过 `/api/v1` 代理到后端；后端在 `sql-visualizer-admin`（Hono + D1，见 [[feedback-pool-cloudflare]]）。

**看板默认 + 首页入口 + 中文标签（原 T1-T7）已实施完成并 git 提交**（`docs/开发计划/20260904-0115-需求池看板优化与首页入口-开发计划.md`）：
- 需求池入口已加进首页 `NavHeader.vue` 和 `config.mts` nav（中英文），排在「关于」前。
- `FeedbackPool.vue` 默认 `view='board'`；看板覆盖全部状态（待审/评估中/已规划/进行中/已完成/已关闭=6+7），卡片补置顶/类型/分类/评论，列色接主题变量。
- 中文标签收敛到前端 `i18n.ts`（`type.*/status.*/cat.*`）；后端 `PostTypeLabels/PostStatusLabels` 与 `STATUS_MAP/TYPE_MAP` 已中文化，`isPinned` 已透出。
- 中英切换状态提升到 `FeedbackPage` 共享给列表/详情。
- 「提交反馈」已改弹窗：默认隐藏，点「＋ 新增反馈」弹出；×/Esc/点遮罩可关；成功后自动关。

**附件上传（已全部完成并上线）**，见 `docs/开发计划/20260904-0809-提交反馈弹窗与附件上传-开发计划.md`：
- 后端**用独立 `fb_attachments` 表**（用户明确要求，不用 `fb_posts.extra_data`）；字节存 R2（勿 base64 塞 D1）。
- R2 已启用：桶 `sql-visualizer-attachments`、binding `BUCKET`（admin `wrangler.toml`），迁移 `0003_attachments.sql` 已应用到线上 D1，Worker 已 `wrangler deploy`。账号 id `7d64866e048ee8f161981483477fa320`。
- 接口约定：`POST {apiBase}/feedback/upload`（multipart 字段 `file`，上限 5MB、白名单 png/jpg/jpeg/gif/webp/pdf/txt/md，不含 svg，超限 413/类型 415）→ `{key,fileName,mimeType,fileSize}`；`GET {apiBase}/feedback/files/{key}` 回读；`/posts` 可带 `attachments[]`（≤3 个）。
- 实现时用 3 个子智能体并行（前端 docs feedback 组件+i18n；worker wrangler.toml+migrations/0003+constants+routes+core/types；SPA admin/src/views/Posts.vue+api/index.ts），文件互不冲突。两仓库均已多次 git 提交，docs 经 `wrangler pages deploy` 上线。

**关键踩坑（改 SFC / 写代理时注意）**：
- **docs Pages 生产要调后端，必须在 docs 仓库自带 `functions/api/v1/[[path]].ts` 代理到 Worker**——此前缺失导致生产池 API 全挂（stats 404、上传失败）；管理后台 SPA 已有 `admin/functions/api/v1/[[path]].ts`。该代理透传 method+body（`request.arrayBuffer()`）+auth/content-type。
- **Vue 响应式陷阱**（`FeedbackForm.vue` 附件列表）：`items.value.push(plainObj)` 后直接 mutate 本地原件不触发更新（数组存的是代理）。修复：用 `reactive({...})` 建附件项，File 用 `markRaw()` 包住（否则 FormData 不认）。
- **弹窗布局**：弹窗用 flex 纵向（`.modal-body` 滚动 + `.modal-footer` `flex-shrink:0` 固定），否则 footer 被滚出视口。

**UI 优化 + 布局/语言微调（本轮，全部完成并上线）**：
- 提交弹窗：主/次按钮同行右对齐【取消 | 提交反馈】——`FeedbackForm` 移除内部 `.submit-btn`，`defineExpose({ submit, canSubmit, invalidTips })` 交父级，弹窗 footer 渲染两按钮；`embedded` prop 去盒；提交禁用时用 footer 的 `.modal-hint` 提示未满足项（标题≥5字/描述≥10字）；弹窗 `max-width` 加宽到 720px。
- 「功能分类」原生 `<select>` 加 `appearance:none` + 自定义 chevron，对齐 UI 风格。
- 需求池页恢复顶栏：`about/feedback.md` 去掉 `layout:false`、走默认布局 + `sidebar:false`（+ `prev/next:false`），`en/about/feedback.md` 同步改（见 [[vitepress-custom-page-layout]]）。
- `FeedbackDetail.vue` 详情页卡片化（`.fd-card` 统一边框/圆角/间距，状态时间线按状态取色，评论表单对齐全站）。
- **跟随文档站全局中英文切换**：`FeedbackPage` 用 `useData().lang`（`/en`→en 否则 zh）派生 locale，移除页内单独「中/EN」切换按钮。
- 「新增反馈」按钮移到与「列表/看板」同一行（`.pool-toolbar`：左切换、右按钮），不放标题行。
- **加宽 + 收紧顶部留白**：真正限宽的是 VitePress `.content-container{max-width:688px}`（不是组件自身 max-width）；顶部留白来自 `.VPDoc{padding-top:48px}`。在组件非 scoped `<style>` 里用 `:has(.feedback-pool)` 覆盖这两者并加 `!important`（详见 [[vitepress-custom-page-layout]]）。

**布局重构 + 动态日志已全部实施上线（2026-09-04 晚，含管理后台 A1-A6，计划 20260904-1430 全任务完成）**：`/feedback/activity` 公开接口、`layout: page` 两列布局（见 [[vitepress-custom-page-layout]]）、FeedbackActivity 窄屏折到下方；管理后台 SPA 已重新构建部署且线上与源码构建逐字节一致（A1/A2/A3 随重建生效）、Posts 详情抽屉+昵称/邮箱模糊查询（新管理端 `GET /api/v1/admin/posts`，401 鉴权已验证）、总览 ECharts（Dashboard 路由懒加载 chunk ~574KB）。本段以下为原始计划记录：`docs/开发计划/20260904-1430-需求池布局重构与动态日志-开发计划.md`。根因：需求池页走 VitePress **默认 doc 布局**，右侧空白=**文档大纲 `.aside`（「页面导航」，`sidebar:false` 只管左侧 sidebar，不管右侧 outline）** → 整体偏左不居中；顶部留白来自 `.VPDoc padding-top`（`:has()+!important` 覆盖较脆）。方案：`about/feedback.md` 改回 `layout:false` + 顶部 `VPNavBar` + **居中两列**（左 `FeedbackPool` / 右新建 `FeedbackActivity` 动态面板）。后端需新增**公开**接口 `GET /api/v1/feedback/activity`（汇总 `fb_status_logs` 状态变更 + `fb_posts` 新增反馈，倒序限量；现有 `/admin/changelog`、`/admin/user-activity` 都要鉴权，不能给公开页用，见 [[sql-visualizer-admin]]）。任务：T1 后端接口 / T2 整页两列布局 / T3 动态面板 / T4 联调部署。

**提交弹窗 UX 修整（2026-09-05 已上线）**：用户报「提交按钮灰色无法点击」，真机复现结论是**不是 bug**——后端强制 标题5-200/描述≥10（routes.ts POST /posts 400 校验），前端 isValid 同阈值，填够即解禁；灰色只是因为阈值提示原先是 footer 一行 12px 灰字没人注意。修复=让要求可见：标题/描述 label 右侧实时计数 n/5、n/10（达标变绿 .char-count.ok）、placeholder 写明字数要求、footer 提示橙色 ⚠ 加粗；弹窗加宽 720→880px。浏览器验证踩坑：browser-use IAB 的 getByRole 点击「＋ 新增反馈」永远超时（元素 visible/enabled 都正常），改用 evaluate 里 DOM 原生 .click() 绕过。

**日期修复 + 看板搜索（2026-09-06 已上线，commit 5047ffe）**：D1 `CURRENT_TIMESTAMP` 存 UTC 且格式 `YYYY-MM-DD HH:MM:SS` 无时区标识——直接 `new Date()` 得 Invalid Date（页面渲染出字面量且无异常），`replace(' ','T')` 则按本地时区误解偏 8 小时。统一走新建的 `feedback/dateTime.ts` `parseUtcDate()`（空格换 T、无时区后缀补 `Z`、失败返回 null 回退原文），`FeedbackDetail/FeedbackPool/FeedbackActivity` 三组件共用；相对时间文案新增 i18n 键 `timeToday/timeYesterday/timeWeeksAgo` 随中英切换。看板搜索=在 `FeedbackPool.vue` 看板分支加输入行绑**同一个** `searchKeyword`、回车走同一 `applySearch()`（服务端 `?keyword=`），`RoadmapBoard.vue` 保持纯展示未动。详见 `docs/开发计划/20260906-1448-需求池日期修复与看板搜索-开发计划.md`。
- 测试坑：`el.value=x` 不触发 input 事件、Vue v-model 不感知，须原生 value setter + `dispatchEvent(new Event('input'))`；`vitepress preview` 参数是站点根不是 dist；preview 进程锁 `.vitepress/dist` 会让下次 `vitepress build` rimraf 失败（部署前先杀）；本地 preview 无 Pages functions，用 request interception 把相对 `/api/v1` 改写到生产域名；正式域名 `.html` 路径 308 到 clean URL，curl 不带 `-L`、Python urllib 默认不跟 308 → 产物 grep 假阴性。

**提交后自动刷新 + 刷新按钮 + 评论昵称选填（2026-09-06 晚已上线，docs 3e7d9c7/1ebc0c0、admin 3a10754）**：弹窗 `done`→`onSubmitted` 关窗即 `loadData()` 并 emit `submitted`；`FeedbackPool`/`FeedbackActivity` 均 `defineExpose({ reload })`，`FeedbackPage` 监听 submitted 联动刷动态、深链弹窗 done 同刷池+动态（计划 `docs/开发计划/20260906-2304-*-开发计划.md` ×2）。工具栏加描边「刷新」按钮（i18n `refresh`），loading 时旋转+禁点，移动端 toolbar 换行。评论昵称选填=后端删 400「请填写昵称」校验、`(body.authorName||'').trim()||'匿名'`（`fb_comments.author_name TEXT NOT NULL`，落「匿名」兼容），前端 placeholder 复用既有 `formName` 键、按钮只校验内容、作者展示 `|| '匿名'` 兜底。线上验证技巧：Git Bash curl 传中文测试体会被 GBK 弄乱导致长度校验假通过，验证用 ASCII；无昵称+合法内容 POST 不存在帖号返回 404（旧码会 400 请填写昵称）即证明选填已生效，不写脏数据。

**How to apply:** 前端改动在 docs 仓库、后端在 sql-visualizer-admin；全流程已上线。若再遇前端池请求失败，先确认 docs `functions/api/v1/[[path]].ts` 代理在；写 SFC 列表用 `reactive()` 而非 push 普通对象（File 用 `markRaw`）；改 VitePress 全页宽度/留白参考 [[vitepress-custom-page-layout]]；验证别用 Playwright（用户要求），改用构建产物 grep + curl 抓已部署页。
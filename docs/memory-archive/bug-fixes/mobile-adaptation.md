---
name: mobile-adaptation
description: 文档站+管理后台移动端适配已实施上线（2026-09-05）：断点统一 768px，docs
  汉堡导航/横滚看板/表格滚动恢复，admin 抽屉侧边栏+useIsMobile
metadata:
  node_type: memory
  type: project
  originSessionId: sess_133f66e9-713e-4957-9907-2e86fdd048be
---

**文档站 + 管理后台移动端适配 2026-09-05 已实施并部署上线**（计划：两仓库各自 `docs/开发计划/20260905-0233-*移动端适配-开发计划.md`，含逐文件行号级问题清单，盘点用两个 Explore 并行完成）。断点业界统一约定 768px（Bootstrap/antd/Element Plus 栅格同款）；**不引入 postcss-px-to-viewport/amfe-flexible**（C 端方案，对 Element Plus/文档站风险高收益低），走媒体查询 + 响应式绑定。

**docs 仓库**（VitePress，改动 8 文件）：style.css 表格恢复 VitePress 默认 `display:block; overflow-x:auto`（原自定义覆盖 `display:table` 曾破坏全站文档页表格横滚）；NavHeader ≤767px 汉堡按钮+下拉导航（首页 `layout:false` 不渲染 VPNavBar，此前移动端首页无法导航）；CoolHome `overflow-x:clip` 裁 hero 光斑；FeedbackPool 移动端默认 list 视图+控件 1rem 防 iOS 聚焦缩放；RoadmapBoard ≤767px 横滚看板（flex+scroll-snap，列 min-width 260px）；FeedbackDetail/Activity/Form/VoteButton 字号触控修整。样式文件实际在 `theme/style.css`、NavHeader 在 `theme/components/home/`。

**admin 仓库**（Element Plus，改动 8 文件 + 1 新增）：`admin/src/composables/useIsMobile.ts`（matchMedia('(max-width: 768px)')，全项目唯一移动端判断来源）；AdminLayout ≤768px 侧边栏改 el-drawer 抽屉（汉堡开/遮罩关/路由跳转自动收，菜单数据 menuItems 数组单一来源，aside 宽度绑回 tokens 变量）；tokens.css 末尾全局兜底（el-dialog/el-message-box max-width:94vw、分页容器 wrap）；Posts 抽屉 size 100%/descriptions column=1/分页 layout 降级 prev-pager-next/次要表格列 v-if 隐藏/操作列动态去 fixed+el-table :key 重建；Notifications/Settings/Dashboard/Stats 同套路。

**2026-09-12 首页移动端修复(三轮合一)**（commit 3bf6d72，20260912 已部署上线）：①FeatureAlternate/DocsShowcase 的 GIF 盒改 `aspect-ratio: 1440/1034` 素材原比例——原 `min-height:300px`+cover 在手机端把 1440×1034 横图裁掉约 1/3 横向画面；②NavHeader 展开菜单全屏化对齐文档页 VPNavScreen（fixed inset:0 + z-index:-1 压 header 背景、链接 1.5rem 水平内边距、打开锁 documentElement 滚动、Esc 关、Transition 淡入、三条杠颜色 text-secondary→text-primary）。

**2026-09-12 三轮修复**（commit b21f10a，20260912 已部署上线，真机反馈）：①手机端大标题两行重叠——根因 VitePress 全局 reset `h1,h2,h3,h4,h5,h6{line-height:24px}` 咬到自定义首页（layout:false 无 .vp-doc 保护）的大字号标题，36px 字号+24px 行高必重叠，PC 端只因标题单行未暴露；修复 `.cool-home h1~h6{line-height:1.25}` 兜底（scoped 显式行高优先级更高不受影响）。②暗色模式 GIF 白边——8 张 poster+GIF 素材四边带录制窗口浅灰窗框（左/右 7-8px、底部 2-8px、顶部 0-1px，仅 sql-to-java 干净），亮色页不可见暗色呈白边；修复三处媒体容器按百分比 `clip-path: inset(0.15% 0.6% 0.85% 0.6%)` 裁边（FeatureAlternate/DocsShowcase/style.css GifPlayer），百分比随渲染尺寸等比缩放，不改素材本体。**教训：VitePress reset 的固定行高对 layout:false 自定义页的 h1-h6 是全局陷阱，新增大字号标题必须带无单位行高；演示素材窗框是录制管线固有产物，新录素材仍会带，靠 clip-path 兜底。**

**2026-09-12 四轮修复：GIF 静态化=hydration 竞态**（commit efda401，已部署上线）：用户真机反馈全站 GIF 变静态。根因：T9c 叠层靠 `@load` 置 gifReady，但 GIF 命中 HTTP 缓存时 img 在 Vue hydration 挂上监听器前已 complete，load 事件丢失 → 叠层恒 opacity:0 → 只显示静态 poster；今天反复部署后缓存命中率高使其从偶发变必现。修复：FeatureAlternate（v-for 按 DOM 序回填）/DocsShowcase（单图 ref）onMounted 按 `img.complete && naturalWidth>0` 直接补位 gifReady/gifError；GifPlayer 的 GIF 是 IntersectionObserver 触发后才插 DOM，监听器必先挂好无需改。生产 DOM 验证：三处叠层 ready 类全命中。**教训：SSR/SSG 页面里『依赖 img load 事件置状态』的模式必须配 onMounted complete 兜底，缓存命中即翻车。**

**验证方式**（无浏览器自动化，符合用户偏好）：两端 `npm run build` + dist grep 新类名/chunk；部署后 curl 部署 URL 的 CSS/JS 产物 grep 标记（overflow-x:clip、nav-hamburger、scroll-snap、useIsMobile chunk 200、max-width:94vw）全部命中。20260912 起可用 browser-use control-browser + setViewportSize(390×844) 手机视口实测（注意：IAB 截图偶发 surface 超时/双影伪影/旧帧，冻结 GIF 或用 evaluate 量几何更稳；4173 端口可能有上会话残留 preview 进程，其文件映射在 dist 重建后会失效，须先 taskkill 再起新服务）。**IAB 环境三大测量陷阱（20260912 实证）：①内嵌 webview 永远不推进 GIF 动画帧（直连 .gif 文件也不动，canvas 逐帧采样恒定），勿用帧差验证动画；②面板隐藏时 CSS transition 计算值冻结（opacity 0/1 读数随可见性跳变）；③hydration/IntersectionObserver 回调被无限拖慢，Vue Transition 清理（rAF/transitionend 驱动）同样冻结——enter-from/leave 中间类会滞留 DOM，勿据此判代码 bug，以状态 watch 副作用（如 overflow 锁）和最终类清理规则为准。验证动画类功能只能读 DOM 类名/内联状态，视觉确认交给用户真机。**

**Why:** 两项目此前均纯 PC 向；admin 全项目只有 2 个 1200px 断点、docs 反馈池系列 0 断点。大厂主流方案（vue-element-plus-admin 等）就是 768px 抽屉侧边栏+媒体查询，不需要重框架。

**How to apply:** 后续新增页面/组件：admin 用 useIsMobile + 768px 媒体查询 + el-dialog 注意 94vw 兜底已有；docs 新组件一律带 768px 断点，表格样式别再覆盖 VitePress 默认的 block 滚动，装饰性绝对定位元素外层要 overflow 裁剪。相关：[[feedback-pool-frontend]]、[[feedback-pool-cloudflare]]、[[vitepress-custom-page-layout]]。

# 项目记忆归档索引

> 本目录存放从本地记忆系统（`~/.zcode/cli/memories/projects/mybatis-plus-sql-visualizer-docs-*/memory/`）归档的历史记忆文件。
> 这些内容已交付/已解决，不再需要每次会话加载，但作为历史记录保留。
> 分类标准见主项目 `docs/记忆精简规范.md`。
>
> **首次精简**：2026-09-14；精简前全量备份 `~/.zcode/cli/memories/projects/mybatis-plus-sql-visualizer-docs-*/memory-backup-2026-09-14/`
> **第二次精简**：2026-09-16（8 个归档 + 1 个收编：cloudflare-gitee-limitation 并入 deployment-target）；精简前全量备份 `~/.zcode/cli/memories/projects/mybatis-plus-sql-visualizer-docs-*/memory-backup-2026-09-16/`
> **项目记忆**：保留 18 个核心文件 + MEMORY.md 索引

## 已修复 Bug / 已完成功能（11 个）

| 文件 | 内容摘要 |
|------|----------|
| [log-timestamp-source-plan-20260915.md](bug-fixes/log-timestamp-source-plan-20260915.md) | 插件日志时间戳计划已实施并合入 master（4406cbd 实证）：LogSqlEntry.logTimestamp 日志原始时间 + 默认显示日志时间可切换 + LogTimestampParser 多格式严格解析 + 历史文件向后兼容；含合并冲突解决（分桶内接 pendingLogLine） |
| [mobile-adaptation.md](bug-fixes/mobile-adaptation.md) | 两项目移动端适配 20260905 已上线（断点 768px 不引入 rem/vw 库；docs 汉堡导航/表格滚动/横滚看板；admin 抽屉侧边栏）+20260912 四轮修复（GIF 比例/全屏菜单/VP reset 行高/素材窗框 clip-path/hydration 竞态）与 IAB 三大测量陷阱（活坑部分由 browser-use-screenshot-fallback 承接） |
| [feedback-pool-cloudflare.md](bug-fixes/feedback-pool-cloudflare.md) | 反馈池后端+管理后台已上线（线上=源码）；推送分类中文化（CategoryLabels，库内存 slug）；验证走文档站主域 /api/v1 代理；推送验收查远程 D1 fb_notifications |
| [feedback-pool-frontend.md](bug-fixes/feedback-pool-frontend.md) | 反馈池前端（20260904-1430 计划布局重构+动态日志+管理后台全部实施上线）；docs 靠自带 /api/v1 Pages 代理连后端；含 Vue/Hono 踩坑 |
| [alert-module.md](bug-fixes/alert-module.md) | 安全预警+IP封禁/一键处理已上线；两个 Pages 项目生产分支都是 main（部署须 --branch=main）；x-client-ip 信任边界与告警误报排查（先看 detail.source_ip）；阈值调优走 sys_settings 勿直接改库 |
| [friend-plugins-tab.md](bug-fixes/friend-plugins-tab.md) | 关于页「友情推荐」tab（20260915 起标题/导航去掉「插件」限定，推荐对象含插件与工具），卡片列表结构 |
| [jb-official-demo-video-research.md](bug-fixes/jb-official-demo-video-research.md) | JB 官方 whatsnew 演示视频参数与手法（1920@30fps、2.6 倍超采样、动静反差节奏）；视频 URL 藏在 entry.js bundle，大文件下载后必须 ffprobe 验证 |
| [admin-security-audit.md](bug-fixes/admin-security-audit.md) | 20260905 管理后台安全审计（公开 JWT 密钥/无 KV/hashPassword/弱口令）——当天全部修复部署验收闭环；修复中沉淀 waitUntil 与代理查询串两坑 |
| [demo-gif-plan-20260907.md](bug-fixes/demo-gif-plan-20260907.md) | GIF 化计划修订一~八全部实施（8 页全 GIF+poster）；后续修订九~十一沿革见活跃记忆 gif-recording-progress |
| [dev-master-merge-20260911.md](bug-fixes/dev-master-merge-20260911.md) | 插件仓库 master→dev 第二轮合并（54c4ab0）+ 录制环境 262 合入与工作区清理；录制环境后来以 -PgifRecord 进 master，此记忆成历史 |
| [video-stubs-are-placeholders.md](bug-fixes/video-stubs-are-placeholders.md) | public/video/ 5 个 mp4 占位已随 GIF 化首轮 T10 删除，留档防复引用 |

## 已解决踩坑（2 个）

| 文件 | 内容摘要 |
|------|----------|
| [gif-player-first-viewport-bug.md](pitfalls/gif-player-first-viewport-bug.md) | GifPlayer 20260915 三轮闭环（已复验）：①IO 首屏竞态修复（78e99a0）②首页动/详解页不动 → 取消 poster 兜底改 GIF 直出与首页同构（0040c09/dc2ed561）③「IAB 不播 GIF」系 canvas 采样假象已推翻（动画判据=用户目视，判据坑已收编 browser-use-screenshot-fallback）；scopeId 构建指纹诊断用户端 stale；遗留候选=MP4 治本待拍板；本机 git commit -m 中文偶发乱码用 -F UTF-8 文件 |
| [docs-search-enabled-202609.md](pitfalls/docs-search-enabled-202609.md) | 文档站搜索切换 Pagefind 1.5.2 全实录——配置层级/索引整目录 404（拆分部署漏传）/手机端闪现即关三案；常备口诀「部署后必 curl 生产 pagefind-ui.js」已收编 deployment-target |

## 统计

| 位置 | 文件数 |
|------|--------|
| 项目 memory（保留） | 19（含 MEMORY.md） |
| 归档 archive/ | 14（bug-fixes 11 + pitfalls 2 + README） |

# 项目记忆归档索引

> 本目录存放从本地记忆系统（`~/.zcode/cli/memories/projects/mybatis-plus-sql-visualizer-docs-*/memory/`）归档的历史记忆文件。
> 这些内容已交付/已解决，不再需要每次会话加载，但作为历史记录保留。
> 分类标准见主项目 `docs/记忆精简规范.md`。
>
> **首次精简**：2026-09-14；精简前全量备份 `~/.zcode/cli/memories/projects/mybatis-plus-sql-visualizer-docs-*/memory-backup-2026-09-14/`
> **项目记忆**：保留 22 个核心文件 + MEMORY.md 索引

## 已修复 Bug / 已完成功能（4 个）

| 文件 | 内容摘要 |
|------|----------|
| [admin-security-audit.md](bug-fixes/admin-security-audit.md) | 20260905 管理后台安全审计（公开 JWT 密钥/无 KV/hashPassword/弱口令）——当天全部修复部署验收闭环；修复中沉淀 waitUntil 与代理查询串两坑 |
| [demo-gif-plan-20260907.md](bug-fixes/demo-gif-plan-20260907.md) | GIF 化计划修订一~八全部实施（8 页全 GIF+poster）；后续修订九~十一沿革见活跃记忆 gif-recording-progress |
| [dev-master-merge-20260911.md](bug-fixes/dev-master-merge-20260911.md) | 插件仓库 master→dev 第二轮合并（54c4ab0）+ 录制环境 262 合入与工作区清理；录制环境后来以 -PgifRecord 进 master，此记忆成历史 |
| [video-stubs-are-placeholders.md](bug-fixes/video-stubs-are-placeholders.md) | public/video/ 5 个 mp4 占位已随 GIF 化首轮 T10 删除，留档防复引用 |

## 已解决踩坑（1 个）

| 文件 | 内容摘要 |
|------|----------|
| [docs-search-enabled-202609.md](pitfalls/docs-search-enabled-202609.md) | 文档站搜索切换 Pagefind 1.5.2 全实录——配置层级/索引整目录 404（拆分部署漏传）/手机端闪现即关三案；常备口诀「部署后必 curl 生产 pagefind-ui.js」已收编 deployment-target |

## 统计

| 位置 | 文件数 |
|------|--------|
| 项目 memory（保留） | 23（含 MEMORY.md） |
| 归档 archive/ | 6（bug-fixes 4 + pitfalls 1 + README） |

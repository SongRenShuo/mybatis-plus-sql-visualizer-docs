---
name: dev-master-merge-20260911
description: 插件仓库 master 合入 dev 第二轮已完成（54c4ab0，全量3733绿）；dev 工作树留有 2 个 GIF 录制期 stash 待还原
metadata:
  node_type: memory
  type: project
  originSessionId: sess_6223f189-9e58-423e-b87b-249eb1b37da3
---

插件仓库（F:\code\Java\Gitee\SongRenShuo\mybatis-plus-sql-visualizer）2026-09-11 完成 master→dev 第二轮合并，merge commit `54c4ab0`，全量 3733/0/0/6 绿（290 套件，dev 基线 3696 + master 新增 37）。

关键语义定案（后续 dev→master 反向合并时要对齐）：
- **SqlPreviewPanel 顶部布局最终定案=master 单行「更多」折叠菜单模式**（用户定案，合并时曾取 dev 两行版，后在 344977c 反转）：metaLabel CENTER + 工具栏 EAST 单行、F3 宽度截断预算扣除工具栏理想宽、低频动作（导入/对比/分享）折叠「更多」菜单、EXPLAIN 内联。dev 的 T-GifHeader 两行版已废弃。**注意：修订九 GIF 重录环境（mpsv-gif-fresh）detached 在 c2d37bf（两行布局提交），重录前须把录制基底挪到含 344977c 的新 dev，否则录出的头部样式与定案不符**，见 [[gif-recording-progress-20260909]]。
- createEditor 预热降级整取 master 超集版（含 ReadAction 包裹）；LogToSqlPanel 保留 dev ConversionOutput 管线、计数用 master countPlaceholders 口径。

**20260911 追加：mpsv-gif-fresh 已并入 dev（merge 9173e3c）且整套录制痕迹清理完毕**。录制工作区唯一实改动=build.gradle.kts 修订九录制配置（262 平台/JCEF/toolchain24/沙盒 MPSV-GifFresh），以分支 `gif-record-262env`（c91aa6d）合入；5 个 record/*.py 是 CRLF 幻影改动未入合并。**dev 构建基线自此切到 2026.2.1 录制平台**，回退=revert 9173e3c。清理明细（20260911）：dev 旧 stash×2（scene_t3 注释/修订八配置）已 drop；mpsv-gif-fresh 工作区已删（605MB build 缓存、无录制产物；Windows 长路径致 `git worktree remove` 报 Filename too long，`rm -rf` + `git worktree prune` 解决）；分支 gif-record-262env 确认是 dev 祖先后 `-D` 删除（`-d` 相对 HEAD=master 检查会误报未合并）。**后续修订九重录直接在 dev 工作树做**（262 配置已就位，且含单行折叠菜单新布局）。

远端无 dev 分支（纯本地）；测试跑 gradle 前记得登记独立沙盒（当时用过 MPSV-MergeMaster2-262，已注销）。

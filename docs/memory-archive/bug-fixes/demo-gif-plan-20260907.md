---
name: demo-gif-plan-20260907
description: 20260907 GIF化计划已两轮全部实施（修订一~八）——8页全GIF+poster、修订八7/8重录本地commit 00b035e 待部署、T6留旧版因输入编辑器回归待修后补录
metadata:
  node_type: memory
  type: project
  originSessionId: sess_be1dc2c6-482d-461d-86a7-93074142f241
---

`docs/开发计划/20260907-1138-文档站演示图GIF化补齐与替换-开发计划.md`（T0~T11，修订一~八）**已全部实施**：首轮 8 张 20260910 上线；修订八重录 20260911 本地 commit 00b035e（docs）+ c2d37bf（插件 dev 前置修复：弹窗头部两行布局 + 预热临时文件失败降级）**未部署，等用户确认**。

**最终格局**：8 页全 GIF + 同名 poster；修订八重录 7/8，T6（sql-to-java）保留上轮成品——dev 构建 SQL→Java 输入编辑器不收点击/键盘（新会话复现，疑 T-Perf-07/T-M52 ReadAction 改造回归），属插件真实缺陷需单独立项修，修好后用 `record/scene_t6_sql2java.py` 补录（坐标需重标）。

**Why:** 演示力与官方风格对齐是门面；修订八重录因上轮两类画面缺陷（弹窗 UI 重叠/SQL 标红）——前者已布局修复根治，后者实证为录制时数据源未完成内省的瞬态（非插件缺陷）。

**How to apply:** 部署前先在预览确认 GIF 播放与 poster→GIF 淡入（T9c）；录制管线与踩坑见 [[gif-recording-progress-20260909]]；资产现状见 [[per-feature-demo-assets]]；官方风格基准见 [[jb-official-demo-video-research]]。

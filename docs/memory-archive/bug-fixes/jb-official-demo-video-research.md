---
name: jb-official-demo-video-research
description: JetBrains IDEA 2026.2 官方 whatsnew 演示视频调研结论（20260907）——1920@30fps mp4、2.6 倍超采样、动静反差节奏，视频 URL 藏在 JS bundle 需从 entry.js 提取
metadata:
  node_type: memory
  type: reference
  originSessionId: sess_be1dc2c6-482d-461d-86a7-93074142f241
---

2026-09-07 为演示图 GIF 化计划（[[demo-gif-plan-20260907]]）调研 IDEA 官方 whatsnew 演示视频，结论已写入计划 2.7 节。

**硬参数（2 支完整样本实测）：** DB_migration（66s）与 Spring_Security（91s）均为 h264 1920×1080@30fps、码率 4.8~5.5Mbps、单支 45~54MB；页面 video 元素显示 732×412 ≈ 2.6 倍超采样；每支视频配同帧 PNG poster（video 元素带 poster + loop）。JetBrains Marketplace 规则另已核实：描述图推荐宽 600-800px、GIF 允许、zip 上限 400MB。

**核心手法：** 亮色 Light 主题 + 超大字号（1080p 下代码观感 20px+）+ 全窗口构图（主体内容占 70%+）；场景检测显示静动分布极不均匀（91 秒仅 9 个画面突变点，8~53 秒连续静止）——「长静止 + 动作瞬间爆发」的反差节奏是表现力本质；auto-zoom 局部放大。主题即 2026.2 沙盒全新默认主题（New UI 浅色）——沙盒默认设置与官方样片天然一致，录制直接用沙盒默认即可（用户已确认弃用「亮色」表述，写入 GIF 计划修订四 [[demo-gif-plan-20260907]]）。

**获取技巧（下次可复用）：**

- jetbrains.com/idea/whatsnew 是 JS 应用壳，2MB HTML 里 grep 不到 video/mp4——视频清单藏在 JS bundle（`/_assets/idea/whatsnew/<版本>/index.entry.*.js`）里，grep 该文件提取全部视频文件名
- 视频直链模式：`https://download.jetbrains.com/resources/idea/video/whatsnew/<版本>/<Name>.mp4`（Logpoints.mp4 探测 206 成功过）
- 大文件下载用 curl `run_in_background` + `--retry`，并行下多支容易截断（moov atom not found）——下载后必须 ffprobe 验证，损坏别硬修，两支有效样本足够做帧分析
- ffmpeg 场景检测定位变化时刻：`ffmpeg -v info -i x.mp4 -vf "select='gte(scene,0.08)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*"`，抽帧用 `-ss <t> -frames:v 1 -vf scale=760:-1` 控制体积

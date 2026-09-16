---
name: gif-player-first-viewport-bug
description: GifPlayer 20260915 两次修复闭环——IO 首屏竞态修复后用户真实浏览器仍静止，按用户指令取消 poster 兜底改 GIF 直出（与首页同构）；scopeId 构建指纹/IAB 不播 GIF/MP4 治本候选
metadata:
  node_type: memory
  type: project
  originSessionId: sess_740d54f1-689b-45ab-a470-81615e6e6ff6
---

**第一轮修复（IO 首屏竞态，commit 78e99a0/部署 340b0b86，已被第二轮取代）**：GifPlayer 懒加载门 IntersectionObserver 对「注册观察时已在视口内」的元素不回调 → GIF img 不挂载恒显模糊 poster。修复=isNearViewport 同步放行。此机制现已被第二轮整体拆除，仅作历史。

**第二轮（修订一，用户指令「取消静态图兜底」，commit 0040c09 + 9ff60bf，部署 dc2ed561）**：用户真实浏览器实测「首页动画正常、功能详解页静止」——首页 FeatureAlternate 与 GifPlayer 同样有 poster 叠层 + loading=lazy，唯一结构差异是 **GIF img 存在方式：首页 SSR 初始直出，GifPlayer 由 JS hydration 后动态插入（v-if 门控 + absolute 叠层淡入）**。判定为动态插入动画 GIF 的 Chromium 解码停帧。实施：GifPlayer.vue 重写为 GIF 直出——GIF img 随 SSR 存在（与首页同构），拆掉 v-if 懒加载门 / IntersectionObserver / isNearViewport / poster 叠层 / opacity 淡入 / syncGifState 全套；props 删 poster；失败防破图灰色占位盒保留；20 处 md 调用（features×18 + getting-started×2）删 poster 属性。生产验证：单图 static 直出 + opacity 1 + complete。

**行为变化**：①弱网下 GIF 加载期页面区域短暂空白（原 poster 撑布局），GIF 失败无静态兜底；②getting-started 页 GIF 原在视口外靠懒加载延迟，现打开即拉（1.6MB）；③GIF 模式点击暂停无语义（仅 video 分支有效）。**poster PNG 文件仍留在 public/demo/（未删文件，只是功能页 md 不再引用）**。

**经验沉淀落位（20260915 末尾，三方同步；后续引用这些权威源即可，勿重复写）**：
- 仓库侧：`docs/开发笔记/20260915-1300-GIF动画播放验证与渲染结构-开发笔记.md`（commit 681ef2f，20260915 修订一纠正 canvas 误判）——四节：验证方法能力边界（canvas 采样判动画不可靠/IAB 正常播 GIF/单帧截图不可靠）/渲染结构差异根因（SSR 直出 vs 动态插入停帧）/IO 同族问题/验收口径；《演示GIF录制指南-说明文档.md》落地清单动画验收已改「真实可见渲染（用户目视）确认」；docs/MEMORY.md 开发笔记区登记。
- skill 侧（用户级权威源 `~/.zcode/skills/ide-demo-gif/`，不进 git，20260915 已更新）：§4 验收重写为「**动画是否在播只能以真实可见渲染（用户目视/真实浏览器前台）为准**」，canvas 采样与单帧截图不可作动画判据（drawImage 只画首帧，20260915 实证推翻「IAB 不播」误判），IAB 正常播 GIF；坑表 18 修正（canvas 采样假象 + IAB 能播）；坑表 21 新增「动态插入+absolute 叠层停帧但 DOM 全绿」→ 投放优先 SSR 直出、动画确认交用户目视。
- 工作流偏好：一轮踩坑收尾时用户主动要求「沉淀到 docs 相关目录」，并提示检查对应 skill 是否需同步——**沉淀=仓库开发笔记+录制指南+用户级 skill 三方互链**，与「repo 已记录的不重复存本地记忆」原则一致。

**Why:** 用户报「静态图」历经四轮：误判「无图可换」→ 误立章节级多图计划（1100，作废留档）→ IO 竞态修复（真实但非全部）→ 用户真实浏览器分层实测（首页动/详解页不动）才锁死动态插入停帧。教训：修复后必须让用户在其真实浏览器复验，且用「与已验证正常的参照物（首页）结构对齐」作为修复方向；一次只改用户指令的变量（「先取消兜底看看效果」是实验，不是终态）。

**How to apply:** ①诊断「用户看到的还是旧的/静态」按序：页面 DOM `data-v-xxxx` scopeId 对比构建指纹（构建间必变）→ curl 生产 chunk md5 对比本地 dist → CF Pages 部署历史 API 取旧部署 preview URL 对照（方法见 [[deployment-target]]）。②**动画是否在播的判据=用户目视**（IAB 正常播 GIF，canvas 采样判动画不可靠——drawImage 对 GIF 只画首帧，见 [[browser-use-screenshot-fallback]]）——自动侧只做 DOM/结构层判定，动画确认必须交用户目视。③若用户强刷后仍静止：渲染结构已排除（与正常首页同构），转查浏览器扩展（广告拦截器拦 .gif，看 DevTools Network 的 GIF 请求是否 200）或网络层。④**治本候选（已向用户提出待拍板）：GIF 全量换 MP4 video**——GifPlayer 仍保留 `video` prop（传入即 `<video>` 渲染），9 张转码 h264 + 调用处加属性即可；video 不走 GIF 解码管线、体积砍半、对齐 JetBrains 官方方案（[[jb-official-demo-video-research]]）。⑤本机 git commit -m 中文**偶发**乱码（UTF-8 被 GBK 解读，同一会话前正常后乱码）——python 写 UTF-8 文件 + `git commit -F <文件>`，且文件须用 git 进程可解析的路径（/tmp/ 实测失败「could not read log file」，用仓库根相对路径成功）。计划全档：docs/开发计划/20260915-1200（含修订一）。
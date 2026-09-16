---
name: friend-plugins-tab
description: 关于页面新增「友情推荐」tab，用于推荐其他独立开发者插件，支持多个推荐卡片
metadata:
  node_type: memory
  type: project
  originSessionId: sess_cf2db2ad-660b-4728-8fdf-0985c8f887b5
---

关于页面新增了「友情推荐」tab（`/about/friends.md` + `/en/about/friends.md`），位于「更新日志」和「开发路线」之间。

页面结构为卡片列表（`.friend-card`），每个推荐项包含图标、标题、描述和外部链接。设计为可扩展——未来新增推荐只需复制一个 `.friend-card` 块即可。

当前收录：
- **Cool Request**（IDEA HTTP 客户端插件）— 有图标 `public/cool-request-icon.svg`
- **CLI Manager**（跨平台 AI CLI 工作台）— 无图标，使用紫色渐变占位（`.friend-card__icon--placeholder`）

**2026-09-15 去「插件」限定（commit 0a95282 已上线）**：推荐对象已不止 IDEA 插件（CLI Manager 是跨平台 AI CLI 工具），故标题与导航放开为通用表述——`about/friends.md` H1「友情插件推荐」→「友情推荐」、`en/about/friends.md` H1「Friend Plugin Recommendations」→「Friend Recommendations」、`.vitepress/config.mts` 英文导航项「Friend Plugins」→「Friend Recommendations」（中文导航项原本就是「友情推荐」，无需改）；两页导语同步改为「同样由独立开发者打造的好东西——IDEA 插件、开发工具都有」。

**How to apply:** 新增推荐时，有图标用 `<img>`，无图标用 `<div class="friend-card__icon friend-card__icon--placeholder">文字</div>`。中英文两页同步添加。**标题/导航不再带「插件」二字**——新增非插件类推荐（工具/服务/AI CLI 等）无需再改标题，直接加卡片即可；改标题或导航项时三个位置（中页 H1 / 英页 H1 / config.mts 英文导航）要一起改，中文导航在 config.mts 条目中已是通用表述。
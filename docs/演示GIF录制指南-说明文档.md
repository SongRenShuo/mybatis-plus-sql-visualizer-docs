---
search: false
---

# 演示 GIF 录制指南（已迁出）

> 2026-10-31 迁入插件仓库：**`mybatis-plus-sql-visualizer/docs/录制/演示GIF录制指南-说明文档.md`**。
>
> 原因：录制起点固定为插件仓库（沙盒、场景脚本 `record/`、通用基建 `.zcode/skills/ide-demo-gif/scripts/` 全在那里），
> 指南留在文档站会与插件仓两侧漂移。本页只作路径占位，不维护内容。

## 现在去哪里看

| 想找 | 位置（插件仓） |
|---|---|
| 录制操作手册（构图规格、环境启动、场景编写、验收） | `docs/录制/演示GIF录制指南-说明文档.md` |
| 录制 skill（管线、定位三件套、坑表 89 条） | `.zcode/skills/ide-demo-gif/SKILL.md` |
| 本轮录制经验（19 条：构建/捕捉面/runner/UI 交互/产物） | `docs/经验总结/20261031-*-第十五轮演示动图补录与录制链根因-经验总结.md` |
| 场景脚本与坐标基线 | `record/scene_*.py`、`record/BASELINE.md` |
| GIF 素材规格校验 | `node record/tools/verify_gif.mjs --dir <素材目录>` |

站点侧只剩**产物**：`public/demo/*.gif` + 同名 poster，以及各功能页的 `<GifPlayer>` 插槽。

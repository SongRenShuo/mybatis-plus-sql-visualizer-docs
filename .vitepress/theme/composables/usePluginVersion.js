import { ref } from 'vue'
import pluginVersion from '../../data/plugin-version.json'

// 版本展示的单一来源：构建期由 scripts/sync-plugin-version.mjs 写入
// .vitepress/data/plugin-version.json（同级插件仓 gradle.properties → Marketplace API → 保留现值）。
// 曾经在客户端拉 /api/changelog 后覆盖显示值——Marketplace 公开版落后于开发版时，
// 页面会先显示构建期版本再跳变回旧版（实测 v2026.10.31 → v2026.10.30），已移除该覆盖逻辑。
const FALLBACK_VERSION = `v${pluginVersion.version}`

export function usePluginVersion() {
  const version = ref(FALLBACK_VERSION)

  return { version }
}

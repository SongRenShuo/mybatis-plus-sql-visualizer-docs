import { ref } from 'vue'
import pluginVersion from '../../data/plugin-version.json'

// Marketplace API 不可用时的静态兜底。值来自构建期注入的单一来源
// （scripts/sync-plugin-version.mjs 写 .vitepress/data/plugin-version.json）——
// 此前是手写字符串，实测会静默滞后（曾停在 v2026.9.18）。
const FALLBACK_VERSION = `v${pluginVersion.version}`

export function usePluginVersion() {
  const version = ref(FALLBACK_VERSION)

  fetch('/api/changelog')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) return
      const latest = data.slice().sort((a, b) => parseInt(b.cdate) - parseInt(a.cdate))[0]
      if (latest?.version) version.value = `v${latest.version}`
    })
    .catch(() => {})

  return { version }
}

import { ref } from 'vue'

// Marketplace API 不可用时的静态兜底，随发版手动同步
const FALLBACK_VERSION = 'v2026.9.4'

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

import { ref } from 'vue'
import fallback from '../../data/facts.json'

/**
 * 「数据事实」卡读数：构建期 facts.json 兜底（scripts/generate-changelog.mjs 生成），
 * 挂载后经 /api/plugin-info（下载量）与 /api/changelog（版本数与跨度）实时刷新。
 * 兜底与实时同源（都是 Marketplace 公开读数），不存在版本号机制当年那种两套口径跳变；
 * 任一实时通道失败都静默保留兜底。
 */

const downloads = ref(Number.isFinite(fallback?.downloads) ? fallback.downloads : null)
const versions = ref(Number.isFinite(fallback?.versions) ? fallback.versions : null)
const days = ref(Number.isFinite(fallback?.days) ? fallback.days : null)
const asOf = ref(String(fallback?.syncedAt ?? '').slice(0, 10) || null)
let started = false

function daysSince(dateStr) {
  const t = Date.parse(dateStr)
  if (Number.isNaN(t)) return null
  return Math.max(1, Math.round((Date.now() - t) / 86400000))
}

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useFacts() {
  if (!started && typeof window !== 'undefined') {
    started = true
    ;(async () => {
      try {
        const updates = await fetchJson('/api/changelog')
        if (Array.isArray(updates) && updates.length) {
          versions.value = updates.length
          const stamps = updates.map((u) => Number(u.cdate)).filter(Number.isFinite)
          if (stamps.length) {
            const oldest = Math.min(...stamps)
            const ms = String(oldest).length >= 13 ? oldest : oldest * 1000
            const firstDate = new Date(ms).toISOString().slice(0, 10)
            const d = daysSince(firstDate)
            if (d) days.value = d
            asOf.value = new Date().toISOString().slice(0, 10)
          }
        }
      } catch {
        /* 保留兜底 */
      }
      try {
        const info = await fetchJson('/api/plugin-info')
        if (Number.isFinite(info?.downloads)) {
          downloads.value = info.downloads
          asOf.value = new Date().toISOString().slice(0, 10)
        }
      } catch {
        /* 保留兜底 */
      }
    })()
  }
  return { downloads, versions, days, asOf }
}

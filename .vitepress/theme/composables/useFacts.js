import { ref } from 'vue'
import fallback from '../../data/facts.json'
import { buildEntries, factsFromEntries } from '../../../scripts/changelog-core.mjs'

/**
 * 「数据事实」卡读数：构建期 facts.json 兜底（scripts/generate-changelog.mjs 生成），
 * 挂载后经 /api/plugin-info（下载量）与 /api/changelog（版本数 / 首版 / 天数）实时刷新。
 *
 * 三张卡的数字都是「实时优先、兜底在后」：
 *   - 下载量：Marketplace 插件详情接口，失败保留兜底；
 *   - 版本数 / 天数：/api/changelog 回来后先按 buildEntries 整理，再用 factsFromEntries
 *     算，与更新日志页、与构建期 facts.json 完全同一套规则——列表接口默认只回 20 条，
 *     直接数条数会少报版本、天数也会算短。
 * 任一实时通道失败都静默保留兜底，不出现空值或错误态。
 */

const downloads = ref(Number.isFinite(fallback?.downloads) ? fallback.downloads : null)
const versions = ref(Number.isFinite(fallback?.versions) ? fallback.versions : null)
const days = ref(Number.isFinite(fallback?.days) ? fallback.days : null)
const firstDate = ref(typeof fallback?.firstDate === 'string' ? fallback.firstDate : null)
const asOf = ref(String(fallback?.syncedAt ?? '').slice(0, 10) || null)
let started = false

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
        const entries = Array.isArray(updates) ? buildEntries(updates) : []
        if (entries.length) {
          const summary = factsFromEntries(entries, downloads.value)
          versions.value = summary.versions
          days.value = summary.days
          firstDate.value = summary.firstDate
          asOf.value = summary.syncedAt
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
  return { downloads, versions, days, firstDate, asOf }
}

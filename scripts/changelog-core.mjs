// 更新日志数据整理核心（构建期生成器与前端实时补齐共用）。
//
// 这里只放纯函数：不碰 fs / fetch / process，浏览器与 Node 都能直接 import。
// 两处必须用同一套规则，否则「构建期 SSR 的版本小节」与「打开页面后实时补的
// 版本小节」会出现口径差异（例如累计日志截取、HTML 白名单净化）。
//
// 关键事实（2026-11-01 实测）：updates API 每条 notes 是「累计日志」——最新一条里
// 按 h2 逐版列出全部历史；因此每条只截取与自身版本号匹配的那个 h2 小节。
// cdate 是 13 位毫秒时间戳（不是秒），日期取 UTC。

export const SUMMARY_MAX = 80

export const normVersion = (v) => String(v ?? '').trim().replace(/^v/i, '')

export function toDate(cdate) {
  const n = Number(cdate)
  const ms = String(cdate).length >= 13 ? n : n * 1000
  return new Date(ms).toISOString().slice(0, 10)
}

/** 去重（按归一化版本号，保留 cdate 最新的条目）+ 倒序 */
export function collectUpdates(raw) {
  if (!Array.isArray(raw)) throw new Error('API 返回不是数组')
  const byVersion = new Map()
  for (const item of raw) {
    const version = normVersion(item.version)
    if (!version) continue
    const prev = byVersion.get(version)
    if (!prev || Number(item.cdate) > Number(prev.cdate)) byVersion.set(version, item)
  }
  return [...byVersion.values()].sort((a, b) => Number(b.cdate) - Number(a.cdate))
}

/**
 * 从累计 notes 里截取属于该版本的 h2 小节（不含小节标题本身）。
 * 找不到精确匹配标题时返回 null（由调用方退回整段 notes）。
 */
export function extractOwnSection(notes, version) {
  if (!notes) return null
  const target = normVersion(version).toLowerCase()
  const re = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/gi
  let start = -1
  let headerLen = 0
  let m
  while ((m = re.exec(notes))) {
    const text = m[1].replace(/<[^>]+>/g, '').trim()
    if (start === -1 && normVersion(text).toLowerCase() === target) {
      start = m.index
      headerLen = m[0].length
    } else if (start > -1) {
      return notes.slice(start + headerLen, m.index)
    }
  }
  if (start > -1) return notes.slice(start + headerLen)
  return null
}

// ---------- HTML 净化（零依赖白名单） ----------

const ALLOWED_TAGS = new Set(['p', 'ul', 'ol', 'li', 'b', 'strong', 'a', 'code', 'h4', 'br'])
const VOID_TAGS = new Set(['br'])
const ALLOWED_ATTRS = { a: ['href'] }

export function sanitizeHtml(html) {
  if (!html) return ''
  let s = html
  // script/style 连内容一起丢
  s = s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
  // 其余标题统一降为白名单内的 h4
  s = s.replace(/<(\/?)h[1-6]\b[^>]*>/gi, (_m, close) => `<${close}h4>`)
  // 非白名单标签剥壳留内容；白名单标签重建，只保留许可属性
  s = s.replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g, (m, name, attrs) => {
    const tag = name.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ''
    if (VOID_TAGS.has(tag)) return '<br>'
    if (m.startsWith('</')) return `</${tag}>`
    const kept = []
    const allow = ALLOWED_ATTRS[tag] || []
    for (const am of attrs.matchAll(/([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
      const attr = am[1].toLowerCase()
      if (!allow.includes(attr)) continue
      const val = (am[2] ?? am[3] ?? am[4] ?? '').trim()
      if (!/^(https?:\/\/|\/|#|mailto:)/i.test(val)) continue // 拦 javascript: 等危险协议
      kept.push(`href="${val.replace(/"/g, '&quot;')}"`)
    }
    return `<${tag}${kept.length ? ' ' + kept.join(' ') : ''}>`
  })
  // 残留的孤立尖括号转义，避免破坏页面结构
  s = s.replace(/<(?![a-zA-Z/!])/g, '&lt;')
  return s.trim()
}

// ---------- 摘要 ----------

export function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
}

/** 取净化后小节的首段纯文本（跳过裸版本号行），截 80 字 */
export function firstSummaryText(sectionHtml) {
  const lines = decodeEntities(sectionHtml.replace(/<[^>]+>/g, '\n'))
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const body = lines.filter((l) => !/^v?\d{4}(\.\d+)+$/.test(l))
  const text = body[0] ?? ''
  return text.length > SUMMARY_MAX ? `${text.slice(0, SUMMARY_MAX - 1)}…` : text
}

/** API 原始数组 → 页面用的版本条目（倒序） */
export function buildEntries(raw) {
  return collectUpdates(raw).map((u) => {
    const own = extractOwnSection(u.notes, u.version)
    const notesHtml = sanitizeHtml(own ?? u.notes ?? '')
    return {
      version: normVersion(u.version),
      date: toDate(u.cdate),
      notesHtml,
      summaryZh: firstSummaryText(notesHtml),
    }
  })
}

function versionParts(version) {
  return String(version)
    .split('.')
    .map((n) => Number(n) || 0)
}

/** 同日或日期缺失时的稳定次序：版本号数字逐段倒序 */
function compareEntries(a, b) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  const pa = versionParts(a.version)
  const pb = versionParts(b.version)
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pb[i] ?? 0) - (pa[i] ?? 0)
    if (d !== 0) return d
  }
  return 0
}

/**
 * 实时数据优先、构建期快照兜底：
 * - 实时里有的版本一律用实时内容（老版本被改过说明、补丁版本后上架都能同步）
 * - 实时里没有、但构建期快照里有的版本保留（API 偶发缺条时不丢历史）
 */
export function mergeEntries(liveEntries, staticEntries) {
  const byVersion = new Map()
  for (const e of Array.isArray(staticEntries) ? staticEntries : []) {
    byVersion.set(normVersion(e.version), e)
  }
  for (const e of Array.isArray(liveEntries) ? liveEntries : []) {
    byVersion.set(normVersion(e.version), e)
  }
  return [...byVersion.values()].sort(compareEntries)
}

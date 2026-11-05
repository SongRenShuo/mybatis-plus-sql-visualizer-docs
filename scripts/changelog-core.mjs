// 更新日志数据整理核心（构建期生成器与前端实时补齐共用）。
//
// 这里只放纯函数：不碰 fs / fetch / process，浏览器与 Node 都能直接 import。
// 两处必须用同一套规则，否则「构建期 SSR 的版本小节」与「打开页面后实时补的
// 版本小节」会出现口径差异（例如累计日志截取、HTML 白名单净化）。
//
// 关键事实（2026-11-01 实测）：updates API 每条 notes 是「累计日志」——最新一条里
// 按 h2 逐版列出全部历史；cdate 是 13 位毫秒时间戳（不是秒），日期取 UTC。
//
// 但每条 update 的 notes 是**该版本上架当时的快照**，不是后台当前内容：后台后来
// 从老版本说明里删掉的句子（例如「好用的话，欢迎到 Marketplace 页评分留言」只该留在
// 最新版，后台会在下次发版时从老版本小节里删掉）仍留在老快照里。因此内容一律以
// **最新一条 notes** 的累计日志为准，只在最新日志缺该版本时才回退到自身快照。
// 2026-11-04 实测：按老快照截取时 2026.10.16~2026.11.3 八版都带评分留言，
// 按最新日志截取后只剩 2026.11.3 带，与 Marketplace 公开页一致。

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
 * 把累计 notes 按标题切成小节，返回 Map<归一化版本号, 小节 HTML（不含标题本身）>。
 * 标题形如 `<h2>v2026.11.3</h2>`，key 取标题里的版本号。
 */
export function parseSections(notes) {
  const map = new Map()
  if (!notes) return map
  const re = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]\s*>/gi
  const heads = []
  let m
  while ((m = re.exec(notes))) {
    heads.push({
      version: normVersion(m[1].replace(/<[^>]+>/g, '')),
      start: m.index,
      bodyStart: m.index + m[0].length,
    })
  }
  for (let i = 0; i < heads.length; i += 1) {
    const bodyEnd = i + 1 < heads.length ? heads[i + 1].start : notes.length
    const section = notes.slice(heads[i].bodyStart, bodyEnd)
    if (heads[i].version && !map.has(heads[i].version)) map.set(heads[i].version, section)
  }
  return map
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

/**
 * 版本号即日期（`YYYY.M.D`）时的兜底日期：草稿 / 已隐藏 / 已删除的版本不在 updates
 * API 里，Marketplace 任何公开位置也不给它们日期，只能用版本号推。实测约一半正式
 * 版本的实际上架日期与版本号同日，其余差 1~4 天（上架流程延迟），故这是近似值。
 */
export function dateFromVersion(version) {
  const m = String(version).match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/)
  if (!m) return null
  const [, y, mo, d] = m
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
}

/**
 * API 原始数组 → 页面用的版本条目（倒序）。
 *
 * 内容一律取最新一条 notes 的累计日志（后台当前状态），版本号与上架日期取各条 API
 * 记录。老快照只作回退：最新日志缺该版本（刚上架、累计日志还没带上）时才用。
 *
 * 累计日志里有、API 里没有的版本（草稿 / 已隐藏 / 已删除——实测 2026.10.26 在后台是
 * Approved·Hidden，故被公开 API 略去）也一并补出，日期用版本号推导，与 Marketplace
 * 公开页 What's New 的 30 版口径一致。
 */
export function buildEntries(raw) {
  const updates = collectUpdates(raw)
  if (!updates.length) return []
  const sections = parseSections(updates[0].notes)
  const byVersion = new Map()
  for (const u of updates) {
    const version = normVersion(u.version)
    const own = sections.get(version) ?? extractOwnSection(u.notes, version)
    const notesHtml = sanitizeHtml(own ?? u.notes ?? '')
    byVersion.set(version, {
      version,
      date: toDate(u.cdate),
      notesHtml,
      summaryZh: firstSummaryText(notesHtml),
    })
  }
  for (const [version, html] of sections) {
    if (byVersion.has(version) || !dateFromVersion(version)) continue
    const notesHtml = sanitizeHtml(html)
    byVersion.set(version, {
      version,
      date: dateFromVersion(version),
      notesHtml,
      summaryZh: firstSummaryText(notesHtml),
    })
  }
  return [...byVersion.values()].sort(compareEntries)
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

/**
 * 取最新 N 版摘要（首页「最近更新」用）。
 * summaryEn 保留既有手工翻译，但只在中文摘要没变时才沿用——老版本说明被改过后，
 * 旧译文已经对不上新中文，退回与中文同文，等人工重译。
 */
export function buildLatestUpdates(entries, existing, count = 3) {
  const oldByVersion = new Map(
    (Array.isArray(existing?.updates) ? existing.updates : []).map((u) => [normVersion(u.version), u]),
  )
  return entries.slice(0, count).map((e) => {
    const prev = oldByVersion.get(normVersion(e.version))
    const summaryEn =
      prev && prev.summaryEn && prev.summaryEn !== prev.summaryZh && prev.summaryZh === e.summaryZh
        ? prev.summaryEn
        : e.summaryZh
    return {
      version: e.version,
      date: e.date,
      summaryZh: e.summaryZh,
      summaryEn,
    }
  })
}

/**
 * 事实卡读数（版本数 / 首版日期 / 天数）：构建期兜底与前端实时共用同一套规则。
 *
 * 口径取「更新日志页上列出的版本」而不是 Marketplace 列表页的条数：
 * 列表接口默认只回 20 条、会把最早的几版截掉，而日志页由 buildEntries 从累计
 * 日志补全（含未上架版本），两边对不上时卡片会少报版本数、天数也会算错。
 */
export function factsFromEntries(entries, downloads = null, now = Date.now()) {
  const dates = entries.map((e) => e.date).filter(Boolean).sort()
  const firstDate = dates[0] ?? null
  const days = firstDate ? Math.max(1, Math.round((now - Date.parse(firstDate)) / 86400000)) : null
  return {
    downloads: Number.isFinite(downloads) ? downloads : null,
    versions: entries.length,
    firstDate,
    days,
    syncedAt: new Date(now).toISOString().slice(0, 10),
  }
}

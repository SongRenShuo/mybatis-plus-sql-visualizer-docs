// 构建期更新日志生成器（C 车道）。
//
// 从 JetBrains Marketplace API 拉取插件 33633 的全部更新，生成两份数据：
//   1. .vitepress/data/changelog.json      —— 每版 { version, date, notesHtml }，供
//      about/changelog.md / en/about/changelog.md 的 ChangelogList 构建期 SSR 直出
//   2. .vitepress/data/latest-updates.json —— 最新 3 版摘要，供首页 RecentUpdates 区块
//
// 关键事实（2026-11-01 实测）：updates API 每条 notes 是「累计日志」——最新一条里
// 按 h2 逐版列出全部历史；因此每条只截取与自身版本号匹配的那个 h2 小节。
// cdate 是 13 位毫秒时间戳（不是秒），日期取 UTC（与 B 车道 stub 口径一致）。
//
// 网络策略：node fetch 直连 → 失败降级 curl -x 127.0.0.1:7890 → 都失败则保留磁盘
// 既有 JSON，console.warn 后 exit 0。网络故障绝不阻断构建。
//
// 幂等：内容无变化不写文件，保持 mtime 稳定，避免构建噪音。
import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const API_URL = 'https://plugins.jetbrains.com/api/plugins/33633/updates'
const PLUGIN_PAGE = 'https://plugins.jetbrains.com/plugin/33633-sql-visualizer'
const PROXY = 'http://127.0.0.1:7890'
const CHANGELOG_OUT = resolve(repoRoot, '.vitepress/data/changelog.json')
const LATEST_OUT = resolve(repoRoot, '.vitepress/data/latest-updates.json')
const LATEST_COUNT = 3
const SUMMARY_MAX = 80

// ---------- 拉取 ----------

async function fetchDirect() {
  const res = await fetch(API_URL, {
    headers: { 'User-Agent': 'sql-visualizer-docs-build' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function fetchViaCurlProxy() {
  const r = spawnSync(
    'curl',
    ['-sf', '--max-time', '30', '-x', PROXY, API_URL],
    { encoding: 'buffer', maxBuffer: 8 * 1024 * 1024 },
  )
  if (r.status !== 0) throw new Error(`curl exit ${r.status}`)
  return JSON.parse(Buffer.from(r.stdout).toString('utf8'))
}

async function fetchUpdates() {
  try {
    return await fetchDirect()
  } catch (e) {
    console.warn(`[changelog] 直连 Marketplace 失败（${e?.message ?? e}），降级走本地代理`)
  }
  return fetchViaCurlProxy()
}

// ---------- 版本条目整理 ----------

const normVersion = (v) => String(v ?? '').trim().replace(/^v/i, '')

function toDate(cdate) {
  const n = Number(cdate)
  const ms = String(cdate).length >= 13 ? n : n * 1000
  return new Date(ms).toISOString().slice(0, 10)
}

/** 去重（按归一化版本号，保留 cdate 最新的条目）+ 倒序 */
function collectUpdates(raw) {
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
function extractOwnSection(notes, version) {
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

function sanitizeHtml(html) {
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

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'")
}

/** 取净化后小节的首段纯文本（跳过裸版本号行），截 80 字 */
function firstSummaryText(sectionHtml) {
  const lines = decodeEntities(sectionHtml.replace(/<[^>]+>/g, '\n'))
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const body = lines.filter((l) => !/^v?\d{4}(\.\d+)+$/.test(l))
  const text = body[0] ?? ''
  return text.length > SUMMARY_MAX ? `${text.slice(0, SUMMARY_MAX - 1)}…` : text
}

const LATEST_COMMENT =
  '构建期由 scripts/generate-changelog.mjs 从 JetBrains Marketplace API 自动重写，手工改动会被覆盖。' +
  'summaryZh 取对应版本 notes 首条纯文本（≤80 字）；summaryEn 沿用此前的手工翻译，新版本在翻译前与 summaryZh 同文。' +
  `数据来源 ${API_URL}`

function buildLatestJson(entries, existing) {
  const oldByVersion = new Map(
    (Array.isArray(existing?.updates) ? existing.updates : []).map((u) => [normVersion(u.version), u]),
  )
  const updates = entries.slice(0, LATEST_COUNT).map((e) => {
    const prev = oldByVersion.get(normVersion(e.version))
    // 既有条目若带人工翻译（en !== zh），保留；新版本摘要中英同文
    const summaryEn =
      prev && prev.summaryEn && prev.summaryEn !== prev.summaryZh ? prev.summaryEn : e.summaryZh
    return {
      version: e.version,
      date: e.date,
      summaryZh: e.summaryZh,
      summaryEn,
    }
  })
  return `${JSON.stringify({ _comment: LATEST_COMMENT, updates }, null, 2)}\n`
}

// ---------- 写文件（无变化不写，保 mtime） ----------

function writeIfChanged(file, content, label) {
  let current = null
  try {
    current = readFileSync(file, 'utf8')
  } catch {
    /* 首次生成 */
  }
  if (current === content) {
    console.log(`[changelog] ${label} 无变化，不重写`)
    return false
  }
  writeFileSync(file, content, 'utf8')
  console.log(`[changelog] ${label} 已写入（${content.length} 字符）`)
  return true
}

// ---------- 主流程 ----------

async function main() {
  let raw
  try {
    raw = await fetchUpdates()
  } catch (e) {
    console.warn(
      `[changelog] 直连与代理均失败（${e?.message ?? e}），保留磁盘上既有的 changelog.json / latest-updates.json`,
    )
    process.exit(0)
  }

  let updates
  try {
    updates = collectUpdates(raw)
  } catch (e) {
    console.warn(`[changelog] API 数据不可用（${e?.message ?? e}），保留既有文件`)
    process.exit(0)
  }
  if (updates.length === 0) {
    console.warn('[changelog] API 返回空列表，保留既有文件')
    process.exit(0)
  }

  const entries = updates.map((u) => {
    const own = extractOwnSection(u.notes, u.version)
    const notesHtml = sanitizeHtml(own ?? u.notes ?? '')
    return {
      version: normVersion(u.version),
      date: toDate(u.cdate),
      notesHtml,
      summaryZh: firstSummaryText(notesHtml),
    }
  })

  const changed1 = writeIfChanged(
    CHANGELOG_OUT,
    `${JSON.stringify(entries, null, 2)}\n`,
    'changelog.json',
  )

  let existingLatest = null
  try {
    existingLatest = JSON.parse(readFileSync(LATEST_OUT, 'utf8'))
  } catch {
    /* 无既有文件 */
  }
  const changed2 = writeIfChanged(LATEST_OUT, buildLatestJson(entries, existingLatest), 'latest-updates.json')

  console.log(
    `[changelog] 共 ${entries.length} 版，最新 ${entries
      .slice(0, LATEST_COUNT)
      .map((e) => e.version)
      .join(' / ')}（${changed1 || changed2 ? '有更新' : '全部无变化'}）`,
  )
}

await main()

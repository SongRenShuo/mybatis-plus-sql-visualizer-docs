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
import { buildEntries, buildLatestUpdates, collectUpdates, toDate } from './changelog-core.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const API_URL = 'https://plugins.jetbrains.com/api/plugins/33633/updates'
const PLUGIN_API_URL = 'https://plugins.jetbrains.com/api/plugins/33633'
const PLUGIN_PAGE = 'https://plugins.jetbrains.com/plugin/33633-sql-visualizer'
const PROXY = 'http://127.0.0.1:7890'
const CHANGELOG_OUT = resolve(repoRoot, '.vitepress/data/changelog.json')
const LATEST_OUT = resolve(repoRoot, '.vitepress/data/latest-updates.json')
const FACTS_OUT = resolve(repoRoot, '.vitepress/data/facts.json')
const LATEST_COUNT = 3

// ---------- 拉取 ----------

async function fetchDirect(url = API_URL) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'sql-visualizer-docs-build' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function fetchViaCurlProxy(url = API_URL) {
  const r = spawnSync(
    'curl',
    ['-sf', '--max-time', '30', '-x', PROXY, url],
    { encoding: 'buffer', maxBuffer: 8 * 1024 * 1024 },
  )
  if (r.status !== 0) throw new Error(`curl exit ${r.status}`)
  return JSON.parse(Buffer.from(r.stdout).toString('utf8'))
}

async function fetchUpdates(url = API_URL) {
  try {
    return await fetchDirect(url)
  } catch (e) {
    console.warn(`[changelog] 直连 Marketplace 失败（${e?.message ?? e}），降级走本地代理`)
  }
  return fetchViaCurlProxy(url)
}

// ---------- 版本条目整理 ----------

// 归一化 / 截取 / 净化 / 摘要都放在 changelog-core.mjs，前端实时补齐复用同一套规则。

const LATEST_COMMENT =
  '构建期由 scripts/generate-changelog.mjs 从 JetBrains Marketplace API 自动重写，手工改动会被覆盖。' +
  'summaryZh 取对应版本 notes 首条纯文本（≤80 字）；summaryEn 沿用此前的手工翻译（中文摘要变了就不再沿用），新版本在翻译前与 summaryZh 同文。' +
  '首页「最近更新」打开时会用 /api/changelog 实时刷新，本文件是构建期兜底。' +
  `数据来源 ${API_URL}`

function buildLatestJson(entries, existing) {
  const updates = buildLatestUpdates(entries, existing, LATEST_COUNT)
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

// ---------- 事实卡读数（facts.json：构建期兜底，前台经 /api/plugin-info 实时刷新） ----------

function buildFacts(updates, downloads) {
  const dates = updates
    .map((u) => Date.parse(toDate(u.cdate)))
    .filter((n) => !Number.isNaN(n))
  const firstDate = dates.length ? new Date(Math.min(...dates)).toISOString().slice(0, 10) : null
  const days = firstDate
    ? Math.max(1, Math.round((Date.now() - Date.parse(firstDate)) / 86400000))
    : null
  return {
    downloads: Number.isFinite(downloads) ? downloads : null,
    versions: updates.length,
    firstDate,
    days,
    syncedAt: new Date().toISOString().slice(0, 10),
  }
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

  const entries = buildEntries(raw)

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

  // 事实卡兜底：下载量来自插件详情 API；拉取失败回落既有 facts.json 的值（首次为 null）
  let downloads = null
  try {
    const detail = await fetchUpdates(PLUGIN_API_URL)
    const n = Number(detail?.downloads)
    downloads = Number.isFinite(n) ? n : null
  } catch (e) {
    console.warn(`[changelog] 插件详情拉取失败（${e?.message ?? e}），downloads 沿用既有 facts.json`)
    try {
      downloads = JSON.parse(readFileSync(FACTS_OUT, 'utf8'))?.downloads ?? null
    } catch {
      /* 首次生成 */
    }
  }
  const changed3 = writeIfChanged(FACTS_OUT, `${JSON.stringify(buildFacts(updates, downloads), null, 2)}\n`, 'facts.json')

  console.log(
    `[changelog] 共 ${entries.length} 版，最新 ${entries
      .slice(0, LATEST_COUNT)
      .map((e) => e.version)
      .join(' / ')}；事实卡 downloads=${downloads}（${changed1 || changed2 || changed3 ? '有更新' : '全部无变化'}）`,
  )
}

await main()

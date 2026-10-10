// 构建期插件版本注入。
//
// 目的：`config.mts` 的 JSON-LD `softwareVersion` 与前端 `usePluginVersion` 的兜底值
// 此前都是手写字符串，每轮发版都要人工改，实测会静默滞后（2026-10-08 扫出仍停在 2026.9.4）。
// 本脚本在构建/部署前把版本写进 `.vitepress/data/plugin-version.json`，成为唯一来源。
//
// 取值顺序：
//   1. 环境变量 `PLUGIN_VERSION`（显式覆盖，CI 可用）
//   2. 同级插件仓 `../mybatis-plus-sql-visualizer/gradle.properties` 的 `version=`
//      （本机开发布局下最准，零网络）
//   3. JetBrains Marketplace API（换机器 / 无同级仓时）
//   4. 保留 JSON 里的现值
//
// 任一步失败都只告警、不阻断构建——版本号是展示性数据，不该让构建挂掉。
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const outFile = resolve(repoRoot, '.vitepress/data/plugin-version.json')
const pluginRepoProps = resolve(repoRoot, '../mybatis-plus-sql-visualizer/gradle.properties')
const MARKETPLACE_API = 'https://plugins.jetbrains.com/api/plugins/33633/updates?size=1'

const normalize = (v) => String(v ?? '').trim().replace(/^v/, '')
const looksLikeVersion = (v) => /^\d{4}\.\d+/.test(v)

function readExisting() {
  try {
    return JSON.parse(readFileSync(outFile, 'utf8'))
  } catch {
    return {}
  }
}

function fromEnv() {
  return normalize(process.env.PLUGIN_VERSION)
}

function fromPluginRepo() {
  if (!existsSync(pluginRepoProps)) return ''
  const m = readFileSync(pluginRepoProps, 'utf8').match(/^\s*version\s*=\s*(.+)$/m)
  return m ? normalize(m[1]) : ''
}

async function fromMarketplace() {
  const res = await fetch(MARKETPLACE_API, {
    headers: { 'User-Agent': 'sql-visualizer-docs-build' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const list = Array.isArray(data) ? data : []
  list.sort((a, b) => Number(b?.cdate ?? 0) - Number(a?.cdate ?? 0))
  return normalize(list[0]?.version)
}

async function main() {
  const existing = readExisting()
  const candidates = [
    ['env:PLUGIN_VERSION', fromEnv()],
    ['plugin-repo:gradle.properties', fromPluginRepo()],
  ]

  if (!candidates.some(([, v]) => looksLikeVersion(v))) {
    try {
      candidates.push(['marketplace-api', await fromMarketplace()])
    } catch (e) {
      console.warn(`[plugin-version] Marketplace API 不可用（${e?.message ?? e}），跳过该来源`)
    }
  }

  const hit = candidates.find(([, v]) => looksLikeVersion(v))
  const version = hit ? hit[1] : normalize(existing.version)
  const source = hit ? hit[0] : 'unchanged'

  if (!looksLikeVersion(version)) {
    console.warn('[plugin-version] 未取到任何版本来源，且现值不可用——保留原文件不动')
    return
  }

  const changed = version !== normalize(existing.version)
  if (!changed) {
    console.log(`[plugin-version] ${version}（来源 ${source}，无变化）`)
    return
  }

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(
    outFile,
    `${JSON.stringify({ version, source, syncedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8',
  )
  console.log(`[plugin-version] ${version}（来源 ${source}）← 由 ${existing.version ?? '空'} 更新`)
}

await main()

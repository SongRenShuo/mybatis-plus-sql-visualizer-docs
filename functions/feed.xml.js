/**
 * Cloudflare Pages Function — 更新日志 RSS 订阅
 * 路由：/feed.xml
 * 数据源与 /api/changelog 相同：JetBrains Marketplace updates API
 */

const PLUGIN_PAGE = 'https://plugins.jetbrains.com/plugin/33633-sql-visualizer'
const SITE = 'https://sql-visualizer.jvtools.cn'

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function onRequest(context) {
  const pluginId = '33633'
  const apiUrl = `https://plugins.jetbrains.com/api/plugins/${pluginId}/updates`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'MyBatis-Plus-SQL-Visualizer-Docs/1.0',
        'Accept': 'application/json',
      },
    })
    const updates = await res.json()

    if (!Array.isArray(updates)) throw new Error('unexpected API response')

    const items = updates
      .slice()
      .sort((a, b) => parseInt(b.cdate) - parseInt(a.cdate))
      .slice(0, 20)
      .map((u) => {
        // Marketplace cdate 为毫秒时间戳，兼容秒级以防字段变更
        const raw = parseInt(u.cdate)
        const pubDate = new Date(raw > 1e12 ? raw : raw * 1000).toUTCString()
        const desc = stripHtml(u.notes) || `SQL Visualizer ${u.version}`
        return `    <item>
      <title>${escapeXml(`v${u.version}`)}</title>
      <link>${PLUGIN_PAGE}</link>
      <guid isPermaLink="false">${PLUGIN_PAGE}#v${u.version}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
    </item>`
      })
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SQL Visualizer 更新日志</title>
    <link>${SITE}</link>
    <description>IntelliJ IDEA 插件 SQL Visualizer 的版本发布动态</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    return new Response(`RSS 生成失败：${err.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}

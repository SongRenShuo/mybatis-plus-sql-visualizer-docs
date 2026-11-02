/**
 * Cloudflare Pages Function — JetBrains Marketplace 插件详情代理（只取下载量）
 * 路由：/api/plugin-info → 此函数
 * 用途：首页「数据事实」卡前台实时刷新下载量；构建期 facts.json 是兜底，这里给浏览器刷新。
 */

export async function onRequest(context) {
  const { request, env } = context
  const pluginId = '33633'
  const apiUrl = `https://plugins.jetbrains.com/api/plugins/${pluginId}`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SQL-Visualizer-Docs/1.0',
        'Accept': 'application/json',
      },
    })

    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = await res.json()
    const downloads = Number(data?.downloads)

    return new Response(
      JSON.stringify({ downloads: Number.isFinite(downloads) ? downloads : null }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600, s-maxage=600',
        },
      },
    )
  } catch (e) {
    return new Response(JSON.stringify({ downloads: null, error: String(e?.message ?? e) }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
}

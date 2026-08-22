/**
 * Cloudflare Pages Function — JetBrains Marketplace API 代理
 * 路由：/api/changelog → 此函数
 * 解决浏览器跨域问题
 */

export async function onRequest(context) {
  const { request, env } = context
  const pluginId = '33633'
  const apiUrl = `https://plugins.jetbrains.com/api/plugins/${pluginId}/updates`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'MyBatis-Plus-SQL-Visualizer-Docs/1.0',
        'Accept': 'application/json',
      },
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

/**
 * Cloudflare Pages Function — JetBrains Marketplace API 代理
 * 路由：/api/changelog → 此函数
 * 解决浏览器跨域问题
 *
 * size=100 是必需的：接口默认只回 20 条，会把最早几版截掉——事实卡按条数算版本数、
 * 更新日志页的实时补齐也会缺尾巴。这个插件总量在几十条量级，一次取全最省事。
 */

export async function onRequest(context) {
  const { request, env } = context
  const pluginId = '33633'
  const apiUrl = `https://plugins.jetbrains.com/api/plugins/${pluginId}/updates?size=100`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SQL-Visualizer-Docs/1.0',
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

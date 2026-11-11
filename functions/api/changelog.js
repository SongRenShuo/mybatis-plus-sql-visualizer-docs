/**
 * Cloudflare Pages Function — JetBrains Marketplace API 代理
 * 路由：/api/changelog → 此函数
 * 解决浏览器跨域问题
 *
 * size=100 是必需的：接口默认只回 20 条，会把最早几版截掉——事实卡按条数算版本数、
 * 更新日志页的实时补齐也会缺尾巴。这个插件总量在几十条量级，一次取全最省事。
 *
 * 缓存两级（2026-11-11 从 max-age=3600 收紧，缩短发版感知延迟）：
 * 1. 边缘 caches.default 按 URL 共享缓存 5 分钟——全站访客共用一份，上游调用量
 *    反而比「每访客各自穿透」更低；JSON 不在 CF 默认缓存扩展列表，必须显式用 Cache API。
 * 2. 浏览器 max-age=300 + stale-while-revalidate=3600——过期后先回旧值再后台刷新，
 *    重复访问不再白等。5 分钟 TTL 意味着无需（现有令牌也做不到）做缓存清理。
 * caches.default 仅在 Workers 运行时存在，本地 node 仿真（scripts/local-server.mjs）无此 API，判空跳过。
 */

export async function onRequest(context) {
  const { request, env } = context
  const pluginId = '33633'
  const apiUrl = `https://plugins.jetbrains.com/api/plugins/${pluginId}/updates?size=100`
  const edgeCache = typeof caches !== 'undefined' ? caches.default : null

  try {
    if (edgeCache) {
      const hit = await edgeCache.match(request)
      if (hit) return hit
    }

    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SQL-Visualizer-Docs/1.0',
        'Accept': 'application/json',
      },
    })

    const data = await res.json()

    const response = new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    })
    if (edgeCache && res.status === 200) {
      context.waitUntil(edgeCache.put(request, response.clone()))
    }
    return response
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

/**
 * Cloudflare Worker — JetBrains Marketplace API 代理
 * 解决浏览器跨域问题（JetBrains API 无 CORS 头）
 *
 * 部署方式：
 * 1. 将此文件放到 Cloudflare Workers 中
 * 2. 路由：your-domain.dev/api/changelog → 此 Worker
 * 3. 或直接在 Pages 中通过 functions/ 目录部署
 *
 * 本地测试：npx wrangler dev proxy/worker.js
 */

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const pluginId = url.searchParams.get('pluginId') || '33633'
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
          'Cache-Control': 'public, max-age=3600', // 缓存1小时
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
  },
}

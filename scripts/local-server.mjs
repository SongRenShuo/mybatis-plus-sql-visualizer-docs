/**
 * 本地开发服务器 — 模拟 Cloudflare Pages Function
 * 用于本地测试 /api/changelog 代理
 *
 * 用法：node scripts/local-server.mjs
 * 访问：http://localhost:3000
 */

import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, '.vitepress/dist')
const PORT = 3000

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  // API 代理：/api/changelog → JetBrains Marketplace
  if (url.pathname === '/api/changelog') {
    try {
      const apiRes = await fetch(
        'https://plugins.jetbrains.com/api/plugins/33633/updates',
        {
          headers: {
            'User-Agent': 'MyBatis-Plus-SQL-Visualizer-Docs/1.0',
            'Accept': 'application/json',
          },
        }
      )
      const data = await apiRes.json()
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      })
      res.end(JSON.stringify(data))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // 静态文件服务
  let filePath = resolve(DIST, '.' + (url.pathname === '/' ? '/index.html' : url.pathname))

  if (!existsSync(filePath)) {
    // SPA fallback
    filePath = resolve(DIST, 'index.html')
  }

  const ext = filePath.slice(filePath.lastIndexOf('.'))
  const contentType = MIME[ext] || 'application/octet-stream'

  try {
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(PORT, () => {
  console.log(`\n🚀 本地服务器已启动: http://localhost:${PORT}`)
  console.log(`   API 代理: http://localhost:${PORT}/api/changelog`)
  console.log(`   按 Ctrl+C 停止\n`)
})

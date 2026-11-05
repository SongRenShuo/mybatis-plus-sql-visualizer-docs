/**
 * Cloudflare Pages Function — 全局中间件
 * 旧域名 / 旧 pages.dev 整站 301 到新域名，保留路径与查询串
 * 仅拦截两个明确的历史主机，其余（新域名、部署预览子域）直接放行
 *
 * 另：临时工作目录（tmp/、_probe/）一律 404。构建期已用 srcExclude 排除，
 * 这里再兜一道——2026-11-05 发现临时 markdown 曾随构建发布，且撤掉后边缘
 * 仍按 URL 继续返回旧 HTML（s-maxage=604800），中间件在取缓存之前执行，
 * 能立刻把这些路径关掉。
 */

const LEGACY_HOSTS = new Set([
  'mybatis-plus-sql-visualizer.jvtools.cn',
  'mybatis-plus-sql-visualizer-docs.pages.dev',
])

const BLOCKED_PREFIXES = ['/tmp/', '/_probe/']

export function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (BLOCKED_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }

  if (LEGACY_HOSTS.has(url.hostname)) {
    url.protocol = 'https:'
    url.hostname = 'sql-visualizer.jvtools.cn'
    url.port = ''
    return Response.redirect(url.toString(), 301)
  }

  return context.next()
}

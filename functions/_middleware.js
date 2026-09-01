/**
 * Cloudflare Pages Function — 全局中间件
 * 旧域名 / 旧 pages.dev 整站 301 到新域名，保留路径与查询串
 * 仅拦截两个明确的历史主机，其余（新域名、部署预览子域）直接放行
 */

const LEGACY_HOSTS = new Set([
  'mybatis-plus-sql-visualizer.jvtools.cn',
  'mybatis-plus-sql-visualizer-docs.pages.dev',
])

export function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  if (LEGACY_HOSTS.has(url.hostname)) {
    url.protocol = 'https:'
    url.hostname = 'sql-visualizer.jvtools.cn'
    url.port = ''
    return Response.redirect(url.toString(), 301)
  }

  return context.next()
}

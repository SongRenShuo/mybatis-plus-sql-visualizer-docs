/**
 * Pages Function 代理：将 /api/v1/* 转发到 Cloudflare Worker
 * 前端同域请求，手机无需直连 workers.dev；Cloudflare 边缘 → Worker 无网络限制
 */
const UPSTREAM = 'https://sql-visualizer-admin.3064597532.workers.dev/api/v1'

export async function onRequest(context: {
  request: Request
  params: { path?: string[] }
}): Promise<Response> {
  const { request, params } = context
  const segments = params.path || []
  const path = segments.join('/')
  const url = `${UPSTREAM}${path ? '/' + path : ''}`

  const headers = new Headers()
  const auth = request.headers.get('authorization')
  if (auth) headers.set('authorization', auth)
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer()
  }

  return fetch(url, init)
}
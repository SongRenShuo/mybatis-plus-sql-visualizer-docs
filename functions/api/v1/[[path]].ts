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
  // 查询串必须透传：反馈池列表的状态/分类/关键词筛选参数全靠它
  const search = new URL(request.url).search
  const url = `${UPSTREAM}${path ? '/' + path : ''}${search}`

  const headers = new Headers()
  const auth = request.headers.get('authorization')
  if (auth) headers.set('authorization', auth)
  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  // 透传真实访客 IP：Worker 侧看到的 cf-connecting-ip 是代理出口的共享 IP，
  // set() 会覆盖客户端自带的伪造值；限流/审计/告警的按访客粒度全靠它
  const clientIp = request.headers.get('cf-connecting-ip')
  if (clientIp) headers.set('x-client-ip', clientIp)
  // 透传 CF 边缘国家码（batch C）：Pages 域名走 CF 边缘必带此头，Worker 侧用它落
  // st_track_events/fb_posts 的 country 列；set() 覆盖伪造值，直连 workers.dev 无此头落 NULL
  const ipCountry = request.headers.get('cf-ipcountry')
  if (ipCountry) headers.set('cf-ipcountry', ipCountry)
  // 透传 UA：投票指纹 = 访客 IP + UA，不透传则 Worker 侧所有访客 UA 相同、指纹退化为全站单指纹
  const userAgent = request.headers.get('user-agent')
  if (userAgent) headers.set('user-agent', userAgent)
  // 透传 Origin：埋点 /track 的第一道闸是 Origin 白名单校验，缺 Origin 一律 403——
  // 不透传则所有浏览器 PV 到 Worker 时都因 Origin 缺失被拒，访问分析永远只有验证数据
  const origin = request.headers.get('origin')
  if (origin) headers.set('origin', origin)

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
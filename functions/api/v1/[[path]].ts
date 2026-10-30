/**
 * Pages Function 代理：将 /api/v1/* 转发到 Cloudflare Worker
 * 前端同域请求，手机无需直连 workers.dev；Cloudflare 边缘 → Worker 无网络限制
 */
const UPSTREAM = 'https://sql-visualizer-admin.3064597532.workers.dev/api/v1'

export async function onRequest(context: {
  request: Request
  params: { path?: string[] }
  env?: { X_CLIENT_IP_TRUST?: string }
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
  // 代理身份证明（20261031 x-client-ip 信任链收紧）：Worker 侧只有收到与自身
  // X_CLIENT_IP_TRUST secret 相等的 x-proxy-trust 头才采信 x-client-ip，
  // 防 workers.dev 直连者伪造假 IP 绕过限流/封禁/指纹。Pages 与 Worker 配了
  // 同名 secret 就自动带上；secret 未配置（本地 dev/未升密前）不设头，
  // Worker 侧回落 cf-connecting-ip（共享出口 IP，与旧行为的兜底一致）
  const trust = context.env?.X_CLIENT_IP_TRUST
  if (trust) headers.set('x-proxy-trust', trust)
  // 透传 CF 边缘国家码（batch C）：Pages 域名走 CF 边缘必带此头，Worker 侧用它落
  // st_track_events/fb_posts 的 country 列；set() 覆盖伪造值，直连 workers.dev 无此头落 NULL
  const ipCountry = request.headers.get('cf-ipcountry')
  if (ipCountry) headers.set('cf-ipcountry', ipCountry)
  // 透传 CF 边缘地理数据（写时采集三层，2026-10-30）：Pages Functions 运行在 Workers runtime，
  // request.cf 自带访客的城市/区域/ASN——coderutil 只认中国 IPv4，国外 IP 与 IPv6 归属地靠
  // 这层数据。序列化为单头 JSON（字段缺失就省略该键，值全 ASCII 安全）；整个 cf 不存在
  // （本地 dev/部分环境）就不设头，Worker 侧落 NULL 与 country 缺失同语义
  const cf = (request as Request & { cf?: Record<string, unknown> }).cf
  if (cf) {
    const geo: Record<string, string> = {}
    if (typeof cf.country === 'string') geo.country = cf.country
    if (typeof cf.city === 'string') geo.city = cf.city
    if (typeof cf.region === 'string') geo.region = cf.region
    if (typeof cf.asn === 'number') geo.asn = String(cf.asn)
    if (typeof cf.asOrganization === 'string') geo.asOrg = cf.asOrganization
    if (Object.keys(geo).length > 0) headers.set('x-client-geo', JSON.stringify(geo))
  }
  // 声明本请求来自插件官网（20261025-2045 计划）：浏览器同源 GET 不带 Origin，
  // Worker 只能靠这层标注判断站点归属；set() 覆盖客户端可能的伪造值。
  headers.set('x-site-origin', 'plugin')
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
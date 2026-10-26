/**
 * 文档站访问埋点（20260911-1052 计划）
 *
 * 在 enhanceApp 中接入，靠 router.onAfterRouteChanged 覆盖 SPA 站内跳转——
 * VitePress 是单页应用，只监听 load 事件会漏掉全部站内导航。
 *
 * 纪律：任何异常一律吞掉，统计绝不能影响页面；接口地址与反馈池同一套
 * （生产相对路径经 Pages Functions 代理，dev 走 config.mts 里配好的 /api/v1 代理）。
 */

const API_BASE = '/api/v1'

/** 上报一次页面访问；path 站内路径，referrer 站内上一页或 document.referrer */
function report(path: string, referrer: string | null): void {
  try {
    // keepalive：离开页面瞬间的路由跳转/关闭标签也能送出去；响应不关心，catch 全吞
    void fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p: path, r: referrer || undefined }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* 静默 */
  }
}

/**
 * 下载目标白名单。取值即上报的 q，后端原样写入 ext 列，
 * 后台按 `event_type='download' AND ext=<值>` 聚合——拼错的字符串会变成脏 ext，故运行时也要挡。
 */
const DOWNLOAD_TARGETS = ['marketplace', 'gitee-releases'] as const

export type DownloadTarget = (typeof DOWNLOAD_TARGETS)[number]

/**
 * 上报一次下载按钮点击（20261026 下载量统计计划批次 C）。
 * target 只接受 DOWNLOAD_TARGETS 内的值，其余直接丢弃；跳转本身不受影响，
 * 调用方用 @click 并列挂载即可，不要 preventDefault。
 * 自带 keepalive：target=_blank 外链点击后当前页可能被关闭/切走，仍要送出去。
 */
export function trackDownload(target: DownloadTarget): void {
  try {
    if (!DOWNLOAD_TARGETS.includes(target)) return
    const path = cleanPath(typeof location === 'undefined' ? '' : location.pathname)
    const referrer = typeof document === 'undefined' ? '' : document.referrer
    void fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p: path, r: referrer || undefined, e: 'download', q: target }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* 静默 */
  }
}

/** 归一化路由 path：去 hash/query、去 .html 后缀（本站未开 cleanUrls，VitePress 路由事件带 .html）、去尾斜杠 */
function cleanPath(route: string): string {
  let path = route.split(/[?#]/)[0]
  if (path.endsWith('.html')) path = path.slice(0, -5)
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path || '/'
}

/**
 * 安装埋点。enhanceApp 里调用：
 *   setupTracker(router)
 * 首屏无需单独处理——VitePress 初始化也会走一次 router.go()，
 * onAfterRouteChanged 对首次加载同样触发（vitepress 1.6 实证 client/app/index.js）。
 */
export function setupTracker(router: { onAfterRouteChanged: ((to: string) => void) | undefined }): void {
  // 站内来源链：记录上一个 path，路由切换时作为 referrer 上报
  let lastPath: string | null = null

  // document.referrer 是跨站来源（搜索引擎/外链），首屏用它；站内切换用 lastPath
  const externalReferrer = typeof document !== 'undefined' ? document.referrer : ''

  router.onAfterRouteChanged = (to: string) => {
    const path = cleanPath(to)
    if (!path.startsWith('/')) return
    // 同一路由重复触发（前进后退回到同页等）不重报
    if (path === lastPath) return
    report(path, lastPath ?? externalReferrer)
    lastPath = path
  }
}

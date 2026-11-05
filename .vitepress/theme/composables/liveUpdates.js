/**
 * Marketplace 实时数据的共享入口。
 *
 * 首页有两处要它：首屏「最新版本」数字（`usePluginVersion`）和页尾「最近更新」
 * （`RecentUpdates`）。两处都在 onMounted 里拉，各自写一份 fetch 会在同一帧
 * 发两个请求；这里用模块级 Promise 缓存合并成一次。失败不缓存，下次挂载可重试。
 *
 * 走 `/api/changelog` 而不是直连 Marketplace：CF Pages Function 代理解掉跨域，
 * 并带 `Cache-Control: public, max-age=3600`。
 */
let pending = null

export function getLiveUpdates() {
  if (!pending) {
    pending = fetch('/api/changelog', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data) => {
        if (!data) pending = null
        return data
      })
  }
  return pending
}

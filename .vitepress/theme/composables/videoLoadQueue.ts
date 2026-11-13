/**
 * 全局视频加载队列（计划 20261114-0027 P1-5）。
 *
 * 为什么需要：功能详解页单页可达 19 个演示位（mp4 合计 4.7MB），距离门控命中
 * 后各组件独立设 src 起播——快速滚动时多路视频同时下载分抢带宽，弱网下全部
 * 卡在缓冲、一个都出不了画面。这里限制同时处于「加载中」的视频数量，拿到
 * canplay/loadeddata（首帧可绘）或 error 后放行下一个，让有限带宽串行喂饱
 * 少数几个视频。
 *
 * 用法：调用 acquireVideoSlot() 拿到 Promise<release>；视频首帧就绪或失败时
 * 调 release()。组件卸载时若尚未 release 也必须 release，否则槽位泄漏、
 * 队列停在 2 个占位上不再放行。
 */

const MAX_CONCURRENT = 2

let active = 0
const waiting: Array<() => void> = []

function grant(release: (fn: () => void) => void) {
  active++
  release(() => {
    active--
    const next = waiting.shift()
    if (next) next()
  })
}

export function acquireVideoSlot(): Promise<() => void> {
  return new Promise((resolve) => {
    if (active < MAX_CONCURRENT) {
      grant(resolve)
    } else {
      waiting.push(() => grant(resolve))
    }
  })
}

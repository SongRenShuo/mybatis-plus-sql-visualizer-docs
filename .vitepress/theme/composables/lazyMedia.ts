/**
 * 统一的「接近视口才加载」门控。
 *
 * 为什么不用原生 loading="lazy"：触发距离由浏览器按网络质量决定，慢网会放大到
 * 几千像素。实测慢网下首页 8 个演示位被一次性全下（GIF 7.4MB + poster 3.2MB），
 * 单个 1~1.6MB 的 GIF 要跑 20 秒。这里用固定距离，与网络无关。
 *
 * 全页共用一个 scroll/resize 监听：功能详解页同一屏可能有二十多张动图，每个组件
 * 各挂一份监听会重复做 rect 计算。命中即摘除，全部加载完自动停监听。
 *
 * 只用 rect 判定、不依赖 IntersectionObserver 回调与渲染帧：窗口被遮挡或标签页
 * 后台时帧回调会被暂停，rect 判定不受影响。
 */

type Task = { el: Element; margin: number; run: () => void }

const tasks = new Set<Task>()
let scheduled = false

function viewportHeight() {
  return window.innerHeight || document.documentElement.clientHeight
}

function flush() {
  scheduled = false
  const limit = viewportHeight()
  for (const task of [...tasks]) {
    if (task.el.getBoundingClientRect().top >= limit + task.margin) continue
    tasks.delete(task)
    task.run()
  }
  if (!tasks.size) detach()
}

function schedule() {
  if (scheduled) return
  scheduled = true
  // 用宏任务合并同一帧内的多次 scroll 事件；不用 rAF，后台标签页里 rAF 会被暂停
  setTimeout(flush, 0)
}

function detach() {
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
}

function attach() {
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
}

/**
 * 元素顶部进入「视口下沿 + margin」时执行一次 run。
 * 返回取消函数；元素已经在范围内则同步执行。
 */
export function whenNear(el: Element | null | undefined, margin: number, run: () => void): () => void {
  if (!el) return () => {}
  if (typeof window === 'undefined') {
    run()
    return () => {}
  }

  const task: Task = { el, margin, run }
  tasks.add(task)
  attach()

  // 挂载时已在范围内（首屏或回滚位置）直接放行，不等第一次滚动
  if (el.getBoundingClientRect().top < viewportHeight() + margin) {
    tasks.delete(task)
    run()
    if (!tasks.size) detach()
    return () => {}
  }

  return () => {
    tasks.delete(task)
    if (!tasks.size) detach()
  }
}

/**
 * 弱网探测（计划 20261114-0027 P1-6）：saveData 开启或 2g 级网络时，
 * GifPlayer 把门控距离收到 0（仅视口内加载）并关闭自动播放。
 * 连接信息 API 不存在（Firefox/Safari）按非弱网处理——距离门控本身已限流。
 */
export function weakNetwork(): boolean {
  if (typeof navigator === 'undefined') return false
  const conn = (
    navigator as { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection
  if (!conn) return false
  if (conn.saveData) return true
  return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'
}

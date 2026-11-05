import { nextTick } from 'vue'
import { useData } from 'vitepress'

/**
 * 明暗切换的过渡动画（取法 cool-request-web 的 View Transitions 圆形揭示）。
 *
 * 做法：点哪个位置就从哪个位置扩散一个圆，新主题像一层贴纸被"揭开"，
 * 而不是整页颜色一起淡入淡出——后者在长页面上会看到区块各自到位的参差感。
 *
 * 三个必须注意的点：
 * 1. VitePress 的 isDark 是 @vueuse/core 的 useDark，落类名靠 watchEffect（微任务）。
 *    View Transition 在回调返回后立刻拍"新"快照，等不到那次微任务，所以这里同步
 *    写一次 html.dark；VitePress 随后那次 toggle 是幂等的。
 * 2. 回调里 await nextTick()：图标、aria-checked 这些要等 Vue 渲染完才进快照，
 *    否则动画结束后会看到图标"晚一拍"跳变。
 * 3. 切换期间给 html 挂 theme-switching，全局关掉 transition——否则快照会拍到
 *    颜色过渡的中间态，等于把同一段过渡演两遍。
 */
export function useThemeTransition() {
  const { isDark } = useData()

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const apply = (next: boolean) => {
    isDark.value = next
    document.documentElement.classList.toggle('dark', next)
  }

  function toggle(event?: MouseEvent, el?: HTMLElement | null) {
    if (typeof document === 'undefined') return
    const next = !isDark.value
    const doc = document as Document & {
      startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> }
    }

    if (typeof doc.startViewTransition !== 'function' || prefersReducedMotion()) {
      apply(next)
      return
    }

    // 键盘触发的 click 事件 clientX/clientY 都是 0，这时退回按钮几何中心；
    // 拿不到按钮再退回右上角（顶栏开关的常规位置）。
    const rect = el?.getBoundingClientRect()
    const fromPointer = Boolean(event && (event.clientX || event.clientY))
    const x = fromPointer ? event!.clientX : rect ? rect.left + rect.width / 2 : window.innerWidth - 40
    const y = fromPointer ? event!.clientY : rect ? rect.top + rect.height / 2 : 40
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const root = document.documentElement
    root.style.setProperty('--theme-switch-x', `${x}px`)
    root.style.setProperty('--theme-switch-y', `${y}px`)
    root.style.setProperty('--theme-switch-radius', `${radius}px`)
    root.classList.add('theme-switching')

    try {
      const transition = doc.startViewTransition(async () => {
        apply(next)
        await nextTick()
      })
      transition.finished.finally(() => root.classList.remove('theme-switching'))
    } catch {
      // 已经有一个 View Transition 在跑（连点）时直接落值，别让主题停在旧态
      root.classList.remove('theme-switching')
      apply(next)
    }
  }

  return { toggle }
}

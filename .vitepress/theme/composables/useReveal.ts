import { onMounted, onUnmounted, type Ref } from 'vue'

const REVEAL_CLASS = 'mp-reveal'
const REVEALED_CLASS = 'is-revealed'

/**
 * 滚动揭示统一入口（T6）。
 *
 * 约定：需要入场动画的元素自己带 `mp-reveal` 类，本组合式函数只负责在元素进入
 * 视口时补上 `is-revealed`，过渡效果全部写在 style.css。脚本与动画解耦，以后
 * 调动画不需要碰 JS。
 *
 * 三条行为约束：
 * - 只播一次。元素揭示后立即解除观察，回滚再进入不重播。
 * - 首屏不参与。HeroSection 不加 `mp-reveal`，避免入场动画推迟 LCP。
 * - `prefers-reduced-motion: reduce` 下直接补类，内容立即可见，不留过渡。
 *
 * 全页共用一个观察器：由 CoolHome 调用一次，扫描整棵子树即可，各区块组件
 * 不需要自己引入。Vue 的挂载顺序是子先于父，所以 CoolHome 的 onMounted 执行时
 * 子组件的 DOM 已经就位。
 */
export function useReveal(root?: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const scope: ParentNode = root?.value ?? document
    const targets = Array.from(scope.querySelectorAll<HTMLElement>(`.${REVEAL_CLASS}`))
    if (!targets.length) return

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add(REVEALED_CLASS))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add(REVEALED_CLASS)
          observer?.unobserve(entry.target)
        })
      },
      // 元素顶部进入视口下沿 12% 处即揭示，避免「滚到了才开始动」的迟滞感
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    targets.forEach((el) => observer!.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}

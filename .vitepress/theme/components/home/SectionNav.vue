<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 首页吸顶章节导航（T1）。
 *
 * 形态取「主导航下方的横向二级条」而不是 Payathon 那种左侧常驻栏：本页容器
 * max-width 1280px，1440 视口下单侧留白仅 73px，190px 的侧栏放不下（按容器
 * 推算需视口 ≥1660px）。横条不依赖侧边留白，桌面与移动端共用一套实现。
 *
 * 高亮用「阈值线 + 缓存偏移」而不是 IntersectionObserver：本页区块高度差异极大
 * （最大的 4300px，最小的 250px），IO 在多区块同时相交时难以判定唯一当前项，
 * 而验收要求任一时刻有且仅有一个高亮。阈值线法结果确定、代价只是一次线性扫描。
 * IO 仍用于滚动揭示（useReveal），两者解决的问题不同。
 *
 * 视觉刻意保守：只做高亮与细进度线，不做 Payathon 的 dock 高斯放大——那类
 * 「无谓动效」是明确排除项。
 */

const props = defineProps({
  // 移动端全屏菜单展开时强制收起，避免菜单首项被二级条压住
  suppressed: { type: Boolean, default: false },
})

const sections = [
  { id: 'sec-tech', label: '技术栈' },
  { id: 'sec-capability', label: '核心能力' },
  { id: 'sec-preview', label: '预览能力' },
  { id: 'sec-features', label: '更多特性' },
  { id: 'sec-opensource', label: '开源免费' },
  { id: 'sec-testimonials', label: '用户评价' },
  { id: 'sec-pricing', label: '免费下载' },
  { id: 'sec-start', label: '开始使用' },
]

const pastHero = ref(false)
const activeId = ref(null)
const progress = ref(0)

// 判定「当前区块」的阈值线：区块顶边越过视口 y=140 即成为当前项。
// 与 style.css 里 section[id] 的 scroll-margin-top(112px) 保持约 28px 余量，
// 使点击跳转后的落点必然命中同一项，不会出现「点了却不亮」。
const ACTIVE_LINE = 140

let offsets = []
let heroHeight = 0
let scrollHandler = null
let resizeHandler = null
let rafId = 0

const isVisible = computed(() => pastHero.value && !props.suppressed)

function measure() {
  heroHeight = document.querySelector('.hero-section')?.offsetHeight ?? window.innerHeight
  offsets = sections.map((s) => {
    const el = document.getElementById(s.id)
    if (!el) return Number.POSITIVE_INFINITY
    // offsetTop 相对 offsetParent，逐级累加得到文档绝对位置
    let top = 0
    let node = el
    while (node) {
      top += node.offsetTop
      node = node.offsetParent
    }
    return top
  })
}

function update() {
  rafId = 0
  const y = window.scrollY

  pastHero.value = y > heroHeight - ACTIVE_LINE

  const pos = y + ACTIVE_LINE
  let current = null
  for (let i = 0; i < offsets.length; i += 1) {
    if (offsets[i] <= pos) current = sections[i].id
  }
  // 触底时强制选中最后一项：末节高度可能不足以把顶边推到阈值线以上
  if (window.innerHeight + y >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1].id
  }
  activeId.value = current

  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0
}

function onScroll() {
  if (rafId) return
  rafId = window.requestAnimationFrame(update)
}

function onResize() {
  measure()
  update()
}

function onClick(event, id) {
  const el = document.getElementById(id)
  if (!el) return
  event.preventDefault()
  const reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 落点由 CSS 的 scroll-margin-top 负责避让两级吸顶导航
  const before = window.scrollY
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })

  if (!reduceMotion) {
    // 平滑滚动不被支持的宿主会「完全不动」（实测内嵌 webview 即如此：
    // scrollIntoView 与 scrollTo 的 smooth 均无效，瞬时调用正常）。
    // 下一拍仍未位移则退回瞬时跳转，保证落点在所有宿主都正确。
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - before) < 2) {
        el.scrollIntoView({ block: 'start' })
      }
    }, 160)
  }

  history.replaceState(null, '', `#${id}`)
  activeId.value = id
}

onMounted(() => {
  measure()
  scrollHandler = onScroll
  resizeHandler = onResize
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler)
  // 懒加载图片落位后偏移会变，加载完成再量一次
  window.addEventListener('load', resizeHandler, { once: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('resize', resizeHandler)
  window.removeEventListener('load', resizeHandler)
  if (rafId) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="section-nav" :class="{ 'is-visible': isVisible }">
    <div class="section-nav__viewport">
      <nav class="section-nav__links" aria-label="页内章节导航">
        <a
          v-for="s in sections"
          :key="s.id"
          class="section-nav__link"
          :class="{ 'is-active': activeId === s.id }"
          :href="`#${s.id}`"
          :aria-current="activeId === s.id ? 'true' : undefined"
          @click="onClick($event, s.id)"
        >
          {{ s.label }}
        </a>
      </nav>
    </div>
    <div class="section-nav__progress" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<style scoped>
.section-nav {
  position: relative;
  height: 0;
  overflow: hidden;
  background-color: var(--bg-primary);
  transition: height 0.25s ease;
}

.section-nav.is-visible {
  height: 44px;
  border-top: 1px solid var(--border-color);
}

.section-nav__viewport {
  height: 44px;
  display: flex;
  align-items: center;
  /* 不用 .container：首页内层 .container 会与 VitePress 全局 .container 的
     24px 内边距叠加，窄屏下内容宽度被双重压缩（曾致 375 视口卡片只剩 279px） */
  padding: 0 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.section-nav__viewport::-webkit-scrollbar {
  display: none;
}

.section-nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0 auto;
  white-space: nowrap;
}

.section-nav__link {
  position: relative;
  padding: 0.25rem 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.section-nav__link:hover {
  color: var(--text-primary);
}

.section-nav__link.is-active {
  color: var(--primary-color);
  font-weight: 600;
}

.section-nav__link:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
  border-radius: 2px;
}

.section-nav__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0.75;
}

@media (max-width: 767px) {
  .section-nav__viewport {
    padding: 0 1rem;
  }

  .section-nav__links {
    gap: 1.125rem;
    margin: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-nav {
    transition: none;
  }
}
</style>

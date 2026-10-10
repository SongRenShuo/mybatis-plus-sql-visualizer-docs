<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHomeContent } from '../../composables/useHomeContent'

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

const { c } = useHomeContent()

const sections = computed(() => c.value.sectionNav.items)

const pastHero = ref(false)
const activeId = ref(null)
const progress = ref(0)

// 判定「当前区块」的阈值线：区块顶边越过视口 y=140 即成为当前项。
// 必须大于 style.css 的 --home-anchor-offset(124px)，否则跳转后的落点算不出
// 当前项，会出现「点了却不亮」。
const ACTIVE_LINE = 140

let scrollHandler = null
let resizeHandler = null

const isVisible = computed(() => pastHero.value && !props.suppressed)

/**
 * 每次滚动都直接读元素矩形，不缓存偏移量。
 *
 * 起初缓存了各区块的文档绝对位置（挂载时量一次 + resize/load 时重量），实测在
 * 英文首页上会系统性失准——点「更多特性」高亮停在「预览能力」，即整体慢一项；
 * 原因是页面在挂载后仍有 ~70px 级别的布局增长（懒加载素材与文字回流），缓存
 * 一旦过期，阈值比较就整体偏移。改成每帧读 8 个 getBoundingClientRect 后，
 * 这类问题从根上消失，代价是每帧一次布局读取，可接受。
 */
function update() {
  const y = window.scrollY

  const hero = document.querySelector('.hero-section')
  pastHero.value = hero ? hero.getBoundingClientRect().bottom <= ACTIVE_LINE : y > 400

  const list = sections.value
  let current = null
  for (let i = 0; i < list.length; i += 1) {
    const el = document.getElementById(list[i].id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= ACTIVE_LINE) current = list[i].id
  }
  // 触底时强制选中最后一项：末节高度可能不足以把顶边推到阈值线以上
  if (window.innerHeight + y >= document.documentElement.scrollHeight - 2) {
    current = list[list.length - 1].id
  }
  activeId.value = current

  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0
}

// 直接调用，不用 rAF 节流：滚动事件本身已按帧合并，update() 只是 8 次
// getBoundingClientRect 读取；而该宿主 requestAnimationFrame 不触发，
// 用 rAF 节流会让高亮完全不更新。
function onScroll() {
  update()
}

function onResize() {
  update()
}

/**
 * 点击落点显式计算，不交给 scrollIntoView 的 scroll-margin。
 *
 * 实测（内嵌 webview）：同一份布局下 `scrollIntoView({behavior:'smooth'})` 与
 * 瞬时分支给出不同落点——smooth 只避让了 54px，瞬时避让 124px（后者才是 CSS 里
 * scroll-margin-top 的值）。所以自己算 `元素文档绝对位置 - 避让量`，避让量从
 * CSS 变量读，保证与 style.css 的 scroll-margin-top 同源。
 */
function anchorOffset() {
  const root = document.querySelector('.cool-home')
  const raw = root ? getComputedStyle(root).getPropertyValue('--home-anchor-offset') : ''
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 124
}

function documentTop(el) {
  let top = 0
  let node = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent
  }
  return top
}

/**
 * 瞬时跳转，不用原生平滑，也不用 rAF 自己动画。
 *
 * 实测（内嵌 webview，三者都踩过）：
 * ① 原生 `scrollIntoView({behavior:'smooth'})` 的落点不可信——同一份布局下只避让
 *    54px，瞬时分支避让 124px（后者才是 CSS 的 scroll-margin-top）；
 * ② 该宿主 `requestAnimationFrame` 完全不触发（1.5s 超时未回调），自己写的
 *    逐帧动画会一帧都不跑；
 * ③ `setTimeout` 被节流到约 1s 一帧，也撑不起动画。
 *
 * 所以落点由自己算、跳转瞬时完成：结果确定、与宿主能力无关，也不会出现
 * 「点了没反应」。跳转语义上瞬时跳转本就是页内锚点的常规做法。
 * prefers-reduced-motion 无需特殊处理——本来就没有动画。
 */
function scrollToTarget(target) {
  window.scrollTo(0, target)
}

function onClick(event, id) {
  const el = document.getElementById(id)
  if (!el) return
  event.preventDefault()

  scrollToTarget(Math.max(0, documentTop(el) - anchorOffset()))

  history.replaceState(null, '', `#${id}`)
  activeId.value = id
}

onMounted(() => {
  scrollHandler = onScroll
  resizeHandler = onResize
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler)
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="section-nav" :class="{ 'is-visible': isVisible }">
    <div class="section-nav__viewport">
      <nav class="section-nav__links" :aria-label="c.sectionNav.label">
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

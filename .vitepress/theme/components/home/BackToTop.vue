<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { useHomeContent } from '../../composables/useHomeContent'

const route = useRoute()
const { c } = useHomeContent()
const visible = ref(false)
let settleTimer = null
let probeTimers = []

// 锚点滚动 / 路由切换带来的滚动未必会派发 scroll 事件（本仓实测：带 #锚点 进入
// 文档页时 scrollY 已是 2541 但按钮没出现，且此后不再有 scroll 事件）。挂载与换页后
// 各做几次有限重查兜住这类迟到的滚动，不常驻轮询。
function scheduleProbes() {
  clearProbes()
  probeTimers = [0, 250, 700, 1400].map((delay) =>
    window.setTimeout(updateVisibility, delay)
  )
}

function clearProbes() {
  for (const t of probeTimers) window.clearTimeout(t)
  probeTimers = []
}

function updateVisibility() {
  visible.value = window.scrollY > 400
}

function returnToTop() {
  if (settleTimer !== null) window.clearTimeout(settleTimer)
  // 先清掉地址栏里的片段标识：否则浏览器自己的「滚动到片段」会在我们回顶之后
  // 再把页面拉回该锚点（实测文档页从 #功能特性 回顶后被拉回 2541px，且按钮已隐藏）。
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  if (reducedMotion) {
    window.dispatchEvent(new Event('scroll'))
  } else {
    settleTimer = window.setTimeout(() => {
      if (window.scrollY > 1) window.scrollTo(0, 0)
      window.dispatchEvent(new Event('scroll'))
      settleTimer = null
    }, 1200)
  }
}

watch(() => route.path, () => {
  if (settleTimer !== null) window.clearTimeout(settleTimer)
  visible.value = false
  scheduleProbes()
})

onMounted(() => {
  window.addEventListener('scroll', updateVisibility, { passive: true })
  window.addEventListener('scrollend', updateVisibility)
  window.addEventListener('resize', updateVisibility)
  updateVisibility()
  scheduleProbes()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisibility)
  window.removeEventListener('scrollend', updateVisibility)
  window.removeEventListener('resize', updateVisibility)
  if (settleTimer !== null) window.clearTimeout(settleTimer)
  clearProbes()
})
</script>

<template>
  <button
    v-if="visible"
    type="button"
    class="back-to-top"
    :aria-label="c.backToTop.label"
    :title="c.backToTop.label"
    @click="returnToTop"
  >
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 19V5m-6 6 6-6 6 6" />
    </svg>
  </button>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: calc(24px + env(safe-area-inset-right, 0px));
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  z-index: 40;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  background: var(--bg-card);
  color: var(--primary-color);
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.12);
  cursor: pointer;
}

.back-to-top:hover {
  background: var(--bg-hover);
}

.back-to-top:active {
  box-shadow: 0 2px 7px rgba(17, 24, 39, 0.12);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
}

:global(.dark .back-to-top) {
  color: var(--primary-light);
}

@media (max-width: 767px) {
  .back-to-top {
    right: calc(16px + env(safe-area-inset-right, 0px));
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
}

</style>

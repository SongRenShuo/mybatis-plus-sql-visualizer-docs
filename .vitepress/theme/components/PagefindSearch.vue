<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { useData } from 'vitepress'

// Pagefind 搜索入口：pill 按钮（compact 为圆形图标钮）+ 遮罩弹窗内嵌官方 pagefind-ui。
// 索引由构建链生成（npm run build 里的 pagefind --site），UI 脚本按需注入一次。
// 多处挂载（默认主题导航栏 / 移动侧栏菜单 / 中文首页自绘顶栏）共享同一份模块级
// 状态，弹窗全局唯一；Ctrl+K / Cmd+K / "/" 打开，Esc 关闭。

const props = defineProps({
  compact: { type: Boolean, default: false }
})

const { lang } = useData()
const isZh = computed(() => (lang.value || 'zh-CN').toLowerCase().startsWith('zh'))
const buttonText = computed(() => (isZh.value ? '搜索文档' : 'Search documentation'))
const modalAria = computed(() => (isZh.value ? '站内搜索' : 'Site search'))

// ---- 模块级共享：弹窗状态、UI 脚本加载、快捷键只绑一次 ----
let sharedOpen = ref(false)
let uiLoadPromise = null
let shortcutsBound = false

function loadPagefindUI() {
  if (typeof window !== 'undefined' && window.PagefindUI) return Promise.resolve()
  if (!uiLoadPromise) {
    uiLoadPromise = new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/pagefind/pagefind-ui.css'
      document.head.appendChild(link)
      const script = document.createElement('script')
      script.src = '/pagefind/pagefind-ui.js'
      script.onload = resolve
      script.onerror = () => {
        uiLoadPromise = null
        reject(new Error('pagefind-ui 加载失败'))
      }
      document.head.appendChild(script)
    })
  }
  return uiLoadPromise
}

const open = sharedOpen
const container = ref(null)
const modalEl = ref(null)
const ui = shallowRef(null)

async function openModal() {
  if (open.value) return
  open.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  try {
    await loadPagefindUI()
  } catch {
    closeModal()
    return
  }
  if (!container.value) return
  ui.value = new window.PagefindUI({
    element: container.value,
    bundlePath: '/pagefind/',
    showImages: false,
    showSubResults: true,
    excerptLength: 40,
    processResult: (result) => {
      // 结果 URL 去掉 .html 后缀，与站点路由风格一致
      if (result && result.url) result.url = result.url.replace(/\.html(?=($|#))/, '')
      return result
    },
    translations: isZh.value
      ? {
          placeholder: '搜索文档',
          stop_delayed_loading: '暂停',
          results_delayed_loading: '结果加载中',
          result_null: '无法找到相关结果'
        }
      : undefined
  })
  await nextTick()
  const input = container.value?.querySelector('input')
  input?.focus()
}

function closeModal() {
  if (!open.value) return
  open.value = false
  document.body.style.overflow = ''
  ui.value?.destroy?.()
  ui.value = null
  if (container.value) container.value.innerHTML = ''
}

function onKeydown(e) {
  const key = (e.key || '').toLowerCase()
  if ((e.ctrlKey || e.metaKey) && key === 'k') {
    e.preventDefault()
    open.value ? closeModal() : openModal()
    return
  }
  if (key === 'escape' && open.value) {
    closeModal()
    return
  }
  if (key === '/' && !open.value) {
    const el = document.activeElement
    const tag = (el?.tagName || '').toLowerCase()
    if (tag === 'input' || tag === 'textarea' || el?.isContentEditable) return
    e.preventDefault()
    openModal()
  }
}

// 点击结果跳转后路由变化：关闭弹窗（SPA 内导航不会重载页面）
function onRouteChange() {
  if (open.value) closeModal()
}

onMounted(() => {
  if (!shortcutsBound) {
    shortcutsBound = true
    window.addEventListener('keydown', onKeydown)
  }
  // VitePress SPA 路由切换经 popstate/link 点击，监听 URL 变化兜底关窗
  window.addEventListener('popstate', onRouteChange)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onRouteChange)
  closeModal()
})

const modKey = computed(() => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
  return /Mac|iPhone|iPad/.test(ua) ? '⌘' : '^'
})
</script>

<template>
  <button
    v-if="!compact"
    class="pf-trigger"
    type="button"
    :aria-label="modalAria"
    @click="openModal()"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
    <span class="pf-trigger-text">{{ buttonText }}</span>
    <span class="pf-keys">
      <kbd>{{ modKey }}</kbd><kbd>K</kbd>
    </span>
  </button>
  <button
    v-else
    class="pf-trigger pf-trigger-icon"
    type="button"
    :aria-label="modalAria"
    @click="openModal()"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  </button>

  <Teleport to="body">
    <div v-if="open" class="pf-modal-mask" @click.self="closeModal()">
      <div ref="modalEl" class="pf-modal" role="dialog" :aria-label="modalAria">
        <div ref="container" class="pf-modal-body"></div>
        <div class="pf-modal-hint">
          <template v-if="isZh">Esc 关闭 · ↑↓ 选择 · Enter 打开</template>
          <template v-else>esc to close · ↑↓ to navigate · Enter to open</template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pf-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.25s, color 0.25s;
}

.pf-trigger:hover {
  border-color: var(--vp-c-gray-soft);
  color: var(--vp-c-text-2);
}

.pf-trigger-icon {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  justify-content: center;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  color: var(--vp-c-text-2);
}

.pf-trigger-icon:hover {
  color: var(--vp-c-brand-1);
  border-color: transparent;
}

.pf-trigger-text {
  display: none;
}

@media (min-width: 960px) {
  .pf-trigger-text {
    display: inline;
  }
  .pf-trigger {
    width: 192px;
    padding: 0 12px;
  }
}

.pf-keys {
  display: none;
  margin-left: auto;
  gap: 2px;
}

@media (min-width: 960px) {
  .pf-keys {
    display: flex;
  }
}

.pf-keys kbd {
  display: inline-block;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background-color: var(--vp-c-bg-elv);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  color: var(--vp-c-text-3);
}

.pf-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 12px;
  overflow-y: auto;
  backdrop-filter: blur(2px);
}

.pf-modal {
  width: 100%;
  max-width: 640px;
  margin: 8vh auto 0;
  padding: 8px 20px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
  max-height: 76vh;
  overflow-y: auto;
}

.pf-modal-hint {
  padding: 8px 2px 2px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 8px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: right;
}
</style>

<style>
/* pagefind-ui 官方组件配色映射到 VitePress 主题变量（非 scoped：其 DOM 动态注入） */
.pf-modal .pagefind-ui {
  --pagefind-ui-scale: 0.9;
  --pagefind-ui-primary: var(--vp-c-brand-1);
  --pagefind-ui-accent: var(--vp-c-brand-1);
  --pagefind-ui-accent-rgb: 46 106 224;
  --pagefind-ui-text: var(--vp-c-text-1);
  --pagefind-ui-background: var(--vp-c-bg);
  --pagefind-ui-border: var(--vp-c-divider);
  --pagefind-ui-border-width: 1px;
  --pagefind-ui-border-radius: 8px;
  --pagefind-ui-font: var(--vp-font-family-base);
  --pagefind-ui-image-border-radius: 8px;
}

.pf-modal .pagefind-ui__result-nested {
  padding-left: 12px;
}

.pf-modal .pagefind-ui__result-links {
  gap: 12px;
}

.pf-modal mark {
  color: var(--vp-c-brand-1);
}
</style>

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
let uiLoadAttempted = false // 是否已尝试加载 pagefind-ui（区分「未加载」与「加载失败」）
let shortcutsBound = false

function loadPagefindUI() {
  if (typeof window !== 'undefined' && window.PagefindUI) return Promise.resolve()
  // 已失败过一次：直接拒绝，避免 onerror 反复触发重复挂 script
  if (uiLoadAttempted) return Promise.reject(new Error('pagefind-ui 加载失败'))
  uiLoadAttempted = true
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('pagefind-ui 加载失败'))
    document.head.appendChild(script)
  })
}

const open = sharedOpen
const container = ref(null)
const modalEl = ref(null)
const ui = shallowRef(null)
const uiLoadFailed = ref(false)

async function openModal() {
  if (open.value) return
  open.value = true
  uiLoadFailed.value = false
  document.body.style.overflow = 'hidden'
  await nextTick()
  try {
    await loadPagefindUI()
  } catch {
    // UI 脚本加载失败是「闪现即关」的直接原因（修正前在此直接 closeModal）。
    // 改为弹窗内落地降级提示，不再瞬间关窗，给用户明确反馈。
    uiLoadFailed.value = true
    document.body.style.overflow = ''
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
  uiLoadFailed.value = false
  try {
    ui.value?.destroy?.()
  } catch {
    // 结果渲染与销毁竞态时 pagefind 内部会抛 "worker terminated"，窗口已关可忽略
  }
  ui.value = null
  if (container.value) container.value.innerHTML = ''
}

// 官方 pagefind-ui 的 <a> 只包标题行，摘要 <p> 在链接外，点摘要区不会跳转。
// 在容器上做点击委托：落点不在 <a> 内时，找最近的子结果块（优先）或整卡，
// 触发其标题链接（同页锚点/跨页 SPA 均走浏览器默认导航）。
// 命中即关窗：SPA 链接点击走 pushState 不触发 popstate，而组件内 watch
// route.data 实测不回调（VitePress 路由反应性在此场景不可靠），故在事件派发
// 完成后的下一个宏任务关窗——不能在派发中同步移除 <a>，那会取消默认导航。
// 注意不能以 defaultPrevented 作短路条件：键盘 Enter 触发的合成 click 在捕获
// 阶段即为 prevented（导航照样发生），只排除中键与修饰键（新标签页语义）。
function onResultClick(e) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  let link = e.target.closest('a')
  if (!link) {
    const block =
      e.target.closest('.pagefind-ui__result-nested') || e.target.closest('.pagefind-ui__result-inner')
    link = block?.querySelector('a.pagefind-ui__result-link')
    link?.click()
  }
  if (link) window.setTimeout(closeModal, 0)
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
  // ↑↓ 在结果链接间循环移动焦点。pagefind-ui 1.5.2 自身没有方向键导航，
  // 链接本身是可 Tab 的 <a>，此处补键盘选择；Enter 在焦点链接上为原生导航，
  // click 冒泡进 onResultClick 完成关窗。
  if (open.value && (key === 'arrowdown' || key === 'arrowup') && container.value) {
    const links = [...container.value.querySelectorAll('.pagefind-ui__result-link')]
    if (!links.length) return
    e.preventDefault()
    const cur = links.indexOf(document.activeElement)
    if (key === 'arrowup' && cur <= 0) {
      container.value.querySelector('input')?.focus()
      return
    }
    const next =
      key === 'arrowdown'
        ? cur < 0
          ? links[0]
          : links[Math.min(cur + 1, links.length - 1)]
        : links[Math.max(cur - 1, 0)]
    next.focus()
    next.scrollIntoView({ block: 'nearest' })
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

// 浏览器前进/后退兜底关窗（SPA 结果点击关窗见 onResultClick）
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
        <div v-if="uiLoadFailed" class="pf-modal-error">
          <template v-if="isZh">搜索组件加载失败，请刷新页面后重试。</template>
          <template v-else>Search failed to load. Please refresh the page and try again.</template>
        </div>
        <div ref="container" class="pf-modal-body" @click="onResultClick"></div>
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

.pf-modal-error {
  padding: 12px 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
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

/* 整卡可点（点击委托见 onResultClick），手型提示可达 */
.pf-modal .pagefind-ui__result-inner,
.pf-modal .pagefind-ui__result-nested {
  cursor: pointer;
}

/* ↑↓ 键盘选择时的焦点环 */
.pf-modal .pagefind-ui__result-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
  border-radius: 4px;
}

.pf-modal .pagefind-ui__result-links {
  gap: 12px;
}

.pf-modal mark {
  color: var(--vp-c-brand-1);
}
</style>

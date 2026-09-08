<template>
  <div ref="root" class="fs-wrap">
    <button
      ref="trigger"
      type="button"
      class="fs-trigger"
      :class="{ open }"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="fs-label">{{ currentLabel }}</span>
      <span class="fs-chevron" aria-hidden="true">▾</span>
    </button>

    <Teleport to="body">
      <div v-if="open" class="fs-backdrop" @mousedown="close" />
      <div v-if="open" class="fs-panel" :style="panelStyle" role="listbox">
        <button
          v-for="(o, i) in options"
          :key="o.value"
          type="button"
          class="fs-option"
          :class="{ selected: o.value === props.modelValue, active: i === activeIndex }"
          role="option"
          :aria-selected="o.value === props.modelValue"
          @mouseenter="activeIndex = i"
          @click="pick(o.value)"
        >
          <span class="fs-option-label">{{ o.label }}</span>
          <span v-if="o.value === props.modelValue" class="fs-check" aria-hidden="true">✓</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 主题化下拉选择，替代浏览器原生 <select>（原生弹层样式与站点 UI 严重不协调）。
 * 面板 Teleport 到 body + fixed 定位：不受页面滚动容器/弹窗 overflow 裁剪，
 * 深浅色跟随 VitePress CSS 变量自动切换。
 */
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
  options: Array<{ value: string; label: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const panelStyle = ref<Record<string, string>>({})

const currentLabel = computed(
  () => props.options.find(o => o.value === props.modelValue)?.label ?? props.options[0]?.label ?? '',
)

function toggle() {
  open.value ? close() : show()
}

async function show() {
  open.value = true
  activeIndex.value = Math.max(0, props.options.findIndex(o => o.value === props.modelValue))
  await nextTick()
  const el = trigger.value
  if (!el) return
  const r = el.getBoundingClientRect()
  // 面板估高：选项 34px + 内边距，超出视口下边则向上展开
  const estH = Math.min(props.options.length * 34 + 12, 280)
  const openUp = r.bottom + estH + 8 > window.innerHeight && r.top - estH > 8
  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(r.left)}px`,
    top: openUp ? `${Math.round(r.top - estH - 6)}px` : `${Math.round(r.bottom + 6)}px`,
    minWidth: `${Math.max(Math.round(r.width), 120)}px`,
  }
}

function close() {
  open.value = false
  activeIndex.value = -1
}

function pick(v: string) {
  emit('update:modelValue', v)
  close()
  trigger.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      show()
    }
    return
  }
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, props.options.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    const o = props.options[activeIndex.value]
    if (o) pick(o.value)
  } else if (e.key === 'Tab') {
    close()
  }
}

onBeforeUnmount(close)
</script>

<style scoped>
.fs-wrap {
  display: inline-flex;
}

/* 触发器外观与原 select/输入框一致（0.375rem 0.75rem / 6px 圆角 / 0.8rem 字号） */
.fs-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  line-height: 1.5;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.fs-trigger:hover,
.fs-trigger.open {
  border-color: var(--vp-c-brand-1);
}

.fs-trigger:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.fs-label {
  white-space: nowrap;
}

.fs-chevron {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  transition: transform 0.15s;
}

.fs-trigger.open .fs-chevron {
  transform: rotate(180deg);
}

.fs-backdrop {
  position: fixed;
  inset: 0;
  /* 压过需求池提交弹窗（modal-overlay z-index:1000），弹窗内也能正常展开 */
  z-index: 1090;
}

.fs-panel {
  z-index: 1091;
  max-height: 280px;
  overflow-y: auto;
  padding: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}

.fs-option.active {
  background: var(--vp-c-bg-soft);
}

.fs-option.selected {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.fs-check {
  font-size: 0.7rem;
}
</style>

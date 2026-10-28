<template>
  <div class="vs-wrap">
    <button
      ref="trigger"
      type="button"
      class="vs-trigger"
      :class="{ open, disabled: props.disabled }"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :disabled="props.disabled"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="vs-label" :class="{ placeholder: !props.modelValue }">{{ displayLabel }}</span>
      <span v-if="props.modelValue && !props.disabled" class="vs-clear" :title="t('versionClear', props.locale || 'zh')" @click.stop="pick('')">×</span>
      <span class="vs-chevron" aria-hidden="true">▾</span>
    </button>

    <Teleport to="body">
      <div v-if="open" class="vs-backdrop" @mousedown="close" />
      <div v-if="open" class="vs-panel" :style="panelStyle">
        <input
          ref="searchInput"
          v-model="keyword"
          type="text"
          class="vs-search"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="vs-listbox"
          :aria-expanded="open"
          :aria-activedescendant="activeIndex >= 0 ? `vs-row-${activeIndex}` : undefined"
          :placeholder="t('versionSearch', props.locale || 'zh')"
          @keydown="onSearchKeydown"
        />
        <div id="vs-listbox" class="vs-list" role="listbox">
          <button
            v-for="(row, i) in rows"
            :id="`vs-row-${i}`"
            :key="row.key"
            type="button"
            class="vs-option"
            :class="{ selected: row.selected, active: i === activeIndex, create: row.kind !== 'option' }"
            role="option"
            :aria-selected="!!row.selected"
            @mouseenter="activeIndex = i"
            @click="pick(row.value)"
          >
            <span class="vs-option-label">{{ row.label }}</span>
            <span v-if="row.selected" class="vs-check" aria-hidden="true">✓</span>
          </button>
          <div v-if="!rows.length" class="vs-empty">{{ t('versionEmpty', props.locale || 'zh') }}</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 可搜索 + 可自定义 + 可清空的版本选择器。
 *
 * 与 FilterSelect 的差异（因此不复用）：FilterSelect 是「有默认值」的筛选器
 * （无空态、currentLabel 回落 options[0]），而版本字段是**非必填且默认为空**，
 * 直接复用会把第一个选项显示成已选中。这里独立实现，保留同一套 Teleport + fixed
 * 定位方案，避免被提交弹窗的 overflow 裁剪、z-index 压过 modal（1090/1091）。
 *
 * 面板内容统一成「行」模型（清除行 / 自定义值行 / 选项行），这样键盘 ↑↓ 与 Enter
 * 只需在一维下标上移动——否则清除与自定义这两类特殊行要么漏掉键盘、要么下标算错。
 */
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { t, type Locale } from './i18n'

const props = defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  locale?: Locale
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

interface Row {
  key: string
  kind: 'clear' | 'create' | 'option'
  label: string
  value: string
  selected?: boolean
}

const trigger = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const keyword = ref('')
const activeIndex = ref(-1)
const panelStyle = ref<Record<string, string>>({})

const locale = computed(() => props.locale || 'zh')
const displayLabel = computed(() => props.modelValue || props.placeholder || '')

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return props.options
  return props.options.filter((o) => o.toLowerCase().includes(kw))
})

const createValue = computed(() => keyword.value.trim())

/** 输入内容与任何选项都不完全相等（大小写不敏感）时才提供「使用自定义值」 */
const showCreate = computed(
  () => !!createValue.value && !props.options.some((o) => o.toLowerCase() === createValue.value.toLowerCase()),
)

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  if (props.modelValue) {
    out.push({ key: '__clear__', kind: 'clear', label: t('versionClear', locale.value), value: '' })
  }
  if (showCreate.value) {
    out.push({
      key: '__create__',
      kind: 'create',
      label: t('versionUseCustom', locale.value, { v: createValue.value }),
      value: createValue.value,
    })
  }
  for (const o of filtered.value) {
    out.push({ key: `o:${o}`, kind: 'option', label: o, value: o, selected: o === props.modelValue })
  }
  return out
})

function toggle() {
  open.value ? close() : show()
}

async function show() {
  keyword.value = ''
  activeIndex.value = -1
  // 先算好 fixed 坐标再挂载面板：若等 open=true 后再定位，面板会先以正文流节点
  // 插入 body 末尾，浏览器的滚动锚定会先动一次视口，表现为「点开下拉页面跳走」。
  positionPanel()
  open.value = true
  await nextTick()
  positionPanel()
  searchInput.value?.focus({ preventScroll: true })
}

/** 面板定位：行高 34px + 搜索行 44px + 内边距；超出视口下边则向上展开 */
function positionPanel() {
  const el = trigger.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const estH = Math.min(rows.value.length * 34 + 56, 300)
  const openUp = r.bottom + estH + 8 > window.innerHeight && r.top - estH > 8
  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(r.left)}px`,
    top: openUp ? `${Math.round(r.top - estH - 6)}px` : `${Math.round(r.bottom + 6)}px`,
    minWidth: `${Math.max(Math.round(r.width), 200)}px`,
  }
}

function close() {
  open.value = false
  keyword.value = ''
  activeIndex.value = -1
}

function pick(v: string) {
  emit('update:modelValue', v)
  close()
  trigger.value?.focus({ preventScroll: true })
}

/** 面板是 fixed 定位；滚动/缩放后重新贴合触发器，避免面板与控件脱节 */
function onViewportChange() {
  if (open.value) positionPanel()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (!open.value && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
    e.preventDefault()
    show()
  }
}

function onSearchKeydown(e: KeyboardEvent) {
  const last = rows.value.length - 1
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    trigger.value?.focus({ preventScroll: true })
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (last >= 0) activeIndex.value = Math.min(activeIndex.value + 1, last)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const row = rows.value[activeIndex.value]
    if (row) pick(row.value)
    else if (showCreate.value) pick(createValue.value)
  } else if (e.key === 'Tab') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
  close()
})
</script>

<style scoped>
.vs-wrap {
  display: block;
  width: 100%;
}

.vs-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.vs-trigger:hover:not(.disabled),
.vs-trigger.open {
  border-color: var(--vp-c-brand-1);
}

.vs-trigger:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.vs-trigger.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vs-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vs-label.placeholder {
  color: var(--vp-c-text-3);
}

/* 鼠标快捷清除；键盘路径是面板首行的「清除」项，故此处不占 Tab 位 */
.vs-clear {
  flex-shrink: 0;
  padding: 0 0.25rem;
  color: var(--vp-c-text-3);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
}

.vs-clear:hover {
  color: #ef4444;
}

.vs-chevron {
  flex-shrink: 0;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  transition: transform 0.15s;
}

.vs-trigger.open .vs-chevron {
  transform: rotate(180deg);
}

.vs-backdrop {
  position: fixed;
  inset: 0;
  /* 压过需求池提交弹窗（modal-overlay z-index:1000），弹窗内也能正常展开 */
  z-index: 1090;
}

.vs-panel {
  z-index: 1091;
  display: flex;
  flex-direction: column;
  max-height: 300px;
  padding: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
}

.vs-search {
  margin: 2px 2px 4px;
  padding: 6px 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
}

.vs-search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.vs-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.vs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}

.vs-option.active {
  background: var(--vp-c-bg-soft);
}

.vs-option.selected {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.vs-option.create {
  color: var(--vp-c-brand-1);
}

.vs-check {
  font-size: 0.7rem;
}

.vs-empty {
  padding: 8px 10px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}
</style>

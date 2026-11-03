<template>
  <section class="kb-col" :data-kb-col="column.id" :aria-label="column.title">
    <header class="kb-col-head" :style="{ '--col-color': column.color }">
      <span v-if="column.step" class="kb-col-step">{{ column.step }}</span>
      <span v-else class="kb-col-dot" :style="{ background: column.color }" aria-hidden="true" />
      <h3 class="kb-col-title">{{ column.title }}</h3>
      <span class="kb-col-count">{{ column.items.length }}</span>
    </header>
    <div
      ref="body"
      class="kb-col-body"
      :class="{ 'mask-top': hasTop, 'mask-bottom': hasBottom }"
      :style="bodyStyle"
      @scroll="measure"
    >
      <slot />
      <p v-if="!column.items.length" class="kb-col-empty">{{ emptyText }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { KanbanColumnData } from './kanban'

const props = withDefaults(
  defineProps<{
    column: KanbanColumnData
    emptyText?: string
    /** false 时列体不设最大高度（内容短的流程看板用） */
    scrollBody?: boolean
    bodyMaxHeight?: string
  }>(),
  { emptyText: '', scrollBody: true, bodyMaxHeight: 'min(62vh, 560px)' }
)

const body = ref<HTMLElement | null>(null)
const hasTop = ref(false)
const hasBottom = ref(false)

const bodyStyle = computed(() =>
  props.scrollBody ? { maxHeight: props.bodyMaxHeight } : {}
)

/** 只有真能滚动时才加渐隐，否则最后一张卡片会被无谓地淡掉。 */
function measure() {
  const el = body.value
  if (!el) return
  hasTop.value = el.scrollTop > 1
  hasBottom.value = el.scrollHeight - el.clientHeight - el.scrollTop > 2
}

let observer: ResizeObserver | null = null

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && body.value) {
    observer = new ResizeObserver(measure)
    observer.observe(body.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

watch(
  () => props.column.items.length,
  () => nextTick(measure)
)
</script>

<style scoped>
.kb-col {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
}

.kb-col-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px 10px;
}

/* 流程看板（带阶段号）：列头加阶段色顶线 + 序号胶囊，读起来是一条流水线，
   而不是四个并列的列表 */
.kb-col-head:has(.kb-col-step) {
  margin-bottom: 4px;
  padding: 12px 2px 10px;
  border-top: 2px solid color-mix(in srgb, var(--col-color) 60%, var(--vp-c-border));
}

.kb-col-step {
  display: inline-flex;
  min-width: 26px;
  height: 20px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--col-color) 13%, var(--vp-c-bg));
  color: var(--col-color);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.kb-col-dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
}

.kb-col-title {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}

.kb-col-count {
  margin-left: auto;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11px;
  line-height: 20px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.kb-col-body {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 1px 4px;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ui-fg) 18%, transparent) transparent;
}

.kb-col-body::-webkit-scrollbar {
  width: 6px;
}

.kb-col-body::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: color-mix(in srgb, var(--ui-fg) 18%, transparent);
}

.kb-col-body::-webkit-scrollbar-track {
  background: transparent;
}

/* 列体是纵向 flex 容器，默认允许子项压缩会把卡片挤扁而不是滚动 */
.kb-col-body > * {
  flex-shrink: 0;
}

.kb-col-body.mask-bottom {
  mask-image: linear-gradient(to bottom, #000 calc(100% - 20px), transparent);
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 20px), transparent);
}

.kb-col-body.mask-top {
  mask-image: linear-gradient(to bottom, transparent, #000 20px);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 20px);
}

.kb-col-body.mask-top.mask-bottom {
  mask-image: linear-gradient(to bottom, transparent, #000 20px, #000 calc(100% - 20px), transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 20px, #000 calc(100% - 20px), transparent);
}

.kb-col-empty {
  display: grid;
  place-items: center;
  min-height: 96px;
  margin: 0;
  padding: 12px;
  border: 1px dashed var(--vp-c-border);
  border-radius: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>

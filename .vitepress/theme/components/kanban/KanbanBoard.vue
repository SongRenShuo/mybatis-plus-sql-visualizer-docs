<template>
  <section class="kb">
    <header v-if="title || $slots.actions" class="kb-head">
      <div class="kb-heading">
        <h2 v-if="title" class="kb-title">{{ title }}</h2>
        <p v-if="meta" class="kb-meta">{{ meta }}</p>
      </div>
      <div class="kb-head-actions">
        <slot name="actions" />
      </div>
    </header>

    <div v-if="filters.length || searchPlaceholder" class="kb-toolbar">
      <UiTabs
        v-if="filters.length"
        :model-value="filter"
        :items="filters"
        :aria-label="filterLabel"
        @update:model-value="$emit('update:filter', $event)"
      />
      <UiInput
        v-if="searchPlaceholder"
        :model-value="query"
        :placeholder="searchPlaceholder"
        :aria-label="searchLabel"
        size="sm"
        class="kb-search"
        @update:model-value="$emit('update:query', $event)"
        @enter="$emit('search')"
        @keydown.esc="clearQuery"
      >
        <template #left>
          <svg class="kb-search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
        </template>
        <template #right>
          <button v-if="query" type="button" class="kb-search-clear" :aria-label="clearLabel" @click="clearQuery">×</button>
        </template>
      </UiInput>
    </div>

    <div ref="root" class="kb-columns" @keydown="onBoardKeydown">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :scroll-body="scrollBody"
        :body-max-height="bodyMaxHeight"
        :empty-text="column.items.length ? '' : filtered ? emptyText : idleText"
      >
        <slot :column="column" />
      </KanbanColumn>
    </div>

    <p v-if="instructions" class="kb-sr">{{ instructions }}</p>
    <p v-if="statusText" class="kb-sr" role="status" aria-live="polite">{{ statusText }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import UiInput from '../ui/UiInput.vue'
import UiTabs from '../ui/UiTabs.vue'
import { moveCardFocus, type KanbanColumnData, type KanbanFilter } from './kanban'

const props = withDefaults(
  defineProps<{
    columns: KanbanColumnData[]
    title?: string
    meta?: string
    filters?: KanbanFilter[]
    filter?: string
    query?: string
    filterLabel?: string
    searchPlaceholder?: string
    searchLabel?: string
    clearLabel?: string
    /** 当前是否处于筛选/搜索态，决定列空态文案 */
    filtered?: boolean
    /** 筛选后无结果的文案 */
    emptyText?: string
    /** 无筛选时的列空态文案 */
    idleText?: string
    /** 读屏操作说明 */
    instructions?: string
    /** 结果播报文本，写入 aria-live */
    statusText?: string
    scrollBody?: boolean
    bodyMaxHeight?: string
  }>(),
  {
    title: '',
    meta: '',
    filters: () => [],
    filter: '',
    query: '',
    filterLabel: 'Filter',
    searchPlaceholder: '',
    searchLabel: 'Search',
    clearLabel: 'Clear',
    filtered: false,
    emptyText: '',
    idleText: '',
    instructions: '',
    statusText: '',
    scrollBody: true,
    bodyMaxHeight: 'min(62vh, 560px)',
  }
)

const emit = defineEmits<{
  (e: 'update:filter', value: string): void
  (e: 'update:query', value: string): void
  (e: 'search'): void
}>()

const root = ref<HTMLElement | null>(null)

function clearQuery() {
  if (!props.query) return
  emit('update:query', '')
  emit('search')
}

function onBoardKeydown(event: KeyboardEvent) {
  if (!root.value) return
  moveCardFocus(root.value, event)
}
</script>

<style scoped>
.kb {
  min-width: 0;
}

.kb-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 2px 12px;
}

.kb-title {
  margin: 0;
  border: none;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ui-fg);
}

.kb-meta {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.kb-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kb-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 2px 14px;
}

.kb-search {
  width: 100%;
  max-width: 240px;
}

.kb-search-icon {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.kb-search-clear {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: transparent;
  font-size: 15px;
  line-height: 1;
  color: var(--ui-fg-muted);
  cursor: pointer;
}

.kb-search-clear:hover {
  background: var(--ui-surface-muted);
  color: var(--ui-fg);
}

.kb-columns {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(15rem, 1fr);
  gap: 12px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
}

.kb-columns > * {
  scroll-snap-align: start;
}

.kb-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 767px) {
  .kb-search {
    max-width: none;
  }

  .kb-columns {
    grid-auto-columns: minmax(15rem, 82vw);
  }
}
</style>

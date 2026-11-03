<template>
  <div class="ui-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      type="button"
      role="tab"
      class="ui-tab"
      :class="{ active: item.value === modelValue }"
      :aria-selected="item.value === modelValue"
      :tabindex="item.value === modelValue ? 0 : -1"
      @click="pick(item.value)"
      @keydown="onKeydown($event, index)"
    >
      <slot name="item" :item="item">{{ item.label }}</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
/** 胶囊分段控件：轨道是浅底，选中项是白底小卡。左右键循环切换。 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    items: Array<{ value: string; label: string }>
    ariaLabel?: string
  }>(),
  { ariaLabel: '' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function pick(value: string) {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
}

function onKeydown(event: KeyboardEvent, index: number) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!keys.includes(event.key)) return
  event.preventDefault()
  const total = props.items.length
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? total - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + total) % total
  const value = props.items[next]?.value
  if (value === undefined) return
  pick(value)
  const buttons = (event.currentTarget as HTMLElement)
    .closest('[role="tablist"]')
    ?.querySelectorAll<HTMLElement>('[role="tab"]')
  buttons?.[next]?.focus()
}
</script>

<style scoped>
.ui-tabs {
  display: inline-flex;
  max-width: 100%;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-pill);
  background: var(--ui-surface-muted);
  overflow-x: auto;
  scrollbar-width: none;
}

.ui-tabs::-webkit-scrollbar {
  display: none;
}

.ui-tab {
  height: 28px;
  padding: 0 12px;
  border: none;
  border-radius: var(--ui-radius-pill);
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-fg-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ui-tab:hover {
  color: var(--ui-fg);
}

.ui-tab.active {
  background: var(--ui-surface);
  color: var(--ui-fg);
  box-shadow: var(--ui-shadow-sm);
}

.ui-tab:focus-visible {
  outline: 2px solid var(--ui-accent);
  outline-offset: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .ui-tab {
    transition: none;
  }
}
</style>

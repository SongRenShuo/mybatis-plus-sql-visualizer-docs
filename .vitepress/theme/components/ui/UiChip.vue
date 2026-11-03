<template>
  <span class="ui-chip" :class="[tone ? `ui-chip--${tone}` : '', { 'is-mono': mono }]"><slot /></span>
</template>

<script setup lang="ts">
/** 组件库小胶囊：26px 高、全圆角、发丝线。用于卡片信息与筛选摘要。 */
withDefaults(
  defineProps<{
    tone?: 'brand' | 'warn' | 'ok' | 'muted'
    mono?: boolean
  }>(),
  { tone: undefined, mono: false }
)
</script>

<style scoped>
.ui-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  max-width: 100%;
  min-width: 0;
  padding: 0 9px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-pill);
  font-size: 12px;
  line-height: 1;
  color: var(--ui-fg-muted);
  white-space: nowrap;
}

.ui-chip.is-mono {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.ui-chip :deep(svg) {
  flex-shrink: 0;
}

.ui-chip :deep(span) {
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-chip--brand {
  border-color: color-mix(in srgb, var(--ui-accent) 36%, var(--ui-border));
  color: var(--ui-accent);
}

.ui-chip--warn {
  border-color: color-mix(in srgb, #f59e0b 42%, var(--ui-border));
  color: #b45309;
}

.ui-chip--ok {
  border-color: color-mix(in srgb, #10b981 40%, var(--ui-border));
  color: #047857;
}

.ui-chip--muted {
  background: var(--ui-surface-muted);
  border-color: transparent;
}

.dark .ui-chip--warn {
  color: #fbbf24;
}

.dark .ui-chip--ok {
  color: #34d399;
}
</style>

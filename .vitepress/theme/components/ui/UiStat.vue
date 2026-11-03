<template>
  <div class="ui-stat ui-card">
    <span class="ui-stat-value ui-num">{{ value }}</span>
    <span class="ui-stat-label">
      <span v-if="dot" class="ui-stat-dot" :style="{ background: dot }" aria-hidden="true" />
      {{ label }}
    </span>
    <span v-if="hint" class="ui-stat-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
/** 统计卡：大数字 + 小标签，可选状态色点（点跟在标签前，不占数字行的位）。 */
withDefaults(
  defineProps<{
    value: string | number
    label: string
    hint?: string
    dot?: string
  }>(),
  { hint: '', dot: '' }
)
</script>

<style scoped>
.ui-stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px;
  background: var(--ui-surface-muted);
}

.ui-stat-value {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--ui-fg);
}

.ui-stat-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.ui-stat-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
}

.ui-stat-hint {
  font-size: 11px;
  color: var(--ui-fg-muted);
}
</style>

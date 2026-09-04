<template>
  <span class="status-badge" :style="{ backgroundColor: color + '20', color: color, borderColor: color + '40' }">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, type Locale, type MessageKey } from './i18n'

const props = defineProps<{
  status: number
  locale?: Locale
}>()

const statusMap: Record<number, { labelKey: MessageKey; color: string }> = {
  1: { labelKey: 'status.1', color: '#6b7280' },
  2: { labelKey: 'status.2', color: '#f59e0b' },
  3: { labelKey: 'status.3', color: '#3b82f6' },
  4: { labelKey: 'status.4', color: '#8b5cf6' },
  5: { labelKey: 'status.5', color: '#10b981' },
  6: { labelKey: 'status.6', color: '#ef4444' },
  7: { labelKey: 'status.7', color: '#6b7280' },
}

const locale = props.locale || 'zh'
const label = computed(() => {
  const entry = statusMap[props.status]
  return entry ? t(entry.labelKey, locale) : 'Unknown'
})
const color = computed(() => statusMap[props.status]?.color || '#6b7280')
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
}
</style>

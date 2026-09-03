<template>
  <span class="status-badge" :style="{ backgroundColor: color + '20', color: color, borderColor: color + '40' }">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: number
}>()

const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Submitted', color: '#6b7280' },
  2: { label: 'Under Review', color: '#f59e0b' },
  3: { label: 'Planned', color: '#3b82f6' },
  4: { label: 'In Progress', color: '#8b5cf6' },
  5: { label: 'Completed', color: '#10b981' },
  6: { label: 'Declined', color: '#ef4444' },
  7: { label: 'Duplicate', color: '#6b7280' },
}

const label = computed(() => statusMap[props.status]?.label || 'Unknown')
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

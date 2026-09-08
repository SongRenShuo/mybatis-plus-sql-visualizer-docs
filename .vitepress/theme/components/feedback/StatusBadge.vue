<template>
  <span class="status-badge" :style="{ backgroundColor: color + '20', color: color, borderColor: color + '40' }">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { statusGroup } from './status'
import { t, type Locale } from './i18n'

const props = defineProps<{
  status: number
  locale?: Locale
}>()

const locale = props.locale || 'zh'
// 公开侧统一展示归并后的 4 组状态（库内 1~7 不变，状态历史仍用原始状态）
const group = computed(() => statusGroup(props.status))
const label = computed(() => t(group.value.key, locale))
const color = computed(() => group.value.color)
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

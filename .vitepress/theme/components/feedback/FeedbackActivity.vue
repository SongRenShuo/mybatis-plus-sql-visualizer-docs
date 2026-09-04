<template>
  <div class="feedback-activity">
    <h3 class="activity-title">{{ t('activity', locale) }}</h3>

    <div v-if="loading" class="activity-empty">{{ t('loading', locale) }}</div>
    <div v-else-if="!items.length" class="activity-empty">{{ t('activityEmpty', locale) }}</div>
    <ul v-else class="activity-list">
      <li v-for="item in items" :key="item.id" class="activity-item">
        <span
          class="activity-icon"
          :class="item.type === 'new' ? 'icon-new' : 'icon-status'"
        >{{ item.type === 'new' ? '✨' : '🔁' }}</span>
        <div class="activity-body">
          <p class="activity-line">
            <span
              class="activity-label"
              :class="item.type === 'new' ? 'label-new' : 'label-status'"
            >{{ item.type === 'new' ? t('activityNew', locale) : t('statusChanged', locale) }}</span>
            <span class="activity-post-title" :title="item.title">{{ item.title }}</span>
          </p>
          <p class="activity-meta">
            <template v-if="item.type === 'status'">
              <span class="activity-status">
                {{ statusLabel(item.statusFromLabel, item.statusFrom) }} → {{ statusLabel(item.statusToLabel, item.statusTo) }}
              </span>
              <span v-if="item.operator" class="activity-operator">{{ item.operator }}</span>
            </template>
            <span class="activity-time">{{ relativeTime(item.createdAt) }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { t, type Locale, type MessageKey } from './i18n'

const props = defineProps<{
  apiBase: string
  locale: Locale
}>()

interface ActivityItem {
  id: number | string
  type: 'status' | 'new'
  postNo: string
  title: string
  statusFrom?: number
  statusTo?: number
  statusFromLabel?: string
  statusToLabel?: string
  operator?: string
  createdAt: string
}

const loading = ref(true)
const items = ref<ActivityItem[]>([])

const statusKeys: Record<number, MessageKey> = {
  1: 'status.1', 2: 'status.2', 3: 'status.3', 4: 'status.4', 5: 'status.5', 6: 'status.6', 7: 'status.7',
}

// 优先用后端返回的状态标签（中文），缺失时按数字状态走 i18n
function statusLabel(backendLabel: string | undefined, status: number | undefined): string {
  if (backendLabel) return backendLabel
  if (status !== undefined && status !== null && statusKeys[status]) {
    return t(statusKeys[status], props.locale)
  }
  return ''
}

function relativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T'))
  if (isNaN(d.getTime())) return dateStr
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('timeJustNow', props.locale)
  if (minutes < 60) return t('timeMinutesAgo', props.locale, { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('timeHoursAgo', props.locale, { n: hours })
  const days = Math.floor(hours / 24)
  if (days < 30) return t('timeDaysAgo', props.locale, { n: days })
  const dateLocale = props.locale === 'zh' ? 'zh-CN' : 'en-US'
  return d.toLocaleDateString(dateLocale, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(async () => {
  try {
    const res = await fetch(`${props.apiBase}/feedback/activity?limit=20`)
    const data = await res.json()
    if (data.code === 0) {
      items.value = data.data?.items || []
    }
  } catch (err) {
    console.error('Failed to load feedback activity:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.feedback-activity {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  padding: 1rem 1.25rem;
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.activity-empty {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.activity-item {
  display: flex;
  gap: 0.625rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.875rem;
  line-height: 1;
}

.icon-new {
  background: rgba(16, 185, 129, 0.12);
}

.icon-status {
  background: rgba(59, 130, 246, 0.12);
}

.activity-body {
  flex: 1;
  min-width: 0;
}

.activity-line {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
}

.activity-label {
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.label-new {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.label-status {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.activity-post-title {
  flex: 1;
  min-width: 0;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.5rem;
  margin: 0.125rem 0 0;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.activity-status {
  color: var(--vp-c-text-2);
}

.activity-operator {
  padding: 0 6px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.activity-time {
  margin-left: auto;
  white-space: nowrap;
}
</style>

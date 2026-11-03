<template>
  <div class="feedback-activity">
    <h3 class="activity-title">{{ t('activity', locale) }}</h3>

    <div v-if="loading" class="activity-empty">{{ t('loading', locale) }}</div>
    <div v-else-if="!items.length" class="activity-empty">{{ t('activityEmpty', locale) }}</div>
    <ul v-else class="activity-list">
      <li
        v-for="item in items"
        :key="item.id"
        class="activity-item"
        tabindex="0"
        @click="$emit('select-post', item.postNo)"
        @keydown.enter="$emit('select-post', item.postNo)"
      >
        <span
          class="activity-dot"
          :class="item.type === 'new' ? 'is-new' : 'is-status'"
          aria-hidden="true"
        />
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
import { parseUtcDate } from './dateTime'

const props = defineProps<{
  apiBase: string
  locale: Locale
}>()

// 条目点击直达对应需求（后端 activity 接口两类条目都带 postNo）
defineEmits<{
  (e: 'select-post', postNo: string): void
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
  const d = parseUtcDate(dateStr)
  if (!d) return dateStr || ''
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

onMounted(loadActivity)

async function loadActivity() {
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
}

// 供父组件在反馈池提交成功后刷新动态
defineExpose({ reload: loadActivity })
</script>

<style scoped>
.feedback-activity {
  padding: 14px 16px 6px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
}

.activity-title {
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ui-border);
  font-size: 15px;
  font-weight: 600;
  color: var(--ui-fg);
}

.activity-empty {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

/* 时间线：左侧一条竖线 + 彩色节点，替掉原来「浅色圆圈图标 + 同色标签胶囊」
   两个并排的色块（图标只有 14px，看着脏也有点丑） */
.activity-list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0 0 0 18px;
  /* 动态最多 20 条，不限高会把右栏拉成一整屏长条，与左侧看板高度失衡 */
  max-height: min(70vh, 620px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--ui-fg) 24%, transparent) transparent;
}

.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: color-mix(in srgb, var(--ui-fg) 24%, transparent);
}

.activity-list::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 14px;
  width: 1px;
  background: var(--ui-border);
}

.activity-item {
  position: relative;
  display: flex;
  gap: 8px;
  padding: 7px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.activity-item:hover {
  background: var(--ui-surface-muted);
}

.activity-item:hover .activity-post-title {
  color: var(--ui-accent);
}

.activity-item:focus-visible {
  outline: 2px solid var(--ui-accent);
  outline-offset: -2px;
}

.activity-dot {
  position: absolute;
  left: -16px;
  top: 13px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  /* 与面板同色的外环，让节点压在竖线上而不是糊成一条 */
  box-shadow: 0 0 0 3px var(--ui-surface);
}

.activity-item:hover .activity-dot {
  box-shadow: 0 0 0 3px var(--ui-surface-muted);
}

.is-new {
  background: #10b981;
}

.is-status {
  background: #3b82f6;
}

.activity-body {
  min-width: 0;
  flex: 1;
}

.activity-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
}

.activity-label {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.label-new {
  color: #059669;
}

.label-status {
  color: #2563eb;
}

.dark .label-new {
  color: #34d399;
}

.dark .label-status {
  color: #60a5fa;
}

.activity-post-title {
  min-width: 0;
  flex: 1;
  color: var(--ui-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin: 3px 0 0;
  font-size: 11px;
  color: var(--ui-fg-muted);
}

.activity-status {
  color: var(--ui-fg-soft);
  font-variant-numeric: tabular-nums;
}

.activity-operator {
  padding: 0 6px;
  border-radius: 999px;
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
  font-size: 10px;
  line-height: 16px;
}

.activity-time {
  margin-left: auto;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .activity-item {
    transition: none;
  }
}
</style>

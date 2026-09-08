<template>
  <div class="roadmap-board">
    <div v-for="col in columns" :key="col.key" class="roadmap-col">
      <div class="col-header">
        <span class="col-dot" :style="{ background: col.color }"></span>
        <span class="col-title">{{ t(col.key, locale) }}</span>
        <span class="col-count">{{ getStatusPosts(col.statuses).length }}</span>
      </div>
      <div class="col-body">
        <div
          v-for="post in getStatusPosts(col.statuses)"
          :key="post.postNo"
          class="roadmap-card"
          :class="{ pinned: post.isPinned }"
          @click="$emit('select', post.postNo)"
        >
          <div class="card-top">
            <VoteButton
              size="sm"
              :post-no="post.postNo"
              :count="post.voteCount"
              :has-voted="post.hasVoted"
              :api-base="apiBase"
              @update="(c, v) => $emit('vote', post.postNo, c, v)"
            />
            <span v-if="post.isPinned" class="card-pin" title="置顶">📌</span>
          </div>
          <div class="card-title">{{ post.title }}</div>
          <div class="card-meta">
            <span class="card-type">{{ post.typeIcon }} {{ post.typeLabel }}</span>
            <span v-if="post.category" class="card-category">{{ categoryLabel(post.category) }}</span>
            <span v-if="post.commentCount > 0" class="card-comments">💬 {{ post.commentCount }}</span>
          </div>
          <!-- 与列表卡片同款时间（MM-DD HH:mm），看板此前完全没有时间 -->
          <div class="card-footer">
            <span class="card-no">{{ post.postNo }}</span>
            <span v-if="post.createdAt" class="card-date">{{ formatDateTime(post.createdAt) }}</span>
          </div>
        </div>
        <div v-if="!getStatusPosts(col.statuses).length" class="col-empty">
          {{ t('noItems', locale) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale, MessageKey } from './i18n'
import { t } from './i18n'
import VoteButton from './VoteButton.vue'
import { formatDateTime } from './dateTime'
import { STATUS_GROUPS, type StatusGroup } from './status'

const props = defineProps<{
  posts: Array<{
    postNo: string
    title: string
    type: number
    typeIcon: string
    typeLabel: string
    status: number
    voteCount: number
    commentCount: number
    category: string
    isPinned: boolean
    hasVoted: boolean
    createdAt?: string
  }>
  apiBase: string
  locale?: Locale
}>()

defineEmits<{
  (e: 'select', postNo: string): void
  /** 卡片直接点赞/取消：透传给 FeedbackPool 回写共享的 posts 状态 */
  (e: 'vote', postNo: string, count: number, hasVoted: boolean): void
}>()

const locale = props.locale || 'zh'

// 公开侧状态归并为 4 列（库内 1~7 不变），列序随 STATUS_GROUPS
const columns: StatusGroup[] = STATUS_GROUPS

function getStatusPosts(statuses: number[]) {
  return props.posts
    .filter(p => statuses.includes(p.status))
    .sort((a, b) => {
      if (!!a.isPinned !== !!b.isPinned) return a.isPinned ? -1 : 1
      return b.voteCount - a.voteCount
    })
}

function categoryLabel(category: string): string {
  const key = `cat.${category}` as MessageKey
  const label = t(key, locale)
  return label === key ? category : label
}
</script>

<style scoped>
.roadmap-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1rem;
  align-items: start;
}

/* 窄屏改为横向滚动看板，避免 6 列纵向堆叠成超长列表 */
@media (max-width: 767px) {
  .roadmap-board {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
    /* 底部留白，横向滚动条不遮住卡片内容 */
    padding-bottom: 0.5rem;
  }

  .roadmap-col {
    min-width: 260px;
    scroll-snap-align: start;
  }
}

.roadmap-col {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 0.875rem;
  font-weight: 600;
}

.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.col-title {
  flex: 1;
}

.col-count {
  padding: 1px 8px;
  border-radius: 9999px;
  background: var(--vp-c-bg);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.col-body {
  padding: 0.75rem;
  min-height: 100px;
}

.roadmap-card {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.roadmap-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.roadmap-card.pinned {
  border-left: 3px solid var(--vp-c-brand-1);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.card-pin {
  font-size: 0.8rem;
  line-height: 1;
}

.card-title {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.card-type {
  white-space: nowrap;
}

.card-category {
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.card-no {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

/* 卡片底部：编号 + 时间（与列表 meta 同款时分格式） */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-date {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.col-empty {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}
</style>
<template>
  <div class="feedback-pool">
    <!-- Header -->
    <div class="pool-header">
      <div class="header-row">
        <div class="header-spacer"></div>
        <div class="pool-title">
          <h2>{{ t('title', locale) }}</h2>
          <p>{{ t('subtitle', locale) }}</p>
        </div>
        <div class="header-actions">
          <button class="submit-open-btn" @click="showForm = true">
            <span class="submit-plus">＋</span>{{ t('submitNew', locale) }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="view-toggle">
      <button :class="{ active: view === 'list' }" @click="view = 'list'">{{ t('list', locale) }}</button>
      <button :class="{ active: view === 'board' }" @click="view = 'board'">{{ t('board', locale) }}</button>
    </div>

    <!-- List View -->
    <div v-if="view === 'list'">
      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>{{ t('filterStatus', locale) }}</label>
          <select v-model="filterStatus">
            <option value="">{{ locale === 'zh' ? '全部' : 'All' }}</option>
            <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>{{ t('filterType', locale) }}</label>
          <select v-model="filterType">
            <option value="">{{ locale === 'zh' ? '全部' : 'All' }}</option>
            <option v-for="t in typeOptions" :key="t.value" :value="t.value">{{ t.icon }} {{ t.label }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>{{ t('filterSort', locale) }}</label>
          <select v-model="sortBy">
            <option value="votes">{{ t('sortVotes', locale) }}</option>
            <option value="newest">{{ t('sortNewest', locale) }}</option>
          </select>
        </div>
        <div class="filter-group filter-search">
          <input
            v-model="searchKeyword"
            type="text"
            :placeholder="t('search', locale)"
            @keyup.enter="applySearch"
          />
        </div>
      </div>

      <!-- Post List -->
      <div v-if="loading" class="loading">{{ t('loading', locale) }}</div>
      <div v-else-if="!filteredPosts.length" class="empty">{{ t('empty', locale) }}</div>
      <div v-else class="post-list">
        <div
          v-for="post in filteredPosts"
          :key="post.postNo"
          class="post-card"
          @click="selectPost(post.postNo)"
        >
          <div class="card-left">
            <VoteButton
              :post-no="post.postNo"
              :count="post.voteCount"
              :has-voted="post.hasVoted"
              :api-base="apiBase"
              @update="(c, v) => onVoteUpdate(post.postNo, c, v)"
            />
          </div>
          <div class="card-right">
            <div class="card-header">
              <h3 class="card-title">{{ post.title }}</h3>
              <StatusBadge :status="post.status" :locale="locale" />
            </div>
            <div class="card-meta">
              <span class="meta-type">{{ post.typeIcon }} {{ typeLabel(post.type) }}</span>
              <span v-if="post.category" class="meta-category">{{ categoryLabel(post.category) }}</span>
              <span class="meta-date">{{ formatDate(post.createdAt) }}</span>
              <span class="meta-comments">💬 {{ post.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Board View -->
    <div v-else>
      <div v-if="statusStats.length" class="board-stats">
        <span v-for="s in statusStats" :key="s.status" class="board-stat">
          <span class="board-stat-dot" :style="{ background: statusColor(s.status) }"></span>
          {{ statusLabel(s.status) }} {{ s.count }}
        </span>
      </div>
      <RoadmapBoard :posts="postsForBoard" :locale="locale" @select="selectPost" />
    </div>

    <!-- Submit modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @mousedown.self="closeForm">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <button class="modal-close" :title="t('close', locale)" :aria-label="t('close', locale)" @click="closeForm">
            ×
          </button>
          <div class="modal-body">
            <FeedbackForm ref="formRef" :api-base="apiBase" :locale="locale" embedded @done="closeForm" />
          </div>
          <div class="modal-footer">
            <span v-if="!formRef?.canSubmit" class="modal-hint">{{ (formRef?.invalidTips || []).join('，') }}</span>
            <button class="modal-cancel" @click="closeForm">{{ t('cancel', locale) }}</button>
            <button class="modal-submit" :disabled="!formRef?.canSubmit" @click="formRef?.submit()">{{ t('submitBtn', locale) }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <span>{{ t('totalPosts', locale, { n: stats.totalPosts }) }}</span>
      <span>·</span>
      <span>{{ t('totalVotes', locale, { n: stats.totalVotes }) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import StatusBadge from './StatusBadge.vue'
import VoteButton from './VoteButton.vue'
import FeedbackForm from './FeedbackForm.vue'
import RoadmapBoard from './RoadmapBoard.vue'
import { t, type Locale, type MessageKey } from './i18n'

const props = defineProps<{
  apiBase: string
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'select-post', postNo: string): void
}>()

interface Post {
  postNo: string
  title: string
  type: number
  typeLabel: string
  typeIcon: string
  status: number
  statusLabel: string
  category: string
  voteCount: number
  commentCount: number
  submitterName: string
  createdAt: string
  tags: Array<{ name: string; color: string }>
  hasVoted: boolean
  isPinned: boolean
}

const loading = ref(true)
const posts = ref<Post[]>([])
const stats = ref({ totalPosts: 0, totalVotes: 0 })
const statusStats = ref<Array<{ status: number; count: number }>>([])
const view = ref<'list' | 'board'>('board')
const showForm = ref(false)
const formRef = ref<InstanceType<typeof FeedbackForm> | null>(null)
const filterStatus = ref('')
const filterType = ref('')
const sortBy = ref('votes')
const searchKeyword = ref('')

const statusOptions = computed(() => [
  { value: 1, label: t('status.1', props.locale) },
  { value: 2, label: t('status.2', props.locale) },
  { value: 3, label: t('status.3', props.locale) },
  { value: 4, label: t('status.4', props.locale) },
  { value: 5, label: t('status.5', props.locale) },
  { value: 6, label: t('status.6', props.locale) },
  { value: 7, label: t('status.7', props.locale) },
])

const typeOptions = computed(() => [
  { value: 1, label: t('type.feature', props.locale), icon: '✨' },
  { value: 2, label: t('type.bug', props.locale), icon: '🐛' },
  { value: 3, label: t('type.improvement', props.locale), icon: '⚡' },
  { value: 4, label: t('type.question', props.locale), icon: '❓' },
])

const typeIcons: Record<number, string> = { 1: '✨', 2: '🐛', 3: '⚡', 4: '❓' }

const statusColors: Record<number, string> = {
  1: '#6b7280', 2: '#f59e0b', 3: '#3b82f6', 4: '#8b5cf6', 5: '#10b981', 6: '#ef4444', 7: '#6b7280',
}

const typeKeys: Record<number, MessageKey> = {
  1: 'type.feature', 2: 'type.bug', 3: 'type.improvement', 4: 'type.question',
}

function typeLabel(type: number): string {
  return typeKeys[type] ? t(typeKeys[type], props.locale) : ''
}

function statusLabel(s: number): string {
  const keys: Record<number, MessageKey> = {
    1: 'status.1', 2: 'status.2', 3: 'status.3', 4: 'status.4', 5: 'status.5', 6: 'status.6', 7: 'status.7',
  }
  return keys[s] ? t(keys[s], props.locale) : String(s)
}

function statusColor(s: number): string {
  return statusColors[s] || '#6b7280'
}

function categoryLabel(category: string): string {
  const key = `cat.${category}`
  const label = t(key as MessageKey, props.locale)
  return label === key ? category : label
}

const filteredPosts = computed(() => {
  let result = posts.value

  if (filterStatus.value) {
    result = result.filter(p => p.status === Number(filterStatus.value))
  }
  if (filterType.value) {
    result = result.filter(p => p.type === Number(filterType.value))
  }

  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } else {
    result = [...result].sort((a, b) => b.voteCount - a.voteCount)
  }

  return result
})

const postsForBoard = computed(() =>
  posts.value.map(p => ({
    postNo: p.postNo,
    title: p.title,
    type: p.type,
    typeIcon: typeIcons[p.type] || '',
    typeLabel: typeLabel(p.type),
    status: p.status,
    voteCount: p.voteCount,
    commentCount: p.commentCount,
    category: p.category,
    isPinned: !!p.isPinned,
  }))
)

onMounted(loadData)
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
watch([filterStatus, filterType, sortBy], () => {
  // Filters reactive, no need to reload
})

function closeForm() {
  showForm.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showForm.value) {
    closeForm()
  }
}

function applySearch() {
  loadData()
}

async function loadData() {
  loading.value = true
  try {
    const params = new URLSearchParams({ size: '100' })
    if (searchKeyword.value) params.set('keyword', searchKeyword.value)

    const [postsRes, statsRes] = await Promise.all([
      fetch(`${props.apiBase}/feedback/posts?${params.toString()}`),
      fetch(`${props.apiBase}/feedback/stats`),
    ])

    const postsData = await postsRes.json()
    const statsData = await statsRes.json()

    if (postsData.code === 0) {
      posts.value = (postsData.data.items || []).map((p: any) => ({
        ...p,
        typeIcon: typeIcons[p.type] || '',
      }))
    }
    if (statsData.code === 0) {
      stats.value = { totalPosts: statsData.data.totalPosts, totalVotes: statsData.data.totalVotes }
      statusStats.value = statsData.data.statusStats || []
    }
  } catch (err) {
    console.error('Failed to load feedback data:', err)
  } finally {
    loading.value = false
  }
}

function selectPost(postNo: string) {
  emit('select-post', postNo)
}

function onVoteUpdate(postNo: string, count: number, hasVoted: boolean) {
  const post = posts.value.find(p => p.postNo === postNo)
  if (post) {
    post.voteCount = count
    post.hasVoted = hasVoted
  }
  if (stats.value) {
    stats.value.totalVotes = hasVoted
      ? stats.value.totalVotes + 1
      : stats.value.totalVotes - 1
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T'))
  if (isNaN(d.getTime())) return dateStr
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 周前`
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
</script>

<style scoped>
.feedback-pool {
  max-width: 1200px;
  margin: 0 auto;
}

.pool-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pool-header h2 {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
}

.pool-header p {
  color: var(--vp-c-text-2);
  margin: 0;
}

.pool-title {
  text-align: center;
}

.header-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

.header-spacer {
  min-width: 0;
}

.header-actions {
  justify-self: end;
}

.view-toggle {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  width: fit-content;
}

.view-toggle button {
  padding: 0.5rem 1.25rem;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.view-toggle button.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.filter-group select {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  cursor: pointer;
}

.filter-search input {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  width: 200px;
}

.filter-search input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.loading, .empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-3);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-left {
  flex-shrink: 0;
}

.card-right {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  flex-wrap: wrap;
}

.meta-category {
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.stats-bar {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.board-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.board-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.board-stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.submit-open-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.submit-open-btn:hover {
  opacity: 0.9;
}

.submit-plus {
  font-size: 1rem;
  line-height: 1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.55);
  overflow-y: auto;
}

.modal-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 1.25rem 1.5rem 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.modal-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-border);
}

.modal-cancel {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-cancel:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.modal-hint {
  margin-right: auto;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.modal-submit {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.modal-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style>
/* 仅需求反馈池页生效（该组件只在此页渲染）：收紧文档页顶部留白，让自定义页面更紧凑 */
.VPDoc:has(.feedback-pool) {
  padding-top: 20px;
}
.feedback-page:has(.feedback-pool) {
  padding: 0;
}
</style>

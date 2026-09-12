<template>
  <div class="feedback-pool">
    <!-- Header -->
    <div class="pool-header">
      <div class="pool-title">
        <h2>{{ t('title', locale) }}</h2>
        <p>{{ t('subtitle', locale) }}</p>
      </div>
    </div>

    <!-- Toolbar: 列表/看板切换(左) + 刷新/新增反馈(右) -->
    <div class="pool-toolbar">
      <div class="view-toggle">
        <button :class="{ active: view === 'list' }" @click="view = 'list'">{{ t('list', locale) }}</button>
        <button :class="{ active: view === 'board' }" @click="view = 'board'">{{ t('board', locale) }}</button>
      </div>
      <div class="pool-actions">
        <button class="pool-refresh-btn" :disabled="loading" @click="loadData">
          <span class="refresh-icon" :class="{ spinning: loading }">↻</span>{{ t('refresh', locale) }}
        </button>
        <button class="submit-open-btn" @click="showForm = true">
          <span class="submit-plus">＋</span>{{ t('submitNew', locale) }}
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="view === 'list'">
      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>{{ t('filterStatus', locale) }}</label>
          <FilterSelect v-model="filterStatus" :options="statusOptions" />
        </div>
        <div class="filter-group">
          <label>{{ t('filterType', locale) }}</label>
          <FilterSelect v-model="filterType" :options="typeOptions" />
        </div>
        <div class="filter-group">
          <label>{{ t('filterSort', locale) }}</label>
          <FilterSelect v-model="sortBy" :options="sortOptions" />
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
              <span class="meta-date">{{ formatDateTime(post.createdAt) }}</span>
              <span class="meta-comments">💬 {{ post.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Board View -->
    <div v-else>
      <div class="board-search">
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="t('search', locale)"
          @keyup.enter="applySearch"
        />
      </div>
      <div v-if="boardStats.length" class="board-stats">
        <span v-for="s in boardStats" :key="s.key" class="board-stat">
          <span class="board-stat-dot" :style="{ background: s.color }"></span>
          {{ t(s.key, locale) }} {{ s.count }}
        </span>
      </div>
      <RoadmapBoard
        :posts="postsForBoard"
        :api-base="apiBase"
        :locale="locale"
        @select="selectPost"
        @vote="onVoteUpdate"
      />
    </div>

    <!-- Submit modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @mousedown.self="closeForm">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <button class="modal-close" :title="t('close', locale)" :aria-label="t('close', locale)" @click="closeForm">
            ×
          </button>
          <div class="modal-body">
            <FeedbackForm ref="formRef" :api-base="apiBase" :locale="locale" embedded @done="onSubmitted" />
          </div>
          <div class="modal-footer">
            <span v-if="!formRef?.canSubmit" class="modal-hint">⚠ {{ (formRef?.invalidTips || []).join('，') }}</span>
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
import FilterSelect from './FilterSelect.vue'
import VoteButton from './VoteButton.vue'
import FeedbackForm from './FeedbackForm.vue'
import RoadmapBoard from './RoadmapBoard.vue'
import { t, type Locale, type MessageKey } from './i18n'
import { formatDateTime } from './dateTime'
import { STATUS_GROUPS } from './status'

const props = defineProps<{
  apiBase: string
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'select-post', postNo: string): void
  (e: 'submitted'): void
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
const view = ref<'list' | 'board'>(
  typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'board'
)
const showForm = ref(false)
const formRef = ref<InstanceType<typeof FeedbackForm> | null>(null)
// 状态筛选用归并组（值=组序号），库内 1~7 状态对用户隐藏
const filterStatus = ref('')
const filterType = ref('')
const sortBy = ref('votes')
const searchKeyword = ref('')

// 状态筛选下拉：4 个归并组（值=STATUS_GROUPS 下标）
const statusOptions = computed(() => [
  { value: '', label: props.locale === 'zh' ? '全部' : 'All' },
  ...STATUS_GROUPS.map((g, i) => ({ value: String(i), label: t(g.key, props.locale) })),
])

const typeOptions = computed(() => [
  { value: '', label: props.locale === 'zh' ? '全部' : 'All' },
  { value: '1', label: `✨ ${t('type.feature', props.locale)}` },
  { value: '2', label: `🐛 ${t('type.bug', props.locale)}` },
  { value: '3', label: `⚡ ${t('type.improvement', props.locale)}` },
  { value: '4', label: `❓ ${t('type.question', props.locale)}` },
])

const sortOptions = computed(() => [
  { value: 'votes', label: t('sortVotes', props.locale) },
  { value: 'newest', label: t('sortNewest', props.locale) },
])

const typeIcons: Record<number, string> = { 1: '✨', 2: '🐛', 3: '⚡', 4: '❓' }

const typeKeys: Record<number, MessageKey> = {
  1: 'type.feature', 2: 'type.bug', 3: 'type.improvement', 4: 'type.question',
}

function typeLabel(type: number): string {
  return typeKeys[type] ? t(typeKeys[type], props.locale) : ''
}

// 看板顶部统计条：原始状态计数按归并组聚合（顺序随 STATUS_GROUPS，零计数组不显示）
const boardStats = computed(() =>
  STATUS_GROUPS.map(g => ({
    key: g.key,
    color: g.color,
    count: (statusStats.value || [])
      .filter(s => g.statuses.includes(s.status))
      .reduce((sum, s) => sum + s.count, 0),
  })).filter(s => s.count > 0),
)

function categoryLabel(category: string): string {
  const key = `cat.${category}`
  const label = t(key as MessageKey, props.locale)
  return label === key ? category : label
}

const filteredPosts = computed(() => {
  let result = posts.value

  if (filterStatus.value !== '') {
    const group = STATUS_GROUPS[Number(filterStatus.value)]
    if (group) result = result.filter(p => group.statuses.includes(p.status))
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
    hasVoted: !!p.hasVoted,
    createdAt: p.createdAt,
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

// 提交成功：关弹窗后立刻刷新列表/统计，并通知父级联动刷新动态
function onSubmitted() {
  closeForm()
  loadData()
  emit('submitted')
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

// 供父组件在深链弹窗提交成功后刷新本池数据
defineExpose({ reload: loadData })

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
</script>

<style scoped>
.feedback-pool {
  max-width: none;
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

.pool-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pool-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-toggle {
  display: flex;
  gap: 0;
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

.filter-search input {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  /* 与同行三个 FilterSelect 触发器同档，工具栏一排控件字号一致 */
  font-size: 0.85rem;
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

.board-search {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.board-search input {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  /* 与列表视图的筛选控件、下拉选项同档 */
  font-size: 0.85rem;
  width: 240px;
}

.board-search input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
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

.pool-refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.pool-refresh-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pool-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  line-height: 1;
}

.refresh-icon.spinning {
  animation: refresh-spin 0.8s linear infinite;
}

@keyframes refresh-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  max-width: 880px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 1.25rem 1.5rem 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  /* 配合 overlay 滚动：内容超高时从顶部开始而非垂直居中被裁剪 */
  margin: auto;
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
  flex-wrap: wrap;
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
  font-size: 0.8125rem;
  font-weight: 500;
  color: #d97706;
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

@media (max-width: 768px) {
  /* <16px 的输入控件聚焦会触发 iOS Safari 自动放大页面 */
  .fs-trigger,
  .filter-search input,
  .board-search input {
    font-size: 1rem;
    min-height: 38px;
  }

  /* 窄屏工具栏按钮换行，避免挤压 */
  .pool-toolbar {
    flex-wrap: wrap;
  }

  .pool-actions {
    flex: 1 1 100%;
    justify-content: flex-end;
  }

  .board-search {
    width: 100%;
  }

  .board-search input {
    width: 100%;
  }

  .filter-search {
    flex: 1 1 100%;
  }

  .filter-search input {
    width: 100%;
  }

  /* 校验提示独占一行，不挤占取消/提交按钮 */
  .modal-hint {
    flex-basis: 100%;
    margin-right: 0;
  }
}
</style>

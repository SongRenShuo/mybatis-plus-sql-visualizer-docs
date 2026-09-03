<template>
  <div class="feedback-pool">
    <!-- Header -->
    <div class="pool-header">
      <div class="header-row">
        <div>
          <h2>{{ t('title', locale) }}</h2>
          <p>{{ t('subtitle', locale) }}</p>
        </div>
        <div class="lang-toggle">
          <button :class="{ active: locale === 'zh' }" @click="locale = 'zh'">中</button>
          <button :class="{ active: locale === 'en' }" @click="locale = 'en'">EN</button>
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
              <StatusBadge :status="post.status" />
            </div>
            <div class="card-meta">
              <span class="meta-type">{{ post.typeIcon }} {{ post.typeLabel }}</span>
              <span v-if="post.category" class="meta-category">{{ post.category }}</span>
              <span class="meta-date">{{ formatDate(post.createdAt) }}</span>
              <span class="meta-comments">💬 {{ post.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Board View -->
    <div v-else>
      <RoadmapBoard :posts="postsForBoard" @select="selectPost" />
    </div>

    <!-- Submit Form -->
    <FeedbackForm :api-base="apiBase" :locale="locale" />

    <!-- Stats Bar -->
    <div class="stats-bar">
      <span>{{ t('totalPosts', locale, { n: stats.totalPosts }) }}</span>
      <span>·</span>
      <span>{{ t('totalVotes', locale, { n: stats.totalVotes }) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import StatusBadge from './StatusBadge.vue'
import VoteButton from './VoteButton.vue'
import FeedbackForm from './FeedbackForm.vue'
import RoadmapBoard from './RoadmapBoard.vue'
import { t, type Locale } from './i18n'

const props = defineProps<{
  apiBase: string
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
}

const loading = ref(true)
const posts = ref<Post[]>([])
const stats = ref({ totalPosts: 0, totalVotes: 0 })
const view = ref<'list' | 'board'>('list')
const filterStatus = ref('')
const filterType = ref('')
const sortBy = ref('votes')
const searchKeyword = ref('')
const locale = ref<Locale>('zh')

const statusOptions = [
  { value: 1, label: 'Submitted' },
  { value: 2, label: 'Under Review' },
  { value: 3, label: 'Planned' },
  { value: 4, label: 'In Progress' },
  { value: 5, label: 'Completed' },
  { value: 6, label: 'Declined' },
  { value: 7, label: 'Duplicate' },
]

const typeOptions = [
  { value: 1, label: 'Feature', icon: '✨' },
  { value: 2, label: 'Bug', icon: '🐛' },
  { value: 3, label: 'Improvement', icon: '⚡' },
  { value: 4, label: 'Question', icon: '❓' },
]

const typeIcons: Record<number, string> = { 1: '✨', 2: '🐛', 3: '⚡', 4: '❓' }

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
    status: p.status,
    voteCount: p.voteCount,
  }))
)

onMounted(loadData)
watch([filterStatus, filterType, sortBy], () => {
  // Filters reactive, no need to reload
})

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
      stats.value = statsData.data
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
  max-width: 800px;
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.lang-toggle {
  display: flex;
  gap: 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  flex-shrink: 0;
}

.lang-toggle button {
  padding: 0.25rem 0.75rem;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.lang-toggle button.active {
  background: var(--vp-c-brand-1);
  color: #fff;
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
</style>

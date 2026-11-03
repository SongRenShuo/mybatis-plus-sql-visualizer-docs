<template>
  <div class="feedback-pool">
    <!-- 页头：眉标 + 标题 + 副文案 + 主操作 -->
    <header class="pool-head">
      <div class="pool-heading">
        <p class="ui-eyebrow">{{ t('poolEyebrow', locale) }}</p>
        <h2 class="pool-title">{{ t('title', locale) }}</h2>
        <p class="pool-sub">{{ t('subtitle', locale) }}</p>
      </div>
      <div class="pool-head-actions">
        <UiButton variant="outline" :disabled="loading" @click="loadData">
          <span class="refresh-icon" :class="{ spinning: loading }" aria-hidden="true">↻</span>
          {{ t('refresh', locale) }}
        </UiButton>
        <UiButton variant="primary" @click="showForm = true">
          <span class="btn-plus" aria-hidden="true">+</span>
          {{ t('submitNew', locale) }}
        </UiButton>
      </div>
    </header>

    <!-- 统计条：总数与总票数来自 stats，处理中/已完成来自 statusStats -->
    <div class="pool-stats">
      <UiStat :value="stats.totalPosts" :label="t('statTotal', locale)" />
      <UiStat :value="stats.totalVotes" :label="t('statVotes', locale)" />
      <UiStat :value="groupCount(1)" :label="t('statusGroup.inProgress', locale)" dot="#3b82f6" />
      <UiStat :value="groupCount(2)" :label="t('statusGroup.done', locale)" dot="#10b981" />
    </div>

    <!-- 视图切换 -->
    <div class="pool-toolbar">
      <UiTabs v-model="view" :items="viewTabs" :aria-label="t('viewLabel', locale)" />
      <span class="pool-summary ui-num">{{ t('poolSummary', locale, { n: stats.totalPosts, m: STATUS_GROUPS.length }) }}</span>
    </div>

    <!-- 列表视图 -->
    <div v-if="view === 'list'" class="list-view">
      <div class="list-filters">
        <span class="filter-item">
          <span class="filter-label">{{ t('filterStatus', locale) }}</span>
          <FilterSelect v-model="filterStatus" :options="statusOptions" />
        </span>
        <span class="filter-item">
          <span class="filter-label">{{ t('filterType', locale) }}</span>
          <FilterSelect v-model="filterType" :options="typeOptions" />
        </span>
        <span class="filter-item">
          <span class="filter-label">{{ t('filterSort', locale) }}</span>
          <FilterSelect v-model="sortBy" :options="sortOptions" />
        </span>
        <UiInput
          v-model="searchKeyword"
          :placeholder="t('search', locale)"
          :aria-label="t('boardSearchLabel', locale)"
          size="sm"
          class="list-search"
          @enter="applySearch"
        />
      </div>

      <div v-if="loading" class="pool-empty">{{ t('loading', locale) }}</div>
      <div v-else-if="!filteredPosts.length" class="pool-empty">{{ t('empty', locale) }}</div>
      <div v-else class="post-list">
        <article
          v-for="post in filteredPosts"
          :key="post.postNo"
          class="post-row"
          role="button"
          tabindex="0"
          :aria-label="post.title"
          @click="selectPost(post.postNo)"
          @keydown.enter.prevent="selectPost(post.postNo)"
        >
          <div class="post-vote">
            <VoteButton
              :post-no="post.postNo"
              :count="post.voteCount"
              :has-voted="post.hasVoted"
              :api-base="apiBase"
              @update="(c, v) => onVoteUpdate(post.postNo, c, v)"
            />
          </div>
          <div class="post-body">
            <div class="post-head">
              <h3 class="post-title">
                <span v-if="post.isPinned" class="post-pin" :title="t('pinned', locale)"><FbIcon name="pin" :size="13" /></span>{{ post.title }}
              </h3>
              <StatusBadge :status="post.status" :locale="locale" />
            </div>
            <div class="post-meta">
              <span class="post-type"><FbIcon :name="post.typeIcon" :size="13" />{{ typeLabel(post.type) }}</span>
              <span v-if="post.category" class="post-category">{{ categoryLabel(post.category) }}</span>
              <span class="post-date ui-num">{{ formatDateTime(post.createdAt) }}</span>
              <span class="post-comments"><FbIcon name="message" :size="12" />{{ post.commentCount }}</span>
              <span class="post-no">{{ post.postNo }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- 看板视图：按状态分列，卡片点击开右侧详情抽屉 -->
    <div v-else class="board-view">
      <KanbanBoard
        v-model:filter="boardType"
        v-model:query="boardQuery"
        :filters="boardTypeFilters"
        :columns="boardColumns"
        :filtered="boardFiltered"
        :filter-label="t('filterType', locale)"
        :search-placeholder="t('search', locale)"
        :search-label="t('boardSearchLabel', locale)"
        :clear-label="t('boardClearSearch', locale)"
        :empty-text="t('boardNoMatch', locale)"
        :idle-text="t('boardEmptyColumn', locale)"
        :instructions="t('boardHint', locale)"
        :status-text="boardStatusText"
      >
        <template #default="{ column }">
          <KanbanCard
            v-for="post in column.items"
            :key="post.postNo"
            :item-id="post.postNo"
            :label="post.title"
            :pinned="post.isPinned"
            @open="selectPost(post.postNo)"
          >
            <template #title>
              <span class="kb-card-title">
                <span v-if="post.isPinned" class="post-pin" :title="t('pinned', locale)"><FbIcon name="pin" :size="13" /></span>{{ post.title }}
              </span>
            </template>
            <template #meta>
              <span class="kb-inline"><FbIcon :name="post.typeIcon" :size="13" />{{ post.typeLabel }}</span>
              <span v-if="post.category" class="kb-category">{{ categoryLabel(post.category) }}</span>
              <span class="kb-date">{{ formatDateTime(post.createdAt) }}</span>
            </template>
            <template #footer>
              <VoteButton
                size="sm"
                :post-no="post.postNo"
                :count="post.voteCount"
                :has-voted="post.hasVoted"
                :api-base="apiBase"
                @update="(c, v) => onVoteUpdate(post.postNo, c, v)"
              />
              <UiChip><FbIcon name="message" :size="12" />{{ post.commentCount }}</UiChip>
              <UiChip mono class="kb-post-no">{{ post.postNo }}</UiChip>
            </template>
          </KanbanCard>
        </template>
      </KanbanBoard>
    </div>

    <!-- 提交弹窗 -->
    <UiModal
      v-if="showForm"
      :title="t('submitTitle', locale)"
      :subtitle="t('formTip', locale)"
      :close-label="t('close', locale)"
      @close="closeForm"
    >
      <FeedbackForm ref="formRef" :api-base="apiBase" :locale="locale" embedded @done="onSubmitted" />
      <template #footer>
        <span v-if="!formRef?.canSubmit" class="modal-hint">
          <FbIcon name="alert" :size="14" /> {{ (formRef?.invalidTips || []).join('，') }}
        </span>
        <UiButton variant="ghost" @click="closeForm">{{ t('cancel', locale) }}</UiButton>
        <UiButton variant="primary" :disabled="!formRef?.canSubmit" @click="formRef?.submit()">
          {{ t('submitBtn', locale) }}
        </UiButton>
      </template>
    </UiModal>

    <!-- 提交成功 toast -->
    <Teleport to="body">
      <div v-if="toast" class="pool-toast" role="status">
        <span class="pool-toast-text">{{ toast.text }}</span>
        <a v-if="toast.link" :href="toast.link.href" class="pool-toast-link">{{ toast.link.label }}</a>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import StatusBadge from './StatusBadge.vue'
import FbIcon from './FbIcon.vue'
import FilterSelect from './FilterSelect.vue'
import VoteButton from './VoteButton.vue'
import FeedbackForm from './FeedbackForm.vue'
import KanbanBoard from '../kanban/KanbanBoard.vue'
import KanbanCard from '../kanban/KanbanCard.vue'
import UiButton from '../ui/UiButton.vue'
import UiChip from '../ui/UiChip.vue'
import UiInput from '../ui/UiInput.vue'
import UiModal from '../ui/UiModal.vue'
import UiStat from '../ui/UiStat.vue'
import UiTabs from '../ui/UiTabs.vue'
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
// 看板自带的筛选/搜索：与列表视图的状态分开，避免两个视图互相污染
const boardType = ref('')
const boardQuery = ref('')

const viewTabs = computed(() => [
  { value: 'board', label: t('board', props.locale) },
  { value: 'list', label: t('list', props.locale) },
])

const statusOptions = computed(() => [
  { value: '', label: t('boardAllTypes', props.locale) },
  ...STATUS_GROUPS.map((g, i) => ({ value: String(i), label: t(g.key, props.locale) })),
])

const typeOptions = computed(() => [
  { value: '', label: t('boardAllTypes', props.locale) },
  { value: '1', label: t('type.feature', props.locale) },
  { value: '2', label: t('type.bug', props.locale) },
  { value: '3', label: t('type.improvement', props.locale) },
  { value: '4', label: t('type.question', props.locale) },
])

const sortOptions = computed(() => [
  { value: 'votes', label: t('sortVotes', props.locale) },
  { value: 'newest', label: t('sortNewest', props.locale) },
])

// 类型 -> FbIcon 图标名（原 emoji 载体已换成内联 SVG，看板卡片同样消费该字段）
const typeIcons: Record<number, string> = {
  1: 'plus-square', 2: 'bug', 3: 'trending-up', 4: 'help-circle',
}

const typeKeys: Record<number, MessageKey> = {
  1: 'type.feature', 2: 'type.bug', 3: 'type.improvement', 4: 'type.question',
}

function typeLabel(type: number): string {
  return typeKeys[type] ? t(typeKeys[type], props.locale) : ''
}

// 统计条里的归并组计数：statusStats 是后端给的全量状态计数
function groupCount(groupIndex: number): number {
  const group = STATUS_GROUPS[groupIndex]
  if (!group) return 0
  return (statusStats.value || [])
    .filter(row => group.statuses.includes(row.status))
    .reduce((sum, row) => sum + row.count, 0)
}

// 看板类型筛选用胶囊：状态已经由列表达，这里只筛类型
const boardTypeFilters = computed(() => [
  { value: '', label: t('boardAllTypes', props.locale) },
  { value: '1', label: t('type.feature', props.locale) },
  { value: '2', label: t('type.bug', props.locale) },
  { value: '3', label: t('type.improvement', props.locale) },
  { value: '4', label: t('type.question', props.locale) },
])

const boardFiltered = computed(
  () => boardType.value !== '' || boardQuery.value.trim() !== ''
)

// 看板内做本地筛选：数据本来就一次最多 100 条（与列表同一个请求），本地过滤才能即时响应输入
const boardMatched = computed(() => {
  const needle = boardQuery.value.trim().toLocaleLowerCase()
  return posts.value.filter(p => {
    if (boardType.value && p.type !== Number(boardType.value)) return false
    if (!needle) return true
    return [p.title, p.postNo, typeLabel(p.type), categoryLabel(p.category)]
      .join(' ')
      .toLocaleLowerCase()
      .includes(needle)
  })
})

// 列序随 STATUS_GROUPS；列内置顶在前、票数降序（与旧看板口径一致）
const boardColumns = computed(() =>
  STATUS_GROUPS.map((group, index) => ({
    id: String(index),
    title: t(group.key, props.locale),
    color: group.color,
    items: boardMatched.value
      .filter(p => group.statuses.includes(p.status))
      .sort((a, b) => {
        if (!!a.isPinned !== !!b.isPinned) return a.isPinned ? -1 : 1
        return b.voteCount - a.voteCount
      }),
  }))
)

// 只给读屏播报结果数，视觉上由列头计数承担
const boardStatusText = computed(() =>
  boardFiltered.value
    ? t('boardResultCount', props.locale, { n: boardMatched.value.length })
    : ''
)

function categoryLabel(category: string): string {
  const key = `cat.${category}`
  const label = t(key as MessageKey, props.locale)
  return label === key ? category : label
}

// 服务端已按 status/type/sort 过滤与排序（置顶由后端 ORDER BY is_pinned DESC 保证），
// 这里只做旧接口不认参数时的本地兜底，不再重排——否则会打乱置顶优先序
const filteredPosts = computed(() => {
  let result = posts.value

  if (filterStatus.value !== '') {
    const group = STATUS_GROUPS[Number(filterStatus.value)]
    if (group) result = result.filter(p => group.statuses.includes(p.status))
  }
  if (filterType.value) {
    result = result.filter(p => p.type === Number(filterType.value))
  }

  return result
})

onMounted(loadData)
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (toastTimer) clearTimeout(toastTimer)
})
// 筛选/排序交给服务端：本地过滤只兜底，翻页到 100 条以后的数据也能被筛到
watch([filterStatus, filterType, sortBy], () => {
  loadData()
})
// 切到看板：看板用的是自己那套类型胶囊，列表筛选若还在生效就只剩一列有数据。
// 重置由上面的筛选 watch 触发唯一一次 loadData，这里不再额外请求。
watch(view, (v) => {
  if (v !== 'board') return
  if (filterStatus.value !== '' || filterType.value !== '') {
    filterStatus.value = ''
    filterType.value = ''
  }
})

function closeForm() {
  showForm.value = false
}

/** 提交成功后的编号 toast（本池弹窗与深链弹窗两个入口共用同一文案） */
interface SubmitOptions {
  /** 需求池表单勾选了「同时申请 Bug 悬赏」 */
  bountyIntent?: boolean
  /** 本次提交标题，用于拼悬赏页的 title 参数 */
  title?: string
}

interface ToastState {
  text: string
  link?: { href: string; label: string }
}

const TOAST_DURATION = 6000
const TOAST_DURATION_BOUNTY = 15000

function notifySubmitted(postNo?: string, opts?: SubmitOptions) {
  const base = postNo ? `${t('submitSuccess', props.locale)} ${postNo}` : t('submitSuccess', props.locale)

  // 勾选悬赏时 toast 延长到 15s 并追加「继续申请悬赏」链接；不自动跳转，避免打断用户
  if (opts?.bountyIntent && postNo) {
    const prefix = props.locale === 'en' ? '/en' : ''
    const href = `${prefix}/about/bounty?postNo=${encodeURIComponent(postNo)}&title=${encodeURIComponent(opts.title || '')}`
    showToast(base, {
      duration: TOAST_DURATION_BOUNTY,
      link: { href, label: t('bountyContinue', props.locale) },
    })
    return
  }

  showToast(base)
}

// 提交成功：关弹窗后立刻刷新列表/统计，并通知父级联动刷新动态；
// 表单内的成功块随弹窗卸载，编号改由底部 toast 展示（否则用户看不到提交结果）
function onSubmitted(postNo?: string, opts?: SubmitOptions) {
  closeForm()
  loadData()
  emit('submitted')
  notifySubmitted(postNo, opts)
}

const toast = ref<ToastState | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string, opts?: { duration?: number; link?: ToastState['link'] }) {
  toast.value = { text: msg, link: opts?.link }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
    toastTimer = null
  }, opts?.duration ?? TOAST_DURATION)
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
    if (filterType.value) params.set('type', filterType.value)
    // 状态筛选用归并组：服务端按原始 status 逗号列表过滤
    const group = filterStatus.value === '' ? null : STATUS_GROUPS[Number(filterStatus.value)]
    if (group) params.set('status', group.statuses.join(','))
    if (sortBy.value) params.set('sort', sortBy.value)

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

// 供父组件在深链弹窗提交成功后刷新本池数据、复用编号 toast；
// applyVoteUpdate 供详情抽屉投票后定向同步卡片票数与统计条
defineExpose({ reload: loadData, notifySubmitted, applyVoteUpdate: onVoteUpdate })

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
  min-width: 0;
}

/* 页头 */
.pool-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
}

.pool-title {
  margin: 10px 0 6px;
  border: none;
  padding: 0;
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ui-fg);
}

.pool-sub {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--ui-fg-muted);
}

.pool-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-plus {
  font-size: 15px;
  line-height: 1;
}

.refresh-icon {
  display: inline-block;
  line-height: 1;
}

.refresh-icon.spinning {
  animation: refresh-spin 0.8s linear infinite;
}

@keyframes refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

/* 统计条 */
.pool-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  padding-bottom: 16px;
}

/* 工具栏 */
.pool-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 14px;
}

.pool-summary {
  font-size: 12px;
  color: var(--ui-fg-muted);
}

/* 列表视图 */
.list-view {
  min-width: 0;
}

.list-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
}

.filter-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter-label {
  font-size: 12px;
  color: var(--ui-fg-muted);
  white-space: nowrap;
}

.list-search {
  width: 220px;
  margin-left: auto;
}

.pool-empty {
  padding: 48px 16px;
  border: 1px dashed var(--ui-border);
  border-radius: var(--ui-radius-card);
  text-align: center;
  font-size: 13px;
  color: var(--ui-fg-muted);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.post-row:hover {
  border-color: color-mix(in srgb, var(--ui-accent) 45%, var(--ui-border));
  box-shadow: var(--ui-shadow-md);
}

.post-row:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ui-surface), 0 0 0 4px var(--ui-ring);
}

.post-vote {
  flex-shrink: 0;
}

.post-body {
  min-width: 0;
  flex: 1;
}

.post-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.post-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--ui-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-pin {
  margin-right: 4px;
  color: var(--ui-fg-muted);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.post-type,
.post-comments {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.post-category {
  padding: 1px 8px;
  border-radius: var(--ui-radius-pill);
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
}

.post-no {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11px;
}

/* 看板视图 */
.board-view {
  min-width: 0;
}

.kb-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.kb-category {
  color: var(--ui-accent);
}

.kb-date {
  font-variant-numeric: tabular-nums;
}

.kb-post-no {
  margin-left: auto;
}

/* 提交弹窗校验提示 */
.modal-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
  font-size: 12px;
  font-weight: 500;
  color: #d97706;
}

/* 提交成功 toast */
.pool-toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  z-index: 1200;
  display: flex;
  max-width: min(90vw, 520px);
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  transform: translateX(-50%);
  border: 1px solid color-mix(in srgb, #10b981 55%, var(--ui-border));
  border-radius: 12px;
  background: color-mix(in srgb, #10b981 12%, var(--ui-surface));
  box-shadow: var(--ui-shadow-md);
  text-align: center;
}

.pool-toast-text {
  font-size: 13px;
  font-weight: 500;
  color: #059669;
}

.dark .pool-toast-text {
  color: #34d399;
}

.pool-toast-link {
  font-size: 13px;
  font-weight: 600;
  color: #047857;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.dark .pool-toast-link {
  color: #6ee7b7;
}

@media (max-width: 860px) {
  .pool-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .pool-head-actions {
    width: 100%;
  }

  .pool-head-actions > * {
    flex: 1;
  }

  .list-filters {
    gap: 6px;
  }

  .list-search {
    width: 100%;
    margin-left: 0;
  }

  .post-title {
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-row {
    transition: none;
  }
}
</style>

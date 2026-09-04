<template>
  <div v-if="loading" class="loading">加载中...</div>

  <div v-else-if="error" class="error">{{ error }}</div>

  <div v-else-if="post" class="feedback-detail">
    <!-- Header -->
    <div class="detail-header">
      <div class="header-top">
        <span class="post-no">{{ post.postNo }}</span>
        <StatusBadge :status="post.status" :locale="locale" />
      </div>
      <h1 class="detail-title">{{ post.title }}</h1>
      <div class="detail-meta">
        <span v-if="post.submitterName">{{ post.submitterName }}</span>
        <span v-else>匿名</span>
        <span class="sep">·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <span v-if="post.category" class="sep">·</span>
        <span v-if="post.category" class="category-tag">{{ categoryLabel(post.category) }}</span>
      </div>
    </div>

    <!-- Description -->
    <div class="detail-body">
      <div class="description" v-html="renderMd(post.description)"></div>
    </div>

    <!-- Vote + Actions -->
    <div class="detail-actions">
      <VoteButton
        :post-no="post.postNo"
        :count="post.voteCount"
        :has-voted="post.hasVoted"
        :api-base="apiBase"
        @update="onVoteUpdate"
      />
    </div>

    <!-- Status Timeline -->
    <div v-if="post.statusLogs && post.statusLogs.length" class="section">
      <h3>状态历史</h3>
      <div class="timeline">
        <div v-for="(log, i) in post.statusLogs" :key="i" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-status">{{ statusLabel(log.to_status) }}</span>
            <span v-if="log.reason" class="timeline-reason">{{ log.reason }}</span>
            <span class="timeline-meta">{{ log.operator }} · {{ formatDate(log.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments -->
    <div class="section">
      <h3>评论 ({{ post.comments?.length || 0 }})</h3>

      <div v-if="post.comments && post.comments.length" class="comments-list">
        <div v-for="c in post.comments" :key="c.id" class="comment-item" :class="{ official: c.is_official }">
          <div class="comment-header">
            <span class="comment-author">{{ c.author_name }}</span>
            <span v-if="c.is_official" class="official-badge">官方</span>
            <span class="comment-date">{{ formatDate(c.created_at) }}</span>
          </div>
          <div class="comment-content">{{ c.content }}</div>
        </div>
      </div>

      <!-- Comment Form -->
      <div class="comment-form">
        <input
          v-model="commentName"
          type="text"
          placeholder="昵称"
          class="comment-input-name"
        />
        <textarea
          v-model="commentContent"
          placeholder="写下您的评论..."
          rows="3"
          class="comment-input-content"
        ></textarea>
        <button :disabled="!commentName || !commentContent.trim()" @click="submitComment">
          发表评论
        </button>
      </div>
    </div>

    <!-- Back link -->
    <div class="back-link">
      <a href="#" @click.prevent="$emit('back')">← 返回列表</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusBadge from './StatusBadge.vue'
import VoteButton from './VoteButton.vue'
import { t, type Locale, type MessageKey } from './i18n'

const props = defineProps<{
  postNo: string
  apiBase: string
  locale?: Locale
}>()

defineEmits<{
  (e: 'back'): void
}>()

const locale = props.locale || 'zh'

function statusLabel(s: number): string {
  const keys: Record<number, MessageKey> = {
    1: 'status.1',
    2: 'status.2',
    3: 'status.3',
    4: 'status.4',
    5: 'status.5',
    6: 'status.6',
    7: 'status.7',
  }
  return keys[s] ? t(keys[s], locale) : String(s)
}

function categoryLabel(category: string): string {
  const key = `cat.${category}`
  const label = t(key as MessageKey, locale)
  return label === key ? category : label
}

interface StatusLog {
  from_status: number
  to_status: number
  reason: string | null
  operator: string
  created_at: string
}

interface Comment {
  id: number
  content: string
  author_name: string
  is_official: number
  created_at: string
}

interface Post {
  postNo: string
  title: string
  description: string
  type: number
  typeLabel: string
  status: number
  statusLabel: string
  category: string
  voteCount: number
  commentCount: number
  submitterName: string
  createdAt: string
  updatedAt: string
  tags: Array<{ name: string; color: string }>
  comments: Comment[]
  statusLogs: StatusLog[]
  hasVoted: boolean
}

const loading = ref(true)
const error = ref('')
const post = ref<Post | null>(null)
const commentName = ref('')
const commentContent = ref('')

onMounted(loadDetail)

async function loadDetail() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${props.apiBase}/feedback/posts/${props.postNo}`)
    const data = await res.json()
    if (data.code === 0) {
      post.value = data.data
    } else {
      error.value = data.message
    }
  } catch (err) {
    error.value = '加载失败'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function onVoteUpdate(count: number, hasVoted: boolean) {
  if (post.value) {
    post.value.voteCount = count
    post.value.hasVoted = hasVoted
  }
}

async function submitComment() {
  if (!commentName.value || !commentContent.value.trim()) return

  try {
    const res = await fetch(`${props.apiBase}/feedback/posts/${props.postNo}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: commentContent.value,
        authorName: commentName.value,
      }),
    })
    const data = await res.json()
    if (data.code === 0) {
      commentContent.value = ''
      loadDetail() // Reload to show new comment
    }
  } catch (err) {
    console.error('Comment failed:', err)
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'))
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function renderMd(text: string): string {
  if (!text) return ''
  // Basic markdown rendering
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.error {
  color: #ef4444;
}

.detail-header {
  margin-bottom: 1.5rem;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.post-no {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.detail-meta {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sep {
  opacity: 0.5;
}

.category-tag {
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
}

.detail-body {
  margin-bottom: 1.5rem;
}

.description {
  line-height: 1.7;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
}

.description :deep(h3) {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-border);
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  font-size: 1rem;
  margin: 0 0 1rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-border);
}

.timeline-item {
  position: relative;
  padding-bottom: 1rem;
}

.timeline-dot {
  position: absolute;
  left: -1.5rem;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.timeline-status {
  font-weight: 600;
  font-size: 0.875rem;
}

.timeline-reason {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.timeline-meta {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* Comments */
.comments-list {
  margin-bottom: 1.5rem;
}

.comment-item {
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.comment-item.official {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  font-size: 0.875rem;
}

.official-badge {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
}

.comment-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.comment-content {
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-input-name {
  width: 200px;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.comment-input-content {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  resize: vertical;
}

.comment-form button {
  align-self: flex-end;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
}

.comment-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  margin-top: 2rem;
}

.back-link a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.875rem;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>

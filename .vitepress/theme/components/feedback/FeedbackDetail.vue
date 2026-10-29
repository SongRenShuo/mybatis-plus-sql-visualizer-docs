<template>
  <div v-if="loading" class="loading">加载中...</div>

  <div v-else-if="error" class="error">{{ error }}</div>

  <div v-else-if="post" class="feedback-detail">
    <!-- 详情卡片 -->
    <div class="fd-card fd-header">
      <div class="fd-header-top">
        <span class="fd-post-no">{{ post.postNo }}</span>
        <StatusBadge :status="post.status" :locale="locale" />
        <span v-if="post.typeLabel" class="fd-type-chip"><FbIcon :name="typeIcon(post.type)" :size="14" /> {{ post.typeLabel }}</span>
      </div>
      <h1 class="fd-title">{{ post.title }}</h1>
      <div class="fd-meta">
        <span class="fd-author">{{ post.submitterName || '匿名' }}</span>
        <span class="fd-dot">·</span>
        <span>{{ formatDate(post.createdAt) }}</span>
        <template v-if="post.category">
          <span class="fd-dot">·</span>
          <span class="fd-category">{{ categoryLabel(post.category) }}</span>
        </template>
        <template v-if="post.ideVersion">
          <span class="fd-dot">·</span>
          <span class="fd-env">IDE {{ post.ideVersion }}</span>
        </template>
        <template v-if="post.pluginVersion">
          <span class="fd-dot">·</span>
          <span class="fd-env">插件 {{ post.pluginVersion }}</span>
        </template>
      </div>
      <div class="fd-desc">
        <div class="fd-desc-body" v-html="renderMd(post.description)"></div>
      </div>
      <div class="fd-vote">
        <VoteButton
          :post-no="post.postNo"
          :count="post.voteCount"
          :has-voted="post.hasVoted"
          :api-base="apiBase"
          @update="onVoteUpdate"
        />
      </div>
    </div>

    <!-- 附件卡片 -->
    <div v-if="post.attachments && post.attachments.length" class="fd-card">
      <h3 class="fd-section-title">{{ t('attachments', locale) }}</h3>
      <div class="fd-att-list">
        <a
          v-for="att in post.attachments"
          :key="att.key"
          :href="fileUrl(att.key)"
          class="fd-att"
          :class="{ 'is-image': isImage(att) }"
          target="_blank"
          rel="noopener"
        >
          <img v-if="isImage(att)" :src="fileUrl(att.key)" :alt="att.fileName" class="fd-att-thumb" loading="lazy" />
          <span v-else class="fd-att-icon"><FbIcon name="paperclip" :size="15" /></span>
          <span class="fd-att-name">{{ att.fileName }}</span>
          <span class="fd-att-size">{{ formatSize(att.fileSize) }}</span>
        </a>
      </div>
    </div>

    <!-- 状态时间线卡片 -->
    <div v-if="post.statusLogs && post.statusLogs.length" class="fd-card">
      <h3 class="fd-section-title">状态历史</h3>
      <div class="fd-timeline">
        <div v-for="(log, i) in post.statusLogs" :key="i" class="fd-tl-item">
          <span class="fd-tl-dot" :style="{ background: statusColor(log.to_status) }"></span>
          <div class="fd-tl-body">
            <span class="fd-tl-status">{{ statusLabel(log.to_status) }}</span>
            <span v-if="log.reason" class="fd-tl-reason">{{ log.reason }}</span>
            <span class="fd-tl-meta">{{ log.operator }} · {{ formatDate(log.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论卡片 -->
    <div class="fd-card">
      <h3 class="fd-section-title">评论 ({{ post.comments?.length || 0 }})</h3>

      <div v-if="post.comments && post.comments.length" class="fd-comments">
        <div v-for="c in post.comments" :key="c.id" class="fd-comment" :class="{ official: c.is_official }">
          <div class="fd-comment-head">
            <span class="fd-comment-author">{{ c.author_name || '匿名' }}</span>
            <span v-if="c.is_official" class="fd-official">官方</span>
            <span class="fd-comment-date">{{ formatDate(c.created_at) }}</span>
          </div>
          <div class="fd-comment-content">{{ c.content }}</div>
          <!-- 楼中楼回复（官方回复常挂在这层）：两层结构，回复统一挂在顶层评论下 -->
          <div v-if="c.replies && c.replies.length" class="fd-reply-list">
            <div v-for="r in c.replies" :key="r.id" class="fd-reply">
              <div class="fd-comment-head">
                <span class="fd-comment-author">{{ r.author_name || '匿名' }}</span>
                <span v-if="r.is_official" class="fd-official">官方</span>
                <span class="fd-comment-date">{{ formatDate(r.created_at) }}</span>
              </div>
              <div class="fd-comment-content">{{ r.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="fd-empty">暂无评论</div>

      <div class="fd-comment-form">
        <div class="fd-form-row">
          <input v-model="commentName" type="text" :placeholder="t('formName', locale)" class="fd-input fd-input-name" />
          <input v-model="commentEmail" type="email" :placeholder="t('commentEmailPlaceholder', locale)" class="fd-input fd-input-email" />
        </div>
        <textarea v-model="commentContent" placeholder="写下您的评论..." rows="3" class="fd-input fd-textarea"></textarea>
        <span v-if="commentError" class="fd-form-error">{{ commentError }}</span>
        <button class="fd-submit" :disabled="!commentContent.trim() || commenting" @click="submitComment">
          {{ commenting ? (locale === 'zh' ? '提交中...' : 'Posting...') : (locale === 'zh' ? '发表评论' : 'Post Comment') }}
        </button>
      </div>
    </div>

    <!-- 返回 -->
    <div class="fd-back">
      <a href="#" @click.prevent="$emit('back')">← 返回列表</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusBadge from './StatusBadge.vue'
import FbIcon from './FbIcon.vue'
import VoteButton from './VoteButton.vue'
import { t, type Locale, type MessageKey } from './i18n'
import { formatDateTime } from './dateTime'

const props = defineProps<{
  postNo: string
  apiBase: string
  locale?: Locale
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'vote', count: number, hasVoted: boolean): void
  (e: 'commented'): void
}>()

const locale = props.locale || 'zh'

const statusColors: Record<number, string> = {
  1: '#6b7280', 2: '#f59e0b', 3: '#3b82f6', 4: '#8b5cf6', 5: '#10b981', 6: '#ef4444', 7: '#6b7280',
}

function statusColor(s: number): string {
  return statusColors[s] || '#6b7280'
}

// 类型 -> FbIcon 图标名
const typeIcons: Record<number, string> = {
  1: 'plus-square', 2: 'bug', 3: 'trending-up', 4: 'help-circle',
}

function typeIcon(type: number): string {
  return typeIcons[type] || ''
}

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
  /** 楼中楼回复（公开详情返回嵌套在顶层评论下，两层结构） */
  replies?: Comment[]
}

interface AttachmentFile {
  key: string
  fileName: string
  mimeType: string
  fileSize: number
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
  /** 环境版本（选填，提交时用户选择或自定义，可空） */
  ideVersion?: string | null
  pluginVersion?: string | null
  tags: Array<{ name: string; color: string }>
  comments: Comment[]
  statusLogs: StatusLog[]
  attachments?: AttachmentFile[]
  hasVoted: boolean
}

const loading = ref(true)
const error = ref('')
const post = ref<Post | null>(null)
const commentName = ref('')
const commentEmail = ref('')
const commentContent = ref('')
const commentError = ref('')
// 评论提交中：按钮禁用 + 函数入口守卫，防双击产生两条相同评论
const commenting = ref(false)

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
  // 通知抽屉上层定向同步背景列表（抽屉形态下列表常驻，不再靠重挂载刷新）
  emit('vote', count, hasVoted)
}

async function submitComment() {
  if (commenting.value) return
  const content = commentContent.value.trim()
  if (!content) return
  commentError.value = ''

  // 后端要求评论内容至少 2 个字符，前端先拦，避免一次无谓请求
  if (content.length < 2) {
    commentError.value = locale === 'zh' ? '评论内容至少 2 个字符' : 'Comment must be at least 2 characters'
    return
  }

  // 邮箱选填，但填了先做轻校验（后端同规则兜底）；留邮箱后官方回复会推送通知
  const email = commentEmail.value.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    commentError.value = locale === 'zh' ? '邮箱格式不正确，请检查后重试' : 'Invalid email address'
    return
  }

  commenting.value = true
  try {
    const res = await fetch(`${props.apiBase}/feedback/posts/${props.postNo}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        authorName: commentName.value.trim() || undefined,
        authorEmail: email || undefined,
      }),
    })
    const data = await res.json()
    if (data.code === 0) {
      commentContent.value = ''
      commentError.value = ''
      emit('commented') // 上层刷新背景列表的评论数；自己随后 loadDetail 展示新评论
      loadDetail() // Reload to show new comment
    } else {
      commentError.value = data.message || (locale === 'zh' ? '提交失败' : 'Failed')
    }
  } catch (err) {
    commentError.value = locale === 'zh' ? '提交失败，请稍后重试' : 'Failed, please retry'
    console.error('Comment failed:', err)
  } finally {
    commenting.value = false
  }
}

function formatDate(dateStr: string): string {
  // 统一换共享工具：当年 MM-DD HH:mm，跨年带年份（此前只显示日期）
  return formatDateTime(dateStr)
}

function renderMd(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 只认行首的 ## （正文里出现的 ## 不算标题）
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/\n/g, '<br>')
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp']

function fileUrl(key: string): string {
  return `${props.apiBase}/feedback/files/${key}`
}

function isImage(att: { fileName: string; mimeType: string }): boolean {
  if (att.mimeType && att.mimeType.startsWith('image/')) return true
  const ext = (att.fileName.split('.').pop() || '').toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

function formatSize(bytes: number): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped>
.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.error {
  color: #ef4444;
}

.feedback-detail {
  max-width: 800px;
  margin: 0 auto;
}

.fd-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.fd-header-top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.fd-post-no {
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.fd-type-chip {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 9999px;
  padding: 1px 8px;
  white-space: nowrap;
}

.fd-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.625rem 0 0.5rem;
  line-height: 1.3;
}

.fd-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.fd-author {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.fd-dot {
  opacity: 0.5;
}

.fd-category {
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.75rem;
}

.fd-desc {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-border);
}

.fd-desc-body {
  line-height: 1.7;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
}

.fd-desc-body :deep(h3) {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
}

.fd-vote {
  margin-top: 1rem;
}

.fd-section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

/* Attachments */
.fd-att-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fd-att {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s;
}

.fd-att:hover {
  border-color: var(--vp-c-brand-1);
}

.fd-att-thumb {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  flex-shrink: 0;
}

.fd-att-icon {
  font-size: 1rem;
}

.fd-att-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
}

.fd-att-size {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* Timeline */
.fd-timeline {
  position: relative;
  padding-left: 1.25rem;
}

.fd-timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--vp-c-border);
}

.fd-tl-item {
  position: relative;
  padding-bottom: 1rem;
}

.fd-tl-item:last-child {
  padding-bottom: 0;
}

.fd-tl-dot {
  position: absolute;
  left: -1.25rem;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg-soft);
}

.fd-tl-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 0.5rem;
}

.fd-tl-status {
  font-weight: 600;
  font-size: 0.875rem;
}

.fd-tl-reason {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.fd-tl-meta {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* Comments */
.fd-comments {
  margin-bottom: 1rem;
}

.fd-comment {
  padding: 0.875rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin-bottom: 0.625rem;
}

.fd-comment.official {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.fd-comment-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.fd-comment-author {
  font-weight: 600;
  font-size: 0.875rem;
}

.fd-official {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
}

.fd-comment-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.fd-comment-content {
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.fd-empty {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}

.fd-comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fd-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.fd-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.fd-textarea {
  resize: vertical;
}

.fd-input-name {
  width: 100%;
  max-width: 220px;
}

/* 昵称 + 邮箱同行：邮箱占剩余宽度，窄屏回落纵向 */
.fd-form-row {
  display: flex;
  gap: 0.5rem;
}

.fd-input-email {
  flex: 1;
  min-width: 0;
}

.fd-form-error {
  font-size: 0.8125rem;
  color: #ef4444;
}

/* 楼中楼回复：缩进浅底，与顶层评论区分 */
.fd-reply-list {
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fd-reply {
  padding: 0.25rem 0;
}

@media (max-width: 640px) {
  .fd-form-row {
    flex-direction: column;
  }
}

.fd-submit {
  align-self: flex-end;
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

.fd-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.fd-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fd-back {
  margin-top: 1.5rem;
}

.fd-back a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.875rem;
}

.fd-back a:hover {
  text-decoration: underline;
}
</style>
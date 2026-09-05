<template>
  <div class="feedback-form" :class="{ embedded }">
    <h3>{{ t('submitTitle', props.locale || 'zh') }}</h3>

    <!-- 类型选择 -->
    <div class="form-group">
      <label>{{ t('formType', props.locale || 'zh') }} *</label>
      <div class="type-selector">
        <button
          v-for="t in types"
          :key="t.value"
          class="type-btn"
          :class="{ active: form.type === t.value }"
          :style="{ '--type-color': t.color }"
          @click="form.type = t.value"
        >
          <span class="type-icon">{{ t.icon }}</span>
          <span>{{ t.label }}</span>
        </button>
      </div>
    </div>

    <!-- 标题 -->
    <div class="form-group">
      <div class="label-row">
        <label for="fb-title">{{ t('formTitle', props.locale || 'zh') }} *</label>
        <span class="char-count" :class="{ ok: titleOk }">{{ form.title.length }}/5</span>
      </div>
      <input
        id="fb-title"
        v-model="form.title"
        type="text"
        :placeholder="t('formTitlePlaceholder', props.locale || 'zh')"
        maxlength="200"
      />
    </div>

    <!-- 描述 -->
    <div class="form-group">
      <div class="label-row">
        <label for="fb-desc">{{ t('formDesc', props.locale || 'zh') }} *</label>
        <span class="char-count" :class="{ ok: descOk }">{{ form.description.length }}/10</span>
      </div>
      <textarea
        id="fb-desc"
        v-model="form.description"
        rows="6"
        :placeholder="t('formDescPlaceholder', props.locale || 'zh')"
      ></textarea>
    </div>

    <!-- 功能分类 -->
    <div class="form-group">
      <label for="fb-category">{{ t('formCategory', props.locale || 'zh') }}</label>
      <select id="fb-category" v-model="form.category">
        <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <!-- 昵称和邮箱 -->
    <div class="form-row">
      <div class="form-group">
        <label for="fb-name">{{ t('formName', props.locale || 'zh') }}</label>
        <input id="fb-name" v-model="form.submitterName" type="text" :placeholder="t('formNamePlaceholder', props.locale || 'zh')" />
      </div>
      <div class="form-group">
        <label for="fb-email">{{ t('formEmail', props.locale || 'zh') }}</label>
        <input id="fb-email" v-model="form.submitterEmail" type="email" :placeholder="t('formEmailPlaceholder', props.locale || 'zh')" />
      </div>
    </div>

    <p class="form-tip">{{ t('formTip', props.locale || 'zh') }}</p>

    <!-- 附件上传 -->
    <div class="form-group">
      <label>{{ t('addAttachment', props.locale || 'zh') }}</label>
      <input
        ref="fileInput"
        id="fb-att"
        type="file"
        multiple
        class="file-input-hidden"
        accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.md"
        @change="handleFileSelect"
      />
      <button type="button" class="att-picker" @click="fileInput?.click()">
        <span class="att-picker-plus">＋</span>{{ t('addAttachment', props.locale || 'zh') }}
      </button>
      <p class="att-hint">{{ t('maxAttachment', props.locale || 'zh') }}</p>
      <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
      <div v-if="items.length" class="attachment-list">
        <div v-for="item in items" :key="item.id" class="attachment-item">
          <img v-if="isImage(item) && item.key" :src="fileUrl(item)" :alt="item.fileName" class="att-thumb" loading="lazy" />
          <span class="att-name" :title="item.fileName">{{ item.fileName }}</span>
          <span v-if="item.status === 'uploading'" class="att-status upload">{{ t('uploading', props.locale || 'zh') }}</span>
          <span v-else-if="item.status === 'success'" class="att-status ok">{{ formatSize(item.fileSize) }}</span>
          <span v-else class="att-status err">
            {{ item.error }}
            <button type="button" class="att-retry" @click="uploadItem(item)">{{ t('retry', props.locale || 'zh') }}</button>
          </span>
          <button type="button" class="att-remove" :title="t('removeFile', props.locale || 'zh')" @click="removeItem(item)">
            {{ t('removeFile', props.locale || 'zh') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="success" class="success-msg">
      提交成功！您的反馈编号是 <strong>{{ submittedPostNo }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, markRaw } from 'vue'

const props = defineProps<{
  apiBase: string
  locale?: 'zh' | 'en'
  embedded?: boolean
}>()

const emit = defineEmits<{
  (e: 'done'): void
}>()

import { t, type MessageKey } from './i18n'

const types = computed<Array<{ value: number; label: string; icon: string; color: string }>>(() => {
  const l = props.locale || 'zh'
  return [
    { value: 1, label: t('type.feature', l), icon: '✨', color: '#3b82f6' },
    { value: 2, label: t('type.bug', l), icon: '🐛', color: '#ef4444' },
    { value: 3, label: t('type.improvement', l), icon: '⚡', color: '#f59e0b' },
    { value: 4, label: t('type.question', l), icon: '❓', color: '#8b5cf6' },
  ]
})

const categorySlugs = [
  'wrapper', 'xml', 'annotation', 'sql-to-java',
  'sql-log', 'batch', 'completion', 'other',
]

const categories = computed<Array<{ value: string; label: string }>>(() => {
  const l = props.locale || 'zh'
  return categorySlugs.map(slug => {
    const key = `cat.${slug}` as MessageKey
    const label = t(key, l)
    return { value: slug, label: label === key ? slug : label }
  })
})

const form = reactive({
  title: '',
  description: '',
  type: 1,
  category: 'other',
  submitterName: '',
  submitterEmail: '',
})

const submitting = ref(false)
const success = ref(false)
const submittedPostNo = ref('')

const MAX_ATTACHMENTS = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'txt', 'md']

interface UploadItem {
  id: string
  _file: File
  key: string
  fileName: string
  mimeType: string
  fileSize: number
  status: 'uploading' | 'success' | 'error'
  error: string
}

const items = ref<UploadItem[]>([])
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
let uid = 0

function isAllowedFile(file: File): boolean {
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files.length) return
  uploadError.value = ''
  const l = props.locale || 'zh'
  const newFiles = Array.from(input.files)

  for (const file of newFiles) {
    if (items.value.length >= MAX_ATTACHMENTS) {
      uploadError.value = t('maxAttachment', l)
      break
    }
    if (file.size > MAX_FILE_SIZE) {
      uploadError.value = `${file.name}: ${t('fileTooLarge', l)}`
      continue
    }
    if (!isAllowedFile(file)) {
      uploadError.value = `${file.name}: ${t('fileTypeError', l)}`
      continue
    }
    const item = reactive<UploadItem>({
      id: `att-${Date.now()}-${uid++}`,
      _file: markRaw(file),
      key: '',
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      status: 'uploading',
      error: '',
    })
    items.value.push(item)
    uploadItem(item)
  }
  input.value = ''
}

async function uploadItem(item: UploadItem) {
  const l = props.locale || 'zh'
  item.status = 'uploading'
  item.error = ''
  try {
    const formData = new FormData()
    formData.append('file', item._file)
    const res = await fetch(`${props.apiBase}/feedback/upload`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (data.code === 0) {
      item.key = data.data.key
      item.fileName = data.data.fileName || item.fileName
      item.mimeType = data.data.mimeType || item.mimeType
      item.fileSize = data.data.fileSize ?? item.fileSize
      item.status = 'success'
    } else {
      item.status = 'error'
      item.error = t('uploadFailed', l)
    }
  } catch (err) {
    item.status = 'error'
    item.error = t('uploadFailed', l)
    console.error(err)
  }
}

function removeItem(item: UploadItem) {
  const idx = items.value.indexOf(item)
  if (idx > -1) items.value.splice(idx, 1)
  if (!items.value.length) uploadError.value = ''
}

function formatSize(bytes: number): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImage(item: UploadItem): boolean {
  return item.mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(item.fileName)
}

function fileUrl(item: UploadItem): string {
  return `${props.apiBase}/feedback/files/${item.key}`
}

function successfulAttachments() {
  return items.value
    .filter(it => it.status === 'success' && it.key)
    .map(it => ({ key: it.key, fileName: it.fileName, mimeType: it.mimeType, fileSize: it.fileSize }))
}

// 邮箱选填，但填了必须是合法格式（与后端 POST /posts 校验一致）
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValid = computed(() =>
  form.title.length >= 5 &&
  form.title.length <= 200 &&
  form.description.length >= 10 &&
  (!form.submitterEmail.trim() || EMAIL_RE.test(form.submitterEmail.trim()))
)

// 字数计数器（label 右侧）的达标态
const titleOk = computed(() => form.title.length >= 5 && form.title.length <= 200)
const descOk = computed(() => form.description.length >= 10)

// 供父级（提交弹窗 footer）读取/调用
const canSubmit = computed(() => isValid.value && !submitting.value)
const invalidTips = computed(() => {
  const l = props.locale || 'zh'
  const tips: string[] = []
  if (form.title.trim().length < 5) tips.push(t('tipTitleMin', l))
  if (form.title.length > 200) tips.push(t('tipTitleMax', l))
  if (form.description.trim().length < 10) tips.push(t('tipDescMin', l))
  if (form.submitterEmail.trim() && !EMAIL_RE.test(form.submitterEmail.trim())) tips.push(t('tipEmailInvalid', l))
  return tips
})
defineExpose({ submit: handleSubmit, canSubmit, invalidTips })

async function handleSubmit() {
  if (!isValid.value || submitting.value) return
  submitting.value = true
  success.value = false

  try {
    const res = await fetch(`${props.apiBase}/feedback/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        type: form.type,
        category: form.category,
        submitterName: form.submitterName || undefined,
        submitterEmail: form.submitterEmail || undefined,
        isAnonymous: !form.submitterName,
        attachments: successfulAttachments(),
      }),
    })
    const data = await res.json()

    if (data.code === 0) {
      success.value = true
      submittedPostNo.value = data.data.postNo
      emit('done')
      // Reset form
      form.title = ''
      form.description = ''
      form.type = 1
      form.category = 'other'
      form.submitterName = ''
      form.submitterEmail = ''
      items.value = []
      uploadError.value = ''
    } else {
      alert('提交失败: ' + data.message)
    }
  } catch (err) {
    alert('提交失败，请稍后重试')
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.feedback-form {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.feedback-form.embedded {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
}

.feedback-form h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.label-row label {
  margin-bottom: 0;
}

.char-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.char-count.ok {
  color: #10b981;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.form-group select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  cursor: pointer;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: var(--type-color);
}

.type-btn.active {
  border-color: var(--type-color);
  background: color-mix(in srgb, var(--type-color) 10%, var(--vp-c-bg));
  color: var(--type-color);
  font-weight: 600;
}

.form-tip {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin: 0 0 1rem;
}

.file-input-hidden {
  display: none;
}

.att-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px dashed var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.att-picker:hover {
  background: var(--vp-c-brand-soft);
}

.att-picker-plus {
  font-size: 1rem;
  line-height: 1;
}

.att-hint {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.upload-error {
  font-size: 0.8rem;
  color: #ef4444;
  margin: 0.5rem 0 0;
}

.attachment-list {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  font-size: 0.8rem;
}

.att-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.att-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
}

.att-status {
  font-size: 0.75rem;
  white-space: nowrap;
}

.att-status.upload {
  color: var(--vp-c-text-3);
}

.att-status.ok {
  color: #10b981;
}

.att-status.err {
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.att-retry {
  border: none;
  background: none;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
  text-decoration: underline;
}

.att-remove {
  border: none;
  background: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 0.75rem;
  /* 负 margin 抵消 padding，布局不变但触控目标 ≥32px */
  padding: 0.5rem;
  margin: -0.5rem;
  white-space: nowrap;
}

.att-remove:hover {
  color: #ef4444;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-msg {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: color-mix(in srgb, #10b981 10%, var(--vp-c-bg));
  border: 1px solid #10b981;
  color: #10b981;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .type-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<template>
  <div class="bounty-form-card">
    <div v-if="success" class="success-card" role="status">
      <div class="success-icon" aria-hidden="true">✓</div>
      <h3>{{ t('form.successTitle', locale) }}</h3>
      <p class="success-no">
        {{ t('form.successNo', locale) }}
        <strong>{{ submittedNo }}</strong>
      </p>
      <p class="success-hint">{{ t('form.successHint', locale) }}</p>
      <div class="success-actions">
        <a href="#bounty-lookup" class="btn-primary">{{ t('form.goLookup', locale) }}</a>
        <button type="button" class="btn-ghost" @click="startAnother">{{ t('form.again', locale) }}</button>
      </div>
    </div>

    <template v-else>
      <h2 class="form-title">{{ t('form.title', locale) }}</h2>
      <p class="form-sub">{{ t('form.subtitle', locale) }}</p>

      <p v-if="policyReady && !policy.enabled" class="closed-notice" role="status">{{ t('form.planClosed', locale) }}</p>

      <form novalidate @submit.prevent="handleSubmit">
        <!-- 问题信息 -->
        <fieldset class="form-section">
          <legend>{{ t('form.sectionIssue', locale) }}</legend>

          <div class="form-group">
            <div class="label-row">
              <label for="bounty-title">{{ t('form.titleLabel', locale) }} *</label>
              <span class="char-count" :class="{ ok: titleOk }">{{ form.title.length }}/200</span>
            </div>
            <input
              id="bounty-title"
              v-model="form.title"
              type="text"
              maxlength="200"
              :placeholder="t('form.titlePlaceholder', locale)"
            />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="bounty-desc">{{ t('form.descLabel', locale) }} *</label>
              <span class="char-count" :class="{ ok: descOk }">{{ form.description.length }}/5000</span>
            </div>
            <textarea
              id="bounty-desc"
              v-model="form.description"
              rows="5"
              maxlength="5000"
              :placeholder="t('form.descPlaceholder', locale)"
            ></textarea>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="bounty-steps">{{ t('form.stepsLabel', locale) }} *</label>
              <span class="char-count" :class="{ ok: stepsOk }">{{ form.reproduceSteps.length }}/5000</span>
            </div>
            <textarea
              id="bounty-steps"
              v-model="form.reproduceSteps"
              rows="4"
              maxlength="5000"
              :placeholder="t('form.stepsPlaceholder', locale)"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bounty-expected">{{ t('form.expectedLabel', locale) }}</label>
              <textarea
                id="bounty-expected"
                v-model="form.expectedBehavior"
                rows="3"
                maxlength="2000"
                :placeholder="t('form.expectedPlaceholder', locale)"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="bounty-actual">{{ t('form.actualLabel', locale) }}</label>
              <textarea
                id="bounty-actual"
                v-model="form.actualBehavior"
                rows="3"
                maxlength="2000"
                :placeholder="t('form.actualPlaceholder', locale)"
              ></textarea>
            </div>
          </div>
        </fieldset>

        <!-- 分类与自评 -->
        <fieldset class="form-section">
          <legend>{{ t('form.sectionMeta', locale) }}</legend>

          <div class="form-group">
            <label>{{ t('form.category', locale) }}</label>
            <FilterSelect v-model="form.category" :options="categories" />
          </div>

          <div class="form-group">
            <label>{{ t('form.severity', locale) }}</label>
            <div class="severity-grid">
              <button
                v-for="option in severityOptions"
                :key="option.value"
                type="button"
                class="severity-btn"
                :class="{ active: form.severitySelf === option.value }"
                :style="{ '--sev-color': option.color }"
                :aria-pressed="form.severitySelf === option.value"
                @click="form.severitySelf = option.value"
              >
                {{ option.label }}
              </button>
            </div>
            <p class="field-hint">{{ t('form.severityHint', locale) }}</p>
          </div>
        </fieldset>

        <!-- 环境信息 -->
        <fieldset class="form-section">
          <legend>{{ t('form.sectionEnv', locale) }}</legend>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('form.pluginVersion', locale) }}</label>
              <VersionSelect
                v-model="form.pluginVersion"
                :options="pluginVersionOptions"
                :locale="locale"
                :placeholder="t('form.pluginVersion', locale)"
              />
            </div>
            <div class="form-group">
              <label>{{ t('form.ideVersion', locale) }}</label>
              <VersionSelect
                v-model="form.ideVersion"
                :options="ideVersionOptions"
                :locale="locale"
                :placeholder="t('form.ideVersion', locale)"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bounty-os">{{ t('form.os', locale) }}</label>
              <input
                id="bounty-os"
                v-model="form.osInfo"
                type="text"
                maxlength="100"
                :placeholder="t('form.osPlaceholder', locale)"
              />
            </div>
            <div class="form-group">
              <label for="bounty-jdk">{{ t('form.jdk', locale) }}</label>
              <input
                id="bounty-jdk"
                v-model="form.jdkVersion"
                type="text"
                maxlength="32"
                :placeholder="t('form.jdkPlaceholder', locale)"
              />
            </div>
          </div>
        </fieldset>

        <!-- 联系方式 -->
        <fieldset class="form-section">
          <legend>{{ t('form.sectionContact', locale) }}</legend>

          <div class="form-row">
            <div class="form-group">
              <label for="bounty-name">{{ t('form.name', locale) }}</label>
              <input
                id="bounty-name"
                v-model="form.reporterName"
                type="text"
                maxlength="50"
                autocomplete="nickname"
                :placeholder="t('form.namePlaceholder', locale)"
              />
            </div>
            <div class="form-group">
              <label for="bounty-email">{{ t('form.email', locale) }} *</label>
              <input
                id="bounty-email"
                v-model="form.reporterEmail"
                type="email"
                maxlength="120"
                autocomplete="email"
                :aria-invalid="!!emailError"
                :aria-describedby="emailError ? 'bounty-email-error' : 'bounty-email-hint'"
                :placeholder="t('form.emailPlaceholder', locale)"
                @blur="emailTouched = true"
              />
              <p v-if="emailError" id="bounty-email-error" class="field-error">{{ emailError }}</p>
              <p v-else id="bounty-email-hint" class="field-hint">{{ t('form.emailHint', locale) }}</p>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('form.postNo', locale) }}</label>
            <div v-if="linkedPostNo" class="linked-post">
              <span class="linked-post-no">{{ t('form.linkedPost', locale) }} {{ linkedPostNo }}</span>
              <button type="button" class="link-btn" @click="unlinkPost">{{ t('form.unlink', locale) }}</button>
            </div>
            <input
              v-else
              id="bounty-post-no"
              v-model="form.postNo"
              type="text"
              maxlength="10"
              :placeholder="t('form.postNoPlaceholder', locale)"
            />
            <p class="field-hint">{{ t('form.postNoPlaceholder', locale) }}</p>
          </div>
        </fieldset>

        <!-- 附件 -->
        <fieldset class="form-section">
          <legend>{{ t('form.sectionAttach', locale) }}</legend>

          <div class="form-group">
            <input
              ref="fileInput"
              id="bounty-att"
              type="file"
              multiple
              class="file-input-hidden"
              accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt,.md"
              @change="handleFileSelect"
            />
            <button type="button" class="att-picker" @click="fileInput?.click()">
              <span class="att-picker-plus">＋</span>{{ t('form.addAttachment', locale) }}
            </button>
            <p class="field-hint">{{ t('form.attachHint', locale) }}</p>
            <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
            <div v-if="items.length" class="attachment-list">
              <div v-for="item in items" :key="item.id" class="attachment-item">
                <img v-if="item.previewUrl" :src="item.previewUrl" :alt="item.fileName" class="att-thumb" loading="lazy" />
                <span class="att-name" :title="item.fileName">{{ item.fileName }}</span>
                <span v-if="item.status === 'uploading'" class="att-status upload">{{ t('form.uploading', locale) }}</span>
                <span v-else-if="item.status === 'success'" class="att-status ok">{{ formatSize(item.fileSize) }}</span>
                <span v-else class="att-status err">
                  {{ item.error }}
                  <button type="button" class="att-retry" @click="uploadItem(item)">{{ t('form.retry', locale) }}</button>
                </span>
                <button type="button" class="att-remove" :title="t('form.removeFile', locale)" @click="removeItem(item)">
                  {{ t('form.removeFile', locale) }}
                </button>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- 安全类 -->
        <div class="sensitive-box">
          <label class="checkbox-row">
            <input v-model="form.isSensitive" type="checkbox" />
            <span>{{ t('form.sensitive', locale) }}</span>
          </label>
          <p class="field-hint">{{ t('form.sensitiveHint', locale) }}</p>
        </div>

        <!-- 蜜罐：正常用户不可见，填写即被后端静默拒绝 -->
        <div class="hp-field" aria-hidden="true">
          <label>Website<input v-model="form.website" type="text" tabindex="-1" autocomplete="off" /></label>
        </div>

        <div v-if="invalidTips.length" class="tips" aria-live="polite">
          <p v-for="tip in invalidTips" :key="tip">⚠ {{ tip }}</p>
        </div>

        <p v-if="submitError" class="submit-error" role="alert">{{ submitError }}</p>

        <button type="submit" class="submit-btn" :disabled="!canSubmit">
          {{ submitting ? t('form.submitting', locale) : t('form.submit', locale) }}
        </button>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import FilterSelect from '../feedback/FilterSelect.vue'
import VersionSelect from '../feedback/VersionSelect.vue'
import { t, type Locale } from './i18n'
import {
  CATEGORY_SLUGS,
  categoryOptions,
  severityColor,
  severityLabel,
  type BountyPolicyData,
} from './bountyStatus'
import { useAttachmentUpload } from './useAttachmentUpload'

const props = defineProps<{
  apiBase: string
  locale: Locale
  policy: BountyPolicyData
  /** 策略请求是否已完成；未完成时提交按钮保持禁用 */
  policyReady?: boolean
}>()

const emit = defineEmits<{
  (e: 'submitted', submissionNo: string): void
}>()

const form = reactive({
  title: '',
  description: '',
  reproduceSteps: '',
  expectedBehavior: '',
  actualBehavior: '',
  category: 'other',
  severitySelf: 0,
  pluginVersion: '',
  ideVersion: '',
  osInfo: '',
  jdkVersion: '',
  reporterName: '',
  reporterEmail: '',
  postNo: '',
  isSensitive: false,
  // honeypot：必须为空
  website: '',
})

// 深链带入的关联需求：展示为锁定态，可点「取消关联」后手动填写
const linkedPostNo = ref('')

const submitting = ref(false)
const success = ref(false)
const submitError = ref('')
const submittedNo = ref('')
const emailTouched = ref(false)

const categories = computed(() => categoryOptions(props.locale))

const SEVERITY_ORDER = [1, 2, 3, 4, 0]
const severityOptions = computed(() =>
  SEVERITY_ORDER.map((value) => ({
    value,
    label: severityLabel(value, props.locale),
    color: severityColor(value),
  })),
)

// 版本选项：由后端 /feedback/version-options 提供；拿不到时仍可自定义输入
const ideVersionOptions = ref<string[]>([])
const pluginVersionOptions = ref<string[]>([])

const attachments = useAttachmentUpload({
  apiBase: () => props.apiBase,
  locale: () => props.locale,
})
const {
  items,
  uploadError,
  fileInput,
  hasUploading,
  handleFileSelect,
  uploadItem,
  removeItem,
  successfulAttachments,
  reset: resetAttachments,
  formatSize,
} = attachments

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POST_NO_RE = /^FR-\d{1,6}$/

const titleLen = computed(() => form.title.trim().length)
const descLen = computed(() => form.description.trim().length)
const stepsLen = computed(() => form.reproduceSteps.trim().length)
const emailTrimmed = computed(() => form.reporterEmail.trim())

// 失焦即校验：未触碰前不报错，避免一进页面就红一片
const emailError = computed(() => {
  if (!emailTouched.value) return ''
  if (!emailTrimmed.value) return t('form.tipEmailRequired', props.locale)
  if (emailTrimmed.value.length > 120 || !EMAIL_RE.test(emailTrimmed.value)) {
    return t('form.tipEmailInvalid', props.locale)
  }
  return ''
})

const postNoInvalid = computed(() => {
  const value = form.postNo.trim()
  return !!value && !POST_NO_RE.test(value)
})

const titleOk = computed(() => titleLen.value >= 5 && form.title.length <= 200)
const descOk = computed(() => descLen.value >= 20 && form.description.length <= 5000)
const stepsOk = computed(() => stepsLen.value >= 10 && form.reproduceSteps.length <= 5000)

const isValid = computed(() =>
  titleLen.value >= 5 &&
  form.title.length <= 200 &&
  descLen.value >= 20 &&
  form.description.length <= 5000 &&
  stepsLen.value >= 10 &&
  form.reproduceSteps.length <= 5000 &&
  form.expectedBehavior.length <= 2000 &&
  form.actualBehavior.length <= 2000 &&
  emailTrimmed.value.length > 0 &&
  emailTrimmed.value.length <= 120 &&
  EMAIL_RE.test(emailTrimmed.value) &&
  form.reporterName.trim().length <= 50 &&
  form.osInfo.trim().length <= 100 &&
  form.pluginVersion.trim().length <= 32 &&
  form.ideVersion.trim().length <= 32 &&
  form.jdkVersion.trim().length <= 32 &&
  !postNoInvalid.value,
)

const canSubmit = computed(
  () =>
    props.policyReady !== false &&
    props.policy.enabled &&
    isValid.value &&
    !submitting.value &&
    !hasUploading.value,
)

const invalidTips = computed(() => {
  const tips: string[] = []
  if (titleLen.value < 5 || form.title.length > 200) tips.push(t('form.tipTitle', props.locale))
  if (descLen.value < 20 || form.description.length > 5000) tips.push(t('form.tipDesc', props.locale))
  if (stepsLen.value < 10 || form.reproduceSteps.length > 5000) tips.push(t('form.tipSteps', props.locale))
  if (!emailTrimmed.value) tips.push(t('form.tipEmailRequired', props.locale))
  else if (emailTrimmed.value.length > 120 || !EMAIL_RE.test(emailTrimmed.value)) {
    tips.push(t('form.tipEmailInvalid', props.locale))
  }
  if (postNoInvalid.value) tips.push(t('form.tipPostNo', props.locale))
  if (form.reporterName.trim().length > 50) tips.push(t('form.tipName', props.locale))
  if (form.osInfo.trim().length > 100) tips.push(t('form.tipOs', props.locale))
  if (
    form.pluginVersion.trim().length > 32 ||
    form.ideVersion.trim().length > 32 ||
    form.jdkVersion.trim().length > 32
  ) {
    tips.push(t('form.tipVersion', props.locale))
  }
  if (hasUploading.value) tips.push(t('form.tipUploading', props.locale))
  return tips
})

onMounted(() => {
  readDeepLink()
  readPrefill()
  loadVersionOptions()
})

function readDeepLink() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const postNo = (params.get('postNo') || '').trim()
  if (postNo && POST_NO_RE.test(postNo)) {
    linkedPostNo.value = postNo
    form.postNo = postNo
  }
  const title = (params.get('title') || '').trim()
  if (title && !form.title && title.length <= 200) form.title = title
}

/** 需求池勾选悬赏后写入的一次性昵称/邮箱，读取后立即删除，避免邮箱进入 URL。 */
function readPrefill() {
  if (typeof window === 'undefined') return
  let raw = ''
  try {
    raw = window.sessionStorage.getItem('bounty:prefill') || ''
  } catch {
    return
  }
  try {
    if (raw) {
      const data = JSON.parse(raw) as { name?: unknown; email?: unknown }
      if (typeof data.name === 'string') form.reporterName = data.name.slice(0, 50)
      if (typeof data.email === 'string') form.reporterEmail = data.email.slice(0, 120)
    }
  } catch {
    /* 脏数据直接忽略 */
  } finally {
    try {
      window.sessionStorage.removeItem('bounty:prefill')
    } catch {
      /* 隐私模式下可能不可写，忽略 */
    }
  }
}

async function loadVersionOptions() {
  try {
    const res = await fetch(`${props.apiBase}/feedback/version-options`)
    const data = await res.json()
    if (data.code === 0) {
      ideVersionOptions.value = data.data?.ideVersions || []
      pluginVersionOptions.value = data.data?.pluginVersions || []
    }
  } catch {
    /* 静默：选项拿不到时用户仍可自定义输入 */
  }
}

function unlinkPost() {
  linkedPostNo.value = ''
  form.postNo = ''
}

function startAnother() {
  success.value = false
  submittedNo.value = ''
  form.title = ''
  form.description = ''
  form.reproduceSteps = ''
  form.expectedBehavior = ''
  form.actualBehavior = ''
  form.isSensitive = false
  resetAttachments()
}

async function handleSubmit() {
  if (!canSubmit.value) return
  submitting.value = true
  submitError.value = ''

  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    reproduceSteps: form.reproduceSteps.trim(),
    expectedBehavior: form.expectedBehavior.trim(),
    actualBehavior: form.actualBehavior.trim(),
    category: form.category,
    severitySelf: form.severitySelf,
    pluginVersion: form.pluginVersion.trim() || undefined,
    ideVersion: form.ideVersion.trim() || undefined,
    osInfo: form.osInfo.trim() || undefined,
    jdkVersion: form.jdkVersion.trim() || undefined,
    reporterName: form.reporterName.trim() || undefined,
    reporterEmail: form.reporterEmail.trim(),
    postNo: form.postNo.trim() || undefined,
    // 从需求池跳转过来时带上 postNo，便于管理端区分来源
    source: form.postNo.trim() ? 'feedback' : 'web',
    isSensitive: form.isSensitive,
    website: form.website,
    attachments: successfulAttachments(),
  }

  try {
    const res = await fetch(`${props.apiBase}/bounty/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    let data: any = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (data && data.code === 0) {
      submittedNo.value = data.data?.submissionNo || ''
      success.value = true
      // 只清问题信息与附件，环境/联系方式/关联需求保留，方便补充提交或查询
      form.title = ''
      form.description = ''
      form.reproduceSteps = ''
      form.expectedBehavior = ''
      form.actualBehavior = ''
      form.isSensitive = false
      resetAttachments()
      emit('submitted', submittedNo.value)
    } else if (data && typeof data.message === 'string' && data.message) {
      submitError.value = data.message
    } else {
      submitError.value = t('form.submitFailed', props.locale)
    }
  } catch (err) {
    submitError.value = t('form.networkFailed', props.locale)
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.bounty-form-card {
  max-width: 880px;
  margin: 0 auto;
  padding: 0;
}

.form-title {
  margin: 0 0 0.375rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}

.form-sub {
  margin: 0 auto 1.25rem;
  max-width: 680px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.7;
}

.closed-notice {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: color-mix(in srgb, #f59e0b 10%, var(--vp-c-bg));
  color: #b45309;
  font-size: 0.875rem;
  text-align: center;
}

.form-section {
  margin: 0 0 1.25rem;
  padding: 1.25rem 1.25rem 0.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.form-section legend {
  padding: 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
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
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.char-count.ok {
  color: #10b981;
}

.form-group :deep(.fs-trigger) {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.5;
}

.form-group :deep(.fs-trigger):focus-visible {
  outline: none;
  box-shadow: none;
  border-color: var(--vp-c-brand-1);
}

.form-group :deep(.fs-chevron) {
  font-size: 0.7rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.2s;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-hint {
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
}

.field-error {
  margin: 0.375rem 0 0;
  font-size: 0.78rem;
  color: #ef4444;
}

.severity-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}

.severity-btn {
  padding: 0.5rem 0.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.severity-btn:hover {
  border-color: var(--sev-color);
  color: var(--sev-color);
}

.severity-btn.active {
  border-color: var(--sev-color);
  background: color-mix(in srgb, var(--sev-color) 10%, var(--vp-c-bg));
  color: var(--sev-color);
  font-weight: 600;
}

.linked-post {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px dashed var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.linked-post-no {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.link-btn {
  border: none;
  background: none;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.link-btn:hover {
  color: #ef4444;
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
  transition: background 0.2s;
}

.att-picker:hover {
  background: var(--vp-c-brand-soft);
}

.att-picker-plus {
  font-size: 1rem;
  line-height: 1;
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
  padding: 0.5rem;
  margin: -0.5rem;
  white-space: nowrap;
}

.att-remove:hover {
  color: #ef4444;
}

.sensitive-box {
  margin: 0 0 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.checkbox-row input {
  margin-top: 0.2rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.tips {
  margin: 0 0 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  background: color-mix(in srgb, #f59e0b 8%, var(--vp-c-bg));
}

.tips p {
  margin: 0.125rem 0;
  color: #b45309;
  font-size: 0.8rem;
}

.submit-error {
  margin: 0 0 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: color-mix(in srgb, #ef4444 10%, var(--vp-c-bg));
  border: 1px solid #ef4444;
  color: #ef4444;
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.95rem;
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

.success-card {
  padding: 2rem 1.5rem;
  border: 1px solid #10b981;
  border-radius: 12px;
  background: color-mix(in srgb, #10b981 8%, var(--vp-c-bg));
  text-align: center;
}

.success-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: #10b981;
  color: #fff;
  font-size: 1.4rem;
  line-height: 2.5rem;
}

.success-card h3 {
  margin: 0 0 0.5rem;
  color: #059669;
}

.success-no {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.success-no strong {
  font-size: 1.25rem;
  color: #059669;
  letter-spacing: 0.02em;
}

.success-hint {
  margin: 0 auto 1rem;
  max-width: 560px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  line-height: 1.6;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn-ghost {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .severity-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .form-section {
    padding: 1rem 0.875rem 0.125rem;
  }

  .attachment-item {
    flex-wrap: wrap;
  }

  .submit-btn {
    font-size: 1rem;
  }
}
</style>

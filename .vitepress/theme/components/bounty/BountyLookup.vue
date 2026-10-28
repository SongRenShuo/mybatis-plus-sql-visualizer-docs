<template>
  <section id="bounty-lookup" class="bounty-lookup">
    <h2>{{ t('lookup.title', locale) }}</h2>
    <p class="section-sub">{{ t('lookup.subtitle', locale) }}</p>

    <form class="lookup-form" novalidate @submit.prevent="lookup">
      <div class="lookup-fields">
        <div class="form-group">
          <label for="bounty-lookup-no">{{ t('lookup.no', locale) }}</label>
          <input
            id="bounty-lookup-no"
            v-model="submissionNo"
            type="text"
            maxlength="10"
            autocomplete="off"
            :placeholder="t('lookup.noPlaceholder', locale)"
          />
        </div>
        <div class="form-group">
          <label for="bounty-lookup-email">{{ t('lookup.email', locale) }}</label>
          <input
            id="bounty-lookup-email"
            v-model="email"
            type="email"
            maxlength="120"
            autocomplete="email"
            :placeholder="t('lookup.emailPlaceholder', locale)"
          />
        </div>
        <button type="submit" class="lookup-btn" :disabled="loading || !canQuery">
          {{ loading ? t('lookup.searching', locale) : t('lookup.submit', locale) }}
        </button>
      </div>
      <p class="privacy-hint">{{ t('lookup.privacy', locale) }}</p>
    </form>

    <p v-if="error" class="lookup-error" role="alert">{{ error }}</p>

    <div v-if="result" class="result-card" aria-live="polite">
      <div class="result-head">
        <div>
          <span class="result-no">{{ result.submissionNo }}</span>
          <h3 class="result-title">{{ result.title }}</h3>
        </div>
        <div class="badge-row">
          <span class="badge" :style="{ '--badge-color': statusColor(result.status) }">
            <span class="badge-dot" aria-hidden="true"></span>{{ statusLabel(result.status, locale) }}
          </span>
          <span
            v-if="result.validity"
            class="badge"
            :style="{ '--badge-color': validityColor(result.validity) }"
          >
            <span class="badge-dot" aria-hidden="true"></span>{{ validityLabel(result.validity, locale) }}
          </span>
          <span
            v-if="result.severityFinal"
            class="badge"
            :style="{ '--badge-color': severityColor(result.severityFinal) }"
          >
            <span class="badge-dot" aria-hidden="true"></span>{{ severityLabel(result.severityFinal, locale) }}
          </span>
        </div>
      </div>

      <div class="result-grid">
        <div v-if="result.rewardAmount > 0" class="result-cell">
          <span class="cell-label">{{ t('lookup.reward', locale) }}</span>
          <span class="cell-value reward">{{ formatMoney(result.rewardAmount) }}</span>
        </div>
        <div v-if="result.postNo" class="result-cell">
          <span class="cell-label">{{ t('lookup.related', locale) }}</span>
          <a class="cell-value related-link" :href="feedbackHref">{{ result.postNo }}</a>
        </div>
        <div class="result-cell">
          <span class="cell-label">{{ t('lookup.createdAt', locale) }}</span>
          <span class="cell-value">{{ formatDateTime(result.createdAt) }}</span>
        </div>
        <div v-if="result.reviewedAt" class="result-cell">
          <span class="cell-label">{{ t('lookup.reviewedAt', locale) }}</span>
          <span class="cell-value">{{ formatDateTime(result.reviewedAt) }}</span>
        </div>
        <div v-if="result.paidAt" class="result-cell">
          <span class="cell-label">{{ t('lookup.paidAt', locale) }}</span>
          <span class="cell-value">{{ formatDateTime(result.paidAt) }}</span>
        </div>
      </div>

      <div v-if="result.reviewNote" class="review-note">
        <span class="cell-label">{{ t('lookup.reviewNote', locale) }}</span>
        <p>{{ result.reviewNote }}</p>
      </div>

      <div v-if="result.timeline && result.timeline.length" class="timeline">
        <h4>{{ t('lookup.timeline', locale) }}</h4>
        <div v-for="(entry, i) in result.timeline" :key="i" class="timeline-item">
          <span class="timeline-dot" :style="{ background: statusColor(entry.toStatus) }"></span>
          <div class="timeline-body">
            <span class="timeline-action">
              {{ actionLabel(entry.action, locale) }}
              <template v-if="entry.toStatus"> · {{ statusLabel(entry.toStatus, locale) }}</template>
            </span>
            <span v-if="entry.note" class="timeline-note">{{ entry.note }}</span>
            <span class="timeline-time">{{ formatDateTime(entry.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-if="result.attachments && result.attachments.length" class="result-attachments">
        <h4>{{ t('lookup.attachments', locale) }}</h4>
        <ul>
          <li v-for="(att, i) in result.attachments" :key="i">
            <span class="att-file">{{ att.fileName }}</span>
            <span class="att-size">{{ formatSize(att.fileSize) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { t, type Locale } from './i18n'
import { formatDateTime } from '../feedback/dateTime'
import {
  actionLabel,
  formatMoney,
  severityColor,
  severityLabel,
  statusColor,
  statusLabel,
  validityColor,
  validityLabel,
} from './bountyStatus'

const props = defineProps<{
  apiBase: string
  locale: Locale
}>()

interface TimelineEntry {
  action: string
  toStatus: number
  note?: string | null
  createdAt: string
}

interface LookupAttachment {
  fileName: string
  mimeType: string
  fileSize: number
}

interface LookupResult {
  submissionNo: string
  title: string
  status: number
  validity: number
  severityFinal: number
  rewardAmount: number
  currency: string
  reviewNote?: string | null
  createdAt: string
  reviewedAt?: string | null
  paidAt?: string | null
  postNo?: string | null
  timeline?: TimelineEntry[]
  attachments?: LookupAttachment[]
}

const submissionNo = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<LookupResult | null>(null)

const canQuery = computed(() => !!submissionNo.value.trim() && !!email.value.trim())

const feedbackHref = computed(() => {
  if (!result.value?.postNo) return '#'
  const prefix = props.locale === 'en' ? '/en' : ''
  return `${prefix}/about/feedback?postNo=${encodeURIComponent(result.value.postNo)}`
})

function formatSize(bytes: number): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function lookup() {
  error.value = ''
  result.value = null

  if (!canQuery.value) {
    error.value = t('lookup.required', props.locale)
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${props.apiBase}/bounty/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionNo: submissionNo.value.trim(),
        email: email.value.trim(),
      }),
    })
    let data: any = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (data && data.code === 0 && data.data) {
      result.value = data.data as LookupResult
    } else {
      // 编号不存在与邮箱不匹配统一提示，避免被用来枚举编号
      error.value = t('lookup.notFound', props.locale)
    }
  } catch (err) {
    error.value = t('lookup.notFound', props.locale)
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bounty-lookup {
  max-width: 880px;
  margin: 0 auto;
  padding: 3.5rem 0 0;
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}

.bounty-lookup h2 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}

.section-sub {
  margin: 0 auto 1.25rem;
  max-width: 680px;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.7;
}

.lookup-form {
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.lookup-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto;
  gap: 0.75rem;
  align-items: end;
}

.form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.lookup-btn {
  height: 42px;
  padding: 0 1.25rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.lookup-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.privacy-hint {
  margin: 0.625rem 0 0;
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
}

.lookup-error {
  margin: 0.875rem 0 0;
  padding: 0.7rem 0.9rem;
  border: 1px solid #ef4444;
  border-radius: 8px;
  background: color-mix(in srgb, #ef4444 8%, var(--vp-c-bg));
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
}

.result-card {
  margin-top: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.result-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.result-no {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.02em;
}

.result-title {
  margin: 0.2rem 0 0;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--badge-color) 12%, var(--vp-c-bg));
  color: var(--badge-color);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--badge-color);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.result-cell {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.cell-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.cell-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.cell-value.reward {
  color: #059669;
}

.related-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.related-link:hover {
  text-decoration: underline;
}

.review-note {
  margin-top: 0.875rem;
  padding: 0.75rem 0.875rem;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 8px 8px 0;
  background: var(--vp-c-bg-soft);
}

.review-note p {
  margin: 0.25rem 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.7;
  white-space: pre-wrap;
}

.timeline {
  margin-top: 1.25rem;
}

.timeline h4,
.result-attachments h4 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.timeline-item {
  display: flex;
  gap: 0.625rem;
  padding: 0 0 0.75rem;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 12px;
  bottom: 0;
  width: 1px;
  background: var(--vp-c-border);
}

.timeline-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.timeline-action {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.timeline-note {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
}

.timeline-time {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.result-attachments {
  margin-top: 1.25rem;
}

.result-attachments ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.result-attachments li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.375rem 0;
  border-bottom: 1px dashed var(--vp-c-border);
  font-size: 0.82rem;
}

.result-attachments li:last-child {
  border-bottom: none;
}

.att-file {
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.att-size {
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .lookup-fields {
    grid-template-columns: 1fr;
  }

  .lookup-btn {
    width: 100%;
  }
}
</style>

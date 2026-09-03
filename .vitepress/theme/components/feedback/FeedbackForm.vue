<template>
  <div class="feedback-form">
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
      <label for="fb-title">{{ t('formTitle', props.locale || 'zh') }} *</label>
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
      <label for="fb-desc">{{ t('formDesc', props.locale || 'zh') }} *</label>
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
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
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

    <!-- 提交按钮 -->
    <button class="submit-btn" :disabled="submitting || !isValid" @click="handleSubmit">
      {{ submitting ? t('submitting', props.locale || 'zh') : t('submitBtn', props.locale || 'zh') }}
    </button>

    <!-- 成功提示 -->
    <div v-if="success" class="success-msg">
      提交成功！您的反馈编号是 <strong>{{ submittedPostNo }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const props = defineProps<{
  apiBase: string
  locale?: 'zh' | 'en'
}>()

import { t } from './i18n'

const types = [
  { value: 1, label: 'Feature', icon: '✨', color: '#3b82f6' },
  { value: 2, label: 'Bug', icon: '🐛', color: '#ef4444' },
  { value: 3, label: 'Improvement', icon: '⚡', color: '#f59e0b' },
  { value: 4, label: 'Question', icon: '❓', color: '#8b5cf6' },
]

const categories = [
  'wrapper', 'xml', 'annotation', 'sql-to-java',
  'sql-log', 'batch', 'completion', 'other',
]

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

const isValid = computed(() =>
  form.title.length >= 5 &&
  form.title.length <= 200 &&
  form.description.length >= 10
)

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
      }),
    })
    const data = await res.json()

    if (data.code === 0) {
      success.value = true
      submittedPostNo.value = data.data.postNo
      // Reset form
      form.title = ''
      form.description = ''
      form.type = 1
      form.category = 'other'
      form.submitterName = ''
      form.submitterEmail = ''
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

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
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

<template>
  <div class="subscribe-card">
    <div class="subscribe-text">
      <span class="subscribe-title">{{ t('subscribeTitle', locale) }}</span>
      <span class="subscribe-desc">{{ t('subscribeDesc', locale) }}</span>
    </div>
    <div class="subscribe-form">
      <input
        v-model="email"
        class="subscribe-input"
        type="email"
        :placeholder="t('subscribePlaceholder', locale)"
        :disabled="busy"
        @keydown.enter="subscribe"
      />
      <button class="subscribe-btn" :disabled="busy || !emailOk" @click="subscribe">
        {{ busy ? t('submitting', locale) : t('subscribeBtn', locale) }}
      </button>
    </div>
    <div v-if="tip" class="subscribe-tip" :class="tipOk ? 'is-ok' : 'is-err'">{{ tip }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 周报订阅入口（20261030-2321 计划 §五.10 的用户侧入口）：
 * 后端 POST /feedback/subscribe 已带双重确认（提交后发确认邮件，点链接才生效），
 * 这里只负责收集邮箱与把后端的明确文案透传给用户（重复订阅/已退订重订等都是
 * 后端拼好的中文/英文句子，直接展示，避免前端再造一套文案两处维护）。
 */
import { computed, ref } from 'vue'
import { t, type Locale } from './i18n'

const props = defineProps<{ apiBase: string; locale: Locale }>()

const email = ref('')
const busy = ref(false)
const tip = ref('')
const tipOk = ref(false)
/** 输入形态的最基本校验：有 @ 且有域，详细格式交给后端（同一条规则不写两份） */
const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

async function subscribe() {
  if (busy.value || !emailOk.value) return
  busy.value = true
  tip.value = ''
  try {
    const res = await fetch(`${props.apiBase}/feedback/subscribe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email.value.trim() }),
    })
    const body = (await res.json().catch(() => null)) as { code?: number; message?: string } | null
    if (res.ok && body && body.code === 0) {
      tipOk.value = true
      tip.value = body.message || t('subscribeSuccess', props.locale)
      email.value = ''
    } else {
      tipOk.value = false
      // 429/503 等失败后端都给了明确 message，透传比前端硬编码准确
      tip.value = (body && body.message) || t('subscribeFailed', props.locale)
    }
  } catch {
    tipOk.value = false
    tip.value = t('subscribeFailed', props.locale)
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.subscribe-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  margin-bottom: 12px;
}
.subscribe-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.subscribe-title {
  font-weight: 600;
  font-size: 14px;
}
.subscribe-desc {
  font-size: 12px;
  opacity: 0.75;
}
.subscribe-form {
  display: flex;
  gap: 8px;
}
.subscribe-input {
  flex: 1;
  min-width: 0;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.subscribe-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.subscribe-btn {
  padding: 6px 14px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text);
  cursor: pointer;
  white-space: nowrap;
}
.subscribe-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.subscribe-tip {
  font-size: 12px;
}
.subscribe-tip.is-ok {
  color: var(--vp-c-brand-1);
}
.subscribe-tip.is-err {
  color: var(--vp-c-danger-1);
}
@media (max-width: 640px) {
  .subscribe-form {
    flex-direction: column;
  }
}
</style>

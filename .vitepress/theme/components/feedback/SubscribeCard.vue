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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  padding: 16px 20px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface-muted);
  margin: 0;
}
.subscribe-text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}
.subscribe-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--ui-fg);
}
.subscribe-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--ui-fg-muted);
}
.subscribe-form {
  display: flex;
  flex: 0 1 420px;
  gap: 8px;
}
.subscribe-input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 13px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-field);
  background: var(--ui-surface);
  color: var(--ui-fg);
  transition: border-color 0.15s ease;
}
.subscribe-input:focus {
  outline: none;
  border-color: var(--ui-border-strong);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-fg) 6%, transparent);
}
.subscribe-btn {
  height: 36px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: var(--ui-radius-pill);
  background: var(--ui-accent);
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}
.subscribe-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.subscribe-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.subscribe-tip {
  flex-basis: 100%;
  font-size: 12px;
}
.subscribe-tip.is-ok {
  color: var(--ui-accent);
}
.subscribe-tip.is-err {
  color: var(--vp-c-danger-1);
}
@media (max-width: 640px) {
  .subscribe-form {
    flex: 1 1 100%;
    flex-direction: column;
  }
  .subscribe-input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .subscribe-input,
  .subscribe-btn {
    transition: none;
  }
}
</style>

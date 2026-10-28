<template>
  <div class="bounty-page">
    <!-- 顶部：标题、说明、按钮、聚合统计 -->
    <section class="bounty-hero">
      <p class="hero-eyebrow">{{ t('hero.badge', locale) }}</p>
      <h1 class="hero-title">{{ t('hero.title', locale) }}</h1>
      <p class="hero-sub">{{ t('hero.subtitle', locale) }}</p>
      <p class="hero-note">{{ t('hero.note', locale) }}</p>
      <p v-if="policyReady && !policy.enabled" class="hero-paused" role="status">{{ t('hero.paused', locale) }}</p>

      <div class="hero-actions">
        <a href="#bounty-form" class="hero-btn primary">{{ t('hero.submit', locale) }}</a>
        <a href="#bounty-policy" class="hero-btn">{{ t('hero.policy', locale) }}</a>
      </div>

      <BountyStats :stats="stats" :locale="locale" />
    </section>

    <!-- 奖励标准 -->
    <BountyPolicy :policy="policy" :locale="locale" :ready="policyReady" :load-error="policyLoadFailed" />

    <!-- 处理流程 -->
    <section class="flow-section">
      <h2>{{ t('flow.title', locale) }}</h2>
      <ol class="flow-list">
        <li v-for="(step, i) in flowSteps" :key="step.title" class="flow-item">
          <span class="flow-no" aria-hidden="true">{{ i + 1 }}</span>
          <div class="flow-body">
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- 提交表单（页内内联） -->
    <section id="bounty-form" class="bounty-form-section">
      <BountyForm
        :api-base="apiBase"
        :locale="locale"
        :policy="policy"
        :policy-ready="policyReady"
        @submitted="onSubmitted"
      />
    </section>

    <!-- 查询进度 -->
    <BountyLookup :api-base="apiBase" :locale="locale" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import BountyStats from './BountyStats.vue'
import BountyPolicy from './BountyPolicy.vue'
import BountyForm from './BountyForm.vue'
import BountyLookup from './BountyLookup.vue'
import { t, type Locale } from './i18n'
import {
  DEFAULT_POLICY,
  normalizePolicy,
  normalizeStats,
  type BountyPolicyData,
  type BountyStatsData,
} from './bountyStatus'

const props = defineProps<{
  apiBase: string
}>()

// 跟随文档站全局中英文切换（与需求池页同一口径）
const { lang } = useData()
const locale = computed<Locale>(() =>
  (lang.value || 'zh-CN').toLowerCase().startsWith('en') ? 'en' : 'zh',
)

// 首屏先用默认策略（enabled=false）兜底；接口就绪后替换
const policy = ref<BountyPolicyData>(fallbackPolicy())
const stats = ref<BountyStatsData | null>(null)
const policyLoadFailed = ref(false)
// 策略请求完成前不展示「暂停」，避免首屏先闪一句暂停提示
const policyReady = ref(false)

const flowSteps = computed(() => {
  const hours = policy.value.reviewSlaHours || 72
  return [
    { title: t('flow.step1Title', locale.value), desc: t('flow.step1Desc', locale.value) },
    { title: t('flow.step2Title', locale.value), desc: t('flow.step2Desc', locale.value, { h: hours }) },
    { title: t('flow.step3Title', locale.value), desc: t('flow.step3Desc', locale.value) },
    { title: t('flow.step4Title', locale.value), desc: t('flow.step4Desc', locale.value) },
  ]
})

onMounted(() => {
  loadPolicy()
  loadStats()
})

function fallbackPolicy(): BountyPolicyData {
  return {
    ...DEFAULT_POLICY,
    tiers: DEFAULT_POLICY.tiers.map((tier) => ({ ...tier })),
    validityFactors: { ...DEFAULT_POLICY.validityFactors },
  }
}

async function loadPolicy() {
  try {
    const res = await fetch(`${props.apiBase}/bounty/policy`)
    const data = await res.json()
    if (data.code === 0 && data.data) {
      policy.value = normalizePolicy(data.data)
      policyLoadFailed.value = false
    } else {
      policy.value = fallbackPolicy()
      policyLoadFailed.value = true
    }
  } catch (err) {
    // 接口未就绪时按契约默认值兜底：页面可见，表单因 enabled=false 而禁用
    policy.value = fallbackPolicy()
    policyLoadFailed.value = true
    console.error(err)
  } finally {
    policyReady.value = true
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${props.apiBase}/bounty/stats`)
    const data = await res.json()
    if (data.code === 0 && data.data) {
      stats.value = normalizeStats(data.data)
    }
  } catch (err) {
    // 统计条保持「—」，不影响提交与查询
    console.error(err)
  }
}

// 提交成功后只刷新聚合统计，策略无需重拉
function onSubmitted() {
  loadStats()
}
</script>

<style scoped>
.bounty-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 24px 3rem;
}

.bounty-hero {
  padding: 2rem 0 0.5rem;
  text-align: center;
}

.hero-eyebrow {
  display: inline-block;
  margin: 0 0 0.75rem;
  padding: 0.2rem 0.7rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0 0 0.75rem;
  font-size: clamp(2rem, 5vw, 2.75rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.hero-sub {
  max-width: 640px;
  margin: 0 auto 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.8;
}

.hero-note {
  margin: 0 auto;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.hero-paused {
  max-width: 680px;
  margin: 0.875rem auto 0;
  padding: 0.7rem 1rem;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: color-mix(in srgb, #f59e0b 10%, var(--vp-c-bg));
  color: #b45309;
  font-size: 0.85rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  padding: 0.65rem 1.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.hero-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.hero-btn.primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.hero-btn.primary:hover {
  opacity: 0.9;
  color: #fff;
}

.flow-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3.5rem 0 0;
}

.flow-section h2 {
  margin: 0 0 1.25rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}

.flow-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flow-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.flow-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}

.flow-body h3 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.flow-body p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.65;
  color: var(--vp-c-text-3);
}

.bounty-form-section {
  padding: 3.5rem 0 0;
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}

@media (max-width: 860px) {
  .flow-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .bounty-page {
    padding: 1rem 16px 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-btn {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .flow-list {
    grid-template-columns: 1fr;
  }
}
</style>

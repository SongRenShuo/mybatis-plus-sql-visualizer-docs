<template>
  <div class="bounty-page">
    <!-- 月度预算状态：只有状态文字，不出现任何预算金额；reached 也不阻断提交 -->
    <p
      v-if="budgetMessage"
      class="budget-banner"
      :class="`is-${policy.budgetStatus}`"
      role="status"
    >
      {{ budgetMessage }}
    </p>

    <header class="bounty-hero">
      <p class="ui-eyebrow">{{ t('hero.badge', locale) }}</p>
      <h1 class="hero-title">{{ t('hero.title', locale) }}</h1>
      <p class="hero-sub">{{ t('hero.subtitle', locale) }}</p>
      <p class="hero-note">{{ t('hero.note', locale) }}</p>
      <p v-if="policyReady && !policy.enabled" class="hero-paused" role="status">{{ t('hero.paused', locale) }}</p>

      <div class="hero-actions">
        <UiButton variant="primary" @click="showSubmit = true">{{ t('hero.submit', locale) }}</UiButton>
        <UiButton variant="outline" @click="openLookup()">{{ t('hero.lookup', locale) }}</UiButton>
      </div>

      <BountyStats :stats="stats" :locale="locale" />
    </header>

    <!-- 奖励标准 -->
    <BountyPolicy :policy="policy" :locale="locale" :ready="policyReady" :load-error="policyLoadFailed" />

    <!-- 处理流程看板：四列 = 四个阶段，卡片是该阶段的口径 -->
    <section class="flow-section">
      <h2>{{ t('board.title', locale) }}</h2>
      <p class="section-sub">{{ t('board.subtitle', locale) }}</p>
      <KanbanBoard :columns="flowColumns" :scroll-body="false">
        <template #default="{ column }">
          <KanbanCard
            v-for="card in column.items"
            :key="card.id"
            :item-id="card.id"
            :label="card.title"
            :interactive="false"
          >
            <template #title>
              <span class="kb-card-title">{{ card.title }}</span>
            </template>
            <template #description>
              <span class="kb-card-desc">{{ card.desc }}</span>
            </template>
          </KanbanCard>
        </template>
      </KanbanBoard>
    </section>

    <!-- 提交报告弹窗 -->
    <UiModal
      v-if="showSubmit"
      :title="t('form.title', locale)"
      :subtitle="t('form.subtitle', locale)"
      :close-label="t('lookup.close', locale)"
      width="760px"
      @close="showSubmit = false"
    >
      <BountyForm
        :api-base="apiBase"
        :locale="locale"
        :policy="policy"
        :policy-ready="policyReady"
        :budget-status="policy.budgetStatus"
        embedded
        @submitted="onSubmitted"
        @lookup="openLookup()"
      />
    </UiModal>

    <!-- 查询进度弹窗 -->
    <UiModal
      v-if="showLookup"
      :title="t('lookup.title', locale)"
      :subtitle="t('lookup.subtitle', locale)"
      :close-label="t('lookup.close', locale)"
      width="640px"
      @close="showLookup = false"
    >
      <BountyLookup :api-base="apiBase" :locale="locale" embedded :initial-no="lastNo" />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import BountyStats from './BountyStats.vue'
import BountyPolicy from './BountyPolicy.vue'
import BountyForm from './BountyForm.vue'
import BountyLookup from './BountyLookup.vue'
import KanbanBoard from '../kanban/KanbanBoard.vue'
import KanbanCard from '../kanban/KanbanCard.vue'
import UiButton from '../ui/UiButton.vue'
import UiModal from '../ui/UiModal.vue'
import { t, type Locale, type MessageKey } from './i18n'
import {
  DEFAULT_POLICY,
  budgetNotice,
  formatMoney,
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

// 提交 / 查询两个弹窗；lastNo 用于从提交成功卡跳查询时预填编号
const showSubmit = ref(false)
const showLookup = ref(false)
const lastNo = ref('')

function openLookup(no?: string) {
  if (no) lastNo.value = no
  showSubmit.value = false
  showLookup.value = true
}

// 预算状态文案（normal 为空串）；策略就绪前不显示，避免首屏闪出提示
const budgetMessage = computed(() =>
  policyReady.value ? budgetNotice(policy.value.budgetStatus, locale.value) : '',
)

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
// 提交成功：编号记下来（成功卡的「查询进度」会预填），只刷新聚合统计
function onSubmitted(submissionNo: string) {
  lastNo.value = submissionNo
  loadStats()
}

interface FlowCard {
  id: string
  title: string
  desc: string
}

// 四阶段看板：时限、金额、系数全部来自 /bounty/policy，缺省时才用默认值兜底
const flowColumns = computed(() => {
  const localeValue = locale.value
  const hours = policy.value.reviewSlaHours || DEFAULT_POLICY.reviewSlaHours
  const tiers = policy.value.tiers?.length ? policy.value.tiers : DEFAULT_POLICY.tiers
  const low = Math.min(...tiers.map(tier => tier.min))
  const high = Math.max(...tiers.map(tier => tier.max))
  const range = `${formatMoney(low)} – ${formatMoney(high)}`
  const partial = Number(policy.value.validityFactors?.['2'] ?? 0.5)

  const card = (
    id: string,
    title: MessageKey,
    desc: MessageKey,
    params?: Record<string, string | number>
  ): FlowCard => ({
    id,
    title: t(title, localeValue),
    desc: t(desc, localeValue, params),
  })

  return [
    {
      id: 'submit',
      step: '01',
      title: t('board.colSubmit', localeValue),
      color: '#6b7280',
      items: [
        card('s1', 'board.c1t1', 'board.c1d1'),
        card('s2', 'board.c1t2', 'board.c1d2'),
        card('s3', 'board.c1t3', 'board.c1d3'),
      ],
    },
    {
      id: 'review',
      step: '02',
      title: t('board.colReview', localeValue),
      color: '#3b82f6',
      items: [
        card('r1', 'board.c2t1', 'board.c2d1', { h: hours }),
        card('r2', 'board.c2t2', 'board.c2d2'),
        card('r3', 'board.c2t3', 'board.c2d3'),
      ],
    },
    {
      id: 'payout',
      step: '03',
      title: t('board.colPayout', localeValue),
      color: '#f59e0b',
      items: [
        card('p1', 'board.c3t1', 'board.c3d1', { range }),
        card('p2', 'board.c3t2', 'board.c3d2', { f: partial }),
        card('p3', 'board.c3t3', 'board.c3d3'),
      ],
    },
    {
      id: 'close',
      step: '04',
      title: t('board.colClose', localeValue),
      color: '#10b981',
      items: [
        card('c1', 'board.c4t1', 'board.c4d1'),
        card('c2', 'board.c4t2', 'board.c4d2'),
        card('c3', 'board.c4t3', 'board.c4d3'),
      ],
    },
  ]
})
</script>

<style scoped>
.bounty-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 24px 3rem;
}

/* VitePress 只在 ≥960 给 .VPPage 加 64px 顶部偏移；更窄时导航 fixed，
   内容从 0 开始会被顶栏压住（眉标看不见），这里补出导航高度 */
@media (max-width: 959px) {
  .bounty-page {
    padding-top: calc(var(--vp-nav-height) + 20px);
  }
}

/* 预算状态横幅：只承载状态文字，不渲染任何金额 */
.budget-banner {
  max-width: 760px;
  margin: 0 auto;
  padding: 10px 14px;
  border: 1px solid #f59e0b;
  border-radius: var(--ui-radius-field);
  background: color-mix(in srgb, #f59e0b 10%, var(--ui-surface));
  color: #b45309;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}

.budget-banner.is-reached {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 10%, var(--ui-surface));
  color: #b91c1c;
}

.bounty-hero {
  padding: 2.25rem 0 0.5rem;
  text-align: center;
}

.hero-title {
  margin: 12px 0 0.75rem;
  border: none;
  padding: 0;
  font-size: clamp(2rem, 5vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--ui-fg);
}

.hero-sub {
  max-width: 640px;
  margin: 0 auto 0.5rem;
  color: var(--ui-fg-soft);
  font-size: 15px;
  line-height: 1.75;
}

.hero-note {
  margin: 0 auto;
  color: var(--ui-fg-muted);
  font-size: 12px;
}

.hero-paused {
  max-width: 680px;
  margin: 14px auto 0;
  padding: 10px 14px;
  border: 1px solid #f59e0b;
  border-radius: var(--ui-radius-field);
  background: color-mix(in srgb, #f59e0b 10%, var(--ui-surface));
  color: #b45309;
  font-size: 13px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.flow-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3.5rem 0 0;
}

.flow-section h2 {
  margin: 0 0 0.5rem;
  border: none;
  padding: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--ui-fg);
}

.section-sub {
  max-width: 680px;
  margin: 0 auto 1.75rem;
  text-align: center;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ui-fg-muted);
}

@media (max-width: 767px) {
  .bounty-page {
    padding: calc(var(--vp-nav-height) + 14px) 16px 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions > * {
    width: 100%;
  }
}
</style>

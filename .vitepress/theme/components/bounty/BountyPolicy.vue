<template>
  <section id="bounty-policy" class="bounty-policy">
    <h2>{{ t('policy.title', locale) }}</h2>
    <p class="section-sub">{{ t('policy.subtitle', locale) }}</p>

    <p v-if="ready && !policy.enabled" class="paused-notice" role="status">{{ t('policy.paused', locale) }}</p>
    <p v-if="loadError" class="load-error">{{ t('policy.loadFailed', locale) }}</p>

    <!-- 等级 + 有效性合成一张卡：上面是四行等级（色点 / 适用情形 / 区间），
         下面一行是有效性系数。原先两排 4 列灰盒拼在一起，看起来像没修过的表格 -->
    <div class="policy-card">
      <ul class="tier-list">
        <li v-for="tier in tiers" :key="tier.severity" class="tier-row">
          <span class="tier-badge">
            <span class="tier-dot" :style="{ background: tier.color }" aria-hidden="true" />{{ tier.label }}
          </span>
          <span class="tier-desc">{{ tier.desc }}</span>
          <span class="tier-range ui-num">{{ tier.range }}</span>
        </li>
      </ul>

      <div class="policy-div">
        <span class="policy-div-label">{{ t('policy.validityTitle', locale) }}</span>
        <span class="policy-div-hint">{{ t('policy.validityHint', locale) }}</span>
      </div>

      <ul class="factor-row">
        <li v-for="row in validityRows" :key="row.validity" class="factor-item">
          <em class="factor-num" :style="{ color: row.color }">{{ row.factor }}</em>
          <span class="factor-name">{{ row.label }}</span>
        </li>
      </ul>

      <div class="policy-foot">
        <p class="policy-note">{{ t('policy.note', locale, { max: formatMoney(policy.maxReward) }) }}</p>
        <p class="policy-cap">
          {{ t('policy.maxReward', locale) }}<strong class="ui-num">{{ formatMoney(policy.maxReward) }}</strong>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, type Locale } from './i18n'
import {
  formatMoney,
  severityColor,
  severityDesc,
  severityLabel,
  validityColor,
  validityLabel,
  type BountyPolicyData,
} from './bountyStatus'

const props = defineProps<{
  policy: BountyPolicyData
  locale: Locale
  /** 策略请求是否已完成；未完成时不显示「暂停」 */
  ready?: boolean
  loadError?: boolean
}>()

const tiers = computed(() =>
  [...props.policy.tiers]
    .sort((a, b) => a.severity - b.severity)
    .map((tier) => ({
      severity: tier.severity,
      label: severityLabel(tier.severity, props.locale),
      color: severityColor(tier.severity),
      range: `${formatMoney(tier.min)} – ${formatMoney(tier.max)}`,
      desc: severityDesc(tier.severity, props.locale, tier.desc),
    }))
)

const validityRows = computed(() => {
  const factors = props.policy.validityFactors || {}
  const rows = [
    { validity: 1, label: 'policy.validityValid', desc: 'policy.validityValidDesc' },
    { validity: 2, label: 'policy.validityPartial', desc: 'policy.validityPartialDesc' },
    { validity: 3, label: 'policy.validityInvalid', desc: 'policy.validityInvalidDesc' },
    { validity: 4, label: 'policy.validityDuplicate', desc: 'policy.validityDuplicateDesc' },
  ] as const

  return rows.map((row) => {
    const factor = Number(factors[String(row.validity)] ?? 0)
    return {
      validity: row.validity,
      label: validityLabel(row.validity, props.locale),
      color: validityColor(row.validity),
      factor: `×${factor}`,
      desc: t(row.desc, props.locale),
    }
  })
})
</script>

<style scoped>
.bounty-policy {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3.5rem 0 0;
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}

.bounty-policy h2 {
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
  margin: 0 auto 1.5rem;
  max-width: 720px;
  text-align: center;
  font-size: 13px;
  line-height: 1.7;
  color: var(--ui-fg-muted);
}

.paused-notice {
  max-width: 760px;
  margin: 0 auto 1rem;
  padding: 10px 14px;
  border: 1px solid #f59e0b;
  border-radius: var(--ui-radius-field);
  background: color-mix(in srgb, #f59e0b 10%, var(--ui-surface));
  color: #b45309;
  font-size: 13px;
  text-align: center;
}

.load-error {
  margin: 0 0 1rem;
  text-align: center;
  color: var(--ui-fg-muted);
  font-size: 12px;
}

.policy-card {
  padding: 6px 20px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
}

/* 等级行：色点等级 | 适用情形 | 金额区间（右对齐等宽），行间发丝线 */
.tier-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tier-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 6px 16px;
  padding: 13px 0;
  border-top: 1px solid var(--ui-border);
}

.tier-row:first-child {
  border-top: none;
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-fg);
  white-space: nowrap;
}

.tier-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tier-desc {
  min-width: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ui-fg-muted);
}

.tier-range {
  justify-self: end;
  font-size: 14px;
  font-weight: 600;
  color: var(--ui-fg);
  white-space: nowrap;
}

/* 分区标题行：小字 + 说明，替代原来独立成段的 h3 */
.policy-div {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-top: 6px;
  padding: 14px 0 4px;
  border-top: 1px solid var(--ui-border);
}

.policy-div-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-fg-muted);
}

.policy-div-hint {
  font-size: 11px;
  color: var(--ui-fg-muted);
}

/* 有效性系数：一行四个「系数 + 名称」 */
.factor-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0;
  padding: 2px 0 14px;
  list-style: none;
}

.factor-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--ui-fg-soft);
}

.factor-num {
  font-style: normal;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.policy-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 12px 0 14px;
  border-top: 1px solid var(--ui-border);
}

.policy-note {
  margin: 0;
  flex: 1 1 320px;
  color: var(--ui-fg-muted);
  font-size: 12px;
  line-height: 1.6;
}

.policy-cap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 4px 10px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-pill);
  color: var(--ui-fg-muted);
  font-size: 12px;
}

.policy-cap strong {
  color: var(--ui-accent);
  font-size: 13px;
}

@media (max-width: 640px) {
  .policy-card {
    padding: 2px 14px;
  }

  .tier-row {
    grid-template-columns: auto 1fr;
    row-gap: 2px;
  }

  .tier-range {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
  }

  .tier-desc {
    grid-column: 2;
    grid-row: 2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .policy-card {
    transition: none;
  }
}
</style>

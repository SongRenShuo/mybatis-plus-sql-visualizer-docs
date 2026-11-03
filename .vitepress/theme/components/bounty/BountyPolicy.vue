<template>
  <section id="bounty-policy" class="bounty-policy">
    <h2>{{ t('policy.title', locale) }}</h2>
    <p class="section-sub">{{ t('policy.subtitle', locale) }}</p>

    <p v-if="ready && !policy.enabled" class="paused-notice" role="status">{{ t('policy.paused', locale) }}</p>
    <p v-if="loadError" class="load-error">{{ t('policy.loadFailed', locale) }}</p>

    <!-- 等级卡：等级 / 金额区间 / 适用情形，四列并排 -->
    <div class="tier-grid">
      <div v-for="tier in tiers" :key="tier.severity" class="tier-card">
        <span class="tier-badge">
          <span class="tier-dot" :style="{ background: tier.color }" aria-hidden="true" />{{ tier.label }}
        </span>
        <span class="tier-range ui-num">{{ tier.range }}</span>
        <p class="tier-desc">{{ tier.desc }}</p>
      </div>
    </div>

    <div class="policy-foot">
      <p class="policy-note">{{ t('policy.note', locale, { max: formatMoney(policy.maxReward) }) }}</p>
      <p class="policy-cap">
        {{ t('policy.maxReward', locale) }}<strong class="ui-num">{{ formatMoney(policy.maxReward) }}</strong>
      </p>
    </div>

    <h3 class="validity-title">{{ t('policy.validityTitle', locale) }}</h3>
    <p class="validity-hint">{{ t('policy.validityHint', locale) }}</p>
    <div class="validity-list">
      <div v-for="row in validityRows" :key="row.validity" class="validity-item">
        <span class="validity-factor" :style="{ '--validity-color': row.color }">{{ row.factor }}</span>
        <span class="validity-name">{{ row.label }}</span>
        <span class="validity-desc">{{ row.desc }}</span>
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

.tier-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.tier-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ui-fg-soft);
}

.tier-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tier-range {
  font-size: 19px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--ui-fg);
}

.tier-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ui-fg-muted);
}

.policy-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 12px;
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

.validity-title {
  margin: 2rem 0 0.25rem;
  border: none;
  padding: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ui-fg);
}

.validity-hint {
  margin: 0 0 10px;
  color: var(--ui-fg-muted);
  font-size: 12px;
}

.validity-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.validity-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-field);
  background: var(--ui-surface-muted);
}

.validity-factor {
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: var(--ui-radius-pill);
  background: color-mix(in srgb, var(--validity-color) 14%, var(--ui-surface));
  color: var(--validity-color);
  font-size: 11px;
  font-weight: 700;
}

.validity-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ui-fg);
}

.validity-desc {
  font-size: 11px;
  line-height: 1.55;
  color: var(--ui-fg-muted);
}

@media (max-width: 860px) {
  .tier-grid,
  .validity-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .tier-grid,
  .validity-list {
    grid-template-columns: 1fr;
  }
}
</style>

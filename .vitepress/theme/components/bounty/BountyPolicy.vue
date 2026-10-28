<template>
  <section id="bounty-policy" class="bounty-policy">
    <h2>{{ t('policy.title', locale) }}</h2>
    <p class="section-sub">{{ t('policy.subtitle', locale) }}</p>

    <p v-if="ready && !policy.enabled" class="paused-notice" role="status">{{ t('policy.paused', locale) }}</p>
    <p v-if="loadError" class="load-error">{{ t('policy.loadFailed', locale) }}</p>

    <div class="tier-table-wrap">
      <table class="tier-table">
        <thead>
          <tr>
            <th>{{ t('policy.tier', locale) }}</th>
            <th>{{ t('policy.range', locale) }}</th>
            <th>{{ t('policy.desc', locale) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tier in tiers" :key="tier.severity">
            <td :data-label="t('policy.tier', locale)">
              <span class="tier-badge" :style="{ '--tier-color': tier.color }">
                <span class="tier-dot" aria-hidden="true"></span>{{ tier.label }}
              </span>
            </td>
            <td :data-label="t('policy.range', locale)" class="tier-range">{{ tier.range }}</td>
            <td :data-label="t('policy.desc', locale)" class="tier-desc">{{ tier.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="policy-foot">
      <p class="policy-note">{{ t('policy.note', locale, { max: formatMoney(policy.maxReward) }) }}</p>
      <p class="policy-cap">{{ t('policy.maxReward', locale) }}：<strong>{{ formatMoney(policy.maxReward) }}</strong></p>
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
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
}

.section-sub {
  margin: 0 auto 1.5rem;
  max-width: 720px;
  text-align: center;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.paused-notice {
  max-width: 760px;
  margin: 0 auto 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: color-mix(in srgb, #f59e0b 10%, var(--vp-c-bg));
  color: #b45309;
  font-size: 0.875rem;
  text-align: center;
}

/* 预算状态横幅：只承载状态文字，不渲染任何金额 */
.budget-banner {
  max-width: 760px;
  margin: 0 auto 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: color-mix(in srgb, #f59e0b 10%, var(--vp-c-bg));
  color: #b45309;
  font-size: 0.875rem;
  line-height: 1.6;
  text-align: center;
}

.budget-banner.is-reached {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 10%, var(--vp-c-bg));
  color: #b91c1c;
}

.load-error {
  margin: 0 0 1rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.tier-table-wrap {
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.tier-table {
  width: 100%;
  border-collapse: collapse;
}

.tier-table th,
.tier-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 0.9rem;
}

.tier-table th {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-weight: 600;
  font-size: 0.8rem;
}

.tier-table tbody tr:last-child td {
  border-bottom: none;
}

.tier-range {
  white-space: nowrap;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.tier-desc {
  color: var(--vp-c-text-2);
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tier-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tier-color);
}

.policy-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-top: 0.75rem;
}

.policy-note {
  margin: 0;
  flex: 1 1 320px;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.policy-cap {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.policy-cap strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.validity-title {
  margin: 2rem 0 0.25rem;
  font-size: 1.05rem;
}

.validity-hint {
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.validity-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.validity-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.validity-factor {
  align-self: flex-start;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--validity-color) 12%, var(--vp-c-bg));
  color: var(--validity-color);
  font-size: 0.75rem;
  font-weight: 700;
}

.validity-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.validity-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 860px) {
  .validity-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 窄屏等级表改为卡片列表，不横向滚动 */
@media (max-width: 640px) {
  .tier-table-wrap {
    border: none;
    background: transparent;
    overflow: visible;
  }

  .tier-table thead {
    display: none;
  }

  .tier-table,
  .tier-table tbody,
  .tier-table tr,
  .tier-table td {
    display: block;
    width: 100%;
  }

  .tier-table tr {
    margin-bottom: 0.75rem;
    padding: 0.75rem 0.875rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 10px;
    background: var(--vp-c-bg);
  }

  .tier-table td {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.25rem 0;
    border-bottom: none;
    text-align: right;
  }

  .tier-table td::before {
    content: attr(data-label);
    flex-shrink: 0;
    color: var(--vp-c-text-3);
    font-size: 0.75rem;
    text-align: left;
  }

  .tier-badge {
    justify-content: flex-end;
  }

  .validity-list {
    grid-template-columns: 1fr;
  }
}
</style>

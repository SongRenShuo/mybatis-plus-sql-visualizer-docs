<template>
  <div class="bounty-stats" role="group" :aria-label="t('stats.total', locale)">
    <div class="stat">
      <span class="stat-value">{{ stats ? stats.totalSubmissions : '—' }}</span>
      <span class="stat-label">{{ t('stats.total', locale) }}</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ stats ? stats.validCount : '—' }}</span>
      <span class="stat-label">{{ t('stats.valid', locale) }}</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ stats ? stats.paidCount : '—' }}</span>
      <span class="stat-label">{{ t('stats.paid', locale) }}</span>
      <span v-if="stats" class="stat-sub">{{ t('stats.totalPaid', locale, { amount: formatMoney(stats.totalPaid) }) }}</span>
    </div>
    <div class="stat">
      <span class="stat-value">{{ avgReview }}</span>
      <span class="stat-label">{{ t('stats.avgReview', locale) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, type Locale } from './i18n'
import { formatMoney, type BountyStatsData } from './bountyStatus'

const props = defineProps<{
  stats: BountyStatsData | null
  locale: Locale
}>()

const avgReview = computed(() => {
  if (!props.stats) return '—'
  const n = props.stats.avgFirstReviewHours
  if (!Number.isFinite(n) || n <= 0) return t('stats.hours', props.locale, { n: 0 })
  const value = Number.isInteger(n) ? String(n) : n.toFixed(1)
  return t('stats.hours', props.locale, { n: value })
})
</script>

<style scoped>
.bounty-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  max-width: 880px;
  margin: 1.75rem auto 0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.875rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.stat-sub {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .bounty-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

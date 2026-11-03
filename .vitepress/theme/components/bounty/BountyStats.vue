<template>
  <div class="bounty-stats" role="group" :aria-label="t('stats.total', locale)">
    <UiStat :value="stats ? stats.totalSubmissions : '—'" :label="t('stats.total', locale)" />
    <UiStat :value="stats ? stats.validCount : '—'" :label="t('stats.valid', locale)" dot="#10b981" />
    <UiStat
      :value="stats ? stats.paidCount : '—'"
      :label="t('stats.paid', locale)"
      :hint="stats ? t('stats.totalPaid', locale, { amount: formatMoney(stats.totalPaid) }) : ''"
      dot="#3b82f6"
    />
    <UiStat :value="avgReview" :label="t('stats.avgReview', locale)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t, type Locale } from './i18n'
import { formatMoney, type BountyStatsData } from './bountyStatus'
import UiStat from '../ui/UiStat.vue'

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
  gap: 10px;
  /* 与下方奖励标准/流程看板同宽（1100），此前 880 会让统计条比正文窄一截 */
  max-width: 1100px;
  margin: 28px auto 0;
  text-align: left;
}

@media (max-width: 640px) {
  .bounty-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

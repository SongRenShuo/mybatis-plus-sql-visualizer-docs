/**
 * Bug 悬赏的状态 / 等级 / 有效性展示映射与金额格式化。
 *
 * 接口金额统一用「分」；页面统一按元展示，整数元不带小数，非整数保留两位。
 */

import { t, type Locale, type MessageKey } from './i18n'

export interface BountyTier {
  severity: number
  label: string
  min: number
  max: number
  desc?: string
}

/** 月度预算状态：公开接口只给状态文字，不给任何金额。 */
export type BudgetStatus = 'normal' | 'near_limit' | 'reached'

export interface BountyPolicyData {
  enabled: boolean
  currency: string
  reviewSlaHours: number
  maxReward: number
  tiers: BountyTier[]
  validityFactors: Record<string, number>
  /** 预算状态；缺省按 normal 处理 */
  budgetStatus: BudgetStatus
  /**
   * 月度预算（分）。仅用于与后端默认策略对齐的本地兜底，
   * 公开接口不返回该字段，页面任何位置都不渲染。
   */
  monthlyBudget: number
}

export interface BountyStatsData {
  totalSubmissions: number
  validCount: number
  paidCount: number
  totalPaid: number
  avgFirstReviewHours: number
  currency: string
}

/**
 * 默认策略：与后端 `bounty.policy` 缺省值一致（§5.4）。
 * 接口未就绪或请求失败时作为只读兜底，`enabled=false` 表示暂停接收。
 */
export const DEFAULT_POLICY: BountyPolicyData = {
  enabled: false,
  currency: 'CNY',
  reviewSlaHours: 72,
  maxReward: 988,
  tiers: [
    { severity: 1, label: '严重', min: 688, max: 988, desc: '' },
    { severity: 2, label: '高', min: 488, max: 688, desc: '' },
    { severity: 3, label: '中', min: 288, max: 488, desc: '' },
    { severity: 4, label: '低', min: 88, max: 288, desc: '' },
  ],
  validityFactors: { '1': 1, '2': 0.5, '3': 0, '4': 0 },
  budgetStatus: 'normal',
  monthlyBudget: 2000,
}

export const DEFAULT_STATS: BountyStatsData = {
  totalSubmissions: 0,
  validCount: 0,
  paidCount: 0,
  totalPaid: 0,
  avgFirstReviewHours: 0,
  currency: 'CNY',
}

/** 金额（分）→ 展示文本：整数元省略小数，非整数保留两位。 */
export function formatMoney(cents: number | null | undefined): string {
  if (cents == null || !Number.isFinite(Number(cents))) return '—'
  const value = Number(cents)
  const yuan = value / 100
  if (value % 100 === 0) return `¥${yuan}`
  return `¥${yuan.toFixed(2)}`
}

interface StatusMeta {
  key: MessageKey
  color: string
}

const STATUS_META: Record<number, StatusMeta> = {
  1: { key: 'status.1', color: '#6b7280' },
  2: { key: 'status.2', color: '#f59e0b' },
  3: { key: 'status.3', color: '#3b82f6' },
  4: { key: 'status.4', color: '#10b981' },
  5: { key: 'status.5', color: '#ef4444' },
  6: { key: 'status.6', color: '#94a3b8' },
  7: { key: 'status.7', color: '#6b7280' },
}

interface ValidityMeta {
  key: MessageKey
  color: string
}

const VALIDITY_META: Record<number, ValidityMeta> = {
  0: { key: 'validity.0', color: '#6b7280' },
  1: { key: 'validity.1', color: '#10b981' },
  2: { key: 'validity.2', color: '#f59e0b' },
  3: { key: 'validity.3', color: '#ef4444' },
  4: { key: 'validity.4', color: '#94a3b8' },
}

const SEVERITY_COLORS: Record<number, string> = {
  0: '#6b7280',
  1: '#ef4444',
  2: '#f97316',
  3: '#3b82f6',
  4: '#10b981',
}

const ACTION_KEYS: Record<string, MessageKey> = {
  submit: 'action.submit',
  start: 'action.start',
  review: 'action.review',
  supplement: 'action.supplement',
  payout: 'action.payout',
  reopen: 'action.reopen',
  withdraw: 'action.withdraw',
  promote: 'action.promote',
  'revoke-approval': 'action.revoke',
  revoke: 'action.revoke',
}

export function statusColor(status: number): string {
  return STATUS_META[status]?.color || '#6b7280'
}

export function statusLabel(status: number, locale: Locale): string {
  const meta = STATUS_META[status]
  return meta ? t(meta.key, locale) : String(status)
}

export function validityColor(validity: number): string {
  return VALIDITY_META[validity]?.color || '#6b7280'
}

export function validityLabel(validity: number, locale: Locale): string {
  const meta = VALIDITY_META[validity]
  return meta ? t(meta.key, locale) : String(validity)
}

export function severityColor(severity: number): string {
  return SEVERITY_COLORS[severity] || '#6b7280'
}

export function severityLabel(severity: number, locale: Locale): string {
  const key = `severity.${severity}` as MessageKey
  const label = t(key, locale)
  return label === key ? String(severity) : label
}

/** 等级说明：英文页固定用 i18n 文案，避免接口里的中文 label/desc 混入英文版面。 */
export function severityDesc(severity: number, locale: Locale, fallback?: string): string {
  const key = `severityDesc.${severity}` as MessageKey
  const desc = t(key, locale)
  if (desc !== key) return desc
  return fallback || ''
}

export function actionLabel(action: string, locale: Locale): string {
  const key = ACTION_KEYS[action]
  if (key) return t(key, locale)
  return action || ''
}

/** 与需求池一致的分类 slug 枚举 */
export const CATEGORY_SLUGS = [
  'wrapper', 'xml', 'annotation', 'sql-to-java',
  'sql-log', 'batch', 'completion', 'other',
]

export function categoryLabel(slug: string, locale: Locale): string {
  const key = `cat.${slug}` as MessageKey
  const label = t(key, locale)
  return label === key ? slug : label
}

export function categoryOptions(locale: Locale): Array<{ value: string; label: string }> {
  return CATEGORY_SLUGS.map((slug) => ({ value: slug, label: categoryLabel(slug, locale) }))
}

function toInt(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const BUDGET_STATUSES: BudgetStatus[] = ['normal', 'near_limit', 'reached']

/** 预算状态归一化：未知值一律按 normal，页面不因脏数据误报「已达上限」。 */
export function normalizeBudgetStatus(value: unknown): BudgetStatus {
  return BUDGET_STATUSES.includes(value as BudgetStatus) ? (value as BudgetStatus) : 'normal'
}

/** 预算状态提示文案；normal 返回空串，调用方据此决定是否显示横幅。 */
export function budgetNotice(status: BudgetStatus, locale: Locale): string {
  if (status === 'near_limit') return t('budget.near_limit', locale)
  if (status === 'reached') return t('budget.reached', locale)
  return ''
}

/** 接口策略归一化：字段缺失或类型异常时回落到默认值，页面不因脏数据白屏。 */
export function normalizePolicy(raw: unknown): BountyPolicyData {
  const src = (raw || {}) as Record<string, unknown>
  const rawTiers = Array.isArray(src.tiers) ? src.tiers : []
  const tiers: BountyTier[] = rawTiers
    .map((item) => {
      const row = (item || {}) as Record<string, unknown>
      return {
        severity: toInt(row.severity, 0),
        label: typeof row.label === 'string' ? row.label : '',
        min: toInt(row.min, 0),
        max: toInt(row.max, 0),
        desc: typeof row.desc === 'string' ? row.desc : '',
      }
    })
    .filter((row) => row.severity >= 1 && row.severity <= 4)
    .sort((a, b) => a.severity - b.severity)

  const factors = (src.validityFactors || {}) as Record<string, unknown>
  const validityFactors: Record<string, number> = {
    '1': toInt(factors['1'], DEFAULT_POLICY.validityFactors['1']),
    '2': toInt(factors['2'], DEFAULT_POLICY.validityFactors['2']),
    '3': toInt(factors['3'], DEFAULT_POLICY.validityFactors['3']),
    '4': toInt(factors['4'], DEFAULT_POLICY.validityFactors['4']),
  }

  return {
    enabled: src.enabled === true,
    currency: typeof src.currency === 'string' ? src.currency : DEFAULT_POLICY.currency,
    reviewSlaHours: toInt(src.reviewSlaHours, DEFAULT_POLICY.reviewSlaHours),
    maxReward: toInt(src.maxReward, DEFAULT_POLICY.maxReward),
    tiers: tiers.length ? tiers : DEFAULT_POLICY.tiers.map((row) => ({ ...row })),
    validityFactors,
    // 公开接口只返回状态；金额字段不读取，避免把预算数额带进页面
    budgetStatus: normalizeBudgetStatus(src.budgetStatus),
    monthlyBudget: DEFAULT_POLICY.monthlyBudget,
  }
}

export function normalizeStats(raw: unknown): BountyStatsData {
  const src = (raw || {}) as Record<string, unknown>
  return {
    totalSubmissions: toInt(src.totalSubmissions, 0),
    validCount: toInt(src.validCount, 0),
    paidCount: toInt(src.paidCount, 0),
    totalPaid: toInt(src.totalPaid, 0),
    avgFirstReviewHours: toInt(src.avgFirstReviewHours, 0),
    currency: typeof src.currency === 'string' ? src.currency : 'CNY',
  }
}

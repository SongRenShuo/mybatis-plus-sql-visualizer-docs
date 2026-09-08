/**
 * 需求池状态归并（展示层）
 *
 * 库内 status 1~7 共七种，普通用户难以理解「评估中/已规划/进行中」的差异，
 * 公开侧统一归并为 4 组展示；库内值与管理后台口径不变，状态历史仍用原始状态。
 */

import type { MessageKey } from './i18n'

export interface StatusGroup {
  key: MessageKey
  color: string
  /** 看板列/筛选排序 */
  order: number
  /** 归并的原始状态集合 */
  statuses: number[]
}

/** 四个归并组（按 order 排序即为看板列序/筛选序） */
export const STATUS_GROUPS: StatusGroup[] = [
  { key: 'statusGroup.pending', color: '#6b7280', order: 0, statuses: [1] },
  { key: 'statusGroup.inProgress', color: '#3b82f6', order: 1, statuses: [2, 3, 4] },
  { key: 'statusGroup.done', color: '#10b981', order: 2, statuses: [5] },
  { key: 'statusGroup.declined', color: '#94a3b8', order: 3, statuses: [6, 7] },
]

const GROUP_BY_STATUS = new Map<number, StatusGroup>()
for (const g of STATUS_GROUPS) for (const s of g.statuses) GROUP_BY_STATUS.set(s, g)

/** 原始状态 → 归并组；未知状态兜底「未采纳」 */
export function statusGroup(status: number): StatusGroup {
  return (
    GROUP_BY_STATUS.get(status) ||
    STATUS_GROUPS[STATUS_GROUPS.length - 1]
  )
}

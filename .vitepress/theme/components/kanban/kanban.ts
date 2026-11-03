/**
 * 看板通用类型与键盘导航。
 *
 * 版式参考 beui 的 kanban-board，但本站没有写权限：卡片只能导航、不能拖动换列。
 */

export interface KanbanColumnData<T = unknown> {
  id: string
  title: string
  /** 列头左侧圆点色 */
  color: string
  /** 可选阶段号（流程看板用），如 "01" */
  step?: string
  items: T[]
}

export interface KanbanFilter {
  value: string
  label: string
}

const NAV_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

/**
 * 方向键在卡片间移动焦点：上下在列内移动，左右跳到相邻列的首张卡片，Home/End 落到列首尾。
 * 返回 true 表示已处理（调用方据此避免重复 preventDefault）。
 */
export function moveCardFocus(root: HTMLElement, event: KeyboardEvent): boolean {
  if (!NAV_KEYS.includes(event.key)) return false
  const target = event.target as HTMLElement | null
  const card = target?.closest<HTMLElement>('[data-kb-card]')
  if (!card || !root.contains(card)) return false
  const column = card.closest<HTMLElement>('[data-kb-col]')
  if (!column) return false

  const cards = Array.from(column.querySelectorAll<HTMLElement>('[data-kb-card]'))
  const index = cards.indexOf(card)
  let next: HTMLElement | undefined

  if (event.key === 'Home' || event.key === 'End') {
    next = event.key === 'Home' ? cards[0] : cards[cards.length - 1]
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    next = cards[index + (event.key === 'ArrowDown' ? 1 : -1)]
  } else {
    const columns = Array.from(root.querySelectorAll<HTMLElement>('[data-kb-col]'))
    const adjacent = columns[columns.indexOf(column) + (event.key === 'ArrowRight' ? 1 : -1)]
    next = adjacent?.querySelector<HTMLElement>('[data-kb-card]') ?? undefined
  }

  if (!next) return false
  event.preventDefault()
  next.focus()
  return true
}

/**
 * Feedback Pool i18n
 */

export type Locale = 'zh' | 'en'

const messages = {
  zh: {
    // Pool
    title: '需求反馈池',
    subtitle: '提交您的需求、Bug 或建议，社区投票决定优先级',
    list: '列表',
    board: '看板',
    filterStatus: '状态',
    filterType: '类型',
    filterSort: '排序',
    sortVotes: '最多投票',
    sortNewest: '最新发布',
    search: '搜索标题或内容...',
    empty: '暂无反馈，来提交第一个吧！',
    loading: '加载中...',
    comments: '评论',
    noComments: '暂无评论',
    back: '返回列表',
    statusHistory: '状态历史',
    submitComment: '发表评论',
    commentPlaceholder: '写下您的评论...',
    nickname: '昵称',
    // Form
    submitTitle: '提交反馈',
    submitNew: '新增反馈',
    collapse: '收起',
    formType: '类型',
    formTitle: '标题',
    formTitlePlaceholder: '请简要描述您的需求或问题',
    formDesc: '描述',
    formDescPlaceholder: '请详细描述您的问题或需求场景',
    formCategory: '功能分类',
    formName: '昵称（选填）',
    formNamePlaceholder: '怎么称呼您？',
    formEmail: '邮箱（选填）',
    formEmailPlaceholder: '有进展时通知您（选填，不会公开）',
    formTip: '昵称和邮箱均为选填。填写邮箱后，当反馈状态有更新时，我们会邮件通知您。',
    submitBtn: '提交反馈',
    submitting: '提交中...',
    submitSuccess: '提交成功！您的反馈编号是',
    // Stats
    totalPosts: '共 {n} 条反馈',
    totalVotes: '共 {n} 票',
    // Board
    noItems: '暂无',
    closed: '已关闭',
    // Types
    'type.feature': '功能需求',
    'type.bug': 'Bug',
    'type.improvement': '体验优化',
    'type.question': '疑问咨询',
    // Status
    'status.1': '待审',
    'status.2': '评估中',
    'status.3': '已规划',
    'status.4': '进行中',
    'status.5': '已完成',
    'status.6': '已拒绝',
    'status.7': '重复',
    // Categories
    'cat.wrapper': 'Wrapper 预览',
    'cat.xml': 'XML 预览',
    'cat.annotation': '注解预览',
    'cat.sql-to-java': 'SQL 转 Java',
    'cat.sql-log': 'SQL 日志',
    'cat.batch': '批量操作',
    'cat.completion': '代码补全',
    'cat.other': '其他',
  },
  en: {
    // Pool
    title: 'Feedback Pool',
    subtitle: 'Submit your feature requests, bugs, or suggestions. Community votes decide priority.',
    list: 'List',
    board: 'Board',
    filterStatus: 'Status',
    filterType: 'Type',
    filterSort: 'Sort',
    sortVotes: 'Most Votes',
    sortNewest: 'Newest',
    search: 'Search title or content...',
    empty: 'No feedback yet. Be the first to submit!',
    loading: 'Loading...',
    comments: 'Comments',
    noComments: 'No comments yet',
    back: 'Back to list',
    statusHistory: 'Status History',
    submitComment: 'Post Comment',
    commentPlaceholder: 'Write your comment...',
    nickname: 'Name',
    // Form
    submitTitle: 'Submit Feedback',
    submitNew: 'New Feedback',
    collapse: 'Close',
    formType: 'Type',
    formTitle: 'Title',
    formTitlePlaceholder: 'Briefly describe your request or issue',
    formDesc: 'Description',
    formDescPlaceholder: 'Describe your issue or use case in detail',
    formCategory: 'Category',
    formName: 'Name (optional)',
    formNamePlaceholder: 'Your name',
    formEmail: 'Email (optional)',
    formEmailPlaceholder: 'Notify you on progress',
    formTip: 'Name and email are optional. If you provide an email, we will notify you when the status changes.',
    submitBtn: 'Submit',
    submitting: 'Submitting...',
    submitSuccess: 'Submitted! Your feedback ID is',
    // Stats
    totalPosts: '{n} feedback items',
    totalVotes: '{n} votes',
    // Board
    noItems: 'None',
    closed: 'Closed',
    // Types
    'type.feature': 'Feature',
    'type.bug': 'Bug',
    'type.improvement': 'Improvement',
    'type.question': 'Question',
    // Status
    'status.1': 'Submitted',
    'status.2': 'Under Review',
    'status.3': 'Planned',
    'status.4': 'In Progress',
    'status.5': 'Completed',
    'status.6': 'Declined',
    'status.7': 'Duplicate',
    // Categories
    'cat.wrapper': 'Wrapper Preview',
    'cat.xml': 'XML Preview',
    'cat.annotation': 'Annotation Preview',
    'cat.sql-to-java': 'SQL to Java',
    'cat.sql-log': 'SQL Log',
    'cat.batch': 'Batch Operations',
    'cat.completion': 'Code Completion',
    'cat.other': 'Other',
  },
} as const

export type MessageKey = keyof typeof messages.zh

export function t(key: MessageKey, locale: Locale, params?: Record<string, string | number>): string {
  let text = messages[locale][key] || messages.en[key] || key
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}

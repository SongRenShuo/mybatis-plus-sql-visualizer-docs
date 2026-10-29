/**
 * 中英首页「功能宣传点」唯一数据源
 * - coolCards:   中文首页特性卡片（index.md → CoolHome → FeaturesGrid 渲染）
 * - enCoolCards: 英文首页特性卡片（en/index.md → CoolHome → FeaturesGrid 渲染）
 *                与 coolCards 逐项对应（同 icon / color / 主题），只换语言，
 *                保证中英首页的卡片区结构一致
 * 以后增删改宣传点文案，只改这个文件。
 *
 * 卡片数 2026-10-10 由 6 张增至 9 张（用户口径）：补「慢查询与性能建议」
 * 「源码级定位」「SQL → Java 反向转换」三项此前只散落在功能页的能力域。
 *
 * 2026-10-27 卡片正文由整段 description 改为一句话 claim + 三个能力点：
 * 原描述长短差到 41~152 字（英文 130~364 字符），卡片高度在 249/305/305 与
 * 305/361/442 之间跳；改成「一行主张 + 等长能力点」后高度自然齐平，也顺手把
 * 内部工程术语（单通道解析开销减半、同结构 3 条阈值）换成了用户视角的说法。
 * claim 控制在 20 字以内（英文 55 字符以内），能力点 2~12 字，各卡三项；
 * 英文标题也控在一行内（原「Slow queries & performance advice」在 363px 卡宽折行，
 * 会把该行三张卡顶高 25px）。
 *
 * 能力点的渲染方式是顿号分隔的纯文本，不是胶囊块——用户对「AI 味」的判定里，
 * 自创胶囊/勾选块明确算一条（见记忆 no-ai-flavor-ui）。
 *
 * 一处口径订正：Wrapper 预览图标走 LineMarkerProvider 逐文件按需判定，没有
 * 「扫描整个项目」这一步，卡片里不能写成全项目扫描。
 * （另：「${} 直替执行前二次确认」经核对为真——SqlPreviewPanelExecution.confirmDollarRawSegments
 * 对含 raw 段的语句执行前弹 Yes/No，与 DML 二次确认同款形态；原描述这条没问题。）
 */

// 中文首页 9 张卡片：icon 对应 FeaturesGrid 里的 svg 图标，color 对应配色 class，
// link 指向功能页里讲这条能力的位置（锚点均已按 dist 实际 id 核对）；整卡可点。
export const coolCards = [
  {
    icon: 'code',
    color: 'purple',
    title: '多框架支持',
    claim: '项目里怎么写 SQL，这里都能预览',
    tags: ['MPJ 联表', 'JPA / Hibernate', 'XML / 注解'],
    link: '/guide/compatibility#框架支持范围',
  },
  {
    icon: 'gauge',
    color: 'blue',
    title: '极致性能',
    claim: '点开就有结果，不用等项目启动',
    tags: ['静态解析', '大日志不卡', '报错就地提示'],
    link: '/features/wrapper-preview#触发方式',
  },
  {
    icon: 'bulb',
    color: 'green',
    title: '智能识别',
    claim: 'Wrapper 链行首自动出现预览图标',
    tags: ['零配置', '类型自动识别', '随编辑即时更新'],
    link: '/features/wrapper-preview#支持的-wrapper-类型',
  },
  {
    icon: 'cog',
    color: 'yellow',
    title: '广泛集成',
    claim: '从写代码到跑起来，每个环节都接上',
    tags: ['CRUD 一键生成', '真实 EXPLAIN', 'MCP 十一工具'],
    link: '/features/crud-sql',
  },
  {
    icon: 'shield',
    color: 'orange',
    title: '安全防护',
    claim: '把误操作挡在执行之前',
    tags: ['无 WHERE 警示', '逻辑删除注入', '直替执行确认'],
    link: '/features/wrapper-preview#安全警示',
  },
  {
    icon: 'history',
    color: 'indigo',
    title: '历史记录',
    claim: '每次预览和转换都留档，随时翻回来',
    tags: ['自动保存', 'SQL 高亮 + 耗时', '两级导航'],
    link: '/features/sql-log#sql-高亮与耗时显示',
  },
  {
    icon: 'timer',
    color: 'teal',
    title: '慢查询与性能建议',
    claim: '最慢的那几条，一眼就看见',
    tags: ['慢查询标红', 'N+1 同结构聚类', '静态性能建议'],
    link: '/features/sql-log#慢查询与性能建议',
  },
  {
    icon: 'target',
    color: 'rose',
    title: '源码级定位',
    claim: '从日志直接跳到发出这条 SQL 的代码行',
    tags: ['真实调用栈', '逐帧跳转', '悬停看全栈'],
    link: '/features/sql-log#从调用栈跳转',
  },
  {
    icon: 'swap',
    color: 'fuchsia',
    title: 'SQL → Java 反向转换',
    claim: '粘一段 SQL，生成能直接用的 Wrapper',
    tags: ['四种形态', '增删改查 + JOIN', '默认形态可配'],
    link: '/features/sql-to-java',
  },
]

// 英文首页 9 张卡片：与 coolCards 逐项对应（同 icon / color / 主题），只换语言
export const enCoolCards = [
  {
    icon: 'code',
    color: 'purple',
    title: 'Multi-framework support',
    claim: 'Preview every SQL style your project uses',
    tags: ['MPJ joins', 'JPA / Hibernate', 'XML / Annotations'],
    link: '/en/guide/compatibility#framework-coverage',
  },
  {
    icon: 'gauge',
    color: 'blue',
    title: 'Performance',
    claim: 'Results on click, no project startup',
    tags: ['Static parsing', 'Smooth logs', 'In-panel errors'],
    link: '/en/features/wrapper-preview#trigger-methods',
  },
  {
    icon: 'bulb',
    color: 'green',
    title: 'Smart detection',
    claim: 'Preview icons appear on Wrapper chains',
    tags: ['Zero config', 'Types resolved', 'Live updates'],
    link: '/en/features/wrapper-preview#supported-wrapper-types',
  },
  {
    icon: 'cog',
    color: 'yellow',
    title: 'Broad integration',
    claim: 'Wired in from the first line to the running app',
    tags: ['CRUD generation', 'Real EXPLAIN', '11 MCP tools'],
    link: '/en/features/crud-sql',
  },
  {
    icon: 'shield',
    color: 'orange',
    title: 'Safety',
    claim: 'Mistakes stopped before execution',
    tags: ['No-WHERE warnings', 'Logic delete', '${} confirm'],
    link: '/en/features/wrapper-preview#safety-warning',
  },
  {
    icon: 'history',
    color: 'indigo',
    title: 'History',
    claim: 'Every preview and conversion kept on record',
    tags: ['Auto-saved', 'SQL highlight', 'Two-level nav'],
    link: '/en/features/sql-log#sql-highlighting-execution-time',
  },
  {
    icon: 'timer',
    color: 'teal',
    title: 'Slow queries & advice',
    claim: 'The slowest statements, right at the top',
    tags: ['Slow flagged', 'N+1 clusters', 'Static advice'],
    link: '/en/features/sql-log#slow-queries-performance-advice',
  },
  {
    icon: 'target',
    color: 'rose',
    title: 'Source-level navigation',
    claim: 'From a log entry to the line that ran it',
    tags: ['Real call stack', 'Frame jumps', 'Full stack on hover'],
    link: '/en/features/sql-log#jump-from-the-call-stack',
  },
  {
    icon: 'swap',
    color: 'fuchsia',
    title: 'SQL → Java reverse conversion',
    claim: 'Paste SQL, get wrapper code you can run',
    tags: ['Four forms', 'CRUD + joins', 'Configurable default'],
    link: '/en/features/sql-to-java',
  },
]

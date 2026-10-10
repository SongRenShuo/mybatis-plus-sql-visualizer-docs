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
 */

// 中文首页 9 张卡片：icon 对应 FeaturesGrid 里的 svg 图标，color 对应配色 class
export const coolCards = [
  {
    icon: 'code',
    color: 'purple',
    title: '多框架支持',
    description: 'MyBatis-Plus / MPJ 联表 / JPA·Hibernate / XML Mapper / 注解 SQL，xbatis、Easy-Query、Querydsl 等更多 ORM 持续扩展。',
  },
  {
    icon: 'gauge',
    color: 'blue',
    title: '极致性能',
    description: '静态解析，轻量级设计。预览即点即出，捕捉开启时控制台日志单通道解析开销减半；执行失败面板内报错不打断、大日志流式渲染不卡顿，长时间开启依然流畅。',
  },
  {
    icon: 'bulb',
    color: 'green',
    title: '智能识别',
    description: '自动扫描项目中的 Wrapper 端点，智能解析参数类型。无需手动配置，开箱即用。',
  },
  {
    icon: 'cog',
    color: 'yellow',
    title: '广泛集成',
    description: 'XML / 注解 / HQL·JPQL / .hbm.xml 命名查询 / SQL 日志追踪 / 批量操作之外，还支持实体类与数据库表右键生成 CRUD SQL、真实 EXPLAIN 执行计划、项目启动自动监听，以及面向 AI Agent 的 MCP Server 十一工具（IDEA 2025.2+）。',
  },
  {
    icon: 'shield',
    color: 'orange',
    title: '安全防护',
    description: 'UPDATE / DELETE 无 WHERE 条件红色警示并列出无界写发现，${} 直替执行前二次确认，执行超时护栏兜底，逻辑删除与乐观锁条件自动注入，远离全表误操作。',
  },
  {
    icon: 'history',
    color: 'indigo',
    title: '历史记录',
    description: '自动保存所有预览历史和反向转换结果，历史面板两级导航、SQL 带高亮与耗时，可精确跳转回源码。让每一次调试都有迹可循。',
  },
  {
    icon: 'timer',
    color: 'teal',
    title: '慢查询与性能建议',
    description: '耗时达到慢查询阈值（默认 1000ms，可配）的条目整行标红并计入慢查询计数，按耗时降序一眼看到最慢的几条；预览面板给出静态性能建议（警告 / 建议两级），同结构语句达到 3 条即出「同结构 N 条」徽章，N+1 式循环调用一眼可见。',
  },
  {
    icon: 'target',
    color: 'rose',
    title: '源码级定位',
    description: '右键日志条目「跳转到源码」，源码位置取自应用执行时的真实调用栈，直达执行这条 SQL 的代码行；条目还带完整调用栈快照，悬停即出 Frames 风格弹层，点任意一帧跳到该帧源码。',
  },
  {
    icon: 'swap',
    color: 'fuchsia',
    title: 'SQL → Java 反向转换',
    description: '选中 SQL 一键生成可编译的 MyBatis-Plus 代码，四种 Wrapper 形态任选（QueryWrapper / Lambda / Wrappers / MPJ），增删改查与多表 JOIN 全覆盖，默认形态可在设置页配置。',
  },
]

// 英文首页 9 张卡片：与 coolCards 逐项对应（同 icon / color / 主题），只换语言
export const enCoolCards = [
  {
    icon: 'code',
    color: 'purple',
    title: 'Multi-framework support',
    description:
      'MyBatis-Plus / MPJ joins / JPA·Hibernate / XML mapper / annotation SQL, with xbatis, Easy-Query, Querydsl and more ORMs following.',
  },
  {
    icon: 'gauge',
    color: 'blue',
    title: 'Performance',
    description:
      'Static parsing, lightweight by design. Previews appear instantly, and enabling capture halves console log parsing overhead. Failures report inside the panel without interrupting you, and large log streams render without stutter.',
  },
  {
    icon: 'bulb',
    color: 'green',
    title: 'Smart detection',
    description:
      'Wrapper endpoints in your project are scanned automatically and parameter types resolved. Nothing to configure, works out of the box.',
  },
  {
    icon: 'cog',
    color: 'yellow',
    title: 'Broad integration',
    description:
      'Beyond XML / annotation / HQL·JPQL / .hbm.xml named queries / SQL log tracking / batch operations: CRUD SQL generation from entity classes and database tables, real EXPLAIN plans, automatic listener on project start, and eleven MCP Server tools for AI agents (IDEA 2025.2+).',
  },
  {
    icon: 'shield',
    color: 'orange',
    title: 'Safety',
    description:
      'Red warnings on UPDATE / DELETE without a WHERE clause with unbounded-write findings listed, a second confirmation before ${} substitution, an execution timeout guard, and logic-delete plus optimistic-lock conditions injected automatically.',
  },
  {
    icon: 'history',
    color: 'indigo',
    title: 'History',
    description:
      'Every preview and reverse conversion is saved. The history panel offers two-level navigation, SQL with highlighting and durations, and precise jumps back to source.',
  },
  {
    icon: 'timer',
    color: 'teal',
    title: 'Slow queries & performance advice',
    description:
      'Entries past the slow-query threshold (1000 ms by default, configurable) are flagged red and counted, and sorting by duration brings the slowest ones straight to the top. The preview panel adds static performance advice at warning / info levels, and once three same-shape statements appear a "same shape × N" badge shows up — N+1 style loops stand out immediately.',
  },
  {
    icon: 'target',
    color: 'rose',
    title: 'Source-level navigation',
    description:
      'Right-click a log entry to jump to source: the location comes from the real call stack, landing on the exact line that executed the SQL. Entries also carry a full call-stack snapshot — hover for a debugger-style Frames popup and click any frame to jump to that frame.',
  },
  {
    icon: 'swap',
    color: 'fuchsia',
    title: 'SQL → Java reverse conversion',
    description:
      'Select SQL and generate compilable MyBatis-Plus code in one click, in four wrapper forms (QueryWrapper / Lambda / Wrappers / MPJ), covering CRUD and multi-table joins, with a configurable default form.',
  },
]

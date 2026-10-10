/**
 * 中英首页「功能宣传点」唯一数据源
 * - coolCards:       中文首页特性卡片（index.md → CoolHome → FeaturesGrid 渲染）
 * - enCards:         英文首页特性卡片（en/index.md 顶部卡片，EnHomeFeatures 渲染）
 * - enFeatureMatrix: 英文首页 Feature Matrix 三组表格（EnFeatureMatrix 渲染）
 * 以后增删改宣传点文案 / 链接 / 表格行，只改这个文件。
 */

// 中文首页 6 张卡片：icon 对应 FeaturesGrid 里的 svg 图标，color 对应配色 class
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
]

// 英文首页 6 张卡片：icon 为 emoji，link 为站内路径（原 en/index.md frontmatter features）
export const enCards = [
  {
    icon: '⚡',
    title: 'Wrapper → SQL Live Preview',
    details: 'Full static parsing of LambdaQueryWrapper / MPJLambdaWrapper without launching the project. Toggle dynamic conditions, fill parameters, 9 database dialects',
    link: '/en/features/wrapper-preview',
  },
  {
    icon: '📄',
    title: 'XML / Annotation Dynamic SQL Preview',
    details: 'mapper XML dynamic tags (if / choose / foreach) rendered per MyBatis semantics, cross-namespace `include` resolved across files. @Select / @Update annotations fully supported with OGNL toggles',
    link: '/en/features/xml-preview',
  },
  {
    icon: '🔗',
    title: 'MPJ JOIN Reverse Parsing',
    details: 'Complete MPJLambdaWrapper support — 8 JOIN forms, selectAll / selectAs / union, main-table logic-delete auto injection',
    link: '/en/features/wrapper-preview',
  },
  {
    icon: '🔄',
    title: 'SQL → Java Reverse Conversion',
    details: 'One-click SQL to compilable MyBatis-Plus code (QueryWrapper / Lambda / Wrappers / MPJ). Supports CRUD and multi-table JOIN',
    link: '/en/features/sql-to-java',
  },
  {
    icon: '🪵',
    title: 'Console Log One-Click Restore',
    details: 'Enhanced capture as the default channel — real parameters, exact durations and affected rows with no SQL logging setup; console Preparing / Parameters logs restored in per-thread buckets',
    link: '/en/features/sql-log',
  },
  {
    icon: '📊',
    title: 'Batch Operation Panel',
    details: 'save / updateBatchById SQL expanded by column with per-column toggles. saveOrUpdate conflict clause rendered per dialect (MySQL ON DUPLICATE KEY / PG ON CONFLICT); multi-statement execution with a candidate checklist',
    link: '/en/features/batch-operation',
  },
]

// 英文首页 Feature Matrix：三组（组标题 + 锚点 id + 表头 + 行）
// 单元格里的 `反引号` 片段由 EnFeatureMatrix 渲染为 <code> 行内代码，
// 其余内容按纯文本渲染（经 Vue 插值自动转义，`<select>` 等写法安全）。
export const enFeatureMatrix = [
  {
    title: 'SQL Preview',
    anchor: 'sql-preview',
    headers: ['Feature', 'Trigger', 'Scope'],
    rows: [
      [
        'Wrapper → SQL',
        'gutter icon (left-click previews, right-click for recent executions) / right-click / `Alt+Shift+Q`',
        '`LambdaQueryWrapper` / `LambdaUpdateWrapper` / `LambdaDeleteWrapper` / `QueryWrapper` / `MPJLambdaWrapper` JOIN / `service.lambdaQuery()` chains',
      ],
      [
        'XML Dynamic SQL',
        'gutter icon on `<select>` etc.',
        '`if` / `choose` / `where` / `set` / `foreach` / `bind` / `sql`+`include` (cross-namespace supported); OGNL toggles; out-of-support test expressions flagged inline',
      ],
      [
        'Annotation SQL',
        'gutter icon on annotation',
        '`@Select` / `@Update` / `@Delete` / `@Insert` (incl. `<script>` & Provider)',
      ],
      [
        'JPA / Hibernate',
        'gutter icon on method / annotation',
        'derived queries, Repository CRUD write paths, `@Query` / `@NamedQuery` (JPQL, `@Modifying`), `.hbm.xml` named queries (`<query>` / `<sql-query>`), Criteria chains, Specification, QueryByExample, Pageable / Sort',
      ],
      [
        'Other ORM chains',
        'gutter icon on chain call',
        'xbatis / Easy-Query / MyBatis Dynamic SQL / Querydsl / Spring Data JDBC·R2DBC (first batch, MVP)',
      ],
      [
        'Parameter Replace',
        'panel input',
        '`?` placeholder → actual value; LIKE auto `%`; type-aware quoting; type-category placeholders (number / temporal / collection / object) with inline warnings',
      ],
    ],
  },
  {
    title: 'SQL Log & Reverse',
    anchor: 'sql-log-reverse',
    headers: ['Feature', 'Trigger', 'Description'],
    rows: [
      [
        'Auto Capture',
        'sidebar "Capture" button; auto-starts on project open / run with the matching setting enabled',
        'Enhanced capture (bytecode instrumentation) as the default channel — one consent dialog on first project run, then real parameters, exact durations, affected rows, error messages and true source locations with no SQL logging setup; startup-period SQL captured via a premain agent (no dynamic-attach warning); console `Preparing:` / `Parameters:` logs restored in per-thread buckets; `#N` per-session entry numbers; log-line original timestamps with a log/capture source switch',
      ],
      [
        'Focus Tabs',
        'right-click a log entry → "Focus by method" / "Focus by request"',
        'Filter the list to one calling method (line-range approximation, Kotlin callers not yet supported) or one web request; tabs stack, dedupe, capped at 8',
      ],
      [
        'Jump to Mapper XML',
        'right-click a log entry',
        'Entries carrying a mapper statement id jump straight to the statement node in the matching mapper XML; falls back to "Jump to Java" — same entry points on log and history views',
      ],
      [
        'Click Preview',
        'single-click a log entry / double-click for the full dialog',
        'Lightweight popup: syntax-highlighted SQL, editable inline, copy button with check-mark feedback; consistent across log list and history views',
      ],
      [
        'Log → SQL',
        'sidebar "Log → SQL" tab',
        'Paste entire log for batch restore; multi-statement auto-split',
      ],
      [
        'SQL → Java',
        'right-click / `Alt+Shift+J` / sidebar',
        '4 forms (QueryWrapper / Lambda / Wrappers / MPJ); configurable default',
      ],
      [
        'Rollback SQL',
        'preview panel "Rollback" button',
        'Generates the reverse statement for the current INSERT / UPDATE / DELETE — DELETE by primary key, restore original values, or re-insert by WHERE — shown in a dialog with one-click copy',
      ],
    ],
  },
  {
    title: 'Other',
    anchor: 'other',
    headers: ['Feature', 'Description'],
    rows: [
      [
        'Real EXPLAIN Plan',
        'Preview panel button wraps SQL as EXPLAIN per dialect and runs it on the native database console (MySQL / PostgreSQL / KingBase / DM verified; Oracle / SQL Server gracefully declined)',
      ],
      [
        'JOIN Diagram',
        'IDEA-native Diagrams rendering (zoom / auto layout / fold / export), auto fallback to built-in renderer',
      ],
      [
        'SQL Completion',
        'panel + mapper XML/annotation `Ctrl+Space`: table/column names, `#{}` params, XML tags',
      ],
      [
        'Logic Delete Injection',
        '`@TableLogic` entity auto appends `AND deleted = value` (configurable)',
      ],
      [
        'UPDATE/DELETE Warning',
        'Red warning when no WHERE clause — unbounded-write findings listed in the execution confirm dialog',
      ],
      [
        'MCP Server Tools',
        'Eleven read-only SQL tools for external AI agents (Claude Code / Cursor / AI Assistant / Codex) via the built-in MCP Server — per-tool gating in settings, instant effect; requires IDEA 2025.2+',
      ],
      [
        'CRUD SQL Generation',
        'Right-click an entity class (editor / project view) or a Database table node → "Generate CRUD SQL": pick INSERT / UPDATE / SELECT / DELETE in a filterable native popup and it opens in the preview — auto-increment keys unchecked by default, `@Version` column handled, logic-delete variant on the entity side (Community: entity-side entries only)',
      ],
      [
        'No-Restart Update',
        'One-click download & install hot-swaps the new version into the running IDE instantly — no restart needed; auto-fallback to the restart script where dynamic install isn\'t available',
      ],
      [
        'Works Fully Offline',
        'All core features run locally with zero network requests — no telemetry, no account or license checks, your code and SQL never leave the machine; intranet-ready with a private update channel',
      ],
    ],
  },
]

/**
 * 首页全部文案的唯一数据源（中英双语）。
 *
 * 背景：英文首页原本是 `layout: home` + VitePress 默认 hero + EnHomeFeatures +
 * EnFeatureMatrix 的另一套实现，与中文的 CoolHome 九组件树结构完全不同，两边的
 * 区块、卡片主题、带图模块都对不上。现在英文首页改挂同一棵 CoolHome 组件树，
 * 差异只留在文案层，所以文案集中到这里，组件按当前 locale 取值。
 * （旧英文首页的两个组件与它们的数据已于 2026-10-10 删除；那张 Feature Matrix
 * 的能力面在 en/guide/comparison.md 的对比表里有覆盖。）
 *
 * 取 locale 用 VitePress 的 `useData().lang`（root=zh-CN / en=en-US），
 * 不能用 window.location：SSR 阶段没有 window，用它会产出中英不一致的
 * 首屏 HTML 并触发 hydration 失配。
 *
 * 新增文案时的约定：zh / en 两份必须同时补齐，缺键会退回中文并在开发期直接暴露。
 */

export const homeContent = {
  zh: {
    nav: {
      links: [
        { text: '功能详解', href: '/features/wrapper-preview' },
        { text: '使用指南', href: '/guide/getting-started' },
        { text: '需求池', href: '/about/feedback' },
        { text: '关于', href: '/about/' },
      ],
      download: '免费下载',
      langLabel: '简体中文',
      langTitle: '语言',
      langMenuLabel: '切换语言',
      langs: [
        { text: '简体中文', href: '/', active: true },
        { text: 'English', href: '/en/' },
      ],
      themeToLight: '切换到亮色',
      themeToDark: '切换到暗色',
      themeAriaLight: 'Switch to light mode',
      themeAriaDark: 'Switch to dark mode',
      giteeTitle: 'Gitee 源码仓库',
      githubTitle: 'GitHub 镜像仓库',
      menuLabel: '导航菜单',
    },

    hero: {
      titleLine1: '服务未启，',
      titleLine2: 'SQL 先知',
      description:
        'IntelliJ IDEA 插件：写代码时就看见最终 SQL——Wrapper 链、XML/注解/HQL 动态 SQL（含 MPJ 联表 JOIN）实时预览；跑起来后真实参数与耗时自动捕获，慢查询标红、EXPLAIN 看计划、一键跳回源码；SQL 也能反向转成 Java 代码。不启服务、不翻日志、不手拼参数。',
      install: '在 Marketplace 中安装',
      offline: '下载离线包',
      highlights: ['更新无需重启 IDEA', '内网环境离线可用', '无遥测 · 代码不出本机'],
      statLabels: ['最新版本', 'IDEA 支持', '开源协议'],
      codeJavaLabel: 'UserService.java',
      codeSqlLabel: '实时预览 · 生成的 SQL',
    },

    socialProof: {
      caption: '支持多种 SQL 调试场景',
      items: [
        'MyBatis-Plus',
        'MPJ 联表',
        'Spring Boot',
        'XML Mapper',
        '注解 SQL',
        'SQL 日志',
        '批量操作',
        'SQL 补全',
      ],
    },

    capability: {
      eyebrow: 'Core Capabilities',
      title: '大幅提升您的 SQL 调试效率',
      description:
        '更简单的工具，更清晰的逻辑。旨在优化每一个研发细节，让您在更短的时间内成就更多',
      items: [
        {
          badge: 'Wrapper 预览',
          title: 'Wrapper → SQL 实时预览',
          description:
            'LambdaQueryWrapper / MPJLambdaWrapper 等全类型静态解析，无需启动项目，直接预览最终 SQL',
          points: [
            { title: 'Lambda 链静态解析', description: '无需运行项目即可预览完整 SQL' },
            { title: '动态条件勾选', description: 'if / choose / where 等标签按需渲染' },
            { title: '11 种方言分页', description: 'MySQL / PG / Oracle 等全方言分页语法' },
          ],
        },
        {
          badge: '日志还原',
          title: '控制台日志一键还原',
          description:
            '增强捕获为默认通道，无需应用开启 SQL 日志即得真实参数与耗时；控制台日志自动捕获还原',
          points: [
            {
              title: '增强捕获默认通道',
              description: '开箱即采、无需逐次确认，真实参数、精确耗时、影响行数开箱即得',
            },
            {
              title: '并发日志分桶还原',
              description: '自动识别 Preparing / Parameters，多线程交错按线程分桶，参数不错挂',
            },
            {
              title: '目标库角标',
              description: '条目标注 [MySQL]、[DM（达梦）] 等，11 种方言与 HSQL / GBASE 全识别',
            },
          ],
        },
        {
          badge: '日志溯源',
          title: 'SQL 溯源 · 日志直达源码',
          description:
            '执行日志一键回到发出 SQL 的那一行；预览面板的调用栈逐帧列出，点哪一帧跳哪一帧。',
          points: [
            { title: '精确落点', description: '日志条目右键即跳到执行 SQL 的代码行，真实调用栈定位不做表名猜测' },
            { title: '调用栈逐帧', description: '预览面板悬停展开完整调用链，帧数可配（12~64），基础设施帧自动跳过' },
            { title: '两种通道都能用', description: '增强捕获免配置直达；控制台通道配拦截器后同样精确' },
          ],
        },
        {
          badge: '反向转换',
          title: 'SQL → Java 反向转换',
          description: '选中 SQL 一键生成可编译的 MyBatis-Plus 代码，支持四形态输出',
          points: [
            { title: '四形态输出', description: 'QueryWrapper / Lambda / Wrappers / MPJ' },
            { title: '增删改查全覆盖', description: 'SELECT / INSERT / UPDATE / DELETE 全支持' },
            { title: '多表 JOIN', description: '联表查询自动生成 MPJLambdaWrapper' },
          ],
        },
        {
          badge: '智能生成',
          title: 'CRUD SQL 一键生成',
          description:
            '实体类 / 数据库表右键即出 SELECT / INSERT / UPDATE / DELETE 候选，选定进预览直接编辑、复制',
          points: [
            { title: '三入口覆盖', description: '实体类文件、项目视图节点、Database 表节点（Ultimate）' },
            { title: '候选浮层秒选', description: '打字即过滤，Enter / 双击选定，ESC 关闭' },
            {
              title: '语义对齐 MP 运行时',
              description: '乐观锁进 WHERE、自增主键默认不勾、逻辑删除出专用 DELETE 变体',
            },
          ],
        },
        {
          badge: '多框架支持',
          title: 'XML / 注解 / MPJ 全覆盖',
          description: 'mapper XML 全动态标签按 MyBatis 语义渲染，注解 SQL 同样支持',
          points: [
            { title: 'XML 动态标签', description: 'if / choose / foreach / bind 等全支持' },
            { title: '注解 SQL', description: '@Select / @Update / @Delete / @Insert' },
            { title: 'OGNL 表达式', description: '面板勾选动态条件，实时预览结果' },
          ],
        },
        {
          badge: '跨生态',
          title: 'JPA / Hibernate SQL 预览',
          description:
            'Repository 派生方法、JPQL / HQL、Criteria 链静态解析出 SQL，不启动 Spring 容器、不连数据库',
          points: [
            { title: '派生方法解析', description: 'findByXxx 命名规则全支持，gutter 图标点击即出' },
            { title: '@Query 全兼容', description: 'JPQL / 原生 SQL / @Modifying DML 直接预览' },
            { title: 'Criteria 链与 .hbm.xml', description: '静态解析，不依赖容器与数据库' },
          ],
        },
        {
          badge: 'AI Agent 集成',
          title: 'MCP Server：给 AI Agent 的 SQL 工具',
          description:
            'Claude Code / Cursor / AI Assistant / Codex 经 IDEA 内置 MCP Server 直连插件能力，IDE 里照常写代码，agent 在旁边干活',
          points: [
            {
              title: '确定性证据',
              description: '渲染链真实产出的可执行 SQL 本体交给 agent，不是置信度评分',
            },
            {
              title: '十一个只读工具',
              description:
                '渲染还原、表结构、EXPLAIN、写风险核查、回滚预案、性能建议、历史检索（IDEA 2025.2+）',
            },
            {
              title: '可控可审计',
              description: '设置页逐工具启停即时生效，SELECT 白名单拦截 + 每次调用审计留痕',
            },
          ],
        },
      ],
    },

    preview: {
      eyebrow: 'Live Preview',
      badge: 'SQL 预览',
      titleLine1: '强大的 SQL 预览能力',
      titleLine2: '多方言、多场景全覆盖',
      description:
        '支持 11 种数据库方言分页渲染，参数自动替换为实际值，LIKE 自动拼百分号，动态条件面板勾选实时预览。',
      points: [
        { title: '多方言支持', description: 'MySQL / PostgreSQL / Oracle / SQLServer 等 11 种方言分页语法' },
        { title: '参数自动替换', description: '? 占位符替换为实际值，按字段类型自动加引号' },
      ],
      link: '查看预览能力',
    },

    features: {
      eyebrow: 'More Features',
      badge: '更多特性',
      title: '我们为您考虑周全',
      description: 'SQL Visualizer 涵盖了 SQL 调试所需的一切功能。',
    },

    welfare: {
      eyebrow: 'Open Source',
      tag: '开源免费 · 永久使用',
      titleLine1: '完全免费',
      titleLine2: '基于 Apache-2.0 协议',
      description: 'SQL Visualizer 所有功能永久免费使用。无需注册、无需登录，安装即用。',
      items: ['所有功能完全免费', '开源透明，代码可查', '持续更新，社区驱动', '无需注册，开箱即用'],
      giteeCaption: '点击 · 前往源码仓库',
      githubCaption: 'GitHub 镜像',
    },

    testimonials: {
      eyebrow: 'Testimonials',
      badge: '用户评价',
      titlePrefix: '深受 ',
      titleAccent: '开发团队信赖',
      subtitle: '听听那些每天使用 SQL Visualizer 的工程师们怎么说。',
      items: [
        {
          quote:
            '接手的项目一半是 MP 一半是 JdbcTemplate 的字符串 SQL，之前想看真实执行的 SQL 只能跑一遍再翻日志。现在两种写法行首都有图标，点一下直接出 SQL，StringBuilder 拼的也能聚合，上周排查一个分页翻错的问题没启动项目就定位了。',
          name: '夜航船',
          role: 'Java 开发工程师',
          initials: '夜',
          color: '#6366f1',
        },
        {
          quote:
            '我们组维护一个 Hibernate 老项目，实体还挂在 .hbm.xml 上，Criteria 查询根本看不出最后跑的是什么语句。这插件不用启容器就能把 HQL 和 Criteria 链还原成 SQL，hbm 里的命名查询也能认，改一版查询不用再拉同事帮忙跑项目了。',
          name: '不写注释的人',
          role: '后端开发',
          initials: '不',
          color: '#0ea5e9',
        },
        {
          quote:
            'SQL 日志窗口现在是开项目自动抓，参数拼好还能点回源码位置，慢查询直接标红。上次压测就靠它挑出两条没走索引的语句。更新也免得重启 IDE，点一下装完接着用，比很多插件都省心。',
          name: '半糖不加冰',
          role: '全栈开发工程师',
          initials: '半',
          color: '#10b981',
        },
      ],
    },

    pricing: {
      eyebrow: 'Pricing',
      title: '完全免费',
      description: '所有功能永久免费使用，无需注册，无需登录',
      plan: '免费版',
      price: '¥0',
      period: '永久免费',
      features: [
        'Wrapper → SQL 实时预览',
        'XML / 注解动态 SQL 预览',
        'MPJ 联表 JOIN 反向解析',
        'SQL → Java 反向转换',
        '控制台日志一键还原',
        '批量操作参数面板',
        'SQL 代码补全',
        '逻辑删除自动注入',
        '11 种数据库方言支持',
      ],
      button: '立即免费下载',
    },

    cta: {
      eyebrow: 'Get Started',
      badge: '立即体验',
      titleLine1: '准备好告别繁琐的',
      titleLine2: 'SQL 调试方式了吗？',
      subtitle:
        '加入超过 500 名开发者的行列，在 IntelliJ IDEA 中享受更高效的 SQL 调试体验。所有功能永久免费。',
      primary: '立即免费下载',
      secondary: '查看文档',
      trust: ['永久免费使用', '开箱即用', '无需注册'],
    },

    sectionNav: {
      label: '页内章节导航',
      items: [
        { id: 'sec-tech', label: '技术栈' },
        { id: 'sec-capability', label: '核心能力' },
        { id: 'sec-preview', label: '预览能力' },
        { id: 'sec-features', label: '更多特性' },
        { id: 'sec-opensource', label: '开源免费' },
        { id: 'sec-testimonials', label: '用户评价' },
        { id: 'sec-pricing', label: '免费下载' },
        { id: 'sec-start', label: '开始使用' },
      ],
    },

    backToTop: { label: '返回顶部' },

    footer: '基于 Apache-2.0 协议开源发布 · Copyright © 2026-present SongRenShuo',
  },

  en: {
    nav: {
      links: [
        { text: 'Features', href: '/en/features/wrapper-preview' },
        { text: 'Guide', href: '/en/guide/getting-started' },
        { text: 'Feedback', href: '/en/about/feedback' },
        { text: 'About', href: '/en/about/' },
      ],
      download: 'Install — Free',
      langLabel: 'English',
      langTitle: 'Language',
      langMenuLabel: 'Switch language',
      langs: [
        { text: '简体中文', href: '/' },
        { text: 'English', href: '/en/', active: true },
      ],
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      themeAriaLight: 'Switch to light mode',
      themeAriaDark: 'Switch to dark mode',
      giteeTitle: 'Gitee repository',
      githubTitle: 'GitHub mirror',
      menuLabel: 'Navigation menu',
    },

    hero: {
      titleLine1: 'No server to start,',
      titleLine2: 'see the SQL first',
      description:
        'IntelliJ IDEA plugin: see the exact SQL while you write it — Wrapper chains, XML/annotation/HQL dynamic SQL (incl. MPJ joins) previewed live. Once it runs, real parameters and durations are captured automatically with slow-query highlighting, EXPLAIN plans and one-click jumps back to the source line; SQL also converts back into Java code. No server to start, no logs to dig through, no parameters to hand-assemble.',
      install: 'Install from Marketplace',
      offline: 'Download offline package',
      highlights: [
        'Updates without restarting IDEA',
        'Works offline on intranets',
        'No telemetry · your code never leaves the machine',
      ],
      statLabels: ['Latest version', 'IDEA support', 'License'],
      codeJavaLabel: 'UserService.java',
      codeSqlLabel: 'Live preview · generated SQL',
    },

    socialProof: {
      caption: 'Covers a wide range of SQL debugging scenarios',
      items: [
        'MyBatis-Plus',
        'MPJ joins',
        'Spring Boot',
        'XML mapper',
        'Annotation SQL',
        'SQL logs',
        'Batch operations',
        'SQL completion',
      ],
    },

    capability: {
      eyebrow: 'Core Capabilities',
      title: 'Debug SQL far faster',
      description:
        'Simpler tooling, clearer logic. Every detail of the workflow is tuned so you get more done in less time.',
      items: [
        {
          badge: 'Wrapper Preview',
          title: 'Wrapper → SQL Live Preview',
          description:
            'Static parsing for every wrapper type — LambdaQueryWrapper, MPJLambdaWrapper and more. No project launch, straight to the final SQL.',
          points: [
            {
              title: 'Static chain parsing',
              description: 'Preview the complete SQL without running the project',
            },
            {
              title: 'Toggle dynamic conditions',
              description: 'if / choose / where tags rendered on demand',
            },
            {
              title: '11 pagination dialects',
              description: 'Pagination syntax for MySQL / PG / Oracle and the rest',
            },
          ],
        },
        {
          badge: 'Log Restore',
          title: 'One-Click Console Log Restore',
          description:
            'Enhanced capture is the default channel — real parameters and exact durations with no SQL logging setup, and console logs captured and restored automatically.',
          points: [
            {
              title: 'Enhanced capture by default',
              description:
                'Captures out of the box with no per-run confirmation — real parameters, exact durations and affected rows',
            },
            {
              title: 'Per-thread log buckets',
              description:
                'Preparing / Parameters recognised automatically; interleaved threads bucketed so parameters never mis-attach',
            },
            {
              title: 'Target database badges',
              description:
                'Entries tagged [MySQL], [DM] and so on, across 11 dialects plus HSQL / GBASE',
            },
          ],
        },
        {
          badge: 'Log Tracing',
          title: 'SQL Tracing · From Log to Source Line',
          description:
            'Jump from any executed log entry straight back to the line that issued the SQL; the preview panel lists the full call stack frame by frame — click a frame, land on its source.',
          points: [
            {
              title: 'Exact landing',
              description:
                'Right-click an entry to jump to the executing line; located by the real call stack, never guessed from table names',
            },
            {
              title: 'Frame-by-frame stack',
              description:
                'Hover the preview panel for the full call chain, 12–64 frames configurable, infrastructure frames skipped automatically',
            },
            {
              title: 'Works on both channels',
              description:
                'Enhanced capture needs zero configuration; the console channel is just as precise with the interceptor installed',
            },
          ],
        },
        {
          badge: 'Reverse Conversion',
          title: 'SQL → Java Reverse Conversion',
          description:
            'Select SQL and generate compilable MyBatis-Plus code in one click, in four output forms.',
          points: [
            { title: 'Four output forms', description: 'QueryWrapper / Lambda / Wrappers / MPJ' },
            { title: 'Full CRUD coverage', description: 'SELECT / INSERT / UPDATE / DELETE' },
            {
              title: 'Multi-table JOIN',
              description: 'Join queries generate an MPJLambdaWrapper automatically',
            },
          ],
        },
        {
          badge: 'Code Generation',
          title: 'One-Click CRUD SQL Generation',
          description:
            'Right-click an entity class or a database table for SELECT / INSERT / UPDATE / DELETE candidates; pick one and it opens in the preview, ready to edit or copy.',
          points: [
            {
              title: 'Three entry points',
              description: 'Entity class file, project view node, Database table node (Ultimate)',
            },
            {
              title: 'Filterable candidate popup',
              description: 'Type to filter, Enter or double-click to pick, ESC to close',
            },
            {
              title: 'Aligned with MP runtime',
              description:
                '@Version goes into WHERE, auto-increment keys start unchecked, logic delete gets its own DELETE variant',
            },
          ],
        },
        {
          badge: 'Multi-framework',
          title: 'XML / Annotation / MPJ Coverage',
          description:
            'Every dynamic tag in mapper XML rendered with MyBatis semantics, with annotation SQL supported the same way.',
          points: [
            { title: 'XML dynamic tags', description: 'if / choose / foreach / bind and more' },
            { title: 'Annotation SQL', description: '@Select / @Update / @Delete / @Insert' },
            {
              title: 'OGNL expressions',
              description: 'Toggle dynamic conditions in the panel and preview the result live',
            },
          ],
        },
        {
          badge: 'Cross-ecosystem',
          title: 'JPA / Hibernate SQL Preview',
          description:
            'Repository derived methods, JPQL / HQL and Criteria chains parsed into SQL statically — no Spring container, no database connection.',
          points: [
            {
              title: 'Derived method parsing',
              description: 'All findByXxx naming rules; one click on the gutter icon',
            },
            {
              title: '@Query fully supported',
              description: 'JPQL / native SQL / @Modifying DML previewed directly',
            },
            {
              title: 'Criteria chains and .hbm.xml',
              description: 'Static parsing, independent of container and database',
            },
          ],
        },
        {
          badge: 'AI Agent Integration',
          title: 'MCP Server: SQL Tools for AI Agents',
          description:
            "Claude Code / Cursor / AI Assistant / Codex connect straight to the plugin through IDEA's built-in MCP Server — keep coding in the IDE while the agent works alongside.",
          points: [
            {
              title: 'Deterministic evidence',
              description:
                'The agent gets the real executable SQL the renderer produced, not a confidence score',
            },
            {
              title: 'Eleven read-only tools',
              description:
                'Render & restore, schema context, EXPLAIN, write-risk check, rollback plan, performance advice, history search (IDEA 2025.2+)',
            },
            {
              title: 'Controllable and auditable',
              description:
                'Per-tool gating in settings takes effect instantly; SELECT whitelist plus an audit trail on every call',
            },
          ],
        },
      ],
    },

    preview: {
      eyebrow: 'Live Preview',
      badge: 'SQL Preview',
      titleLine1: 'Powerful SQL preview',
      titleLine2: 'across dialects and scenarios',
      description:
        'Pagination rendered for 11 database dialects, parameters replaced with actual values, LIKE gets its percent signs automatically, and dynamic conditions toggle live in the panel.',
      points: [
        {
          title: 'Multi-dialect support',
          description: 'Pagination syntax for MySQL / PostgreSQL / Oracle / SQLServer and 7 more',
        },
        {
          title: 'Automatic parameter replacement',
          description: '? placeholders replaced with actual values, quoted by field type',
        },
      ],
      link: 'See preview capabilities',
    },

    features: {
      eyebrow: 'More Features',
      badge: 'More Features',
      title: 'Everything You Need',
      description: 'SQL Visualizer covers everything SQL debugging takes.',
    },

    welfare: {
      eyebrow: 'Open Source',
      tag: 'Open Source · Free Forever',
      titleLine1: 'Completely free',
      titleLine2: 'under Apache-2.0',
      description:
        'Every SQL Visualizer feature is free forever. No sign-up, no login — install and go.',
      items: [
        'All features completely free',
        'Open source, code auditable',
        'Continuously updated, community-driven',
        'No registration, works out of the box',
      ],
      giteeCaption: 'Click · visit the source repository',
      githubCaption: 'GitHub mirror',
    },

    testimonials: {
      eyebrow: 'Testimonials',
      badge: 'Testimonials',
      titlePrefix: 'Trusted by ',
      titleAccent: 'development teams',
      subtitle: 'Hear from the engineers who use SQL Visualizer every day.',
      items: [
        {
          quote:
            'Half the projects I inherit are MP and half are string SQL in JdbcTemplate. To see the SQL that actually ran I had to run it and dig through logs. Now both styles show an icon at the start of the line — one click gives me the SQL, and even StringBuilder-assembled queries are aggregated. Last week I tracked down a pagination bug without starting the project at all.',
          name: '夜航船',
          role: 'Java Developer',
          initials: '夜',
          color: '#6366f1',
        },
        {
          quote:
            'Our team maintains a legacy Hibernate project with entities still mapped in .hbm.xml, and Criteria queries never show what finally runs. This plugin restores HQL and Criteria chains into SQL without starting the container, and it recognises named queries in hbm too — changing a query no longer means pulling a colleague in to run the project.',
          name: '不写注释的人',
          role: 'Backend Developer',
          initials: '不',
          color: '#0ea5e9',
        },
        {
          quote:
            'The SQL log window now captures automatically when the project opens, parameters come pre-filled, and you can click back to the source location with slow queries highlighted in red. It picked out two queries missing their index during our last load test. Updates no longer restart the IDE either — install and keep working.',
          name: '半糖不加冰',
          role: 'Full-stack Developer',
          initials: '半',
          color: '#10b981',
        },
      ],
    },

    pricing: {
      eyebrow: 'Pricing',
      title: 'Completely Free',
      description: 'Every feature free forever. No sign-up, no login.',
      plan: 'Free',
      price: '$0',
      period: 'free forever',
      features: [
        'Wrapper → SQL live preview',
        'XML / annotation dynamic SQL preview',
        'MPJ join reverse parsing',
        'SQL → Java reverse conversion',
        'One-click console log restore',
        'Batch operation parameter panel',
        'SQL code completion',
        'Logic-delete auto injection',
        '11 database dialects supported',
      ],
      button: 'Install — Free',
    },

    cta: {
      eyebrow: 'Get Started',
      badge: 'Try it now',
      titleLine1: 'Ready to leave tedious',
      titleLine2: 'SQL debugging behind?',
      subtitle:
        'Join 500+ developers getting a better SQL debugging experience in IntelliJ IDEA. Every feature is free forever.',
      primary: 'Install — Free',
      secondary: 'Read the Docs',
      trust: ['Free forever', 'Works out of the box', 'No sign-up'],
    },

    sectionNav: {
      label: 'On-page section navigation',
      items: [
        { id: 'sec-tech', label: 'Stack' },
        { id: 'sec-capability', label: 'Capabilities' },
        { id: 'sec-preview', label: 'Preview' },
        { id: 'sec-features', label: 'More Features' },
        { id: 'sec-opensource', label: 'Open Source' },
        { id: 'sec-testimonials', label: 'Testimonials' },
        { id: 'sec-pricing', label: 'Download' },
        { id: 'sec-start', label: 'Get Started' },
      ],
    },

    backToTop: { label: 'Back to top' },

    footer: 'Open source under Apache-2.0 · Copyright © 2026-present SongRenShuo',
  },
}

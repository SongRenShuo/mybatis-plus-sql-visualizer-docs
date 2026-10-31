import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, extname, resolve, sep } from 'node:path'

// dev server 只服务源码目录，构建产物里的 pagefind 索引（npm run build 生成）不在其列，
// 站内搜索弹窗会落到「加载失败」。这里把 .vitepress/dist/pagefind 只读挂到 /pagefind；
// 索引还没构建时放行，由前端提示先跑一次 build。仅作用于 dev（apply: 'serve'）。
function pagefindDevAssets() {
  const dir = resolve(dirname(fileURLToPath(import.meta.url)), 'dist/pagefind')
  const prefix = dir + sep
  const types: Record<string, string> = {
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
    '.pagefind': 'application/wasm',
    '.pf_meta': 'application/octet-stream'
  }
  return {
    name: 'pagefind-dev-assets',
    apply: 'serve' as const,
    configureServer(server: any) {
      server.middlewares.use('/pagefind', (req: any, res: any, next: any) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        const rel = decodeURIComponent((req.url || '/').split('?')[0])
        const file = resolve(dir, '.' + rel)
        if (file !== dir && !file.startsWith(prefix)) return next()
        if (!existsSync(file) || !statSync(file).isFile()) return next()
        res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream')
        if (req.method === 'HEAD') return res.end()
        createReadStream(file).pipe(res)
      })
    }
  }
}

// 插件版本单一来源：构建前由 scripts/sync-plugin-version.mjs 写入
// （同级插件仓 gradle.properties → Marketplace API → 保留现值），
// 这里读它注入 JSON-LD softwareVersion；前端兜底见 theme/composables/usePluginVersion.js。
const pluginVersion: string = (() => {
  try {
    const p = resolve(dirname(fileURLToPath(import.meta.url)), 'data/plugin-version.json')
    return JSON.parse(readFileSync(p, 'utf8')).version
  } catch {
    return 'unknown'
  }
})()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 忽略死链接（开发计划中的 localhost 链接）
  ignoreDeadLinks: true,
  // 无后缀（clean）URL：VitePress 生成的站内链接（导航 / 侧栏 / 正文 / sitemap）一律不带 .html，
  // 与生产环境一致——CF Pages 默认把 `x.html` 308 跳到无后缀，站点若发 .html 链接等于每次多一跳
  //（实测 `/features/wrapper-preview.html` → 308 → 无后缀 200）。产物仍是 .html 文件，只是链接不带后缀。
  cleanUrls: true,

  // 文档页显示「最后更新于」（构建期按文件跑 git log 取最后一次提交时间），
  // 同时让 sitemap 自动带上 <lastmod>；单页可用 frontmatter `lastUpdated: false` 关闭。
  lastUpdated: true,

  // docs/ 为内部文档（开发计划、开发笔记、发行说明、验收文档、SQL 文件、memory-archive），
  // 不面向访客：直接从构建源排除，既不出页面，也不进 sitemap 与搜索索引。
  srcExclude: ['docs/**'],

  title: 'SQL Visualizer',
  description:
    'IntelliJ IDEA 插件：MyBatis-Plus / MyBatis-Plus-Join / JPA / Hibernate 的 SQL 调试利器——Wrapper 链、XML/注解/HQL 动态 SQL 实时预览（含 MPJ 联表 JOIN），真实 EXPLAIN 执行计划，运行期捕获真实参数与耗时（慢查询标红与静态性能建议），日志一键跳回源码，SQL 反向转 Java 代码。',

  // 默认语言
  lang: 'zh-CN',

  // 主题：支持亮暗切换，默认亮色（'switch' 不跟随系统暗色偏好）
  appearance: 'switch',

  // 自定义 head
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }],
    ['link', { rel: 'icon', href: '/favicon-96.png', sizes: '96x96', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SQL Visualizer' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:locale:alternate', content: 'en_US' }],
    ['meta', { property: 'og:image', content: 'https://sql-visualizer.jvtools.cn/og-image.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://sql-visualizer.jvtools.cn/og-image.png' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'SQL Visualizer',
      'description': 'IntelliJ IDEA 插件：MyBatis-Plus SQL 调试利器',
      'url': 'https://sql-visualizer.jvtools.cn',
      'inLanguage': ['zh-CN', 'en']
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'SQL Visualizer',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Windows, macOS, Linux',
      'description': 'IntelliJ IDEA 插件：MyBatis-Plus / MPJ / JPA / Hibernate 的 SQL 调试利器',
      'url': 'https://sql-visualizer.jvtools.cn',
      'softwareVersion': pluginVersion,
      'featureList': [
        'Wrapper chain to SQL live preview',
        'XML / annotation / HQL dynamic SQL preview',
        'Real EXPLAIN execution plans',
        '.hbm.xml named query preview',
        'SQL to Java reverse conversion',
        'Runtime SQL capture with real parameters and durations',
        'Slow-query highlighting with static performance advice',
        'Jump from a captured SQL back to its source line',
        'Call-stack popup with click-a-frame-to-jump',
        'JPA / Hibernate derived query and CRUD preview',
        'MPJ join query live preview',
        '11-dialect pagination rendering'
      ],
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    })]
  ],

  // 按页面注入 hreflang / canonical（VitePress 不自动生成）
  transformHead({ pageData }) {
    const base = 'https://sql-visualizer.jvtools.cn'
    if (!pageData.relativePath) return
    const clean = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const path = '/' + clean
    const isEn = path.startsWith('/en/')
    const zhPath = isEn ? path.replace(/^\/en/, '') || '/' : path
    const enPath = isEn ? path : path === '/' ? '/en/' : `/en${path}`
    return [
      ['link', { rel: 'canonical', href: base + (isEn ? enPath : zhPath) }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: base + zhPath }],
      ['link', { rel: 'alternate', hreflang: 'en-US', href: base + enPath }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: base + zhPath }]
    ]
  },

  // 开发服务器代理：/api/changelog → JetBrains Marketplace
  vite: {
    // 构建产物生成 llms.txt / llms-full.txt（AI 搜索友好）
    // docs/ 已由根级 srcExclude 排除在构建之外（不再出页面），这里保留 ignoreFiles 兜底，
    // 防止有人临时改动 srcExclude 时内部文档混进 llms 索引。
    // ignoreFiles 为 minimatch 模式，匹配相对 srcDir 的路径；`docs/**` 递归排除 docs/ 下所有层级文件
    plugins: [pagefindDevAssets(), llmstxt({
      ignoreFiles: ['docs/**']
    })],
    server: {
      // 本地 dev 关闭 HMR 错误遮罩：缺静的 GIF（录制中）触发 import-analysis 全遮罩，妨碍调试与页面验收
      hmr: { overlay: false },
      proxy: {
        '/api/changelog': {
          target: 'https://plugins.jetbrains.com/api/plugins/33633/updates',
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp('^/api/changelog'), ''),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*'
              proxyRes.headers['Cache-Control'] = 'public, max-age=3600'
            })
          }
        },
        '/api/v1': {
          // 本地联调可指向 sql-visualizer-admin 的 mock：FEEDBACK_API_TARGET=http://localhost:8787 npx vitepress dev
          target: process.env.FEEDBACK_API_TARGET || 'https://sql-visualizer-admin.3064597532.workers.dev',
          changeOrigin: true
        }
      }
    }
  },

  // 国际化
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'SQL Visualizer',
      description:
        'IntelliJ IDEA 插件：MyBatis-Plus / MyBatis-Plus-Join / JPA / Hibernate 的 SQL 调试利器',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '功能详解', link: '/features/wrapper-preview' },
          { text: '使用指南', link: '/guide/getting-started' },
          { text: '需求池', link: '/about/feedback' },
          { text: 'Bug 悬赏', link: '/about/bounty' },
          { text: '关于', link: '/about/' }
        ],
        sidebar: {
          '/features/': {
            text: '功能详解',
            items: [
              { text: 'Wrapper → SQL 预览', link: '/features/wrapper-preview' },
              { text: 'XML / HQL 动态 SQL 预览', link: '/features/xml-preview' },
              { text: 'JPA / Hibernate SQL 预览', link: '/features/jpa-preview' },
              { text: '注解 SQL 预览', link: '/features/annotation-preview' },
              { text: 'SQL → Java 反向转换', link: '/features/sql-to-java' },
              { text: 'SQL 日志工具窗口', link: '/features/sql-log' },
              { text: '批量操作参数面板', link: '/features/batch-operation' },
              { text: 'CRUD SQL 生成', link: '/features/crud-sql' },
              { text: '数据库方言支持矩阵', link: '/features/dialect-support' },
              { text: 'SQL 代码补全', link: '/features/code-completion' },
              { text: 'MCP Server 工具', link: '/features/mcp' }
            ]
          },
          '/guide/': {
            text: '使用指南',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '配置详解', link: '/guide/configuration' },
              { text: '快捷键速查', link: '/guide/shortcuts' },
              { text: '版本兼容', link: '/guide/compatibility' },
              { text: '内网与离线环境', link: '/guide/offline' },
              { text: '为什么选择 SQL Visualizer', link: '/guide/comparison' },
              { text: '常见问题 FAQ', link: '/guide/faq' }
            ]
          },
          '/about/': {
            text: '关于',
            items: [
              { text: '作者 & 联系', link: '/about/' },
              { text: '更新日志', link: '/about/changelog' },
              { text: '开发路线', link: '/about/roadmap' },
              { text: '需求反馈池', link: '/about/feedback' },
              { text: 'Bug 悬赏', link: '/about/bounty' },
              { text: '友情推荐', link: '/about/friends' }
            ]
          }
        },
        footer: {
          message: '基于 Apache-2.0 协议开源发布',
          copyright: 'Copyright © 2026-present SongRenShuo'
        },
        outline: {
          level: [2, 3],
          label: '页面导航'
        },
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Shanghai',
            forceLocale: true
          }
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'SQL Visualizer',
      description:
        'IntelliJ IDEA Plugin: SQL debugging tool for MyBatis-Plus / MPJ — Wrapper chain, XML/annotation dynamic SQL live preview (incl. MPJ JOIN), console log restore, SQL to Java reverse conversion',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Features', link: '/en/features/wrapper-preview' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Feedback', link: '/en/about/feedback' },
          { text: 'Bug Bounty', link: '/en/about/bounty' },
          { text: 'About', link: '/en/about/' }
        ],
        sidebar: {
          '/en/features/': {
            text: 'Features',
            items: [
              { text: 'Wrapper → SQL Preview', link: '/en/features/wrapper-preview' },
              { text: 'XML / HQL Dynamic SQL Preview', link: '/en/features/xml-preview' },
              { text: 'JPA / Hibernate SQL Preview', link: '/en/features/jpa-preview' },
              { text: 'Annotation SQL Preview', link: '/en/features/annotation-preview' },
              { text: 'SQL → Java Reverse Conversion', link: '/en/features/sql-to-java' },
              { text: 'SQL Log Tool Window', link: '/en/features/sql-log' },
              { text: 'Batch Operation Panel', link: '/en/features/batch-operation' },
              { text: 'CRUD SQL Generation', link: '/en/features/crud-sql' },
              { text: 'Dialect Support Matrix', link: '/en/features/dialect-support' },
              { text: 'SQL Code Completion', link: '/en/features/code-completion' },
              { text: 'MCP Server Tools', link: '/en/features/mcp' }
            ]
          },
          '/en/guide/': {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Configuration', link: '/en/guide/configuration' },
              { text: 'Shortcuts', link: '/en/guide/shortcuts' },
              { text: 'Compatibility', link: '/en/guide/compatibility' },
              { text: 'Offline & Intranet', link: '/en/guide/offline' },
              { text: 'Why SQL Visualizer', link: '/en/guide/comparison' },
              { text: 'FAQ', link: '/en/guide/faq' }
            ]
          },
          '/en/about/': {
            text: 'About',
            items: [
              { text: 'Author & Contact', link: '/en/about/' },
              { text: 'Changelog', link: '/en/about/changelog' },
              { text: 'Roadmap', link: '/en/about/roadmap' },
              { text: 'Feedback Pool', link: '/en/about/feedback' },
              { text: 'Bug Bounty', link: '/en/about/bounty' },
              { text: 'Friend Recommendations', link: '/en/about/friends' }
            ]
          }
        },
        footer: {
          message: 'Released under the Apache-2.0 License',
          copyright: 'Copyright © 2026-present SongRenShuo'
        },
        outline: {
          level: [2, 3],
          label: 'On this page'
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Shanghai',
            forceLocale: true
          }
        }
      }
    }
  },

  // 主题配置（全局共享）
  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [],

    // 外部链接
    externalLinkIcon: true
  },

  // sitemap
  sitemap: {
    hostname: 'https://sql-visualizer.jvtools.cn'
  }
})

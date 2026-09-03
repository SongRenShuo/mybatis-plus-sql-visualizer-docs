import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 忽略死链接（开发计划中的 localhost 链接）
  ignoreDeadLinks: true,

  title: 'SQL Visualizer',
  description:
    'IntelliJ IDEA 插件：MyBatis-Plus / MyBatis-Plus-Join / JPA / Hibernate 的 SQL 调试利器——Wrapper 链、XML/注解/HQL 动态 SQL 实时预览（含 MPJ 联表 JOIN），控制台日志一键还原，SQL 反向转 Java 代码。',

  // 默认语言
  lang: 'zh-CN',

  // 主题：支持亮暗切换，默认亮色（'switch' 不跟随系统暗色偏好）
  appearance: 'switch',

  // 自定义 head
  head: [
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
      'softwareVersion': '2026.9.2',
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
    plugins: [llmstxt()],
    server: {
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
          target: 'https://sql-visualizer-admin.3064597532.workers.dev',
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
          { text: '关于', link: '/about/' }
        ],
        sidebar: {
          '/features/': {
            text: '功能详解',
            items: [
              { text: 'Wrapper → SQL 预览', link: '/features/wrapper-preview' },
              { text: 'XML / HQL 动态 SQL 预览', link: '/features/xml-preview' },
              { text: '注解 SQL 预览', link: '/features/annotation-preview' },
              { text: 'SQL → Java 反向转换', link: '/features/sql-to-java' },
              { text: 'SQL 日志工具窗口', link: '/features/sql-log' },
              { text: '批量操作参数面板', link: '/features/batch-operation' },
              { text: 'SQL 代码补全', link: '/features/code-completion' }
            ]
          },
          '/guide/': {
            text: '使用指南',
            items: [
              { text: '为什么选择 SQL Visualizer', link: '/guide/comparison' },
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '配置详解', link: '/guide/configuration' },
              { text: '快捷键速查', link: '/guide/shortcuts' },
              { text: '版本兼容', link: '/guide/compatibility' },
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
          text: '最后更新于'
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footerText: { selectText: '选择', navigateText: '切换' }
              }
            }
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
          { text: 'About', link: '/en/about/' }
        ],
        sidebar: {
          '/en/features/': {
            text: 'Features',
            items: [
              { text: 'Wrapper → SQL Preview', link: '/en/features/wrapper-preview' },
              { text: 'XML / HQL Dynamic SQL Preview', link: '/en/features/xml-preview' },
              { text: 'Annotation SQL Preview', link: '/en/features/annotation-preview' },
              { text: 'SQL → Java Reverse Conversion', link: '/en/features/sql-to-java' },
              { text: 'SQL Log Tool Window', link: '/en/features/sql-log' },
              { text: 'Batch Operation Panel', link: '/en/features/batch-operation' },
              { text: 'SQL Code Completion', link: '/en/features/code-completion' }
            ]
          },
          '/en/guide/': {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Configuration', link: '/en/guide/configuration' },
              { text: 'Shortcuts', link: '/en/guide/shortcuts' },
              { text: 'Compatibility', link: '/en/guide/compatibility' },
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
              { text: 'Friend Plugins', link: '/en/about/friends' }
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
          text: 'Last updated'
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search docs', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset query',
                footerText: { selectText: 'Select', navigateText: 'Switch', closeText: 'Close' }
              }
            }
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

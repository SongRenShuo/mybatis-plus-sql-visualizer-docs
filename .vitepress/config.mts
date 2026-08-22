import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 忽略死链接（开发计划中的 localhost 链接）
  ignoreDeadLinks: true,

  title: 'MyBatis-Plus SQL Visualizer',
  description:
    'IntelliJ IDEA 插件：MyBatis-Plus / MyBatis-Plus-Join 的 SQL 调试利器——Wrapper 链、XML/注解动态 SQL 实时预览（含 MPJ 联表 JOIN），控制台日志一键还原，SQL 反向转 Java 代码。',

  // 默认语言
  lang: 'zh-CN',

  // 默认亮色主题
  appearance: 'light',

  // 自定义 head
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:locale:alternate', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'MyBatis-Plus SQL Visualizer',
      'description': 'IntelliJ IDEA 插件：MyBatis-Plus SQL 调试利器',
      'url': 'https://mybatis-plus-sql-visualizer.jvtools.cn',
      'inLanguage': ['zh-CN', 'en']
    })]
  ],

  // 开发服务器代理：/api/changelog → JetBrains Marketplace
  vite: {
    server: {
      proxy: {
        '/api/changelog': {
          target: 'https://plugins.jetbrains.com/api/plugins/33633/updates',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/changelog/, ''),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*'
              proxyRes.headers['Cache-Control'] = 'public, max-age=3600'
            })
          }
        }
      }
    }
  },

  // 国际化
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'MyBatis-Plus SQL Visualizer',
      description:
        'IntelliJ IDEA 插件：MyBatis-Plus / MyBatis-Plus-Join 的 SQL 调试利器',
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
              { text: 'XML 动态 SQL 预览', link: '/features/xml-preview' },
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
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '配置详解', link: '/guide/configuration' },
              { text: '常见问题 FAQ', link: '/guide/faq' }
            ]
          },
          '/about/': {
            text: '关于',
            items: [
              { text: '作者 & 联系', link: '/about/' },
              { text: '更新日志', link: '/about/changelog' },
              { text: '开发路线', link: '/about/roadmap' }
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
      title: 'MyBatis-Plus SQL Visualizer',
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
              { text: 'XML Dynamic SQL Preview', link: '/en/features/xml-preview' },
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
              { text: 'FAQ', link: '/en/guide/faq' }
            ]
          },
          '/en/about/': {
            text: 'About',
            items: [
              { text: 'Author & Contact', link: '/en/about/' },
              { text: 'Changelog', link: '/en/about/changelog' },
              { text: 'Roadmap', link: '/en/about/roadmap' }
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
          provider: 'local'
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
    hostname: 'https://mybatis-plus-sql-visualizer.jvtools.cn'
  }
})

// https://vitepress.dev/guide/custom-theme
import { h, onMounted, onUnmounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MiniSearch from 'minisearch'

// 生产构建下 siteConfig 经 window.__VP_SITE_DATA__（纯 JSON）内联，config.mts 里
// miniSearch.options.tokenize 函数到不了客户端，查询分词退回"整句一个 token"，
// 3 字以上中文查询会因 AND 不命中而空结果。这里在客户端包装 MiniSearch.loadJSON，
// 补上与构建期索引一致的 bigram 分词。注意：分词逻辑须与 .vitepress/config.mts 的
// cjkTokenize 保持一致（改动时两处同步）。
const cjkTokenizeClient = (text: string): string[] => {
  const tokens: string[] = []
  const isCjk = (ch: string) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(ch)
  for (const seg of text.split(/[\n\r\p{Z}\p{P}]+/u)) {
    if (!seg) continue
    let buf = ''
    const flush = () => {
      if (!buf) return
      if (isCjk(buf[0])) {
        if (buf.length === 1) tokens.push(buf)
        else for (let i = 0; i + 1 < buf.length; i++) tokens.push(buf.slice(i, i + 2))
      } else {
        tokens.push(buf)
      }
      buf = ''
    }
    for (const ch of seg) {
      if (buf && isCjk(buf[0]) !== isCjk(ch)) flush()
      buf += ch
    }
    flush()
  }
  return tokens
}

const origLoadJSON = MiniSearch.loadJSON.bind(MiniSearch)
;(MiniSearch as any).loadJSON = (json: string, options: any) =>
  origLoadJSON(json, { ...options, tokenize: cjkTokenizeClient })

// 自定义组件
import GifPlayer from './components/GifPlayer.vue'
import ThemedImage from './components/ThemedImage.vue'
import Steps from './components/Steps.vue'
import CodeCompare from './components/CodeCompare.vue'
import FeatureCards from './components/FeatureCards.vue'
import CodeTabs from './components/CodeTabs.vue'
import BadgeBar from './components/BadgeBar.vue'
import SiteNotice from './components/SiteNotice.vue'
import NavBarGitee from './components/NavBarGitee.vue'

// 首页组件
import CoolHome from './components/home/CoolHome.vue'

// 反馈池组件
import FeedbackPage from './components/feedback/FeedbackPage.vue'

// 自定义样式
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(BadgeBar),
      'layout-bottom': () => h(SiteNotice),
      'nav-bar-content-after': () => h(NavBarGitee),
      'not-found': () =>
        h('div', { style: { textAlign: 'center', padding: '6rem 1rem' } }, [
          h('p', { style: { fontSize: '4rem', fontWeight: 'bold', margin: '0', lineHeight: '1.1', color: 'var(--vp-c-brand-1)' } }, '404'),
          h('h1', { style: { fontSize: '1.5rem', margin: '0.5rem 0 1rem' } }, '页面不存在 / Page Not Found'),
          h('p', { style: { color: 'var(--vp-c-text-2)', marginBottom: '1.5rem' } }, '链接可能已失效，试试搜索或从下面返回。'),
          h('div', { style: { display: 'flex', gap: '0.75rem', justifyContent: 'center' } }, [
            h(
              'a',
              { href: '/', style: { padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--vp-c-brand-1)', color: '#fff', textDecoration: 'none' } },
              '返回首页'
            ),
            h(
              'a',
              { href: '/guide/getting-started', style: { padding: '0.5rem 1.25rem', borderRadius: '9999px', border: '1px solid var(--vp-c-border)', color: 'var(--vp-c-text-1)', textDecoration: 'none' } },
              '快速开始'
            )
          ])
        ])
    })
  },
  enhanceApp({ app }) {
    app.component('GifPlayer', GifPlayer)
    app.component('ThemedImage', ThemedImage)
    app.component('Steps', Steps)
    app.component('CodeCompare', CodeCompare)
    app.component('FeatureCards', FeatureCards)
    app.component('CodeTabs', CodeTabs)
    // 首页组件
    app.component('CoolHome', CoolHome)
    // 反馈池组件
    app.component('FeedbackPage', FeedbackPage)
  },
  setup() {
    let scrollHandler: (() => void) | null = null

    onMounted(() => {
      const nav = document.querySelector('.VPNav')
      if (!nav) return

      scrollHandler = () => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled')
          nav.classList.remove('transparent')
        } else {
          nav.classList.remove('scrolled')
          nav.classList.add('transparent')
        }
      }

      window.addEventListener('scroll', scrollHandler, { passive: true })
      scrollHandler()
    })

    onUnmounted(() => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
      }
    })
  }
} satisfies Theme

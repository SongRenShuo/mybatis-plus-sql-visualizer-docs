// https://vitepress.dev/guide/custom-theme
import { h, onMounted, onUnmounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 自定义组件
import GifPlayer from './components/GifPlayer.vue'
import ThemedImage from './components/ThemedImage.vue'
import Steps from './components/Steps.vue'
import CodeCompare from './components/CodeCompare.vue'
import FeatureCards from './components/FeatureCards.vue'
import CodeTabs from './components/CodeTabs.vue'
import DocFooterBar from './components/DocFooterBar.vue'
import SiteNotice from './components/SiteNotice.vue'
import NavBarGitee from './components/NavBarGitee.vue'
import PagefindSearch from './components/PagefindSearch.vue'

// 首页组件
import CoolHome from './components/home/CoolHome.vue'
import BackToTop from './components/home/BackToTop.vue'

// 反馈池组件
import FeedbackPage from './components/feedback/FeedbackPage.vue'

// 访问埋点
import { setupTracker } from './composables/useTracker'
import { useThemeTransition } from './composables/useThemeTransition'

// 自定义样式
import './style.css'
// 需求池 / 悬赏页组件库 token（对齐 beui 的 shadcn 口径）
import './components/ui/ui.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-footer-before': () => h(DocFooterBar),
      'layout-bottom': () => [h(SiteNotice), h(BackToTop)],
      'nav-bar-content-after': () => [h(NavBarGitee), h(PagefindSearch)],
      'nav-screen-content-after': () => h(PagefindSearch, { compact: true }),
      'not-found': () => {
        // 404 页中英切换：/en 前缀走英文文案与英文链接。SSG 期无 location，按默认中文渲染，
        // 客户端水合后再按真实路径切换（VitePress 只生成一份 404.html，无法在构建期分语言）。
        const isEn = typeof location !== 'undefined' && location.pathname.startsWith('/en')
        const t = isEn
          ? { title: 'Page Not Found', desc: 'This link may be broken. Try a search or head back from the buttons below.', home: 'Back to Home', homeHref: '/en/', start: 'Quick Start', startHref: '/en/guide/getting-started' }
          : { title: '页面不存在', desc: '链接可能已失效，试试搜索或从下面返回。', home: '返回首页', homeHref: '/', start: '快速开始', startHref: '/guide/getting-started' }
        return h('div', { style: { textAlign: 'center', padding: '6rem 1rem' } }, [
          h('p', { style: { fontSize: '4rem', fontWeight: 'bold', margin: '0', lineHeight: '1.1', color: 'var(--vp-c-brand-1)' } }, '404'),
          h('h1', { style: { fontSize: '1.5rem', margin: '0.5rem 0 1rem' } }, t.title),
          h('p', { style: { color: 'var(--vp-c-text-2)', marginBottom: '1.5rem' } }, t.desc),
          h('div', { style: { display: 'flex', gap: '0.75rem', justifyContent: 'center' } }, [
            h(
              'a',
              { href: t.homeHref, style: { padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'var(--vp-c-brand-1)', color: '#fff', textDecoration: 'none' } },
              t.home
            ),
            h(
              'a',
              { href: t.startHref, style: { padding: '0.5rem 1.25rem', borderRadius: '9999px', border: '1px solid var(--vp-c-border)', color: 'var(--vp-c-text-1)', textDecoration: 'none' } },
              t.start
            )
          ])
        ])
      }
    })
  },
  enhanceApp({ app, router }) {
    setupTracker(router)
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
    let outlineHandler: (() => void) | null = null

    // 文档页与移动端导航里的明暗开关是 VitePress 默认的 VPSwitchAppearance，
    // 它自己直接改 isDark，接不上首页那套圆形揭示动画。这里在捕获阶段把点击
    // 拦下来交给同一个 toggle；若哪天 VitePress 换了类名，拦截失效但开关照旧能用，
    // 只是退回无动画的瞬时切换，不会把功能弄坏。
    const { toggle: toggleThemeWithTransition } = useThemeTransition()
    const onAppearanceClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const btn = target?.closest?.('.VPSwitchAppearance') as HTMLElement | null
      if (!btn) return
      e.preventDefault()
      e.stopPropagation()
      toggleThemeWithTransition(e, btn)
    }

    onMounted(() => {
      document.addEventListener('click', onAppearanceClick, true)
    })

    onMounted(() => {
      const nav = document.querySelector('.VPNav')
      if (!nav) return

      // 导航底色常驻不透明（见 style.css 的 .VPNav）：透明态没有任何页面受益——
      // 文档页靠 .VPNavBar.has-sidebar 本就不透明，首页走自建 NavHeader 不用 .VPNav，
      // 而 layout: page 的自定义页（需求池 / 悬赏）内容紧贴导航下沿，透明态会让标题
      // 从导航底下穿过。scrolled 现在只负责滚动后的阴影与描边。
      scrollHandler = () => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      }

      window.addEventListener('scroll', scrollHandler, { passive: true })
      scrollHandler()
    })

    // 手机端「页面导航」折叠态显示当前小节名（方案 A 加分项）：窄屏下侧栏大纲容器
    // display:none，其 active 锚点不更新（实测 activeCount=0），故直接读正文标题自行
    // 计算当前小节——取吸顶线以上最后一个带 id 的 h2/h3；顶部或无命中时还原默认标题。
    onMounted(() => {
      outlineHandler = () => {
        const btn = document.querySelector<HTMLSpanElement>(
          '.VPLocalNavOutlineDropdown button .menu-text',
        )
        if (!btn) return
        if (!btn.dataset.default) btn.dataset.default = btn.textContent?.trim() ?? ''
        if (window.scrollY <= 120) {
          btn.textContent = btn.dataset.default
          return
        }
        let current: string | null = null
        document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]').forEach((h) => {
          if (h.getBoundingClientRect().top <= 141) {
            current = (h.textContent ?? '').replace(/\u200b/g, '').trim() || current
          }
        })
        btn.textContent = current ?? btn.dataset.default
      }
      window.addEventListener('scroll', outlineHandler, { passive: true })
      outlineHandler()
    })

    onUnmounted(() => {
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
      }
      if (outlineHandler) {
        window.removeEventListener('scroll', outlineHandler)
      }
      document.removeEventListener('click', onAppearanceClick, true)
    })
  }
} satisfies Theme

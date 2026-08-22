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
import BadgeBar from './components/BadgeBar.vue'
import SiteNotice from './components/SiteNotice.vue'
import NavBarGitee from './components/NavBarGitee.vue'

// 首页组件
import CoolHome from './components/home/CoolHome.vue'

// 自定义样式
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-after': () => h(BadgeBar),
      'layout-bottom': () => h(SiteNotice),
      'nav-bar-content-after': () => h(NavBarGitee)
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

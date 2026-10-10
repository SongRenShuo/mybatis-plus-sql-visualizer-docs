<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import PagefindSearch from '../PagefindSearch.vue'
import SectionNav from './SectionNav.vue'
import { useHomeContent } from '../../composables/useHomeContent'

const { isDark } = useData()
const { c } = useHomeContent()

const scrolled = ref(false)
const mobileOpen = ref(false)
// 首页走自定义导航（CoolHome，layout:false），拿不到 VitePress 自带的
// VPNavBarTranslations，语言切换需要自建；文档页仍是 VitePress 默认那一套。
const langOpen = ref(false)
const langRef = ref(null)

let scrollHandler = null

function onKeydown(e) {
  if (e.key === 'Escape') {
    mobileOpen.value = false
    langOpen.value = false
  }
}

// 点击语言菜单以外的地方收起
function onDocumentClick(e) {
  if (!langOpen.value) return
  if (langRef.value && !langRef.value.contains(e.target)) langOpen.value = false
}

// 全屏菜单展开期间锁定背景滚动，收起/卸载时兜底恢复
watch(mobileOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)
  scrollHandler()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header
    class="nav-bar"
    :class="{ scrolled: scrolled || mobileOpen, transparent: !scrolled && !mobileOpen }"
  >
    <div class="container">
      <div class="nav-content">
        <div class="logo-area">
          <img src="/logo.svg" alt="Logo" class="nav-logo" />
          <span class="logo-text">SQL Visualizer</span>
        </div>

        <nav class="nav-links">
          <a v-for="link in c.nav.links" :key="link.href" :href="link.href" class="nav-link">
            {{ link.text }}
          </a>
        </nav>

        <div class="nav-actions">
          <div ref="langRef" class="nav-lang">
            <button
              class="nav-lang-btn"
              :aria-expanded="langOpen"
              aria-haspopup="true"
              :title="c.nav.langMenuLabel"
              @click="langOpen = !langOpen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nav-lang-icon">
                <path d="M4 5h9M8.5 5c0 3.5-1.8 6.4-4.5 8.2" />
                <path d="M6 9.2c1.2 2.1 3 3.6 5.2 4.5" />
                <path d="M13 20l4-10 4 10M14.4 17h5.2" />
              </svg>
              <span class="nav-lang-label">{{ c.nav.langLabel }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-lang-chevron">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <Transition name="lang-fade">
              <div v-if="langOpen" class="nav-lang-menu">
                <a
                  v-for="l in c.nav.langs"
                  :key="l.href"
                  :href="l.href"
                  class="nav-lang-item"
                  :class="{ 'is-active': l.active }"
                  :aria-current="l.active ? 'true' : undefined"
                >
                  {{ l.text }}
                </a>
              </div>
            </Transition>
          </div>

          <button
            class="theme-toggle"
            :title="isDark ? c.nav.themeToLight : c.nav.themeToDark"
            :aria-label="isDark ? c.nav.themeAriaLight : c.nav.themeAriaDark"
            @click="isDark = !isDark"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <a
            href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-gitee"
            :title="c.nav.giteeTitle"
          >
            <img src="/gitee-icon.png" alt="Gitee" class="nav-gitee-icon" />
          </a>

          <!-- 搜索挨着下载按钮收在右端（对齐 VitePress 默认导航「搜索在 CTA 之前」的排布），
               原先它排在动作区最左，视觉上离导航链接太近、显得偏中 -->
          <PagefindSearch compact />

          <a
            href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            {{ c.nav.download }}
          </a>
          <button
            class="nav-hamburger"
            :class="{ open: mobileOpen }"
            :aria-expanded="mobileOpen"
            :aria-label="c.nav.menuLabel"
            @click="mobileOpen = !mobileOpen"
          >
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 页内章节导航：作为 header 的第二行，共用吸顶背景与投影，避免两条固定栏之间出现接缝。
         收起时高度为 0，顶栏在首屏维持原高度 -->
    <SectionNav :suppressed="mobileOpen" />

    <!-- 全屏导航层（对齐文档页 VPNavScreen 交互）：z-index -1 压在 header 背景之上、
         nav-content 之下，不依赖顶栏具体高度，logo 与关闭按钮保持可点；
         动画与 VPNavScreen 同配方——整屏 opacity .25s + 内部容器 translateY(-8px)→0 滑入 -->
    <Transition name="menu-fade">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-menu-container">
          <nav class="mobile-links">
            <a
              v-for="link in c.nav.links"
              :key="link.href"
              :href="link.href"
              class="mobile-link"
              @click="mobileOpen = false"
            >{{ link.text }}</a>
          </nav>

          <!-- 语言切换在移动端不进下拉，直接平铺各项 -->
          <div class="mobile-lang">
            <span class="mobile-lang-title">{{ c.nav.langTitle }}</span>
            <div class="mobile-lang-items">
              <a
                v-for="l in c.nav.langs"
                :key="l.href"
                :href="l.href"
                class="mobile-lang-item"
                :class="{ 'is-active': l.active }"
                @click="mobileOpen = false"
              >{{ l.text }}</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s;
}

.nav-bar.transparent {
  background-color: transparent;
}

.nav-bar.scrolled {
  background-color: var(--bg-primary);
  box-shadow: 0 3px 18px 2px var(--border-color);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-logo {
  width: 28px;
  height: 28px;
}

.logo-text {
  font-size: 1rem;
  font-weight: bold;
  color: var(--primary-color);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .logo-text {
    font-size: 1.125rem;
  }
}

.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  color: var(--text-secondary);
  transition: color 0.3s;
  text-decoration: none;
  font-size: 0.875rem;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-gitee {
  display: flex;
  align-items: center;
}

/* 语言切换与明暗切换共用同一套按钮外观（对齐英文版 VitePress 默认导航的
   「图标按钮 + 悬浮软底」）：同高、同圆角、同悬浮反馈，避免两个控件观感不一致 */
.nav-lang-btn,
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s;
}

.nav-lang-btn:hover,
.theme-toggle:hover {
  color: var(--text-primary);
  background-color: var(--bg-hover);
}

.nav-lang-btn svg,
.theme-toggle svg {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.nav-lang-chevron {
  width: 0.75rem !important;
  height: 0.75rem !important;
  opacity: 0.7;
}

.nav-lang {
  position: relative;
}

.nav-lang-menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  min-width: 8.5rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.28);
  z-index: 60;
}

.nav-lang-item {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s, background-color 0.2s;
}

.nav-lang-item:hover {
  color: var(--text-primary);
  background-color: var(--bg-hover);
}

.nav-lang-item.is-active {
  color: var(--primary-color);
  font-weight: 600;
}

.lang-fade-enter-active,
.lang-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.lang-fade-enter-from,
.lang-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  /* 窄屏只留图标，避免顶栏拥挤溢出 */
  .nav-lang-label {
    display: none;
  }

  .nav-lang-chevron {
    display: none;
  }
}

.nav-gitee-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  color: white;
  background-color: var(--primary-color);
  border-radius: 9999px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-primary:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* 移动端汉堡导航（桌面端保持原有顶栏，不渲染任何新元素） */
.nav-hamburger {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  cursor: pointer;
}

.hamburger-bar {
  display: block;
  width: 1.125rem;
  height: 2px;
  border-radius: 1px;
  background-color: var(--text-primary);
  transition: transform 0.2s, opacity 0.2s;
}

.nav-hamburger.open .hamburger-bar:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.nav-hamburger.open .hamburger-bar:nth-child(2) {
  opacity: 0;
}

.nav-hamburger.open .hamburger-bar:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* 全屏导航层：桌面端兜底隐藏，菜单展开状态下拉大视口时不残留 */
.mobile-menu {
  display: none;
}

@media (max-width: 767px) {
  .nav-hamburger {
    display: flex;
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: var(--bg-primary);
    overflow-y: auto;
    padding-top: 4.5rem;
  }
}

/* 内部容器承担 VPNavScreen 同款滑入位移，动画由 .menu-fade-* 类驱动 */
.mobile-menu-container {
  padding: 0.5rem 1.5rem 2rem;
}

.mobile-links {
  display: flex;
  flex-direction: column;
}

.mobile-link {
  display: block;
  padding: 0.875rem 0;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.05rem;
  border-bottom: 1px solid var(--border-color);
  transition: color 0.25s, border-color 0.25s;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-lang {
  margin-top: 1.5rem;
}

.mobile-lang-title {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.625rem;
}

.mobile-lang-items {
  display: flex;
  gap: 0.5rem;
}

.mobile-lang-item {
  flex: 1;
  text-align: center;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
}

.mobile-lang-item.is-active {
  color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 600;
}

.mobile-link:hover {
  color: var(--primary-color);
}

/* 展开/收起过渡：整屏淡入 + 内容自上下移 8px 滑入，与文档页 VPNavScreen 同配方 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s;
}

.menu-fade-enter-active .mobile-menu-container,
.menu-fade-leave-active .mobile-menu-container {
  transition: transform 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-fade-enter-from .mobile-menu-container,
.menu-fade-leave-to .mobile-menu-container {
  transform: translateY(-8px);
}

/* 小屏收紧：320px 视口顶栏不溢出不重叠 */
@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .nav-actions {
    gap: 0.5rem;
  }

  .btn-primary {
    padding: 0.375rem 0.75rem;
  }
}
</style>

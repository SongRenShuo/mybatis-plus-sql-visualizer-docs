<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import PagefindSearch from '../PagefindSearch.vue'

const { isDark } = useData()

const scrolled = ref(false)
const mobileOpen = ref(false)

let scrollHandler = null

function onKeydown(e) {
  if (e.key === 'Escape') mobileOpen.value = false
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
  scrollHandler()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('keydown', onKeydown)
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
          <a href="/features/wrapper-preview" class="nav-link">功能详解</a>
          <a href="/guide/getting-started" class="nav-link">使用指南</a>
          <a href="/about/feedback" class="nav-link">需求池</a>
          <a href="/about/" class="nav-link">关于</a>
        </nav>

        <div class="nav-actions">
          <PagefindSearch compact />
          <button
            class="theme-toggle"
            :title="isDark ? '切换到亮色' : '切换到暗色'"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
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
            title="Gitee 源码仓库"
          >
            <img src="/gitee-icon.png" alt="Gitee" class="nav-gitee-icon" />
          </a>
          <a
            href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            免费下载
          </a>
          <button
            class="nav-hamburger"
            :class="{ open: mobileOpen }"
            :aria-expanded="mobileOpen"
            aria-label="导航菜单"
            @click="mobileOpen = !mobileOpen"
          >
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 全屏导航层（参照文档页 VPNavScreen）：z-index -1 压在 header 背景之上、
         nav-content 之下，不依赖顶栏具体高度，logo 与关闭按钮保持可点 -->
    <Transition name="menu-fade">
      <div v-if="mobileOpen" class="mobile-menu">
        <nav class="mobile-links">
          <a href="/features/wrapper-preview" class="mobile-link" @click="mobileOpen = false">功能详解</a>
          <a href="/guide/getting-started" class="mobile-link" @click="mobileOpen = false">使用指南</a>
          <a href="/about/feedback" class="mobile-link" @click="mobileOpen = false">需求池</a>
          <a href="/about/" class="mobile-link" @click="mobileOpen = false">关于</a>
        </nav>
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

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s;
}

.theme-toggle:hover {
  color: var(--primary-color);
}

.theme-toggle svg {
  width: 1.125rem;
  height: 1.125rem;
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

.mobile-links {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.5rem 2rem;
}

.mobile-link {
  display: block;
  padding: 1rem 0;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.05rem;
  border-bottom: 1px solid var(--border-color);
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-link:hover {
  color: var(--primary-color);
}

/* 展开过渡：淡入消除闪现 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.2s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
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

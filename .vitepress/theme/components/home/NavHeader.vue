<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const scrolled = ref(false)

let scrollHandler = null

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  scrollHandler()
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <header class="nav-bar" :class="{ scrolled, transparent: !scrolled }">
    <div class="container">
      <div class="nav-content">
        <div class="logo-area">
          <img src="/logo.svg" alt="Logo" class="nav-logo" />
          <span class="logo-text">SQL Visualizer</span>
        </div>

        <nav class="nav-links">
          <a href="/features/wrapper-preview" class="nav-link">功能详解</a>
          <a href="/guide/getting-started" class="nav-link">使用指南</a>
          <a href="/about/" class="nav-link">关于</a>
        </nav>

        <div class="nav-actions">
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
        </div>
      </div>
    </div>
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
</style>

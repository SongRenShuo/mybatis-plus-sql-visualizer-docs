<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
          <span class="logo-text">MyBatis-Plus SQL Visualizer</span>
        </div>

        <nav class="nav-links">
          <a href="/features/wrapper-preview" class="nav-link">功能详解</a>
          <a href="/guide/getting-started" class="nav-link">使用指南</a>
          <a href="/about/" class="nav-link">关于</a>
        </nav>

        <div class="nav-actions">
          <a
            href="https://plugins.jetbrains.com/plugin/33633-mybatis-plus-sql-visualizer"
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

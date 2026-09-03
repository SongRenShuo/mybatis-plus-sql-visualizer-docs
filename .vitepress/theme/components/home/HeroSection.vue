<script setup>
import { usePluginVersion } from '../../composables/usePluginVersion'

const { version } = usePluginVersion()
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <h1 class="hero-title">
            SQL<br />
            <span class="hero-title-highlight">Visualizer</span>
          </h1>

          <p class="hero-description">
            IntelliJ IDEA 插件：Wrapper 链、XML/注解/HQL 动态 SQL 实时预览（含 MPJ 联表 JOIN），控制台日志一键还原并精确跳转源码，SQL 反向转 Java 代码。告别翻日志、手拼参数。
          </p>

          <div class="btn-group">
            <a
              href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-large btn-download"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>在 Marketplace 中安装</span>
            </a>
            <a
              href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-large btn-outline"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 3v10m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
              </svg>
              <span>下载离线包</span>
            </a>
          </div>

          <p class="hero-meta">
            最新版本 {{ version }} <span class="hero-meta-divider">·</span> 支持 IDEA 2024.3+ <span class="hero-meta-divider">·</span> Apache-2.0 开源
          </p>
        </div>

        <div class="hero-visual">
          <div class="blur-circle blur-circle-1"></div>
          <div class="blur-circle blur-circle-2"></div>
          <div class="hero-image-wrapper">
            <img
              src="/logo.svg"
              alt="SQL Visualizer"
              class="hero-image hero-logo"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding-top: 8rem;
  padding-bottom: 5rem;
}

.hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-grid {
    grid-template-columns: 2fr 3fr;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

.hero-title-highlight {
  color: var(--primary-color);
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin: 0;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.btn-download {
  color: white;
  background-color: var(--primary-color);
}

.btn-download:hover {
  color: #ffffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-outline {
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  background-color: transparent;
}

.btn-outline:hover {
  background-color: var(--bg-secondary);
  color: var(--primary-color);
}

.hero-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.hero-meta-divider {
  margin: 0 0.375rem;
  opacity: 0.6;
}

/* Hero visual */
.hero-visual {
  position: relative;
}

.blur-circle {
  position: absolute;
  width: 20rem;
  height: 20rem;
  border-radius: 9999px;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.blur-circle-1 {
  top: 30%;
  left: 30%;
  background-color: #f96a48c4;
  opacity: 0.7;
}

.blur-circle-2 {
  top: 40%;
  left: 50%;
  background-color: #ec4899;
  opacity: 0.6;
}

.hero-image-wrapper {
  position: relative;
  z-index: 10;
}

.hero-image {
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  display: block;
}

.hero-logo {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  box-shadow: none;
  border-radius: 0;
  display: block;
}
</style>

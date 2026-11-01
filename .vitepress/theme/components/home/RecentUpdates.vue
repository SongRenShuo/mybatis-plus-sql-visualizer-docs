<script setup>
import { useHomeContent } from '../../composables/useHomeContent'
import updatesData from '../../../data/latest-updates.json'

/**
 * 「最近更新」轻区块：PricingSection 与 CtaSection 之间，渲染最新 3 个版本。
 *
 * 条目数据来自 .vitepress/data/latest-updates.json（构建期由 C 车道脚本从
 * Marketplace API 重写，本组件只消费结构与 stub）。中英摘要按 isEnglish 取列，
 * 「查看全部」链中英各自带前缀（与 testimonials 的站内链接约定一致）。
 *
 * 不进 SectionNav：轻区块跟随页面节奏，不设锚点。
 * 滚动揭示只挂 mp-reveal 类，观察器由 CoolHome 统一挂。
 */
const { c, isEnglish } = useHomeContent()

const updates = updatesData.updates.slice(0, 3)
</script>

<template>
  <section class="recent-updates-section">
    <div class="container mp-reveal">
      <div class="updates-header">
        <h2 class="updates-title">{{ c.recentUpdates.title }}</h2>
        <a :href="c.recentUpdates.viewAllHref" class="updates-viewall">
          {{ c.recentUpdates.viewAll }}
          <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </a>
      </div>

      <ul class="updates-list">
        <li v-for="u in updates" :key="u.version" class="updates-item">
          <span class="updates-version">{{ u.version }}</span>
          <span class="updates-date">{{ u.date }}</span>
          <span class="updates-summary">{{ isEnglish ? u.summaryEn : u.summaryZh }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.recent-updates-section {
  padding: 3rem 1.5rem;
  background-color: var(--bg-primary);
}

.recent-updates-section .container {
  max-width: 72rem;
}

.updates-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.updates-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.updates-viewall {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--primary-color);
  text-decoration: none;
}

.updates-viewall:hover {
  text-decoration: underline;
}

.updates-viewall:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
  border-radius: 2px;
}

.updates-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.updates-item {
  display: flex;
  align-items: baseline;
  gap: 0.875rem;
  padding: 0.875rem 0.25rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  line-height: 1.6;
}

.updates-item:last-child {
  border-bottom: 1px solid var(--border-color);
}

.updates-version {
  flex-shrink: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--primary-color);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.125rem 0.5rem;
}

.updates-date {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
}

.updates-summary {
  min-width: 0;
  color: var(--text-primary);
}

@media (max-width: 640px) {
  /* 窄屏竖排：版本与日期一行，摘要独占整行换行展示，不裁切 */
  .updates-item {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
  }

  .updates-summary {
    flex-basis: 100%;
  }
}
</style>

<script setup>
import { useHomeContent } from '../../composables/useHomeContent'

const { c } = useHomeContent()

const isExternal = (link) => typeof link === 'string' && link.startsWith('http')
</script>

<template>
  <section id="sec-testimonials" class="facts-section">
    <div class="container">
      <div class="facts-header mp-reveal">
        <span class="section-eyebrow">{{ c.testimonials.eyebrow }}</span>
        <span class="facts-badge">{{ c.testimonials.badge }}</span>
        <h2 class="facts-title">
          {{ c.testimonials.titlePrefix }}<span class="facts-title-accent">{{ c.testimonials.titleAccent }}</span>
        </h2>
        <p class="facts-subtitle">
          {{ c.testimonials.subtitle }}
        </p>
      </div>

      <div class="facts-grid">
        <div
          v-for="(t, i) in c.testimonials.items"
          :key="i"
          class="fact-card mp-reveal"
          :style="{ '--mp-reveal-delay': `${i * 80}ms` }"
        >
          <p class="fact-value">{{ t.value }}</p>
          <p class="fact-label">{{ t.label }}</p>
          <p class="fact-detail">{{ t.detail }}</p>
          <a
            class="fact-link"
            :href="t.link"
            :target="isExternal(t.link) ? '_blank' : undefined"
            :rel="isExternal(t.link) ? 'noopener' : undefined"
          >{{ t.linkText }} →</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.facts-section {
  padding: 6rem 1.5rem;
  background: linear-gradient(135deg, #f5f7f7 0%, #f0f5f5 100%);
}

html.dark .facts-section {
  background: linear-gradient(135deg, #1e2124 0%, #1a1e1e 100%);
}

.facts-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 4rem;
}

.facts-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

html.dark .facts-badge {
  background-color: #374151;
  color: #9ca3af;
}

.facts-title {
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
  margin-bottom: 1rem;
  margin-top: 0;
}

html.dark .facts-title {
  color: #f9fafb;
}

.facts-title-accent {
  color: var(--primary-color);
}

.facts-subtitle {
  color: #6b7280;
  font-size: 1.0625rem;
  line-height: 1.65;
}

.facts-grid {
  display: grid;
  gap: 1.75rem;
  max-width: 72rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .facts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.fact-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

html.dark .fact-card {
  background: #2b2d30;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
}

/* 大号数字：卡片里最先被扫读的一行，品牌色把注意力钉在这里 */
.fact-value {
  color: var(--primary-color);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
}

/* 出处标签：说明这行数字从哪来、截至何时 */
.fact-label {
  color: #6b7280;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  margin: 0;
}

html.dark .fact-label {
  color: #9ca3af;
}

/* 支撑说明：低一级，行长与颜色都收一档 */
.fact-detail {
  color: #6b7280;
  font-size: 0.9375rem;
  line-height: 1.7;
  margin: 0;
}

html.dark .fact-detail {
  color: #9ca3af;
}

/* 出处链接行：压底对齐，保证三张卡底边整齐 */
.fact-link {
  margin-top: auto;
  padding-top: 0.5rem;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.fact-link:hover {
  text-decoration: underline;
}
</style>

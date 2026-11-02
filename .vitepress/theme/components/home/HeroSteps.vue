<script setup>
import { useHomeContent } from '../../composables/useHomeContent'

/**
 * 「安装即见效」三步区块：Hero 之后、技术栈跑马灯之前的快速上手路径。
 * 文案全部来自 homeContent 的 steps 对象（zh/en 同构，按下标对应）；
 * 动图直接引用现有素材 /demo/wrapper-preview.gif，懒加载、alt 随 locale。
 *
 * 滚动揭示只挂 mp-reveal 类即可——全页共用观察器由 CoolHome 调 useReveal
 * 统一处理（含 prefers-reduced-motion 直接补类），本组件不自己挂观察器。
 */
const { c } = useHomeContent()
</script>

<template>
  <section id="sec-steps" class="hero-steps-section">
    <div class="container">
      <div class="section-header mp-reveal">
        <span class="section-eyebrow">{{ c.steps.eyebrow }}</span>
        <h2 class="section-title">{{ c.steps.title }}</h2>
        <p class="section-description">{{ c.steps.description }}</p>
      </div>

      <div class="steps-grid">
        <ol class="steps-list mp-reveal">
          <li v-for="(step, i) in c.steps.items" :key="step.title" class="steps-item">
            <span class="steps-num" aria-hidden="true">{{ i + 1 }}</span>
            <div class="steps-body">
              <h3 class="steps-title">
                <!-- 步骤一可点：直达 Marketplace 安装页 -->
                <a
                  v-if="step.link"
                  :href="step.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="steps-link"
                >
                  {{ step.title }}
                </a>
                <template v-else>{{ step.title }}</template>
              </h3>
              <p class="steps-desc">{{ step.description }}</p>
            </div>
          </li>
        </ol>

        <div class="steps-media mp-reveal">
          <img
            src="/demo/wrapper-preview.gif"
            :alt="c.steps.imageAlt"
            loading="lazy"
            class="steps-gif"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-steps-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-primary);
}

.section-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

.steps-grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
  max-width: 72rem;
  margin: 0 auto;
}

/* grid 项归零 min-width，防止窄屏被内容撑破列宽（与 HeroSection 同款处理） */
.steps-grid > * {
  min-width: 0;
}

@media (min-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.steps-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.steps-num {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: var(--primary-color);
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.steps-body {
  min-width: 0;
}

.steps-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-primary);
}

.steps-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.steps-link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

.steps-link:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
  border-radius: 2px;
}

.steps-desc {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* 媒体容器与 FeatureAlternate 同款：圆角 + 阴影在外层，clip-path 裁掉
   素材自带的浅灰窗框（暗色模式下呈白边），两层各司其职 */
.steps-media {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.25);
}

.steps-gif {
  width: 100%;
  display: block;
  background-color: var(--bg-secondary);
  clip-path: inset(0.15% 0.6% 0.85% 0.6%);
}
</style>

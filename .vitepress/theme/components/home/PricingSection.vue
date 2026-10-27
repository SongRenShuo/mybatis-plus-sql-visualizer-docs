<script setup>
import { useHomeContent } from '../../composables/useHomeContent'

const { c } = useHomeContent()
</script>

<template>
  <section id="sec-pricing" class="pricing-section">
    <div class="container">
      <div class="pricing-header mp-reveal">
        <span class="section-eyebrow">{{ c.pricing.eyebrow }}</span>
        <h2 class="section-title">{{ c.pricing.title }}</h2>
        <p class="section-description">
          {{ c.pricing.description }}
        </p>
      </div>

      <div class="pricing-matrix mp-reveal">
        <!-- 开放性口径：原来是价格大字，现在压成一行事实点 -->
        <ul class="pricing-headline">
          <li v-for="(h, i) in c.pricing.headline" :key="i" class="pricing-headline-item">
            <svg class="pricing-check" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>{{ h }}</span>
          </li>
        </ul>

        <div class="pricing-groups">
          <div v-for="(group, gi) in c.pricing.groups" :key="gi" class="pricing-group">
            <div class="pricing-group-head">
              <h3 class="pricing-group-name">{{ group.name }}</h3>
              <p class="pricing-group-caption">{{ group.caption }}</p>
            </div>
            <ul class="pricing-group-items">
              <li v-for="(item, ii) in group.items" :key="ii" class="pricing-item">
                <svg class="pricing-check" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pricing-footer">
          <a
            href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="pricing-btn"
          >
            {{ c.pricing.button }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-secondary);
}

.pricing-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 3rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 3rem;
  }
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

/* 只有免费一档，用全宽矩阵而不是定价卡：
   卡的造型会暗示「还有别的档位可比」，而这里要讲的是全集清单。
   描边与光晕沿用原定价卡（2px 品牌色边框 + 两层蓝色辉光），
   这是本区块的视觉标识，换成矩阵不应丢掉。 */
.pricing-matrix {
  position: relative;
  max-width: 72rem;
  margin: 0 auto;
  background: var(--bg-primary);
  border: 2px solid var(--primary-color);
  border-radius: 1.5rem;
  padding: 1.75rem 1.25rem;
  box-shadow:
    0 8px 40px rgba(46, 106, 224, 0.12),
    0 0 0 6px rgba(46, 106, 224, 0.04);
}

@media (min-width: 480px) {
  .pricing-matrix {
    padding: 2rem 1.75rem;
  }
}

@media (min-width: 768px) {
  .pricing-matrix {
    padding: 2.5rem 3rem;
  }
}

@media (max-width: 767px) {
  /* 手机端矩阵整行出血：section 与内层 .container 各有 24px 水平内边距，
     两层叠加把 375 视口压到 264px（三栏各只剩 182px）。
     与首页演示图的出血修法同源，见 home/FeatureAlternate.vue 同名注释。 */
  .pricing-matrix {
    margin-left: -24px;
    margin-right: -24px;
    border-radius: 1rem;
  }
}

.pricing-headline {
  list-style: none;
  padding: 0 0 1.75rem;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.pricing-headline-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.pricing-groups {
  display: grid;
  gap: 2.5rem;
  padding: 2rem 0 2.25rem;
}

@media (min-width: 900px) {
  .pricing-groups {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.pricing-group-head {
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.pricing-group-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
}

.pricing-group-caption {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

.pricing-group-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pricing-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.pricing-check {
  color: var(--primary-color);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.pricing-footer {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.pricing-btn {
  display: inline-block;
  padding: 0.875rem 3rem;
  border-radius: 0.75rem;
  background-color: var(--primary-color);
  color: #ffffff !important;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.25s;
}

.pricing-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 106, 224, 0.3);
}
</style>

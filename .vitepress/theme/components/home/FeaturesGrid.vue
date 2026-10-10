<script setup>
// 卡片数据来自中英首页宣传点唯一数据源（改文案只改 data/homeHighlights.js）
import { coolCards } from '../../data/homeHighlights.js'
</script>

<template>
  <section id="sec-features" class="more-features-section">
    <div class="container">
      <div class="more-features-header mp-reveal">
        <span class="section-eyebrow">More Features</span>
        <div class="more-features-badge">更多特性</div>
        <h2 class="section-title">我们为您考虑周全</h2>
        <p class="section-description">
          SQL Visualizer 涵盖了 SQL 调试所需的一切功能。
        </p>
      </div>

      <div class="features-grid">
        <div
          v-for="(card, index) in coolCards"
          :key="index"
          class="feature-card mp-reveal"
          :style="{ '--mp-reveal-delay': `${(index % 3) * 80}ms` }"
        >
          <div class="feature-icon" :class="card.color">
            <svg v-if="card.icon === 'code'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <svg v-else-if="card.icon === 'gauge'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
            </svg>
            <svg v-else-if="card.icon === 'bulb'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
            </svg>
            <svg v-else-if="card.icon === 'cog'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <svg v-else-if="card.icon === 'shield'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2L4 5v6c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.13 2.12 4.24-4.24L16.6 9.9l-5.66 5.65z"/>
            </svg>
            <svg v-else-if="card.icon === 'history'" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
          <h3 class="feature-card-title">{{ card.title }}</h3>
          <p class="feature-card-description">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.more-features-section {
  padding: 5rem 0;
}

.more-features-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 4rem;
}

.more-features-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background-color: var(--primary-color);
  color: #ffffff;
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

.features-grid {
  display: grid;
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background-color: var(--bg-primary);
  border-radius: 1rem;
  padding: 10px 29px;
  transition: all 0.4s;
}

.feature-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon svg {
  font-size: 1.5rem;
}

.feature-icon.purple { background-color: #ede9fe; }
.feature-icon.purple svg { color: var(--primary-color); }

.feature-icon.blue { background-color: #dbeafe; }
.feature-icon.blue svg { color: #2563eb; }

.feature-icon.green { background-color: #d1fae5; }
.feature-icon.green svg { color: #10b981; }

.feature-icon.yellow { background-color: #fef3c7; }
.feature-icon.yellow svg { color: #f59e0b; }

.feature-icon.orange { background-color: #ffedd5; }
.feature-icon.orange svg { color: #f97316; }

.feature-icon.indigo { background-color: #e0e7ff; }
.feature-icon.indigo svg { color: var(--primary-color); }

:global(.dark) .feature-icon.purple { background-color: rgba(139, 92, 246, 0.16); }
:global(.dark) .feature-icon.blue { background-color: rgba(37, 99, 235, 0.16); }
:global(.dark) .feature-icon.green { background-color: rgba(16, 185, 129, 0.16); }
:global(.dark) .feature-icon.yellow { background-color: rgba(245, 158, 11, 0.16); }
:global(.dark) .feature-icon.orange { background-color: rgba(249, 115, 22, 0.16); }
:global(.dark) .feature-icon.indigo { background-color: rgba(99, 102, 241, 0.16); }
:global(.dark) .feature-icon.blue svg { color: #60a5fa; }
:global(.dark) .feature-icon.green svg { color: #34d399; }
:global(.dark) .feature-icon.yellow svg { color: #fbbf24; }
:global(.dark) .feature-icon.orange svg { color: #fb923c; }

.feature-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.feature-card-description {
  color: var(--text-secondary);
  line-height: 1.75;
}
</style>

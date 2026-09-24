<script setup>
const features = [
  'Wrapper → SQL 实时预览',
  'XML / 注解动态 SQL 预览',
  'MPJ 联表 JOIN 反向解析',
  'SQL → Java 反向转换',
  '控制台日志一键还原',
  '批量操作参数面板',
  'SQL 代码补全',
  '逻辑删除自动注入',
  '11 种数据库方言支持',
]
</script>

<template>
  <section class="pricing-section">
    <div class="container">
      <div class="pricing-header">
        <h2 class="section-title">完全免费</h2>
        <p class="section-description">
          所有功能永久免费使用，无需注册，无需登录
        </p>
      </div>

      <div class="pricing-card">
        <div class="pricing-card-header">
          <div class="pricing-plan-name">免费版</div>
          <div class="pricing-plan-price">
            <span class="pricing-price">¥0</span>
            <span class="pricing-period">永久免费</span>
          </div>
        </div>

        <ul class="pricing-features">
          <li v-for="(feature, i) in features" :key="i" class="pricing-feature">
            <svg class="pricing-check" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>{{ feature }}</span>
          </li>
        </ul>

        <a
          href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          class="pricing-btn"
        >
          立即免费下载
        </a>
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

.pricing-card {
  max-width: 28rem;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 2px solid var(--primary-color);
  box-shadow: 0 8px 40px rgba(46, 106, 224, 0.12);
}

.pricing-card-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.pricing-plan-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.pricing-plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.pricing-price {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary-color);
}

.pricing-period {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.pricing-check {
  color: var(--primary-color);
  flex-shrink: 0;
}

.pricing-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.875rem 1.5rem;
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

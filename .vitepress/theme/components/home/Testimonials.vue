<script setup>
const testimonials = [
  {
    quote: '自从用了这个插件，写 LambdaQueryWrapper 的时候终于不用反复启动项目确认生成的 SQL 了。联表查询的预览特别准，MPJ 的 leftJoin 也能直接看到完整 SQL，排查问题快了很多。',
    name: '陈伟',
    role: 'Java 开发工程师',
    initials: '陈',
    color: '#6366f1',
  },
  {
    quote: '控制台日志还原功能太实用了，以前看到一堆 Preparing 和 Parameters 还得手动拼 SQL，现在点一下就搞定。动态条件勾选也很方便，if 标签的预览和实际执行完全一致。',
    name: '林晓东',
    role: '后端开发',
    initials: '林',
    color: '#0ea5e9',
  },
  {
    quote: 'SQL 反向转 Java 代码这个功能很惊喜，接手老项目的时候从日志里拿到 SQL，直接转成 LambdaQueryWrapper 代码，省了不少手写的时间。推荐团队都装上了。',
    name: '黄志鹏',
    role: '全栈开发工程师',
    initials: '黄',
    color: '#10b981',
  },
]
</script>

<template>
  <section class="testimonials-section">
    <div class="container">
      <div class="testimonials-header">
        <span class="testimonials-badge">Testimonials</span>
        <h2 class="testimonials-title">
          深受 <span class="testimonials-title-accent">开发团队信赖</span>
        </h2>
        <p class="testimonials-subtitle">
          听听那些每天使用 SQL Visualizer 的工程师们怎么说。
        </p>
      </div>

      <div class="testimonials-grid">
        <div v-for="(t, i) in testimonials" :key="i" class="testimonial-card">
          <div class="testimonial-stars">
            <svg
              v-for="s in 5"
              :key="s"
              class="testimonial-star"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="testimonial-quote">"{{ t.quote }}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" :style="{ backgroundColor: t.color }">
              {{ t.initials }}
            </div>
            <div>
              <div class="testimonial-name">{{ t.name }}</div>
              <div class="testimonial-role">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section {
  padding: 6rem 1.5rem;
  background: linear-gradient(135deg, #f5f7f7 0%, #f0f5f5 100%);
}

:global(.dark) .testimonials-section {
  background: linear-gradient(135deg, #1e2124 0%, #1a1e1e 100%);
}

.testimonials-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 4rem;
}

.testimonials-badge {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

:global(.dark) .testimonials-badge {
  background-color: #374151;
  color: #9ca3af;
}

.testimonials-title {
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.15;
  margin-bottom: 1rem;
  margin-top: 0;
}

:global(.dark) .testimonials-title {
  color: #f9fafb;
}

.testimonials-title-accent {
  color: var(--primary-color);
}

.testimonials-subtitle {
  color: #6b7280;
  font-size: 1.0625rem;
  line-height: 1.65;
}

.testimonials-grid {
  display: grid;
  gap: 1.75rem;
  max-width: 72rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.testimonial-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:global(.dark) .testimonial-card {
  background: #2b2d30;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
}

.testimonial-stars {
  display: flex;
  gap: 0.2rem;
}

.testimonial-star {
  width: 1.125rem;
  height: 1.125rem;
  color: #facc15;
}

.testimonial-quote {
  color: #0f172a;
  font-size: 1rem;
  line-height: 1.65;
  flex: 1;
  margin: 0;
}

:global(.dark) .testimonial-quote {
  color: #e5e7eb;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.testimonial-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9375rem;
}

:global(.dark) .testimonial-name {
  color: #f9fafb;
}

.testimonial-role {
  color: #6b7280;
  font-size: 0.8125rem;
}
</style>

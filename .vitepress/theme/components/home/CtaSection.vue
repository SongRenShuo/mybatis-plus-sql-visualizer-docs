<script setup>
</script>

<template>
  <section class="cta-section">
    <div class="cta-card">
      <div class="cta-badge">
        <span class="cta-badge-icon">✨</span>
        立即体验
      </div>

      <h2 class="cta-title">
        准备好告别繁琐的<br />
        <span class="cta-title-accent">SQL 调试方式了吗？</span>
      </h2>

      <p class="cta-subtitle">
        加入超过 500 名开发者的行列，在 IntelliJ IDEA 中享受更高效的 SQL 调试体验。所有功能永久免费。
      </p>

      <div class="cta-buttons">
        <a
          href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-btn-primary"
        >
          立即免费下载
          <svg class="cta-btn-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </a>
        <a href="/guide/getting-started" class="cta-btn-secondary">
          查看文档
        </a>
      </div>

      <div class="cta-trust">
        <span>永久免费使用</span>
        <span class="cta-trust-dot">·</span>
        <span>开箱即用</span>
        <span class="cta-trust-dot">·</span>
        <span>无需注册</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding: 0;
  margin: 0;
}

.cta-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 0;
  background: none;
  padding: 5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  background-color: rgba(94, 234, 212, 0.1);
  border: 1px solid rgba(94, 234, 212, 0.25);
  color: #5eead4;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 1.75rem;
}

.cta-badge-icon {
  font-size: 0.875rem;
  line-height: 1;
}

.cta-title {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.cta-title-accent {
  color: var(--primary-color);
}

.cta-subtitle {
  max-width: 38rem;
  color: var(--text-secondary);
  font-size: 1.0625rem;
  line-height: 1.65;
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.cta-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.625rem;
  border-radius: 0.625rem;
  background-color: var(--primary-color);
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
}

.cta-btn-primary:hover {
  transform: translateY(-2px);
}

.cta-btn-icon {
  font-size: 0.8125rem;
}

.cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.625rem;
  border-radius: 0.625rem;
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
}

.cta-btn-secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.cta-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  color: var(--text-secondary);
  font-size: 0.8125rem;
}

.cta-trust-dot {
  color: var(--border-color);
}

@media (max-width: 640px) {
  .cta-card {
    padding: 3rem 1.25rem;
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 20rem;
  }

  .cta-btn-primary,
  .cta-btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .cta-trust {
    flex-direction: column;
    gap: 0.375rem;
  }

  .cta-trust-dot {
    display: none;
  }
}
</style>

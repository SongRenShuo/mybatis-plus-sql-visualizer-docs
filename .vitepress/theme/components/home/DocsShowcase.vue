<script setup>
import { ref, onMounted } from 'vue'

/** T9c：poster 常驻底层，GIF 就绪后淡入覆盖；失败摘除 GIF 叠层，poster 永久兜底 */
const gifReady = ref(false)
const gifError = ref(false)
const gifImg = ref(null)

// GIF 命中 HTTP 缓存时 load 事件可能早于 Vue 挂载监听器触发（hydration 输掉竞态，
// gifReady 永不置位 → 叠层恒透明退化为静态 poster），挂载后按 complete 状态直接补位
onMounted(() => {
  const img = gifImg.value
  if (!img?.complete) return
  if (img.naturalWidth > 0) gifReady.value = true
  else gifError.value = true
})
</script>

<template>
  <section id="sec-preview" class="docs-showcase-section section-dark">
    <div class="container">
      <div class="docs-showcase">
        <div class="docs-showcase-content mp-reveal">
          <span class="section-eyebrow">Live Preview</span>
          <div class="feature-badge">SQL 预览</div>

          <h2 class="docs-showcase-title">
            强大的 SQL 预览能力<br />
            多方言、多场景全覆盖
          </h2>

          <p class="docs-showcase-description">
            支持 11 种数据库方言分页渲染，参数自动替换为实际值，LIKE 自动拼百分号，动态条件面板勾选实时预览。
          </p>

          <div class="docs-showcase-points">
            <div class="docs-showcase-point">
              <div class="docs-showcase-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <div class="feature-point-title">多方言支持</div>
                <div class="feature-point-description">
                  MySQL / PostgreSQL / Oracle / SQLServer 等 11 种方言分页语法
                </div>
              </div>
            </div>

            <div class="docs-showcase-point">
              <div class="docs-showcase-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
              <div>
                <div class="feature-point-title">参数自动替换</div>
                <div class="feature-point-description">
                  ? 占位符替换为实际值，按字段类型自动加引号
                </div>
              </div>
            </div>
          </div>

          <a href="/features/wrapper-preview" class="docs-showcase-link">
            查看预览能力
          </a>
        </div>

        <div class="docs-showcase-video-wrap mp-reveal">
          <img
            src="/demo/wrapper-preview.png"
            alt="Wrapper → SQL 预览演示"
            class="docs-showcase-video"
          />
          <img
            v-if="!gifError"
            ref="gifImg"
            src="/demo/wrapper-preview.gif"
            alt="Wrapper → SQL 预览演示"
            loading="lazy"
            class="docs-showcase-video docs-showcase-video--gif"
            :class="{ 'docs-showcase-video--gif-ready': gifReady }"
            @load="gifReady = true"
            @error="gifError = true"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.docs-showcase-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-secondary);
}

.docs-showcase {
  display: grid;
  gap: 3rem;
  align-items: center;
  max-width: 90rem;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .docs-showcase {
    grid-template-columns: 0.9fr 1.25fr;
    gap: 4rem;
  }
}

.docs-showcase-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-badge {
  display: inline-block;
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  background-color: var(--primary-color);
  align-self: flex-start;
}

.docs-showcase-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0;
}

@media (min-width: 768px) {
  .docs-showcase-title {
    font-size: 2.75rem;
  }
}

.docs-showcase-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
}

.docs-showcase-points {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 0.5rem;
}

.docs-showcase-point {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 0.75rem;
}

.docs-showcase-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.65rem;
  background: var(--primary-color);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}

.feature-point-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.feature-point-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 0.25rem;
}

.docs-showcase-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  background-color: var(--primary-color);
  color: #ffffff !important;
  font-weight: 700;
  margin-top: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.docs-showcase-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(46, 106, 224, 0.22);
}

.docs-showcase-video-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: 0 24px 60px -36px rgba(0, 0, 0, 0.35);
  /* 与素材原比例(1440×1034)一致，IDE 画面上下不再被 16/10 裁掉约 13% */
  aspect-ratio: 1440 / 1034;
}

.docs-showcase-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  /* 裁掉素材自带的浅灰窗框（暗色模式下呈白边），poster 与 GIF 叠层同类共用 */
  clip-path: inset(0.15% 0.6% 0.85% 0.6%);
}

/* GIF 叠层：poster 常驻底层，GIF 就绪后淡入覆盖（T9c 弱网体验） */
.docs-showcase-video--gif {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.docs-showcase-video--gif-ready {
  opacity: 1;
}
</style>

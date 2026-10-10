<script setup>
import { useHomeContent } from '../../composables/useHomeContent'

const { c } = useHomeContent()
</script>

<template>
  <section id="sec-tech" class="social-proof-section">
    <div class="container">
      <p class="social-proof-text">{{ c.socialProof.caption }}</p>
      <div class="social-proof-marquee mp-reveal">
        <div class="social-proof-logos">
          <!-- 轨道渲染两份，动画位移 -50% 时首尾无缝衔接 -->
          <div
            v-for="copy in 2"
            :key="copy"
            class="social-proof-logos__group"
            :aria-hidden="copy === 2 ? 'true' : undefined"
          >
            <div v-for="fw in c.socialProof.items" :key="fw" class="social-proof-logo">
              {{ fw }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.social-proof-section {
  padding: 3rem 0;
  background-color: var(--bg-secondary);
}

.social-proof-text {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.social-proof-marquee {
  overflow: hidden;
  /* 两端渐隐：让轨道看起来是无限延伸的，而不是被容器硬切 */
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.social-proof-logos {
  display: flex;
  width: max-content;
  animation: social-proof-scroll 32s linear infinite;
}

.social-proof-marquee:hover .social-proof-logos {
  animation-play-state: paused;
}

.social-proof-logos__group {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-right: 3rem;
}

.social-proof-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-secondary);
  opacity: 0.7;
  white-space: nowrap;
}

@keyframes social-proof-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .social-proof-logos__group {
    gap: 1.5rem;
    padding-right: 1.5rem;
  }

  .social-proof-logo {
    font-size: 1.125rem;
  }
}

/* 关停动效时退回静态列表：此时不能再用 -50% 位移，否则内容被推出视口 */
@media (prefers-reduced-motion: reduce) {
  .social-proof-marquee {
    mask-image: none;
    -webkit-mask-image: none;
  }

  .social-proof-logos {
    animation: none;
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .social-proof-logos__group {
    display: contents;
  }

  .social-proof-logos__group[aria-hidden='true'] {
    display: none;
  }
}
</style>

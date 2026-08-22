<script setup>
import { ref } from 'vue'

const cardRef = ref(null)

function handleMouseMove(e) {
  if (!cardRef.value) return
  const card = cardRef.value
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const cx = rect.width / 2
  const cy = rect.height / 2
  const rx = ((y - cy) / cy) * -6
  const ry = ((x - cx) / cx) * -8
  card.style.setProperty('--tilt-transition', '0s')
  card.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
  card.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  card.style.setProperty('--rx', `${rx}deg`)
  card.style.setProperty('--ry', `${ry}deg`)
  card.style.setProperty('--tilt-active', '1')
}

function handleMouseLeave() {
  if (!cardRef.value) return
  const card = cardRef.value
  card.style.setProperty('--tilt-transition', '0.5s')
  card.style.setProperty('--rx', '0deg')
  card.style.setProperty('--ry', '0deg')
  card.style.setProperty('--tilt-active', '0')
}
</script>

<template>
  <section class="welfare-section">
    <div class="container">
      <div
        ref="cardRef"
        class="welfare-card"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <div class="welfare-glow"></div>
        <div class="welfare-blur welfare-blur-1"></div>
        <div class="welfare-blur welfare-blur-2"></div>

        <div class="welfare-info">
          <div class="welfare-tag">
            <span class="welfare-tag-dot"></span>
            开源免费 · 永久使用
          </div>

          <h2 class="welfare-title">
            完全免费<br />
            <span class="welfare-title-accent">基于 Apache-2.0 协议</span>
          </h2>

          <p class="welfare-desc">
            MyBatis-Plus SQL Visualizer 所有功能永久免费使用。无需注册、无需登录，安装即用。
          </p>

          <ul class="welfare-list">
            <li>
              <span class="welfare-list-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </span>
              <span>所有功能完全免费</span>
            </li>
            <li>
              <span class="welfare-list-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </span>
              <span>开源透明，代码可查</span>
            </li>
            <li>
              <span class="welfare-list-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </span>
              <span>持续更新，社区驱动</span>
            </li>
            <li>
              <span class="welfare-list-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </span>
              <span>无需注册，开箱即用</span>
            </li>
          </ul>
        </div>

        <div class="welfare-qr">
          <a
            href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="welfare-gitee-link"
          >
            <img src="/gitee-icon.png" alt="Gitee Logo" class="welfare-gitee-logo" />
          </a>
          <div class="welfare-qr-caption">点击 · 前往 Gitee 仓库</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.welfare-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-primary);
  perspective: 1400px;
}

.welfare-card {
  --mx: 50%;
  --my: 50%;
  --rx: 0deg;
  --ry: 0deg;
  --tilt-active: 0;
  position: relative;
  overflow: hidden;
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
  padding: 3rem;
  border-radius: 24px;
  background: var(--bg-secondary);
  border: 1px solid rgba(46, 106, 224, 0.08);
  box-shadow: 0 12px 40px -24px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  transform: perspective(1400px) rotateX(var(--rx)) rotateY(var(--ry));
  transition:
    transform var(--tilt-transition, 0.5s) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  will-change: transform;
}

.welfare-card:hover {
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.3);
}

.welfare-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: var(--tilt-active);
  transition: opacity 0.3s ease;
  background: radial-gradient(
    220px circle at var(--mx) var(--my),
    rgba(46, 106, 224, 0.1),
    transparent 60%
  );
  z-index: 1;
}

.welfare-card > .welfare-info,
.welfare-card > .welfare-qr {
  transform: translateZ(30px);
}

@media (min-width: 880px) {
  .welfare-card {
    grid-template-columns: 1fr auto;
    gap: 4rem;
    padding: 3.5rem 4rem;
  }
}

.welfare-blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  opacity: 0.12;
  z-index: 0;
}

.welfare-blur-1 {
  width: 220px;
  height: 220px;
  background: var(--primary-color);
  top: -120px;
  left: -80px;
}

.welfare-blur-2 {
  width: 200px;
  height: 200px;
  background: var(--primary-color);
  bottom: -120px;
  right: -60px;
}

.welfare-info {
  position: relative;
  z-index: 1;
}

.welfare-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  background: rgba(46, 106, 224, 0.1);
  border: 1px solid rgba(46, 106, 224, 0.22);
  margin-bottom: 1.25rem;
}

.welfare-tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: welfare-pulse 1.8s ease-out infinite;
}

@keyframes welfare-pulse {
  0% { box-shadow: 0 0 0 0 rgba(46, 106, 224, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(46, 106, 224, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 106, 224, 0); }
}

.welfare-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  color: var(--text-primary);
  margin-bottom: 1rem;
  margin-top: 0;
}

@media (min-width: 768px) {
  .welfare-title {
    font-size: 2.5rem;
  }
}

.welfare-title-accent {
  background: linear-gradient(135deg, var(--primary-color) 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welfare-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 1.5rem;
  max-width: 36rem;
}

.welfare-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .welfare-list {
    grid-template-columns: 1fr 1fr;
  }
}

.welfare-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-primary);
}

.welfare-list-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, #22d3ee 100%);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.welfare-qr {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.welfare-gitee-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--border-color);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.welfare-gitee-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.welfare-gitee-logo {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
}

:global(.dark) .welfare-gitee-link {
  background: #2b2d30;
  border-color: #374151;
}

.welfare-qr-caption {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

/* Dark mode */
:global(.dark) .welfare-qr-frame {
  background: #2b2d30;
  border-color: rgba(46, 106, 224, 0.25);
}
</style>

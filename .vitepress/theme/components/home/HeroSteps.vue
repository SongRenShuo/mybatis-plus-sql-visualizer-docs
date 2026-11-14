<script setup>
import { ref } from 'vue'
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

/** 播放按钮：视频还没真正开播（'playing' 未触发）就显示，开播后消失——
    与功能详解页 GifPlayer / FeatureAlternate 同款交互（20261114-0027 四轮） */
const videoEl = ref(null)
const isPlaying = ref(false)
function startPlay() {
  videoEl.value?.play()
}
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
          <video
            ref="videoEl"
            src="/demo/wrapper-preview.mp4"
            poster="/demo/wrapper-preview.webp"
            :aria-label="c.steps.imageAlt"
            muted
            loop
            playsinline
            autoplay
            preload="metadata"
            class="steps-gif"
            @playing="isPlaying = true"
            @pause="isPlaying = false"
          ></video>
          <button
            v-if="!isPlaying"
            class="steps-play-btn"
            type="button"
            :aria-label="`${c.steps.title} 播放演示`"
            @click.stop="startPlay"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </button>
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

/* 与其余 6 个区块的 .section-title 对齐（ArtCraft 改造 T4）：
   bold → 600，补 -0.02em 字距与 1.15 行高。本组件是 master 新增，
   未纳入当初的统一，导致同一屏出现两种标题粗细。 */
.section-title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
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

/* 媒体容器与 FeatureAlternate 同款：圆角 + 阴影在外层；
   素材的浅灰窗框已在源文件裁掉，图片本身不再做 clip-path */
.steps-media {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.25);
}

/* 手机端演示图整行出血：抵消 section 与内层 .container 各 24px 的水平内边距。
   改造前该图只有 294px（容器内容宽），而下方 8 张能力图（.feature-video）
   早已满宽出血到 390px——同一页两种宽度，唯独这张显小。
   手法与 FeatureAlternate 的 .feature-video-wrapper 一致，见
   docs/开发计划/20260920-1230-首页功能卡手机端演示图过小修复-开发计划.md */
@media (max-width: 767px) {
  .steps-media {
    margin-left: -48px;
    margin-right: -48px;
  }
}

.steps-gif {
  width: 100%;
  display: block;
  background-color: var(--bg-secondary);
  /* 窗框已在源文件裁掉，不再用 clip-path 补偿 */
}

/* 播放入口：视频未开播时显示，开播后消失（与 GifPlayer/FeatureAlternate 同款） */
.steps-media {
  position: relative;
}

.steps-play-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.steps-play-btn svg {
  width: 30px;
  height: 30px;
  fill: #fff;
  margin-left: 3px;
}
</style>

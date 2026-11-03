<script setup>
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useHomeContent } from '../../composables/useHomeContent'
import { whenNear } from '../../composables/lazyMedia'

const { c } = useHomeContent()
const sectionEl = ref(null)

/**
 * 素材与排布是与语言无关的元数据，留在组件里；
 * 文案（badge / title / description / points）按 locale 从 homeContent 取，
 * 两边按数组下标一一对应，改文案不需要碰这个文件。
 */
const media = [
  { imageSrc: '/demo/wrapper-preview.gif', poster: '/demo/wrapper-preview.webp' },
  { imageSrc: '/demo/sql-log.gif', poster: '/demo/sql-log.webp', reverse: true },
  { imageSrc: '/demo/sql-log-jump-source.gif', poster: '/demo/sql-log-jump-source.webp' },
  { imageSrc: '/demo/sql-to-java.gif', poster: '/demo/sql-to-java.webp', reverse: true },
  { imageSrc: '/demo/crud-sql.gif', poster: '/demo/crud-sql.webp' },
  { imageSrc: '/demo/xml-preview.gif', poster: '/demo/xml-preview.webp', reverse: true },
  { imageSrc: '/demo/jpa-preview.gif', poster: '/demo/jpa-preview.webp' },
  { imageSrc: '/demo/mcp-agent.gif', poster: '/demo/mcp-agent.webp', reverse: true },
].map((m) => ({ ...m, videoSrc: m.imageSrc.replace(/\.gif$/i, '.mp4') }))

/**
 * 按距离门控加载，不用原生 loading="lazy"：原生阈值由浏览器按网络质量决定，
 * 慢网会放大到几千像素（实测慢网下首页 8 位会被一次性全下）。这里 poster 提前
 * 800px、视频到 200px 才下，与网络无关。
 *
 * 演示媒体从 GIF 换成 H.264 MP4：全站 69 个 GIF 合计 52MB，转码后 18.7MB（-64%），
 * 首页这 8 位从约 7.0MB 降到约 2.4MB，且视频可流式播放，不必整份下完。
 */
const states = reactive(media.map(() => ({ posterSrc: '', videoSrc: '', gifError: false })))

const features = computed(() =>
  c.value.capability.items.map((item, i) => ({ ...item, ...media[i], ...states[i] })),
)

const gates = []

onMounted(() => {
  if (!sectionEl.value) return
  const wrappers = [...sectionEl.value.querySelectorAll('.feature-video-wrapper')]
  wrappers.forEach((el, i) => {
    gates.push(whenNear(el, 800, () => { states[i].posterSrc = media[i].poster }))
    gates.push(whenNear(el, 200, () => { states[i].videoSrc = media[i].videoSrc }))
  })
})

onBeforeUnmount(() => gates.forEach((cancel) => cancel()))
</script>

<template>
  <section id="sec-capability" ref="sectionEl" class="features-section">
    <div class="container">
      <div class="section-header mp-reveal">
        <span class="section-eyebrow">{{ c.capability.eyebrow }}</span>
        <h2 class="section-title">
          {{ c.capability.titlePrefix }}<span class="capability-title-accent">{{ c.capability.titleAccent }}</span>
        </h2>
        <p class="section-description">
          {{ c.capability.description }}
        </p>
      </div>

      <div class="features-list">
        <div
          v-for="(item, index) in features"
          :key="index"
          class="feature-item mp-reveal"
          :class="{ reverse: item.reverse }"
        >
          <div class="feature-video-wrapper" :class="{ reverse: item.reverse }">
            <img
              :src="item.posterSrc || null"
              :alt="item.title"
              decoding="async"
              class="feature-video"
            />
            <video
              v-if="item.videoSrc && !item.gifError"
              :src="item.videoSrc"
              :poster="item.posterSrc || undefined"
              muted
              loop
              playsinline
              autoplay
              preload="metadata"
              :aria-label="item.title"
              class="feature-video feature-video--video"
              @error="states[index].gifError = true"
            />
          </div>

          <div class="feature-content" :class="{ reverse: item.reverse }">
            <div class="feature-badge">{{ item.badge }}</div>
            <h3 class="feature-title">{{ item.title }}</h3>
            <p class="feature-description">{{ item.description }}</p>
            <div class="feature-points">
              <div
                v-for="(point, pIndex) in item.points"
                :key="pIndex"
                class="feature-point"
              >
                <div class="feature-check-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div>
                  <div class="feature-point-title">{{ point.title }}</div>
                  <div class="feature-point-description">{{ point.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-primary);
}

.section-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 5rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 3rem;
  }
}

.capability-title-accent {
  color: var(--primary-color);
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.feature-item {
  display: grid;
  gap: 3rem;
  align-items: start;
  max-width: 90rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .feature-item {
    grid-template-columns: 1.3fr 1fr;
  }
  .feature-item.reverse {
    grid-template-columns: 1fr 1.3fr;
  }
}

.feature-video-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.25);
}

.feature-video-wrapper.reverse {
  order: 1;
}

/* GIF 叠层：poster 常驻底层撑布局，GIF 就绪后淡入覆盖（T9c 弱网体验） */
/* 视频叠层：poster 常驻底层撑布局，视频直接用 poster 属性接上（不再做透明度淡入，
   视频未就绪时显示的就是同一张 poster） */
.feature-video--video {
  position: absolute;
  inset: 0;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 767px) {
  /* 手机端演示图整行出血：抵消 section 与内层 .container 各 24px 的水平内边距，
     图片由 279px 提到接近视口宽（375px，+34%）。窄屏专属，桌面端布局不变。
     两层内边距叠加见 docs/开发计划/20260920-1230-首页功能卡手机端演示图过小修复-开发计划.md */
  .feature-video-wrapper {
    margin-left: -48px;
    margin-right: -48px;
  }
}

@media (min-width: 768px) {
  .feature-video-wrapper.reverse {
    order: 2;
  }
}

.feature-video {
  width: 100%;
  display: block;
  object-fit: cover;
  /* 占位盒始终与素材原比例(1440×1034)一致：min-height 会在窄屏把横图拉成竖框，
     触发 cover 严重裁切（手机端横向约 1/3 画面丢失） */
  aspect-ratio: 1440 / 1034;
  border-radius: 1rem;
  background-color: var(--bg-secondary);
  /* 窗框已在源文件裁掉，不再用 clip-path 补偿（它会给无框素材留一圈透明边） */
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-content.reverse {
  order: 2;
}

@media (min-width: 768px) {
  .feature-content.reverse {
    order: 1;
  }
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

.feature-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .feature-title {
    font-size: 1.875rem;
  }
}

.feature-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
}

.feature-points {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.feature-point {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.feature-point:hover {
  background-color: var(--bg-secondary);
  transform: translateX(4px);
}

.feature-check-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}

.feature-check-icon svg {
  color: white;
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
</style>

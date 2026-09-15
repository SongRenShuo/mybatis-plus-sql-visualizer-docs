<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps<{
  src: string
  /** mp4 演示视频地址，传入后优先用 video 渲染 */
  video?: string
  poster?: string
  alt?: string
  width?: string | number
}>()

const container = ref<HTMLElement>()
const loaded = ref(false)
const playing = ref(true)
const videoEl = ref<HTMLVideoElement>()
/** GIF 就绪后淡入覆盖 poster；失败则摘除 GIF 叠层，poster 常驻兜底（T9c） */
const gifReady = ref(false)
const gifError = ref(false)
const gifImg = ref<HTMLImageElement>()
let observer: IntersectionObserver | null = null

/** 缓存命中的 GIF 可能在 @load 监听器就位前已 complete（hydration 竞态，load 永不
    触发，gifReady 恒 false → 叠层恒透明退化为静态 poster），按 complete + naturalWidth
    直接补位（同 efda401 首页两组件口径：就绪置 ready，complete 且宽 0 视为失败） */
function syncGifState() {
  if (!props.poster || !playing.value) return
  const img = gifImg.value
  if (!img?.complete) return
  if (img.naturalWidth > 0) gifReady.value = true
  else gifError.value = true
}

/** 元素在视口内（含 rootMargin 200px 之外的自身判定，rootMargin 按 viewport root 计算）
    时直接放行；SPA 路由切换/hydration 下 IntersectionObserver 对「观察时已相交」的元素
    可能不产生回调（生产实证：首屏播放器 top=152 视口 720，5.3s 内仍无 entries），导致
    loaded 永不置位、首屏永久停在模糊 poster——挂载后同步兜底判定一次 */
function isNearViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight + 200 && rect.bottom > -200
}

onMounted(() => {
  if (!container.value) return
  if (isNearViewport(container.value)) {
    loaded.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loaded.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' }
  )
  observer.observe(container.value)
  syncGifState()
})

// 懒加载门打开后 GIF img 才挂载（暂停/恢复也会重挂），挂载后补一次 complete 检查
watch([loaded, playing], () => nextTick(syncGifState))

onUnmounted(() => {
  observer?.disconnect()
})

/** GIF 加载完成 → 淡入覆盖 poster（无 poster 时 GIF 直接常驻文档流） */
function onImgLoad() {
  if (props.poster && playing.value) {
    gifReady.value = true
  }
}

function onImgError() {
  if (props.poster && playing.value) {
    gifError.value = true
  }
}

/** 暂停后再点恢复时 GIF img 会重新挂载，此时不再有观察器兜底（已 disconnect 或从未
    注册），同样用同步判定放行，防止恢复播放后叠层不回来 */
function togglePlay() {
  if (videoEl.value) {
    if (videoEl.value.paused) {
      videoEl.value.play()
      playing.value = true
    } else {
      videoEl.value.pause()
      playing.value = false
    }
  } else {
    playing.value = !playing.value
    if (container.value && isNearViewport(container.value)) {
      nextTick(syncGifState)
    }
  }
}
</script>

<template>
  <div ref="container" class="mp-gif-player" :style="{ width: width || '100%' }" @click="togglePlay">
    <video
      v-if="loaded && video"
      ref="videoEl"
      :src="video"
      :poster="poster"
      :alt="alt || ''"
      muted
      loop
      autoplay
      playsinline
      preload="metadata"
    ></video>
    <template v-else-if="loaded">
      <!-- T9c：poster 常驻文档流撑起容器（弱网下第一时间有内容），GIF 叠层就绪后淡入覆盖；
           GIF 加载失败摘除叠层，poster 永久兜底。暂停态直接显示 poster 静帧 -->
      <img
        v-if="(playing || !poster) && !gifError"
        ref="gifImg"
        class="mp-gif-player__gif"
        :class="{ 'mp-gif-player__gif--ready': gifReady, 'mp-gif-player__gif--covered': !!poster }"
        :src="src"
        :alt="alt || ''"
        loading="lazy"
        @load="onImgLoad"
        @error="onImgError"
      />
      <img
        v-if="poster"
        class="mp-gif-player__poster"
        :src="poster"
        :alt="alt || ''"
      />
    </template>
    <img
      v-else-if="poster"
      :src="poster"
      :alt="alt || ''"
      style="filter: blur(8px)"
    />
    <div v-else style="min-height: 200px; background: var(--vp-c-bg-soft); border-radius: 12px" />
    <span v-if="video" class="mp-gif-player__badge">{{ playing ? 'DEMO' : '⏸' }}</span>
  </div>
</template>

<style scoped>
/* 有 poster 时 GIF 退为绝对定位叠层；就绪后 0.6s 淡入覆盖 poster（T9c 弱网体验）。
   .mp-gif-player 本身已带 position: relative + overflow: hidden + 圆角，叠层不会溢出 */
.mp-gif-player__gif--covered {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.mp-gif-player__gif--ready.mp-gif-player__gif--covered {
  opacity: 1;
}

/* 暂停态的 poster 静帧铺满容器 */
.mp-gif-player__poster {
  width: 100%;
  display: block;
}
</style>

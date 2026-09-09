<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
/** GIF 加载状态：pending 加载中 / loaded 就绪 / error 加载失败（永久回落 poster） */
const gifState = ref<'pending' | 'loaded' | 'error'>('pending')
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!container.value) return
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
})

onUnmounted(() => {
  observer?.disconnect()
})

/** 仅当加载目标是 GIF 本身时才推进状态；poster 兜底图自己的 load/error 不参与判断 */
function onImgLoad() {
  if (props.poster && playing.value) {
    gifState.value = 'loaded'
  }
}

function onImgError() {
  if (props.poster && playing.value) {
    gifState.value = 'error'
  }
}

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
      <!-- 主 img 始终绑定真实 GIF 地址，load/error 事件归属 GIF 本身 -->
      <img
        class="mp-gif-player__gif"
        :class="{ 'mp-gif-player__gif--covered': poster && gifState !== 'loaded' }"
        :src="playing ? src : poster || src"
        :alt="alt || ''"
        loading="lazy"
        @load="onImgLoad"
        @error="onImgError"
      />
      <!-- GIF 未就绪（加载中/失败）时由 poster 占位：poster 在文档流中撑起容器，
           GIF img 退为底层叠层，避免加载期间容器塌陷破坏布局 -->
      <img
        v-if="poster && gifState !== 'loaded'"
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
/* GIF 未就绪时退出文档流（仍持续加载并触发 load/error），由上层 poster 撑起布局；
   .mp-gif-player 本身已带 position: relative + overflow: hidden + 圆角，叠层不会溢出 */
.mp-gif-player__gif--covered {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>

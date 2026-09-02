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
    <img
      v-else-if="loaded"
      :src="playing ? src : poster || src"
      :alt="alt || ''"
      loading="lazy"
    />
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  poster?: string
  alt?: string
  width?: string | number
}>()

const container = ref<HTMLElement>()
const loaded = ref(false)
const playing = ref(true)
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
  playing.value = !playing.value
}
</script>

<template>
  <div ref="container" class="mp-gif-player" :style="{ width: width || '100%' }" @click="togglePlay">
    <img
      v-if="loaded"
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
    <span class="mp-gif-player__badge">{{ playing ? 'GIF' : '⏸' }}</span>
  </div>
</template>

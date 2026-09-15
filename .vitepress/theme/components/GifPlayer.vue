<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  /** mp4 演示视频地址，传入后优先用 video 渲染 */
  video?: string
  alt?: string
  width?: string | number
}>()

const videoEl = ref<HTMLVideoElement>()
const playing = ref(true)
const loadError = ref(false)

function togglePlay() {
  if (!videoEl.value) return
  if (videoEl.value.paused) {
    videoEl.value.play()
    playing.value = true
  } else {
    videoEl.value.pause()
    playing.value = false
  }
}
</script>

<template>
  <div class="mp-gif-player" :style="{ width: width || '100%' }" @click="togglePlay">
    <video
      v-if="video"
      ref="videoEl"
      :src="video"
      :alt="alt || ''"
      muted
      loop
      autoplay
      playsinline
      preload="metadata"
    ></video>
    <!-- GIF 直出：img 随页面初始渲染存在（对齐首页 FeatureAlternate 的已验证结构），
         不再做 poster 叠层与懒加载门——动态插入的动画 GIF 在部分 Chromium 环境
         （20260915 用户真实浏览器实测）解码停帧，静态画面 -->
    <img
      v-else-if="!loadError"
      :src="src"
      :alt="alt || ''"
      @error="loadError = true"
    />
    <div v-else style="min-height: 200px; background: var(--vp-c-bg-soft); border-radius: 12px" />
    <span v-if="video" class="mp-gif-player__badge">{{ playing ? 'DEMO' : '⏸' }}</span>
  </div>
</template>

<style scoped>
.mp-gif-player img {
  display: block;
  width: 100%;
}
</style>

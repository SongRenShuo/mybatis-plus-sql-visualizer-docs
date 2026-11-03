<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { whenNear } from '../composables/lazyMedia'

const props = defineProps<{
  src: string
  /** 显式指定的 mp4 演示视频地址；不传时按 src 同名自动推导（x.gif → x.mp4） */
  video?: string
  alt?: string
  width?: string | number
}>()

const videoEl = ref<HTMLVideoElement>()
const rootEl = ref<HTMLElement>()
const playing = ref(true)
const loadError = ref(false)
/** 进到视口附近才写入 src，见 lazyMedia 的距离门控说明 */
const mediaSrc = ref('')

// 同目录同名 mp4：仓库里每个演示 GIF 都有一份约 1/4 体积的 H.264 版本
const derivedVideo = computed(() => props.src.replace(/\.gif$/i, '.mp4'))
const useVideo = computed(() => !loadError.value)

let cancelGate: (() => void) | null = null

onMounted(() => {
  // 显式传 video 的分支靠自己的 preload 控制，不需要门控
  if (props.video) return
  cancelGate = whenNear(rootEl.value, 400, () => {
    mediaSrc.value = derivedVideo.value
  })
})

onBeforeUnmount(() => cancelGate?.())

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
  <!-- 默认宽度交回 CSS（.mp-gif-player 的 width:100%）：行内写死会挡住窄屏媒体查询的
       整行出血规则（行内样式优先级高于样式表）。传了 width 时仍按行内生效 -->
  <div ref="rootEl" class="mp-gif-player" :style="width ? { width } : undefined" @click="togglePlay">
    <video
      v-if="video"
      ref="videoEl"
      :src="video"
      muted
      loop
      autoplay
      playsinline
      preload="metadata"
    ></video>
    <!-- 无显式 video 时用同名 mp4：GIF 52MB 全量转 H.264 后 18.7MB（-64%）。
         src 由 lazyMedia 按距离写入，不用原生 loading="lazy"——它的触发距离由浏览器
         按网络质量决定，慢网会把整页动图一次性全下。 -->
    <video
      v-else-if="useVideo && mediaSrc"
      ref="videoEl"
      :src="mediaSrc"
      muted
      loop
      autoplay
      playsinline
      preload="metadata"
      :aria-label="alt || undefined"
      @error="loadError = true"
    ></video>
    <!-- 视频加载失败时退回原 GIF -->
    <img
      v-else-if="loadError"
      :src="mediaSrc || src"
      :alt="alt || ''"
      decoding="async"
    />
    <span v-if="video" class="mp-gif-player__badge">{{ playing ? 'DEMO' : '⏸' }}</span>
  </div>
</template>

<style scoped>
.mp-gif-player img,
.mp-gif-player video {
  display: block;
  width: 100%;
}
</style>

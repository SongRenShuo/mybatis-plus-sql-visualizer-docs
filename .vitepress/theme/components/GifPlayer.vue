<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { whenNear } from '../composables/lazyMedia'

const props = defineProps<{
  src: string
  /** mp4 演示视频地址，传入后优先用 video 渲染 */
  video?: string
  alt?: string
  width?: string | number
}>()

const videoEl = ref<HTMLVideoElement>()
const rootEl = ref<HTMLElement>()
const playing = ref(true)
const loadError = ref(false)
/** 进到视口附近才写入 src，见 lazyMedia 的距离门控说明 */
const imgSrc = ref('')

let cancelGate: (() => void) | null = null

onMounted(() => {
  // video 分支靠 preload="metadata" 自己控制，不需要门控
  if (props.video) return
  cancelGate = whenNear(rootEl.value, 400, () => {
    imgSrc.value = props.src
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
      :alt="alt || ''"
      muted
      loop
      autoplay
      playsinline
      preload="metadata"
    ></video>
    <!-- GIF 直出：src 由 lazyMedia 按距离写入。不用原生 loading="lazy"——它的触发距离
         由浏览器按网络质量决定，慢网会把整页动图一次性全下（功能详解页一页二十多张）。
         保留 img 元素常驻、只延迟 src，不做元素级替换，避免早期踩过的动态插入 GIF
         解码停帧问题。 -->
    <img
      v-else-if="!loadError"
      :src="imgSrc || null"
      :alt="alt || ''"
      decoding="async"
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

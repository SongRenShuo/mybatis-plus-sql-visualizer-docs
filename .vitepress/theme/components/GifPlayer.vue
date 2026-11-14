<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { whenNear, weakNetwork } from '../composables/lazyMedia'
import { acquireVideoSlot } from '../composables/videoLoadQueue'

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
/** 视频加载失败 → 进入「poster + 点击重试」降级态（不再回退 52MB GIF） */
const loadError = ref(false)
/** 视频是否已真正开播（'playing' 事件）——播放按钮的显隐依据：
    只要还没开播（弱网待点、autoplay 被 stall、被暂停）就显示按钮 */
const isPlaying = ref(false)
/** 用户点播放按钮时视频尚未挂载 → 记住意图，canplay 后自动开播 */
const pendingPlay = ref(false)
/** 重试计数：>0 时给视频 src 加 cache-bust 查询串绕过坏缓存 */
const retries = ref(0)
/** poster（同名 .webp，mp4 首帧导出，≤20KB）与视频地址，由距离门控写入 */
const posterSrc = ref('')
const mediaSrc = ref('')

// 同目录同名 mp4：仓库里每个演示 GIF 都有一份约 1/4 体积的 H.264 版本
const derivedVideo = computed(() => props.src.replace(/\.gif$/i, '.mp4'))
const videoSrc = computed(() =>
  retries.value ? `${mediaSrc.value}?r=${retries.value}` : mediaSrc.value,
)
/** 弱网（saveData / 2g）：门控收到 0、不自动播放；poster 常驻点击即播 */
const weak = weakNetwork()
const useVideo = computed(() => !loadError.value && !!mediaSrc.value)

let cancelPoster: (() => void) | null = null
let cancelVideo: (() => void) | null = null
/** 已从全局队列拿到的槽位（null=未持有），首帧就绪/失败/卸载时归还 */
let releaseSlot: (() => void) | null = null

function releaseSlotIfHeld() {
  if (releaseSlot) {
    const rel = releaseSlot
    releaseSlot = null
    rel()
  }
}

onMounted(() => {
  // 显式传 video 的分支靠自己的 preload 控制，不需要门控
  if (props.video) return
  // poster 轻量（≤20KB）先行 800px；视频 400px（弱网收到 0，仅视口内加载）
  cancelPoster = whenNear(rootEl.value, 800, () => {
    posterSrc.value = props.src.replace(/\.gif$/i, '.webp')
  })
  cancelVideo = whenNear(rootEl.value, weak ? 0 : 400, async () => {
    releaseSlot = await acquireVideoSlot()
    mediaSrc.value = derivedVideo.value
  })
})

onBeforeUnmount(() => {
  cancelPoster?.()
  cancelVideo?.()
  releaseSlotIfHeld()
})

/** 首帧就绪：归还队列槽位，放行下一个视频；点过播放按钮则立即开播 */
function onVideoReady() {
  releaseSlotIfHeld()
  if (pendingPlay.value) {
    pendingPlay.value = false
    videoEl.value?.play()
  }
}

function onVideoError() {
  releaseSlotIfHeld()
  loadError.value = true
}

function retry() {
  retries.value++
  loadError.value = false
  // 重试是低频路径：直接加载，不再排队
  mediaSrc.value = derivedVideo.value
}

/** 播放按钮：视频未开播时点击即播。若视频还没挂载（门控未放行/排队中），
    记下意图直接加载（用户主动点击=明确意图，不再排队），canplay 后自动开播 */
function startPlay() {
  if (mediaSrc.value && videoEl.value) {
    videoEl.value.play()
  } else {
    pendingPlay.value = true
    mediaSrc.value = derivedVideo.value
  }
}

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
    <!-- poster 先行：视频起播前 / 失败降级时都由它占住画面，弱网下不再空白 -->
    <img
      v-if="posterSrc"
      class="mp-gif-player__poster"
      :src="posterSrc"
      :alt="alt || ''"
      decoding="async"
    />
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
         src 由 lazyMedia 按距离写入、videoLoadQueue 限并发，不用原生 loading="lazy"——
         它的触发距离由浏览器按网络质量决定，慢网会把整页动图一次性全下。 -->
    <video
      v-else-if="useVideo"
      ref="videoEl"
      :src="videoSrc"
      muted
      loop
      :autoplay="!weak"
      playsinline
      preload="metadata"
      :aria-label="alt || undefined"
      @canplay="onVideoReady"
      @playing="isPlaying = true"
      @pause="isPlaying = false"
      @error="onVideoError"
    ></video>
    <span v-if="video" class="mp-gif-player__badge">{{ playing ? 'DEMO' : '⏸' }}</span>
    <!-- 播放入口：只要视频还没真正开播就显示（弱网待点、autoplay 被 stall、被暂停均覆盖），
         'playing' 事件后自动消失——不依赖弱网判定（手机 effectiveType 多报 4g，按弱网
         显隐会导致用户永远看不到按钮）。非弱网自动播放很快接管，按钮只闪现片刻。 -->
    <button
      v-if="useVideo && !isPlaying"
      class="mp-gif-player__play"
      type="button"
      aria-label="播放演示"
      @click.stop="startPlay"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
    </button>
    <!-- 弱网失败降级：poster 常驻 + 手动重试（cache-bust 绕过坏缓存） -->
    <button
      v-if="loadError"
      class="mp-gif-player__retry"
      type="button"
      @click.stop="retry"
    >重新加载</button>
  </div>
</template>

<style scoped>
.mp-gif-player__poster {
  display: block;
  width: 100%;
}

/* 视频绝对定位盖在 poster 上：首帧可绘后自然接管画面；
   容器高度由 poster（正常流）或容器 aspect-ratio（poster 未加载时）撑起，
   彻底消除「视频未加载时高度为 0」的布局塌陷。 */
.mp-gif-player video {
  display: block;
  width: 100%;
  position: absolute;
  inset: 0;
  height: 100%;
}

/* 弱网模式播放入口：半透明圆底 + 白色三角，点按开始后消失 */
.mp-gif-player__play {
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
}

.mp-gif-player__play svg {
  width: 30px;
  height: 30px;
  fill: #fff;
  margin-left: 3px; /* 视觉居中：三角形重心偏右 */
}

/* 弱网失败降级：居中重试按钮，朴素原生控件 */
.mp-gif-player__retry {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 18px;
  font-size: 13px;
  cursor: pointer;
  color: var(--text-primary, #1f2328);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--border-color, #d0d7de);
  border-radius: 8px;
}
</style>

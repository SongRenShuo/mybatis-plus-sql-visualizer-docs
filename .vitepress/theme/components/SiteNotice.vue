<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 浮动通知 — 右下角滑入
// 每次发布新版本时更新下面数据即可

const props = defineProps<{
  /** 通知标题 */
  title?: string
  /** 通知内容（支持 HTML） */
  content?: string
  /** 是否显示 */
  show?: boolean
  /** 自动消失时间（毫秒），0 表示不自动消失 */
  duration?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const exiting = ref(false)

function close() {
  exiting.value = true
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration && props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<template>
  <Transition name="notice">
    <div v-if="show" class="mp-notice" :class="{ 'mp-notice--exit': exiting }">
      <button class="mp-notice__close" @click="close" title="关闭">&times;</button>
      <div v-if="title" class="mp-notice__title">{{ title }}</div>
      <div v-if="content" class="mp-notice__content" v-html="content" />
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.notice-enter-active {
  animation: mp-notice-slide-in 0.4s ease forwards;
}

.notice-leave-active {
  animation: mp-notice-slide-out 0.3s ease forwards;
}

@keyframes mp-notice-slide-in {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes mp-notice-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(120%);
    opacity: 0;
  }
}
</style>

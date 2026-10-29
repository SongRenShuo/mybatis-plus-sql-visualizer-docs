<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>

<script setup lang="ts">
/**
 * 需求池内联描边图标：替代原 emoji 载体，颜色一律吃 currentColor，
 * 配色仍由调用处的样式类决定。图形为手写路径，不引第三方图标库。
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), { size: 14 })

const ICONS: Record<string, string[]> = {
  // 功能需求
  'plus-square': ['M4 4h16v16H4z', 'M12 8v8', 'M8 12h8'],
  // Bug
  bug: [
    'M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    'M12 9V6',
    'M8 13H4',
    'M20 13h-4',
    'M6.5 8.5 4.5 6.5',
    'M17.5 8.5 19.5 6.5',
    'M6.5 17.5 4.5 19.5',
    'M17.5 17.5 19.5 19.5',
  ],
  // 体验优化
  'trending-up': ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
  // 疑问咨询
  'help-circle': [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20',
    'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
    'M12 17h.01',
  ],
  // 动态-新反馈
  'plus-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20', 'M12 8v8', 'M8 12h8'],
  // 动态-状态变更
  refresh: [
    'M23 4v6h-6',
    'M1 20v-6h6',
    'M3.51 9a9 9 0 0 1 14.85-3.36L23 10',
    'M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  ],
  // 置顶
  pin: [
    'M12 17v5',
    'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z',
  ],
  // 评论数
  message: [
    'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  ],
  // 点赞
  'thumbs-up': [
    'M7 10v12',
    'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z',
  ],
  // 附件
  paperclip: [
    'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  ],
  // 校验提示
  alert: [
    'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
    'M12 9v4',
    'M12 17h.01',
  ],
  // 选中/成功
  check: ['M20 6 9 17l-5-5'],
}

const paths = computed(() => ICONS[props.name] || [])
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: -0.125em;
  flex-shrink: 0;
}
</style>

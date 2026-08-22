<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  src: string
  darkSrc?: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const { isDark } = useData()

const currentSrc = computed(() => {
  if (isDark.value && props.darkSrc) return props.darkSrc
  return props.src
})
</script>

<template>
  <img
    :src="currentSrc"
    :alt="alt || ''"
    :width="width"
    :height="height"
    class="mp-themed-image"
    loading="lazy"
  />
</template>

<style scoped>
.mp-themed-image {
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}
</style>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="mp-steps">
    <slot />
  </div>
</template>

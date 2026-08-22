<script setup lang="ts">
defineProps<{
  beforeLabel?: string
  afterLabel?: string
}>()
</script>

<template>
  <div class="mp-code-compare">
    <div class="mp-code-compare__panel mp-code-compare__panel--before">
      <div class="mp-code-compare__label">{{ beforeLabel || 'Before' }}</div>
      <slot name="before" />
    </div>
    <div class="mp-code-compare__panel mp-code-compare__panel--after">
      <div class="mp-code-compare__label">{{ afterLabel || 'After' }}</div>
      <slot name="after" />
    </div>
  </div>
</template>

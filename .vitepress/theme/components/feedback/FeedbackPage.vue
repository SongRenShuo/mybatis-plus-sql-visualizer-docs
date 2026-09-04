<template>
  <div class="feedback-page">
    <FeedbackPool
      v-if="!selectedPost"
      :api-base="apiBase"
      :locale="locale"
      @select-post="selectedPost = $event"
      @update-locale="locale = $event"
    />
    <FeedbackDetail
      v-else
      :post-no="selectedPost"
      :api-base="apiBase"
      :locale="locale"
      @back="selectedPost = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Locale } from './i18n'
import FeedbackPool from './FeedbackPool.vue'
import FeedbackDetail from './FeedbackDetail.vue'

const props = defineProps<{
  apiBase: string
}>()

const selectedPost = ref<string | null>(null)
const locale = ref<Locale>('zh')
</script>

<style scoped>
.feedback-page {
  padding: 1rem 0;
}
</style>

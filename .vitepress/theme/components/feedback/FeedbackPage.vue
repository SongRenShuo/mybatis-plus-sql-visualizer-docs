<template>
  <div class="feedback-page">
    <FeedbackPool
      v-if="!selectedPost"
      :api-base="apiBase"
      :locale="locale"
      @select-post="selectedPost = $event"
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
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import type { Locale } from './i18n'
import FeedbackPool from './FeedbackPool.vue'
import FeedbackDetail from './FeedbackDetail.vue'

const props = defineProps<{
  apiBase: string
}>()

const selectedPost = ref<string | null>(null)
// 跟随文档站全局中英文切换（VitePress useData().lang），页内不再单独切换
const { lang } = useData()
const locale = computed<Locale>(() =>
  (lang.value || 'zh-CN').toLowerCase().startsWith('en') ? 'en' : 'zh'
)
</script>

<style scoped>
.feedback-page {
  padding: 1rem 0;
}
</style>

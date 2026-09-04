<template>
  <div class="feedback-page">
    <FeedbackDetail
      v-if="selectedPost"
      :post-no="selectedPost"
      :api-base="apiBase"
      :locale="locale"
      @back="selectedPost = null"
    />
    <div v-else class="feedback-page-body">
      <FeedbackPool
        :api-base="apiBase"
        :locale="locale"
        @select-post="selectedPost = $event"
      />
      <FeedbackActivity
        :api-base="apiBase"
        :locale="locale"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import type { Locale } from './i18n'
import FeedbackPool from './FeedbackPool.vue'
import FeedbackDetail from './FeedbackDetail.vue'
import FeedbackActivity from './FeedbackActivity.vue'

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
/* 页面走 VitePress layout: page：主题自渲染顶栏（VPNavBar，含中英文切换），
   无 VPDoc 右侧大纲 .aside、无文档顶部留白，容器宽度与留白全部在这里自控 */
.feedback-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 24px 64px;
}

@media (max-width: 767px) {
  .feedback-page {
    padding: 16px 16px 48px;
  }
}

/* 两栏布局：左侧反馈池 + 右侧需求池动态 */
.feedback-page-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1rem;
  align-items: start;
}

/* 窄屏折到下方（动态面板排在反馈池之后） */
@media (max-width: 1024px) {
  .feedback-page-body {
    grid-template-columns: 1fr;
  }
}
</style>

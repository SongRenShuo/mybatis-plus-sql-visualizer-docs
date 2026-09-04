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
.feedback-page {
  padding: 1rem 0;
}
</style>

<style>
/* 仅需求反馈页生效（.feedback-page 只在此页渲染）。用 !important 覆盖 VitePress 更高/更靠后的规则：
   隐藏右侧文档大纲 aside、放宽内容区宽度、收紧顶部留白，让两栏布局居中占满右侧空间 */
.VPDoc:has(.feedback-page) {
  padding-top: 20px !important;
}
.VPDoc:has(.feedback-page) .content-container {
  max-width: 1400px !important;
}
.VPDoc:has(.feedback-page) .aside {
  display: none !important;
}

/* 两栏布局：左侧反馈池 + 右侧需求池动态 */
.feedback-page-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 1rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .feedback-page-body {
    grid-template-columns: 1fr;
  }
  .feedback-activity {
    display: none;
  }
}
</style>

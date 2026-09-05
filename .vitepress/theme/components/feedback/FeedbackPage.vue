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
import { ref, computed, onMounted, watch } from 'vue'
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

// 邮件「查看详情」等外链深链：?postNo=FR-xxxx 直开详情页
function readQueryPost(): string | null {
  const q = new URLSearchParams(window.location.search).get('postNo')
  return q && /^FR-\d{1,6}$/.test(q) ? q : null
}
onMounted(() => {
  selectedPost.value = readQueryPost()
})

// 打开/返回详情时同步查询串：保持链接可分享，返回列表后刷新不再落回详情
watch(selectedPost, (v) => {
  const url = new URL(window.location.href)
  if (v) url.searchParams.set('postNo', v)
  else url.searchParams.delete('postNo')
  window.history.replaceState(null, '', url)
})
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

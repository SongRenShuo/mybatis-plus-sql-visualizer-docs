<template>
  <div class="feedback-page">
    <!-- 两栏常驻：点卡片/动态条目不再整页切换，改为右侧抽屉滑出详情 -->
    <div class="feedback-page-body">
      <FeedbackPool
        ref="poolRef"
        :api-base="apiBase"
        :locale="locale"
        @select-post="selectedPost = $event"
        @submitted="onPoolSubmitted"
      />
      <FeedbackActivity
        ref="activityRef"
        :api-base="apiBase"
        :locale="locale"
        @select-post="selectedPost = $event"
      />
    </div>

    <!-- 周报订阅入口放页尾：先看池子再收邮箱（后端带双重确认，这里只收集邮箱并透传后端文案） -->
    <SubscribeCard class="feedback-subscribe" :api-base="apiBase" :locale="locale" />

    <!-- 详情右侧抽屉：关闭（×/遮罩/Esc/返回列表）回到列表原位 -->
    <FeedbackDetailDrawer
      v-if="selectedPost"
      :post-no="selectedPost"
      :api-base="apiBase"
      :locale="locale"
      @close="selectedPost = null"
      @vote="onDrawerVote"
      @commented="onDrawerCommented"
    />

    <!-- 深链 ?category=xxx 直开提交表单（与反馈池内「提交反馈」弹窗同款外壳） -->
    <UiModal
      v-if="deepLinkCategory"
      :title="t('submitTitle', locale)"
      :subtitle="t('formTip', locale)"
      :close-label="t('close', locale)"
      @close="closeForm"
    >
      <FeedbackForm
        ref="formRef"
        :api-base="apiBase"
        :locale="locale"
        :initial-category="deepLinkCategory || undefined"
        embedded
        @done="onDeepLinkSubmitted"
      />
      <template #footer>
        <span v-if="!formRef?.canSubmit" class="modal-hint">
          <FbIcon name="alert" :size="14" /> {{ (formRef?.invalidTips || []).join('，') }}
        </span>
        <UiButton variant="ghost" @click="closeForm">{{ t('cancel', locale) }}</UiButton>
        <UiButton variant="primary" :disabled="!formRef?.canSubmit" @click="formRef?.submit()">
          {{ t('submitBtn', locale) }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData } from 'vitepress'
import { t, type Locale } from './i18n'
import FeedbackPool from './FeedbackPool.vue'
import FbIcon from './FbIcon.vue'
import FeedbackDetailDrawer from './FeedbackDetailDrawer.vue'
import FeedbackActivity from './FeedbackActivity.vue'
import FeedbackForm from './FeedbackForm.vue'
import SubscribeCard from './SubscribeCard.vue'
import UiButton from '../ui/UiButton.vue'
import UiModal from '../ui/UiModal.vue'

const props = defineProps<{
  apiBase: string
}>()

const selectedPost = ref<string | null>(null)
// 深链 ?category= 直开提交表单：非空即弹窗打开，关闭时清空（一次性动作，不作为常驻状态）
const deepLinkCategory = ref<string | null>(null)
const formRef = ref<InstanceType<typeof FeedbackForm> | null>(null)
// 反馈池/动态面板的实例引用：提交成功后联动刷新两侧数据
const poolRef = ref<InstanceType<typeof FeedbackPool> | null>(null)
const activityRef = ref<InstanceType<typeof FeedbackActivity> | null>(null)
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

// 文档功能页「直达需求反馈池」深链：?category=xxx 预填分类并自动打开提交表单
// 仅接受合法 slug（与 FeedbackForm 的 categorySlugs 同一份枚举），非法值静默忽略
const CATEGORY_SLUGS = [
  'wrapper', 'xml', 'annotation', 'sql-to-java',
  'sql-log', 'batch', 'completion', 'mcp', 'jpa', 'other',
]
function readQueryCategory(): string | null {
  const q = new URLSearchParams(window.location.search).get('category')
  return q && CATEGORY_SLUGS.includes(q) ? q : null
}
onMounted(() => {
  selectedPost.value = readQueryPost()
  deepLinkCategory.value = readQueryCategory()
  window.addEventListener('keydown', onKeydown)
  // 深链处理完即从地址栏清理，刷新不再弹窗；category 与 postNo 同在时一并清，
  // 合法 postNo 已打开详情，其下方 watch 会重新写入 postNo 保持链接可分享
  if (new URLSearchParams(window.location.search).has('category')) {
    const url = new URL(window.location.href)
    url.searchParams.delete('category')
    url.searchParams.delete('postNo')
    window.history.replaceState(null, '', url)
  }
})

// 打开/关闭抽屉时同步查询串 + 背景滚动锁：保持链接可分享，关闭后刷新不再落回详情
watch(selectedPost, (v) => {
  const url = new URL(window.location.href)
  if (v) url.searchParams.set('postNo', v)
  else url.searchParams.delete('postNo')
  window.history.replaceState(null, '', url)
  // 抽屉打开时锁背景滚动，关闭恢复（selectedPost 只在客户端变化，SSG 不经过这里）
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

// 抽屉内投票：定向同步背景列表卡片的票数与统计条（复用池内既有更新逻辑）
function onDrawerVote(postNo: string, count: number, hasVoted: boolean) {
  poolRef.value?.applyVoteUpdate(postNo, count, hasVoted)
}

// 抽屉内评论：刷新背景列表的评论数（评论不进动态流，动态栏无需刷）
function onDrawerCommented() {
  poolRef.value?.reload()
}

// 关闭深链弹窗：清空即卸载表单，下次深链重新挂载取回预填分类
function closeForm() {
  deepLinkCategory.value = null
}

// 反馈池内提交成功：池子自己已刷新，这里联动刷新动态面板
function onPoolSubmitted() {
  activityRef.value?.reload()
}

// 深链弹窗提交成功：关弹窗后由反馈池弹编号 toast（弹窗立刻关闭，表单内提示看不到），
// 再刷新反馈池与动态面板两侧数据；勾选悬赏时把意向与标题透传给池内 toast
function onDeepLinkSubmitted(postNo?: string, opts?: { bountyIntent?: boolean; title?: string }) {
  closeForm()
  poolRef.value?.notifySubmitted(postNo, opts)
  poolRef.value?.reload()
  activityRef.value?.reload()
}

// Esc 分层关闭：深链提交弹窗优先，否则关详情抽屉（两者互斥，这里是兜底）
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (deepLinkCategory.value) closeForm()
  else if (selectedPost.value) selectedPost.value = null
}
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* 页面走 VitePress layout: page：主题自渲染顶栏（VPNavBar，含中英文切换），
   无 VPDoc 右侧大纲 .aside、无文档顶部留白，容器宽度与留白全部在这里自控 */
.feedback-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 24px 64px;
}

/* VitePress 只在 ≥960 给 .VPPage 加 64px 顶部偏移；更窄时导航是 fixed，
   页面内容会从 0 开始被顶栏压住（眉标整个看不见），这里自己补出导航高度 */
@media (max-width: 959px) {
  .feedback-page {
    padding-top: calc(var(--vp-nav-height) + 18px);
  }
}

/* 两栏布局：左侧反馈池 + 右侧需求池动态 */
.feedback-page-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;
}

/* 窄屏折到下方（动态面板排在反馈池之后）。
   minmax(0,1fr) 而不是 1fr：1fr 的最小值是 min-content，筛选行/看板会把整列撑出视口 */
@media (max-width: 1024px) {
  .feedback-page-body {
    grid-template-columns: minmax(0, 1fr);
  }
}

.feedback-subscribe {
  margin-top: 16px;
}

.modal-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
  font-size: 12px;
  font-weight: 500;
  color: #d97706;
}

@media (max-width: 767px) {
  .feedback-page {
    padding: calc(var(--vp-nav-height) + 14px) 16px 48px;
  }

  .modal-hint {
    flex-basis: 100%;
  }
}
</style>

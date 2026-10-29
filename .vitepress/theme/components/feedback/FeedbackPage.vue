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

    <!-- 深链 ?category=xxx 直开提交表单（与反馈池内「提交反馈」弹窗同款交互） -->
    <Teleport to="body">
      <div v-if="deepLinkCategory" class="modal-overlay" @mousedown.self="closeForm">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <button class="modal-close" :title="t('close', locale)" :aria-label="t('close', locale)" @click="closeForm">
            ×
          </button>
          <div class="modal-body">
            <FeedbackForm
              ref="formRef"
              :api-base="apiBase"
              :locale="locale"
              :initial-category="deepLinkCategory || undefined"
              embedded
              @done="onDeepLinkSubmitted"
            />
          </div>
          <div class="modal-footer">
            <span v-if="!formRef?.canSubmit" class="modal-hint"><FbIcon name="alert" :size="14" /> {{ (formRef?.invalidTips || []).join('，') }}</span>
            <button class="modal-cancel" @click="closeForm">{{ t('cancel', locale) }}</button>
            <button class="modal-submit" :disabled="!formRef?.canSubmit" @click="formRef?.submit()">{{ t('submitBtn', locale) }}</button>
          </div>
        </div>
      </div>
    </Teleport>
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
  'sql-log', 'batch', 'completion', 'other',
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

/* 深链直开的提交表单弹窗（与 FeedbackPool 内提交弹窗同款样式，scoped 各自隔离） */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.55);
  overflow-y: auto;
}

.modal-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  padding: 1.25rem 1.5rem 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  /* 配合 overlay 滚动：内容超高时从顶部开始而非垂直居中被裁剪 */
  margin: auto;
}

.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.modal-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.modal-footer {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-border);
}

.modal-hint {
  margin-right: auto;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #d97706;
}

.modal-cancel {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-cancel:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.modal-submit {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modal-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.modal-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 校验提示独占一行，不挤占取消/提交按钮 */
@media (max-width: 768px) {
  .modal-hint {
    flex-basis: 100%;
    margin-right: 0;
  }
}
</style>

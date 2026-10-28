<template>
  <Teleport to="body">
    <div class="fb-drawer-overlay" @mousedown.self="$emit('close')">
      <section class="fb-drawer" role="dialog" aria-modal="true" :aria-label="postNo">
        <button
          class="fb-drawer-close"
          type="button"
          :title="t('close', locale)"
          :aria-label="t('close', locale)"
          @click="$emit('close')"
        >
          ×
        </button>
        <!-- :key 强制重挂载：FeedbackDetail 只在 onMounted 拉数据，抽屉开着切换需求须重新加载 -->
        <FeedbackDetail
          :key="postNo"
          :post-no="postNo"
          :api-base="apiBase"
          :locale="locale"
          @back="$emit('close')"
          @vote="(count, hasVoted) => $emit('vote', postNo, count, hasVoted)"
          @commented="$emit('commented')"
        />
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import FeedbackDetail from './FeedbackDetail.vue'
import { t, type Locale } from './i18n'

defineProps<{
  postNo: string
  apiBase: string
  locale?: Locale
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'vote', postNo: string, count: number, hasVoted: boolean): void
  (e: 'commented'): void
}>()
</script>

<style scoped>
/* 右侧滑出详情抽屉：列表与动态栏常驻背景，遮罩点击关闭。
   与提交弹窗同层（z-index 1000），两者互斥不会并存 */
.fb-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  animation: fb-drawer-fade 0.25s ease-out;
}

.fb-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  width: min(640px, 92vw);
  overflow-y: auto;
  padding: 0.75rem 1.25rem 2rem;
  background: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-border);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15);
  animation: fb-drawer-in 0.25s ease-out;
}

/* sticky：滚动时钉在面板顶部，不随内容滚走 */
.fb-drawer-close {
  position: sticky;
  top: 0.5rem;
  z-index: 2;
  display: block;
  margin-left: auto;
  margin-bottom: 0.25rem;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.fb-drawer-close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

@keyframes fb-drawer-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fb-drawer-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fb-drawer-overlay,
  .fb-drawer {
    animation: none;
  }
}

@media (max-width: 767px) {
  .fb-drawer {
    width: 100vw;
    padding: 0.75rem 1rem 2rem;
  }
}
</style>

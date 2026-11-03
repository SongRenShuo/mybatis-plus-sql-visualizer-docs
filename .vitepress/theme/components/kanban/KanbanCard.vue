<template>
  <div
    class="kb-card"
    :class="{ 'is-pinned': pinned, 'is-static': !interactive }"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :data-kb-card="interactive ? itemId : undefined"
    :aria-label="interactive ? label : undefined"
    @click="interactive && $emit('open')"
    @keydown="onKeydown"
  >
    <div class="kb-card-main">
      <slot name="title" />
      <slot name="description" />
      <div class="kb-card-meta">
        <slot name="meta" />
      </div>
    </div>
    <div class="kb-card-foot">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    itemId: string
    /** 读屏用的整卡名称，一般传条目标题 */
    label: string
    pinned?: boolean
    /** false 时卡片只作展示：不可点击、不进 Tab 序、不参与方向键导航 */
    interactive?: boolean
  }>(),
  { pinned: false, interactive: true }
)

const emit = defineEmits<{
  (e: 'open'): void
}>()

/**
 * 卡片内可能嵌着投票按钮，回车必须只作用于卡片本身；
 * 目标不是卡片自身时放行给内部控件。
 */
function onKeydown(event: KeyboardEvent) {
  if (event.target !== event.currentTarget) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  emit('open')
}
</script>

<style scoped>
.kb-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.kb-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 55%, var(--vp-c-border));
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.kb-card.is-pinned {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 40%, var(--vp-c-border));
}

/* 纯展示卡片：流程说明这类内容不是入口，不该有指针与悬停反馈 */
.kb-card.is-static {
  cursor: default;
}

.kb-card.is-static:hover {
  border-color: var(--vp-c-border);
  box-shadow: none;
}

.kb-card:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px var(--vp-c-brand-1);
}

.kb-card-main {
  display: block;
  padding: 14px 14px 10px;
}

.kb-card-main :deep(.kb-card-title) {
  display: -webkit-box;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.kb-card-main :deep(.kb-card-desc) {
  display: -webkit-box;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ui-fg-muted);
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.kb-card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.kb-card-meta:empty {
  display: none;
}

.kb-card-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-border);
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.kb-card-foot:empty {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .kb-card {
    transition: none;
  }
}
</style>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'is-block': block }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * 组件库按钮：全圆角胶囊、36px 高、1px 发丝线。
 * 传 href 时渲染成 <a>，用于锚点与站外链接。
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'ghost' | 'subtle'
    size?: 'sm' | 'md' | 'icon'
    href?: string
    type?: 'button' | 'submit'
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'outline', size: 'md', href: '', type: 'button', disabled: false, block: false }
)
</script>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: var(--ui-radius-pill);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.ui-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ui-surface), 0 0 0 4px var(--ui-ring);
}

.ui-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-btn--md {
  height: 36px;
  padding: 0 16px;
}

.ui-btn--sm {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}

.ui-btn--icon {
  width: 36px;
  height: 36px;
  padding: 0;
}

.is-block {
  width: 100%;
}

/* 主操作：实底品牌色 */
.ui-btn--primary {
  background: var(--ui-accent);
  border-color: var(--ui-accent);
  color: #fff;
}

.ui-btn--primary:hover:not(:disabled) {
  opacity: 0.9;
}

/* 次操作：白底发丝线 */
.ui-btn--outline {
  background: var(--ui-surface);
  border-color: var(--ui-border);
  color: var(--ui-fg-soft);
}

.ui-btn--outline:hover:not(:disabled) {
  border-color: var(--ui-border-strong);
  color: var(--ui-fg);
}

/* 弱操作：无色块 */
.ui-btn--ghost {
  background: transparent;
  color: var(--ui-fg-soft);
}

.ui-btn--ghost:hover:not(:disabled) {
  background: var(--ui-surface-muted);
  color: var(--ui-fg);
}

/* 浅底操作：用于卡片内的次级动作 */
.ui-btn--subtle {
  background: var(--ui-surface-muted);
  border-color: transparent;
  color: var(--ui-fg-soft);
}

.ui-btn--subtle:hover:not(:disabled) {
  color: var(--ui-fg);
}

@media (prefers-reduced-motion: reduce) {
  .ui-btn {
    transition: none;
  }
}
</style>

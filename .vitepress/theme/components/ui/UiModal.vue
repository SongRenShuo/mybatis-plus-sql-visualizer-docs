<template>
  <Teleport to="body">
    <div class="ui-modal-overlay" @mousedown.self="close">
      <div
        ref="panel"
        class="ui-modal"
        :style="{ maxWidth: width }"
        role="dialog"
        aria-modal="true"
        :aria-label="title || undefined"
      >
        <header class="ui-modal-head">
          <div class="ui-modal-heading">
            <h2 v-if="title" class="ui-modal-title">{{ title }}</h2>
            <p v-if="subtitle" class="ui-modal-sub">{{ subtitle }}</p>
          </div>
          <button type="button" class="ui-modal-close" :aria-label="closeLabel" @click="close">×</button>
        </header>
        <div class="ui-modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="ui-modal-foot"><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 弹窗外壳：遮罩 + 16px 圆角面板 + 头/身/脚三段。
 * Esc 关闭、打开时锁背景滚动，关闭事件统一走 emit('close')。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    width?: string
    closeLabel?: string
  }>(),
  { title: '', subtitle: '', width: '880px', closeLabel: '关闭' }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panel = ref<HTMLElement | null>(null)

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = 'hidden'
  panel.value?.querySelector<HTMLElement>('input, textarea, button')?.focus({ preventScroll: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.ui-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(9, 9, 11, 0.62);
  overflow-y: auto;
  animation: ui-modal-fade 0.16s ease-out;
}

.ui-modal {
  position: relative;
  display: flex;
  width: 100%;
  max-height: 90vh;
  margin: auto;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-card);
  background: var(--ui-surface);
  box-shadow: var(--ui-shadow-lg);
  animation: ui-modal-in 0.18s ease-out;
}

.ui-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--ui-border);
}

.ui-modal-title {
  margin: 0;
  border: none;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ui-fg);
}

.ui-modal-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.ui-modal-close {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  color: var(--ui-fg-muted);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ui-modal-close:hover {
  background: var(--ui-surface-muted);
  color: var(--ui-fg);
}

.ui-modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
}

.ui-modal-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--ui-border);
}

@keyframes ui-modal-fade {
  from {
    opacity: 0;
  }
}

@keyframes ui-modal-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
}

@media (max-width: 600px) {
  .ui-modal-overlay {
    padding: 0;
  }

  .ui-modal {
    max-height: 100vh;
    border-radius: 0;
    border: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-modal-overlay,
  .ui-modal {
    animation: none;
  }
}
</style>

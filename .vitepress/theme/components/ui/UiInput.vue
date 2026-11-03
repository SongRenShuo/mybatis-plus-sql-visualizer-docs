<template>
  <label class="ui-field" :class="[{ 'is-sm': size === 'sm', 'is-block': block }]">
    <span v-if="label" class="ui-field-label">{{ label }}</span>
    <span class="ui-field-box">
      <span v-if="$slots.left" class="ui-field-icon"><slot name="left" /></span>
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :aria-label="ariaLabel || undefined"
        :disabled="disabled"
        class="ui-field-input"
        @input="onInput"
        @keydown.enter="$emit('enter')"
      />
      <span v-if="$slots.right" class="ui-field-right"><slot name="right" /></span>
    </span>
  </label>
</template>

<script setup lang="ts">
/** 组件库输入框：36px 高、12px 圆角、1px 发丝线，聚焦时描边转前景色。 */
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    ariaLabel?: string
    type?: string
    size?: 'sm' | 'md'
    disabled?: boolean
    block?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    ariaLabel: '',
    type: 'text',
    size: 'md',
    disabled: false,
    block: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'enter'): void
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style scoped>
.ui-field {
  display: inline-flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.ui-field-label {
  font-size: 12px;
  color: var(--ui-fg-muted);
}

.ui-field-box {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius-field);
  background: var(--ui-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ui-field.is-sm .ui-field-box {
  height: 32px;
}

.is-block .ui-field-box {
  width: 100%;
}

.ui-field-box:focus-within {
  border-color: var(--ui-border-strong);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-fg) 6%, transparent);
}

.ui-field-icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--ui-fg-muted);
}

.ui-field-input {
  min-width: 0;
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: var(--ui-fg);
  outline: none;
}

.ui-field-input::placeholder {
  color: var(--ui-fg-muted);
}

.ui-field-right {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
}

@media (max-width: 767px) {
  /* <16px 的输入框聚焦会触发 iOS 自动放大 */
  .ui-field-input {
    font-size: 16px;
  }
}
</style>

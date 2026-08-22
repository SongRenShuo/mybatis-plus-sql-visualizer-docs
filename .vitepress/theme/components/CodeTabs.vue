<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  tabs: Array<{
    label: string
    lang: string
    code: string
  }>
}>()

const activeIndex = ref(0)

function selectTab(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="mp-code-tabs">
    <div class="mp-code-tabs__header">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.label"
        :class="['mp-code-tabs__tab', { 'mp-code-tabs__tab--active': activeIndex === index }]"
        @click="selectTab(index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="mp-code-tabs__content">
      <div
        v-for="(tab, index) in tabs"
        v-show="activeIndex === index"
        :key="tab.label"
      >
        <div class="code-block" :data-lang="tab.lang">
          <pre><code>{{ tab.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mp-code-tabs {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.mp-code-tabs__header {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
}

.mp-code-tabs__tab {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}

.mp-code-tabs__tab:hover {
  color: var(--vp-c-text-1);
}

.mp-code-tabs__tab--active {
  color: var(--mp-primary);
  border-bottom-color: var(--mp-primary);
}

.mp-code-tabs__content {
  background: var(--vp-c-bg);
}

.code-block {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
}

.code-block code {
  font-family: inherit;
}
</style>

<script setup>
import entries from '../../data/changelog.json'

/**
 * 更新日志静态列表（C 车道）。
 *
 * changelog.json 由 scripts/generate-changelog.mjs 在构建期生成（每版
 * { version, date, notesHtml }），本组件构建期直接导入，SSR 直出正文——
 * 页面不再有客户端加载/报错态，搜索引擎可直接收录。
 *
 * 每版一节，锚点 #v-<version 点转连字符>（如 #v-2026-10-30）便于外链。
 * notesHtml 已在生成期做白名单净化，这里 v-html 直渲；排版跟随 .vp-doc。
 */
function anchorId(version) {
  return `v-${String(version).replace(/\./g, '-')}`
}
</script>

<template>
  <div class="changelog-list">
    <section
      v-for="e in entries"
      :id="anchorId(e.version)"
      :key="e.version"
      class="changelog-version"
    >
      <h2 class="changelog-version-title">
        <a :href="`#${anchorId(e.version)}`" class="changelog-version-anchor">v{{ e.version }}</a>
        <span class="changelog-version-date">{{ e.date }}</span>
      </h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="changelog-notes" v-html="e.notesHtml" />
    </section>
  </div>
</template>

<style scoped>
.changelog-version {
  margin-top: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.changelog-version:last-child {
  border-bottom: none;
}

.changelog-version-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0;
  line-height: 1.6;
}

.changelog-version-anchor {
  color: inherit;
}

.changelog-version-anchor:hover {
  color: var(--vp-c-brand-1);
}

.changelog-version-date {
  font-size: 0.85em;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.changelog-notes :deep(h4) {
  margin-top: 1.25rem;
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import staticEntries from '../../data/changelog.json'
import { buildEntries, mergeEntries } from '../../../scripts/changelog-core.mjs'

const { lang } = useData()
// 日期自带「发布于」前缀，避免 2026-11-03 被误读成第二个版本号
const datePrefix = computed(() => (lang.value.startsWith('zh') ? '发布于 ' : 'Released '))

/**
 * 更新日志列表：构建期快照 SSR 直出 + 打开页面后实时补齐。
 *
 * 构建期：scripts/generate-changelog.mjs 把 Marketplace 全量更新写进
 * changelog.json（每版 { version, date, notesHtml, summaryZh }），这里直接导入，
 * SSR 直出正文，搜索引擎可收录，也不存在「加载中/报错」态。
 *
 * 客户端：挂载后拉 /api/changelog（Cloudflare Pages Function 实时代理），用与构建期
 * 完全相同的规则（changelog-core.mjs）整理成条目，再与静态快照合并——实时数据优先，
 * 所以「发版后没重新部署」能补上新版本，「老版本说明被改过」也能同步更新；
 * 实时里缺的版本仍保留静态快照，拉取失败则完全沿用静态内容。
 *
 * 每版一节，锚点 #v-<version 点转连字符>（如 #v-2026-10-30）便于外链。
 * notesHtml 已在整理时做白名单净化，这里 v-html 直渲；排版跟随 .vp-doc。
 */
const entries = ref(staticEntries)

function anchorId(version) {
  return `v-${String(version).replace(/\./g, '-')}`
}

async function syncFromMarketplace() {
  const res = await fetch('/api/changelog', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const live = buildEntries(await res.json())
  if (!live.length) return
  const merged = mergeEntries(live, staticEntries)
  // 内容没变就不动，避免无谓重渲染（正常情况实时与快照一致）
  if (JSON.stringify(merged) !== JSON.stringify(entries.value)) entries.value = merged
}

onMounted(() => {
  syncFromMarketplace().catch(() => {
    /* 实时通道不可用：保留构建期快照 */
  })
})
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
        <span class="changelog-version-date">{{ datePrefix }}{{ e.date }}</span>
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

/* 版本标题不走全站 .vp-doc h2 的营销样式（28~40px 居中大字 + 下划线横杠 + 100px 上距），
   覆写为常规文档小节标题，日期不再像第二个版本号 */
.changelog-version-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0 !important;
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  line-height: 1.6;
}

.changelog-version-title::after {
  content: none !important;
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

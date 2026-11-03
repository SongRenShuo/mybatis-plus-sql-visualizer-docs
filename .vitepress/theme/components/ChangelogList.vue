<script setup>
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import staticEntries from '../../data/changelog.json'
import { buildEntries, mergeEntries } from '../../../scripts/changelog-core.mjs'

const { lang } = useData()
// 日期自带「发布于」前缀，避免 2026-11-03 被误读成第二个版本号
const datePrefix = computed(() => (lang.value.startsWith('zh') ? '发布于 ' : 'Released '))
const latestLabel = computed(() => (lang.value.startsWith('zh') ? '最新' : 'Latest'))

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
      v-for="(e, i) in entries"
      :id="anchorId(e.version)"
      :key="e.version"
      class="changelog-version"
    >
      <span class="changelog-node" :class="{ 'is-latest': i === 0 }" aria-hidden="true" />
      <h2 class="changelog-version-title">
        <span class="changelog-version-head">
          <a :href="`#${anchorId(e.version)}`" class="changelog-version-anchor">v{{ e.version }}</a>
          <span v-if="i === 0" class="changelog-latest">{{ latestLabel }}</span>
        </span>
        <span class="changelog-version-date">{{ datePrefix }}{{ e.date }}</span>
      </h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="changelog-notes" v-html="e.notesHtml" />
    </section>
  </div>
</template>

<style scoped>
/* 时间线样式（GitHub / Linear 风格）：左侧竖线由上一节点连到下一节点，
   节点圆点压在线上；最新版本节点用品牌色高亮并带「最新」徽标 */
.changelog-list {
  margin-top: 1.5rem;
}

.changelog-version {
  position: relative;
  padding: 0 0 2.5rem 2.25rem;
}

.changelog-version:last-child {
  padding-bottom: 0.5rem;
}

.changelog-version:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-divider);
}

.changelog-node {
  position: absolute;
  left: 0;
  top: 7px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-divider);
}

.changelog-node.is-latest {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

/* 版本标题不走全站 .vp-doc h2 的营销样式（28~40px 居中大字 + 下划线横杠 + 100px 上距），
   覆写为常规文档小节标题：版本号居左，日期灰字右对齐同一行 */
.changelog-version-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0 !important;
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  line-height: 1.6;
}

.changelog-version-title::after {
  content: none !important;
}

.changelog-version-head {
  display: inline-flex;
  align-items: baseline;
  gap: 0.625rem;
}

.changelog-version-anchor {
  color: inherit;
}

.changelog-version-anchor:hover {
  color: var(--vp-c-brand-1);
}

.changelog-latest {
  align-self: center;
  padding: 1px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.6;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
}

.changelog-version-date {
  font-size: 0.85em;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

.changelog-notes {
  margin-top: 0.75rem;
}

.changelog-notes :deep(h4) {
  margin-top: 1.25rem;
}

@media (max-width: 640px) {
  .changelog-version {
    padding-left: 1.75rem;
  }
}
</style>

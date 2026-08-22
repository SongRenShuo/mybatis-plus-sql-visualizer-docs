<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'

/**
 * 动态更新日志组件
 * 每次访问页面时从 JetBrains Marketplace API 实时获取
 * 样式完全继承 VitePress 默认 .vp-doc 排版
 */

const props = defineProps<{
  /** JetBrains Marketplace API 地址 */
  src: string
  /** 底部查看更多链接 */
  moreLink?: string
  moreText?: string
}>()

const loading = ref(true)
const error = ref('')
const content = ref('')

marked.setOptions({ breaks: true, gfm: true })

function parseNotes(html: string): string {
  if (!html) return ''
  return html
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1')
    .replace(/<\/?ul[^>]*>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatDate(timestamp: string) {
  const d = new Date(parseInt(timestamp))
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

function normalizeVersion(v: string) {
  return v.replace(/^v/, '').trim()
}

onMounted(async () => {
  try {
    const res = await fetch(props.src)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0) throw new Error('返回数据为空')

    // 去重：按标准化版本号去重，保留第一个（最新）
    const seen = new Set<string>()
    const updates = data
      .sort((a: any, b: any) => parseInt(b.cdate) - parseInt(a.cdate))
      .filter((item: any) => {
        const key = normalizeVersion(item.version)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

    let md = ''
    for (const item of updates) {
      const date = formatDate(item.cdate)
      md += `## ${item.version} (${date})\n\n`
      let notes = parseNotes(item.notes)
      // 去掉 notes 中和版本标题重复的 h2/h3
      const verClean = normalizeVersion(item.version)
      notes = notes.replace(new RegExp(`^###?\\s*v?${verClean}\\s*$`, 'gim'), '')
      md += notes + '\n\n'
    }

    content.value = marked.parse(md) as string
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

const hasContent = computed(() => content.value.length > 0)
</script>

<template>
  <div class="dynamic-changelog vp-doc">
    <!-- 加载中 -->
    <div v-if="loading" class="changelog-loading">
      <span class="changelog-spinner"></span>
      正在加载更新日志...
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="changelog-error">
      <p>⚠ 更新日志加载失败：{{ error }}</p>
      <a :href="moreLink" target="_blank" rel="noopener" class="changelog-retry">
        查看插件市场 →
      </a>
    </div>

    <!-- 内容：由外层 VitePress .vp-doc 提供排版，不重复嵌套 -->
    <div v-else-if="hasContent" class="changelog-content" v-html="content" />

    <!-- 底部查看更多 -->
    <div v-if="moreLink" class="changelog-more">
      <a :href="moreLink" target="_blank" rel="noopener" class="changelog-more-link">
        {{ moreText || '查看更多 →' }}
      </a>
    </div>
  </div>
</template>

<style>
.changelog-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 32px;
  color: var(--vp-c-text-2);
  justify-content: center;
}

.changelog-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--vp-c-border);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.changelog-error {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-danger);
}

.changelog-retry {
  display: inline-block;
  margin-top: 12px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.changelog-more {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.changelog-more-link {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  transition: opacity 0.2s;
}

.changelog-more-link:hover {
  opacity: 0.8;
}
</style>

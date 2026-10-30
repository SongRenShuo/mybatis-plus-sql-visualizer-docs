<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'
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
    // 关键：去掉每行前面的缩进，避免 marked 把列表当代码块
    .split('\n').map(line => line.replace(/^\s+/, '')).join('\n')
    .trim()
}


onMounted(async () => {
  try {
    const res = await fetch(props.src)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0) throw new Error('返回数据为空')

    // 按日期排序，取最新版本（第一个）
    const sorted = data.sort((a: any, b: any) => parseInt(b.cdate) - parseInt(a.cdate))
    const latest = sorted[0]

    // 最新版本的 notes 已包含完整更新日志
    let md = `# 更新日志\n\n`
    md += `数据来源：[JetBrains Marketplace](https://plugins.jetbrains.com/plugin/33633-sql-visualizer)\n\n`
    md += parseNotes(latest.notes)

    content.value = marked.parse(md) as string
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

const hasContent = computed(() => content.value.length > 0)

/* ========== 需求池已完成需求（GET /api/v1/feedback/changelog） ========== */

interface FeedbackDoneItem {
  postNo: string
  title: string
  typeLabel: string
  pluginVersion: string | null
  completedAt: string | null
}

const { lang } = useData()
const isEn = computed(() => (lang.value || 'zh-CN').toLowerCase().startsWith('en'))
const feedbackTitle = computed(() => (isEn.value ? 'Completed requests from the feedback pool' : '需求池里已完成的需求'))
const feedbackItems = ref<FeedbackDoneItem[]>([])

/** 同站需求详情深链：跟随当前语言版本 */
function feedbackLink(item: FeedbackDoneItem): string {
  const base = isEn.value ? '/en/about/feedback' : '/about/feedback'
  return `${base}?postNo=${encodeURIComponent(item.postNo)}`
}

/** 后端完成时间是 UTC 'YYYY-MM-DD HH:MM:SS'，按访客本地时区只显示日期 */
function formatDoneDate(completedAt: string): string {
  const parsed = new Date(completedAt.replace(' ', 'T') + 'Z')
  if (Number.isNaN(parsed.getTime())) return completedAt.slice(0, 10)
  return parsed.toLocaleDateString(isEn.value ? 'en-US' : 'zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

onMounted(async () => {
  try {
    const res = await fetch('/api/v1/feedback/changelog?limit=20')
    const data = await res.json()
    if (data.code === 0) feedbackItems.value = data.data?.items || []
  } catch (err) {
    // 需求池条目是附加信息：加载失败只保留 Marketplace 更新日志，不打断页面
    console.error('Failed to load feedback changelog:', err)
  }
})
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

    <!-- 需求池里已完成的需求：与版本日志互补，回答「我提的什么时候做完」 -->
    <section v-if="feedbackItems.length && !loading" class="changelog-feedback">
      <h2>{{ feedbackTitle }}</h2>
      <ul class="changelog-feedback-list">
        <li v-for="item in feedbackItems" :key="item.postNo" class="changelog-feedback-item">
          <a :href="feedbackLink(item)" target="_blank" rel="noopener">{{ item.title }}</a>
          <span class="changelog-feedback-meta">
            {{ item.typeLabel }}<template v-if="item.pluginVersion"> · v{{ item.pluginVersion }}</template><template v-if="item.completedAt"> · {{ formatDoneDate(item.completedAt) }}</template>
          </span>
        </li>
      </ul>
    </section>

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

/* 需求池已完成需求：样式跟随 VitePress 排版变量，不做独立主题 */
.changelog-feedback {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.changelog-feedback-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.changelog-feedback-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.changelog-feedback-item:last-child {
  border-bottom: none;
}

.changelog-feedback-item a {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.changelog-feedback-item a:hover {
  color: var(--vp-c-brand-1);
}

.changelog-feedback-meta {
  color: var(--vp-c-text-3);
  font-size: 0.85em;
}
</style>

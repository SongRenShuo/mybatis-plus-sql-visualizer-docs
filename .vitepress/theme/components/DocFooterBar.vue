<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

// 文档页页脚产品栏：转化入口（安装）+ 高频页面快捷链接，
// 经 index.ts 的 doc-footer-before 插槽挂在默认页脚（上一篇/下一篇）上方。
const { lang } = useData()
const isEn = computed(() => lang.value.startsWith('en'))

const items = computed(() =>
  isEn.value
    ? [
        { text: 'Install', href: 'https://plugins.jetbrains.com/plugin/33633-sql-visualizer', external: true },
        { text: 'Changelog', href: '/en/about/changelog' },
        { text: 'FAQ', href: '/en/guide/faq' },
        { text: 'Community', href: '/en/about/feedback' },
        { text: 'Privacy', href: '/en/about/privacy' }
      ]
    : [
        { text: '安装', href: 'https://plugins.jetbrains.com/plugin/33633-sql-visualizer', external: true },
        { text: '更新日志', href: '/about/changelog' },
        { text: 'FAQ', href: '/guide/faq' },
        { text: '社区', href: '/about/feedback' },
        { text: '隐私说明', href: '/about/privacy' }
      ]
)
</script>

<template>
  <div class="doc-footer-bar">
    <template v-for="(item, i) in items" :key="item.href">
      <span v-if="i > 0" class="doc-footer-bar__dot" aria-hidden="true">·</span>
      <a
        :href="item.href"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener' : undefined"
      >{{ item.text }}</a>
    </template>
  </div>
</template>

<style scoped>
.doc-footer-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
}

.doc-footer-bar a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.25s;
}

.doc-footer-bar a:hover {
  color: var(--vp-c-brand-1);
}

.doc-footer-bar__dot {
  color: var(--vp-c-divider);
}
</style>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  cards: Array<{
    icon: string
    title: string
    desc: string
    link?: string
  }>
}>()

const { lang } = useData()
const isZh = computed(() => lang.value?.startsWith('zh'))

function resolveLink(link: string | undefined) {
  if (!link) return undefined
  return isZh.value ? link : link.replace(/^\/(\w)/, '/en/$1')
}
</script>

<template>
  <div class="mp-feature-grid">
    <a
      v-for="card in cards"
      :key="card.title"
      :href="resolveLink(card.link)"
      class="mp-feature-card"
      :style="{ textDecoration: 'none' }"
    >
      <div class="mp-feature-card__icon">{{ card.icon }}</div>
      <h3 class="mp-feature-card__title">{{ card.title }}</h3>
      <p class="mp-feature-card__desc">{{ card.desc }}</p>
      <span v-if="card.link" class="mp-feature-card__link">
        {{ isZh ? '了解更多 →' : 'Learn more →' }}
      </span>
    </a>
  </div>
</template>

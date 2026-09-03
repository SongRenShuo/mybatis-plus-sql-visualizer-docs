<template>
  <div class="roadmap-board">
    <div v-for="col in columns" :key="col.status" class="roadmap-col">
      <div class="col-header">
        <span class="col-dot" :style="{ background: col.color }"></span>
        <span class="col-title">{{ col.label }}</span>
        <span class="col-count">{{ getStatusPosts(col.status).length }}</span>
      </div>
      <div class="col-body">
        <div
          v-for="post in getStatusPosts(col.status)"
          :key="post.postNo"
          class="roadmap-card"
          @click="$emit('select', post.postNo)"
        >
          <div class="card-votes">👍 {{ post.voteCount }}</div>
          <div class="card-title">{{ post.title }}</div>
          <div class="card-meta">
            <span class="card-type">{{ post.typeIcon }}</span>
            <span class="card-no">{{ post.postNo }}</span>
          </div>
        </div>
        <div v-if="!getStatusPosts(col.status).length" class="col-empty">
          暂无
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  posts: Array<{
    postNo: string
    title: string
    type: number
    typeIcon: string
    status: number
    voteCount: number
  }>
}>()

defineEmits<{
  (e: 'select', postNo: string): void
}>()

const columns = [
  { status: 2, label: 'Under Review', color: '#f59e0b' },
  { status: 3, label: 'Planned', color: '#3b82f6' },
  { status: 4, label: 'In Progress', color: '#8b5cf6' },
  { status: 5, label: 'Completed', color: '#10b981' },
]

function getStatusPosts(status: number) {
  return props.posts.filter(p => p.status === status)
}
</script>

<style scoped>
.roadmap-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.roadmap-col {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.col-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: 0.875rem;
  font-weight: 600;
}

.col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.col-title {
  flex: 1;
}

.col-count {
  padding: 1px 8px;
  border-radius: 9999px;
  background: var(--vp-c-bg);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.col-body {
  padding: 0.75rem;
  min-height: 100px;
}

.roadmap-card {
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.roadmap-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-votes {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.card-title {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.col-empty {
  text-align: center;
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .roadmap-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .roadmap-board {
    grid-template-columns: 1fr;
  }
}
</style>

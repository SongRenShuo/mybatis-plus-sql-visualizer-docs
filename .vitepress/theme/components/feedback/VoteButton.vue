<template>
  <button
    class="vote-btn"
    :class="{ voted: hasVoted, loading }"
    :disabled="loading"
    @click="handleVote"
  >
    <span class="vote-icon">👍</span>
    <span class="vote-count">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  postNo: string
  count: number
  hasVoted: boolean
  apiBase: string
}>()

const emit = defineEmits<{
  (e: 'update', count: number, hasVoted: boolean): void
}>()

const loading = ref(false)

async function handleVote() {
  if (loading.value) return
  loading.value = true

  try {
    const method = props.hasVoted ? 'DELETE' : 'POST'
    const res = await fetch(`${props.apiBase}/feedback/posts/${props.postNo}/vote`, {
      method,
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()

    if (data.code === 0) {
      const newVoted = !props.hasVoted
      const newCount = newVoted ? props.count + 1 : props.count - 1
      emit('update', newCount, newVoted)
    }
  } catch (err) {
    console.error('Vote failed:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.vote-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.vote-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.vote-btn.voted {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.vote-btn.loading {
  opacity: 0.6;
  cursor: wait;
}

.vote-icon {
  font-size: 1rem;
}

.vote-count {
  min-width: 1.5rem;
  text-align: center;
}
</style>

<template>
  <button
    class="vote-btn"
    :class="{ voted: hasVoted, loading, sm: size === 'sm' }"
    :disabled="loading"
    :title="hasVoted ? '取消点赞' : '点赞'"
    @click.stop="handleVote"
  >
    <span class="vote-icon">👍</span>
    <span class="vote-count">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  postNo: string
  count: number
  hasVoted: boolean
  apiBase: string
  /** sm 供看板紧凑卡片；默认 md 与列表/详情一致 */
  size?: 'sm' | 'md'
}>(), { size: 'md' })

const emit = defineEmits<{
  (e: 'update', count: number, hasVoted: boolean): void
}>()

const loading = ref(false)

// 列表/看板卡片整卡可点进详情，这里 @click.stop 保证点赞不误开详情
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
      return
    }
    // 本地状态与服务端不一致时（如换设备/缓存导致 hasVoted 过期），按服务端事实校正而不是静默失败
    const msg: string = data.message || ''
    if (!props.hasVoted && msg.includes('已投')) {
      emit('update', props.count, true)
    } else if (props.hasVoted && msg.includes('未投票')) {
      emit('update', props.count, false)
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
  min-height: 40px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.vote-btn.sm {
  gap: 4px;
  padding: 2px 8px;
  min-height: 24px;
  border-radius: 6px;
  font-size: 0.75rem;
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

.vote-btn.sm .vote-icon {
  font-size: 0.8rem;
}

.vote-count {
  min-width: 1.5rem;
  text-align: center;
}

.vote-btn.sm .vote-count {
  min-width: 1rem;
}
</style>

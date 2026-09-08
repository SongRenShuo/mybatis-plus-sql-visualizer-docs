<template>
  <button
    class="vote-btn"
    :class="{ voted: hasVoted, bumping, sm: size === 'sm' }"
    :title="hasVoted ? '取消点赞' : '点赞'"
    @click.stop="handleVote"
  >
    <span class="vote-icon">👍</span>
    <span class="vote-count">{{ count }}</span>
    <span v-if="floatText" :key="floatKey" class="vote-float">{{ floatText }}</span>
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

/**
 * 乐观更新：点击瞬间翻转状态并播放动画，请求后台发送（keepalive），
 * 失败回滚到点击前快照。此前「等请求返回才更新 + cursor:wait」让看板/列表
 * 的点赞卡几百毫秒转圈，体感很差。inFlight 仅作防连点守卫，不锁视觉。
 */
const inFlight = ref(false)
const bumping = ref(false)
const floatText = ref('')
const floatKey = ref(0)

function playAnimation(voted: boolean) {
  bumping.value = true
  setTimeout(() => { bumping.value = false }, 380)
  floatText.value = voted ? '+1' : '-1'
  floatKey.value += 1
  setTimeout(() => { floatText.value = '' }, 750)
}

// 列表/看板卡片整卡可点进详情，这里 @click.stop 保证点赞不误开详情
function handleVote() {
  if (inFlight.value) return
  inFlight.value = true

  const prevCount = props.count
  const prevVoted = props.hasVoted
  const newVoted = !prevVoted
  // 先翻 UI，再发请求
  emit('update', newVoted ? prevCount + 1 : Math.max(prevCount - 1, 0), newVoted)
  playAnimation(newVoted)

  const method = newVoted ? 'POST' : 'DELETE'
  fetch(`${props.apiBase}/feedback/posts/${props.postNo}/vote`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  })
    .then((res) => res.json())
    .then((data: { code: number; message?: string }) => {
      if (data.code === 0) return
      // 本地状态与服务端不一致时（如换设备/缓存导致 hasVoted 过期），按服务端事实校正
      const msg: string = data.message || ''
      if (!prevVoted && msg.includes('已投')) {
        emit('update', prevCount + 1, true)
      } else if (prevVoted && msg.includes('未投票')) {
        emit('update', Math.max(prevCount - 1, 0), false)
      } else {
        emit('update', prevCount, prevVoted)
      }
    })
    .catch((err) => {
      console.error('Vote failed:', err)
      emit('update', prevCount, prevVoted)
    })
    .finally(() => {
      inFlight.value = false
    })
}
</script>

<style scoped>
.vote-btn {
  position: relative;
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

.vote-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.vote-btn.voted {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.vote-icon {
  font-size: 1rem;
  display: inline-block;
}

/* 点赞瞬间：图标弹跳 */
@keyframes vote-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.45) rotate(-8deg); }
  70% { transform: scale(0.92); }
  100% { transform: scale(1); }
}

.vote-btn.bumping .vote-icon {
  animation: vote-pop 0.38s ease;
}

/* 飘字：+1 / -1 */
@keyframes vote-float-up {
  0% { opacity: 0; transform: translateY(4px); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); }
}

.vote-float {
  position: absolute;
  top: -4px;
  right: -6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  pointer-events: none;
  animation: vote-float-up 0.72s ease forwards;
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

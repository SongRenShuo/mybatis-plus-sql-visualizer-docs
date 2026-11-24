<script setup lang="ts">
/**
 * 账号矩阵：13 个平台入口，按「技术社区 / 内容平台 / 代码与分发」三组展示。
 *
 * 设计依据（见 docs/开发计划/20261124-1440-T-AboutSocialMatrix，含调研结论）：
 * - 13 个入口单靠图标认不全（51CTO / 博客园 / 腾讯云 中文平台辨识度低）→ 必须带文字标签 + 分组
 * - GitHub #181717 / dev.to #0A0A0A / JetBrains #000 三个纯黑在深色下会消失
 *   → 图标默认走 currentColor，品牌色只在 hover 时出现
 * - 不给卡片加持续动画或 backdrop-filter（拖 TBT 且违反 WCAG 2.2.2）
 * - 无 JS 也要能看：入场动画纯 CSS（animation-fill-mode: both）
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { socialLinks } from '../../data/social-links'

const GROUPS = [
  {
    key: 'tech',
    zh: '技术社区',
    en: 'Tech communities',
    ids: ['zhihu', 'juejin', 'csdn', 'cto51', 'cnblogs', 'tencentcloud', 'aliyun', 'devdotto'],
  },
  { key: 'content', zh: '内容平台', en: 'Content platforms', ids: ['toutiao', 'xiaohongshu'] },
  { key: 'code', zh: '代码与分发', en: 'Code & distribution', ids: ['github', 'gitee', 'jetbrains'] },
]

const grouped = computed(() =>
  GROUPS.map((g) => ({
    ...g,
    items: g.ids.map((id) => socialLinks.find((s) => s.id === id)).filter(Boolean),
  })),
)

const root = ref<HTMLElement | null>(null)
const isEn = ref(false)
let rafPending = false

function onMove(e: PointerEvent) {
  const el = root.value
  if (!el || rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    rafPending = false
  })
}

onMounted(() => {
  isEn.value = typeof location !== 'undefined' && location.pathname.startsWith('/en')
  root.value?.addEventListener('pointermove', onMove, { passive: true })
})

onUnmounted(() => {
  root.value?.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div ref="root" class="sm">
    <div class="sm__aura" aria-hidden="true"></div>

    <header class="sm__head">
      <h1 class="sm__title">{{ isEn ? 'Find me elsewhere' : '在其他地方找到我' }}</h1>
      <p class="sm__sub">
        {{
          isEn
            ? 'Same author, different places — write-ups, releases and day-to-day notes.'
            : '同一个作者的不同落脚点。文章、动态与日常记录都在这里。'
        }}
      </p>
    </header>

    <section v-for="(g, gi) in grouped" :key="g.key" class="sm__group">
      <h2 class="sm__group-title">
        <span class="sm__group-bar" aria-hidden="true"></span>
        {{ isEn ? g.en : g.zh }}
      </h2>

      <ul class="sm__grid">
        <li
          v-for="(s, i) in g.items"
          :key="s.id"
          class="sm__item"
          :style="{ '--brand': s!.color, '--d': `${(gi * 4 + i) * 45}ms` }"
        >
          <a
            class="sm__card"
            :href="s!.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="sm__icon" aria-hidden="true">
              <img
                v-if="s!.iconSrc"
                :src="s!.iconSrc"
                alt=""
                width="22"
                height="22"
                loading="lazy"
                decoding="async"
              />
              <svg v-else-if="s!.paths" :viewBox="s!.viewBox" focusable="false">
                <path v-for="(d, k) in s!.paths" :key="k" :d="d" />
              </svg>
              <span v-else class="sm__badge">{{ s!.badge }}</span>
            </span>
            <span class="sm__name">{{ isEn ? s!.nameEn : s!.name }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.sm {
  --mx: 50%;
  --my: 18%;
  position: relative;
  max-width: 980px;
  margin: 0 auto;
  padding: 3rem 1.25rem 5rem;
  overflow: hidden;
}

/* 顶部静态光斑：极慢呼吸，给静止状态一点生命感。纯 CSS 合成层，不产生 TBT */
.sm::before {
  content: '';
  position: absolute;
  top: -14%;
  left: 50%;
  width: 680px;
  height: 340px;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--vp-c-brand-1) 17%, transparent),
    transparent 70%
  );
  filter: blur(46px);
  pointer-events: none;
  animation: sm-breathe 16s ease-in-out infinite;
}

@keyframes sm-breathe {
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.85;
    transform: translateX(-50%) scale(1.09);
  }
}

/* 跟随光标的光晕：只在精确指针设备上出现，纯装饰层不接收事件 */
.sm__aura {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    420px circle at var(--mx) var(--my),
    color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent),
    transparent 68%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
}

@media (hover: hover) and (pointer: fine) {
  .sm:hover .sm__aura {
    opacity: 1;
  }
}

.sm__head {
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
}

.sm__title {
  margin: 0 0 0.625rem;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  background: linear-gradient(
    110deg,
    var(--vp-c-text-1) 10%,
    var(--vp-c-brand-1) 50%,
    var(--vp-c-text-1) 92%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sm__sub {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
}

.sm__group {
  position: relative;
  margin-bottom: 2rem;
}

.sm__group:last-child {
  margin-bottom: 0;
}

.sm__group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.875rem;
  padding: 0;
  border: none;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.sm__group-bar {
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
}

/* 标题右侧延伸线，把三组在视觉上串成一条轴 */
.sm__group-title::after {
  content: '';
  flex: 1;
  height: 1px;
  margin-left: 0.375rem;
  background: linear-gradient(90deg, var(--vp-c-divider), transparent);
}

/* 固定 4 列：技术社区 8 个正好两行，避免 auto-fill 在宽屏下排出 5+3 的碎行 */
.sm__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sm__item {
  animation: sm-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--d);
}

@keyframes sm-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.sm__card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  height: 100%;
  padding: 0.75rem 0.875rem;
  border-radius: 11px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.sm__card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--brand) 50%, var(--vp-c-divider));
  box-shadow: 0 8px 22px -12px color-mix(in srgb, var(--brand) 60%, transparent);
}

.sm__card:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.sm__icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
}

.sm__icon svg {
  width: 22px;
  height: 22px;
  fill: var(--vp-c-text-2);
  transition: fill 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 官方 favicon 是彩色位图，不能改色，靠缩放参与 hover 反馈 */
.sm__icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 4px;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sm__card:hover .sm__icon img {
  transform: scale(1.1);
}

.sm__card:hover .sm__icon svg {
  fill: var(--brand);
  transform: scale(1.1);
}

.sm__badge {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
  color: var(--brand);
  background: color-mix(in srgb, var(--brand) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sm__card:hover .sm__badge {
  transform: scale(1.1);
}

.sm__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  line-height: 1.3;
  transition: color 0.22s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sm__card:hover .sm__name {
  color: var(--vp-c-text-1);
}

/* 深色底下 17% 几乎看不见，提到 26% 才有存在感 */
html.dark .sm::before {
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--vp-c-brand-1) 26%, transparent),
    transparent 70%
  );
}

html.dark .sm__icon svg {
  fill: var(--vp-c-text-1);
  opacity: 0.85;
}

html.dark .sm__card:hover .sm__icon svg {
  opacity: 1;
}

/* 窄屏下 VitePress 不再给 .VPContent 加 nav offset（实测 1280 是 64px、768/375 是 0），
   layout: page 页面必须自己补，否则标题被 fixed 导航压住 */
@media (max-width: 959px) {
  .sm {
    padding-top: calc(var(--vp-nav-height, 64px) + 1.5rem);
  }
}

@media (max-width: 900px) {
  .sm__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .sm__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .sm {
    padding: calc(var(--vp-nav-height, 64px) + 1.25rem) 1rem 3.5rem;
  }

  .sm__title {
    font-size: 1.5rem;
  }

  .sm__head {
    margin-bottom: 2rem;
  }

  .sm__grid {
    gap: 0.625rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sm::before {
    animation: none;
    opacity: 0.6;
  }

  .sm__item {
    animation: none;
  }

  .sm__aura {
    display: none;
  }

  .sm__card,
  .sm__icon svg,
  .sm__badge,
  .sm__name {
    transition: none;
  }

  .sm__card:hover,
  .sm__card:focus-visible {
    transform: none;
  }

  .sm__card:hover .sm__icon svg,
  .sm__card:hover .sm__badge {
    transform: none;
  }
}
</style>

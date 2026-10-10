<script setup>
// 英文首页特性卡片（替代原 en/index.md frontmatter features）
// 复用 .VPFeatures / .item / .icon / .title / .details 类名，
// 以继承 style.css 中对 VPFeatures 的全局皮肤覆盖（bg-card、悬浮上移、mp-fade-up 等），
// scoped 部分复刻 VitePress 默认主题 VPFeatures / VPFeature 的布局样式。
// 数据来源：theme/data/homeHighlights.js 的 enCards
import { enCards } from '../../data/homeHighlights.js'

// 站内干净路径补 .html（与原 VPFeature 构建产物一致），外链原样返回
const toHref = (link) => {
  if (!link || /^(https?:)?\/\//.test(link)) return link
  return /\.html?$/.test(link) ? link : `${link}.html`
}
</script>

<template>
  <section class="VPFeatures en-home-features">
    <div class="container">
      <div class="items">
        <div
          v-for="(card, i) in enCards"
          :key="card.title"
          class="item mp-reveal"
          :style="{ '--mp-reveal-delay': `${(i % 3) * 80}ms` }"
        >
          <a class="card" :href="toHref(card.link)">
            <article class="box">
              <div class="icon">{{ card.icon }}</div>
              <div class="title">{{ card.title }}</div>
              <p class="details">{{ card.details }}</p>
            </article>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 复刻 VPFeatures scoped 布局；负外边距抵消外层 vp-doc.container 的留白，
   使卡片区宽度与原 home layout 独立渲染的 VPFeatures 一致 */
.en-home-features {
  padding: 0 24px;
  margin-left: -24px;
  margin-right: -24px;
}

@media (min-width: 640px) {
  .en-home-features {
    padding: 0 48px;
    margin-left: -48px;
    margin-right: -48px;
  }
}

@media (min-width: 960px) {
  .en-home-features {
    padding: 0 64px;
    margin-left: -64px;
    margin-right: -64px;
  }
}

.en-home-features .container {
  margin: 0 auto;
  max-width: 1152px;
}

.en-home-features .items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.en-home-features .item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .en-home-features .item {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .en-home-features .item {
    width: calc(100% / 3);
  }
}

/* 卡片本体（对应 VPFeature / VPLink） */
.card {
  display: block;
  height: 100%;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  color: inherit;
  text-decoration: none;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  color: inherit;
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
  margin: 0;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.details {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>

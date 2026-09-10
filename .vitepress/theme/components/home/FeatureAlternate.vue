<script setup>
import { reactive } from 'vue'

/** GIF 加载失败时置 gifError 摘除 GIF 叠层，poster 常驻兜底 */
function onImgError(e, item) {
  item.gifError = true
}

const features = reactive([
  {
    badge: 'Wrapper 预览',
    title: 'Wrapper → SQL 实时预览',
    description: 'LambdaQueryWrapper / MPJLambdaWrapper 等全类型静态解析，无需启动项目，直接预览最终 SQL',
    features: [
      { title: 'Lambda 链静态解析', description: '无需运行项目即可预览完整 SQL' },
      { title: '动态条件勾选', description: 'if / choose / where 等标签按需渲染' },
      { title: '9 种方言分页', description: 'MySQL / PG / Oracle 等全方言分页语法' },
    ],
    imageSrc: '/demo/wrapper-preview.gif',
    poster: '/demo/wrapper-preview.png',
    gifReady: false,
    gifError: false,
  },
  {
    badge: '日志还原',
    title: '控制台日志一键还原',
    description: '自动捕获运行控制台 Preparing / Parameters 日志，还原成可执行 SQL',
    features: [
      { title: '自动捕获', description: '监听控制台输出，自动识别 SQL 日志' },
      { title: '批量还原', description: '粘贴整段日志，多组语句自动分隔' },
      { title: '混合前缀匹配', description: '宽容匹配各种日志前缀格式' },
    ],
    imageSrc: '/demo/sql-log.gif',
    poster: '/demo/sql-log.png',
    gifReady: false,
    gifError: false,
    reverse: true,
  },
  {
    badge: '反向转换',
    title: 'SQL → Java 反向转换',
    description: '选中 SQL 一键生成可编译的 MyBatis-Plus 代码，支持四形态输出',
    features: [
      { title: '四形态输出', description: 'QueryWrapper / Lambda / Wrappers / MPJ' },
      { title: '增删改查全覆盖', description: 'SELECT / INSERT / UPDATE / DELETE 全支持' },
      { title: '多表 JOIN', description: '联表查询自动生成 MPJLambdaWrapper' },
    ],
    imageSrc: '/demo/sql-to-java.gif',
    poster: '/demo/sql-to-java.png',
    gifReady: false,
    gifError: false,
  },
  {
    badge: '多框架支持',
    title: 'XML / 注解 / MPJ 全覆盖',
    description: 'mapper XML 全动态标签按 MyBatis 语义渲染，注解 SQL 同样支持',
    features: [
      { title: 'XML 动态标签', description: 'if / choose / foreach / bind 等全支持' },
      { title: '注解 SQL', description: '@Select / @Update / @Delete / @Insert' },
      { title: 'OGNL 表达式', description: '面板勾选动态条件，实时预览结果' },
    ],
    imageSrc: '/demo/xml-preview.gif',
    poster: '/demo/xml-preview.png',
    gifReady: false,
    gifError: false,
    reverse: true,
  },
])
</script>

<template>
  <section class="features-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">大幅提升您的 SQL 调试效率</h2>
        <p class="section-description">
          更简单的工具，更清晰的逻辑。旨在优化每一个研发细节，让您在更短的时间内成就更多
        </p>
      </div>

      <div class="features-list">
        <div
          v-for="(item, index) in features"
          :key="index"
          class="feature-item"
          :class="{ reverse: item.reverse }"
        >
          <div class="feature-video-wrapper" :class="{ reverse: item.reverse }">
            <img
              :src="item.poster"
              :alt="item.title"
              loading="lazy"
              class="feature-video"
            />
            <img
              v-if="!item.gifError"
              :src="item.imageSrc"
              :alt="item.title"
              loading="lazy"
              class="feature-video feature-video--gif"
              :class="{ 'feature-video--gif-ready': item.gifReady }"
              @load="item.gifReady = true"
              @error="onImgError($event, item)"
            />
          </div>

          <div class="feature-content" :class="{ reverse: item.reverse }">
            <div class="feature-badge">{{ item.badge }}</div>
            <h3 class="feature-title">{{ item.title }}</h3>
            <p class="feature-description">{{ item.description }}</p>
            <div class="feature-points">
              <div
                v-for="(point, pIndex) in item.features"
                :key="pIndex"
                class="feature-point"
              >
                <div class="feature-check-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <div>
                  <div class="feature-point-title">{{ point.title }}</div>
                  <div class="feature-point-description">{{ point.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 5rem 1.5rem;
  background-color: var(--bg-primary);
}

.section-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 5rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 3rem;
  }
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.feature-item {
  display: grid;
  gap: 3rem;
  align-items: start;
  max-width: 90rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .feature-item {
    grid-template-columns: 1.3fr 1fr;
  }
  .feature-item.reverse {
    grid-template-columns: 1fr 1.3fr;
  }
}

.feature-video-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.25);
}

.feature-video-wrapper.reverse {
  order: 1;
}

/* GIF 叠层：poster 常驻底层撑布局，GIF 就绪后淡入覆盖（T9c 弱网体验） */
.feature-video--gif {
  position: absolute;
  inset: 0;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.feature-video--gif-ready {
  opacity: 1;
}

@media (min-width: 768px) {
  .feature-video-wrapper.reverse {
    order: 2;
  }
}

.feature-video {
  width: 100%;
  display: block;
  object-fit: cover;
  min-height: 300px;
  border-radius: 1rem;
  background-color: var(--bg-secondary);
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-content.reverse {
  order: 2;
}

@media (min-width: 768px) {
  .feature-content.reverse {
    order: 1;
  }
}

.feature-badge {
  display: inline-block;
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  background-color: var(--primary-color);
  align-self: flex-start;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .feature-title {
    font-size: 1.875rem;
  }
}

.feature-description {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
}

.feature-points {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.feature-point {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.feature-point:hover {
  background-color: var(--bg-secondary);
  transform: translateX(4px);
}

.feature-check-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}

.feature-check-icon svg {
  color: white;
}

.feature-point-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.feature-point-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 0.25rem;
}
</style>

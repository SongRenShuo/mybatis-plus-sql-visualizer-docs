<script setup>
import { usePluginVersion } from '../../composables/usePluginVersion'
import { useHomeContent } from '../../composables/useHomeContent'

const { version } = usePluginVersion()
const { c, isEnglish } = useHomeContent()
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <h1 class="hero-title" :class="{ 'hero-title--zh': !isEnglish }">
            <span>{{ c.hero.titleLine1 }}</span><br v-if="isEnglish" />
            <span class="hero-title-highlight">{{ c.hero.titleLine2 }}</span>
          </h1>

          <p class="hero-description">
            {{ c.hero.description }}
          </p>

          <div class="btn-group">
            <a
              href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-large btn-download"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{{ c.hero.install }}</span>
            </a>
            <a
              href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/releases"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-large btn-outline"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 3v10m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
              </svg>
              <span>{{ c.hero.offline }}</span>
            </a>
          </div>

          <ul class="hero-highlights">
            <li v-for="h in c.hero.highlights" :key="h" class="hero-highlight">
              <svg class="highlight-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>{{ h }}</span>
            </li>
          </ul>

          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-value">{{ version }}</span>
              <span class="hero-stat-label">{{ c.hero.statLabels[0] }}</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">2024.3+</span>
              <span class="hero-stat-label">{{ c.hero.statLabels[1] }}</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">Apache-2.0</span>
              <span class="hero-stat-label">{{ c.hero.statLabels[2] }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="blur-circle blur-circle-1"></div>
          <div class="blur-circle blur-circle-2"></div>

          <!-- 代码对照：左侧 Wrapper 链，右侧生成的 SQL。
               片段取自 features/wrapper-preview.md §示例（同一组示例，逐字一致），
               不另造示意代码；Alt+Shift+Q 为文档记载的预览快捷键。 -->
          <div class="hero-code">
            <div class="hero-code__pane">
              <div class="hero-code__bar">
                <span class="hero-code__dot"></span>
                <span class="hero-code__label">{{ c.hero.codeJavaLabel }}</span>
                <span class="hero-code__chip">Java</span>
              </div>
              <div class="hero-code__body">
                <div class="hero-code__line">
                  <span class="hero-code__ln">1</span><code><span class="tk-type">LambdaQueryWrapper</span>&lt;<span class="tk-type">DeviceInfoEntity</span>&gt; wrapper = <span class="tk-key">new</span> <span class="tk-type">LambdaQueryWrapper</span>&lt;&gt;()</code>
                </div>
                <div class="hero-code__line">
                  <span class="hero-code__ln">2</span><code>    .<span class="tk-fn">eq</span>(<span class="tk-type">DeviceInfoEntity</span>::<span class="tk-fn">getId</span>, <span class="tk-num">1001L</span>)</code>
                </div>
                <div class="hero-code__line">
                  <span class="hero-code__ln">3</span><code>    .<span class="tk-fn">isNotNull</span>(<span class="tk-type">DeviceInfoEntity</span>::<span class="tk-fn">getStationId</span>);</code>
                </div>
              </div>
            </div>

            <div class="hero-code__divider">
              <span class="hero-code__divider-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                Alt + Shift + Q
              </span>
            </div>

            <div class="hero-code__pane">
              <div class="hero-code__bar">
                <span class="hero-code__dot hero-code__dot--sql"></span>
                <span class="hero-code__label">{{ c.hero.codeSqlLabel }}</span>
                <span class="hero-code__chip hero-code__chip--sql">SQL</span>
              </div>
              <div class="hero-code__body hero-code__body--result">
                <div class="hero-code__line">
                  <span class="hero-code__ln">1</span><code><span class="tk-kw">SELECT</span> id, station_id, share_scheme_id</code>
                </div>
                <div class="hero-code__line">
                  <span class="hero-code__ln">2</span><code><span class="tk-kw">FROM</span> device_info_entity</code>
                </div>
                <div class="hero-code__line">
                  <span class="hero-code__ln">3</span><code><span class="tk-kw">WHERE</span> id = <span class="tk-num">1001</span></code>
                </div>
                <div class="hero-code__line">
                  <span class="hero-code__ln">4</span><code>    <span class="tk-kw">AND</span> station_id <span class="tk-kw">IS NOT NULL</span></code>
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
.hero-section {
  min-height: 100vh;
  /* 移动端地址栏收放时按小视口高计算，避免首屏溢出 */
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: 8rem;
  padding-bottom: 5rem;
}

.hero-section .container {
  width: 100%;
}

.hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-grid {
    grid-template-columns: 2fr 3fr;
  }
}

/* grid 项默认 min-width:auto，会被代码块里 white-space:pre 的 min-content（约 470px）
   撑破列宽 —— 375 视口下整块宽 472px 被 overflow-x:clip 裁掉右侧。归零后
   列宽由轨道决定，超出部分交给 .hero-code__body 的 overflow-x 内部滚动。 */
.hero-grid > * {
  min-width: 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

.hero-title--zh > span {
  display: inline-block;
  white-space: nowrap;
}

.hero-title-highlight {
  color: var(--primary-color);
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin: 0;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.btn-download {
  color: white;
  background-color: var(--primary-color);
}

.btn-download:hover {
  color: #ffffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-outline {
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  background-color: transparent;
}

.btn-outline:hover {
  background-color: var(--bg-secondary);
  color: var(--primary-color);
}

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hero-highlight {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.highlight-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
}

.hero-stat-value {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.hero-stat-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Hero visual */
.hero-visual {
  position: relative;
}

.blur-circle {
  position: absolute;
  width: 20rem;
  height: 20rem;
  border-radius: 9999px;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

/* 品牌蓝同色系光斑。原先写死 #f96a48c4（橙）与 #ec4899（粉），是模板遗留值，
   与 --primary-color 的蓝互相打架，生产页表现为 logo 后方一团粉红暖光。 */
.blur-circle-1 {
  top: 30%;
  left: 30%;
  background-color: var(--primary-color);
  opacity: 0.3;
}

.blur-circle-2 {
  top: 40%;
  left: 50%;
  background-color: var(--primary-light);
  opacity: 0.24;
}

.hero-image-wrapper {
  position: relative;
  z-index: 10;
}

/* 代码对照面板：固定深色（代表 IDE 画面，不随主题反转），
   与全站截图同为深色，避免浅色首屏里出现一块突兀的浅底代码 */
.hero-code {
  position: relative;
  z-index: 10;
  border-radius: 14px;
  overflow: hidden;
  background-color: #0e1218;
  border: 1px solid #2a3340;
  box-shadow:
    0 24px 48px -20px rgba(11, 20, 34, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
}

.hero-code__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background-color: #161d27;
  border-bottom: 1px solid #232c38;
}

.hero-code__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #86eaff;
  box-shadow: 0 0 0 3px rgba(134, 234, 255, 0.12);
  flex-shrink: 0;
}

.hero-code__dot--sql {
  background-color: #ff997b;
  box-shadow: 0 0 0 3px rgba(255, 153, 123, 0.12);
}

.hero-code__label {
  font-size: 0.75rem;
  color: #a4adbc;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右上角语言标签：一眼分清哪块是 Java、哪块是 SQL */
.hero-code__chip {
  margin-left: auto;
  flex-shrink: 0;
  padding: 0.125rem 0.4375rem;
  border-radius: 5px;
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #86eaff;
  background-color: rgba(134, 234, 255, 0.1);
  border: 1px solid rgba(134, 234, 255, 0.22);
}

.hero-code__chip--sql {
  color: #ff997b;
  background-color: rgba(255, 153, 123, 0.1);
  border-color: rgba(255, 153, 123, 0.22);
}

.hero-code__body {
  padding: 0.75rem 0;
  font-size: 0.75rem;
  line-height: 1.75;
  color: #e5e8ed;
  overflow-x: auto;
  scrollbar-width: thin;
}

/* 结果面板：极淡的品牌色底 + 左侧强调条，一眼区分「这块是生成出来的 SQL」 */
.hero-code__body--result {
  background-image: linear-gradient(180deg, rgba(46, 106, 224, 0.09), rgba(46, 106, 224, 0.02));
  box-shadow: inset 2px 0 0 rgba(134, 234, 255, 0.45);
}

.hero-code__line {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0 0.875rem;
}

.hero-code__line code {
  white-space: pre;
  font: inherit;
}

/* 行号：不可选中，避免复制代码时把行号带进去 */
.hero-code__ln {
  flex-shrink: 0;
  width: 1ch;
  text-align: right;
  color: #46505f;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

/* 转换分隔：细线 + 居中胶囊，比整幅色带更轻，也不抢代码的注意力 */
.hero-code__divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0;
  background-color: #0b0e13;
}

.hero-code__divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background-color: #232c38;
}

.hero-code__divider-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8e99a9;
  background-color: #12181f;
  border: 1px solid #232c38;
}

.hero-code__divider-chip svg {
  width: 0.75rem;
  height: 0.75rem;
  color: #86eaff;
}

/* 语法着色：取参考页（Payathon）的深色配色，青为主、橙为辅 */
.tk-type { color: #86eaff; }
.tk-fn { color: #82b5ff; }
.tk-key { color: #ff997b; }
.tk-num { color: #a9e6b6; }
.tk-kw { color: #ff997b; font-weight: 600; }

@media (max-width: 767px) {
  /* 窄屏只隐藏行号、让出行号那点宽度。字号保持 0.75rem（12px）——T4 验收线
     要求移动端代码字号不低于 12px；代价是最长的 Java 行会超出容器宽度，
     由 .hero-code__body 的 overflow-x 内部横滑消化（代码块内部横滑是常规行为）。 */
  .hero-code__ln {
    display: none;
  }

  .hero-code__line {
    padding: 0 0.75rem;
    gap: 0;
  }

  .hero-code__label {
    font-size: 0.6875rem;
  }
}
</style>

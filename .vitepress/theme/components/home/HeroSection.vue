<script setup>
import { usePluginVersion } from '../../composables/usePluginVersion'

const { version } = usePluginVersion()
</script>

<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <h1 class="hero-title">
            服务未启，<br />
            <span class="hero-title-highlight">SQL 先知</span>
          </h1>

          <p class="hero-description">
            IntelliJ IDEA 插件：写代码时就看见最终 SQL——Wrapper 链、XML/注解/HQL 动态 SQL（含 MPJ 联表 JOIN）实时预览；跑起来后真实参数与耗时自动捕获，慢查询标红、EXPLAIN 看计划、一键跳回源码；SQL 也能反向转成 Java 代码。不启服务、不翻日志、不手拼参数。
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
              <span>在 Marketplace 中安装</span>
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
              <span>下载离线包</span>
            </a>
          </div>

          <ul class="hero-highlights">
            <li class="hero-highlight">
              <svg class="highlight-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>更新无需重启 IDEA</span>
            </li>
            <li class="hero-highlight">
              <svg class="highlight-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>内网环境离线可用</span>
            </li>
            <li class="hero-highlight">
              <svg class="highlight-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>无遥测 · 代码不出本机</span>
            </li>
          </ul>

          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-value">{{ version }}</span>
              <span class="hero-stat-label">最新版本</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">2024.3+</span>
              <span class="hero-stat-label">IDEA 支持</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">Apache-2.0</span>
              <span class="hero-stat-label">开源协议</span>
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
                <span class="hero-code__label">UserService.java</span>
              </div>
              <pre class="hero-code__body"><code><span class="tk-type">LambdaQueryWrapper</span>&lt;<span class="tk-type">DeviceInfoEntity</span>&gt; wrapper = <span class="tk-key">new</span> <span class="tk-type">LambdaQueryWrapper</span>&lt;&gt;()
    .<span class="tk-fn">eq</span>(<span class="tk-type">DeviceInfoEntity</span>::<span class="tk-fn">getId</span>, <span class="tk-num">1001L</span>)
    .<span class="tk-fn">isNotNull</span>(<span class="tk-type">DeviceInfoEntity</span>::<span class="tk-fn">getStationId</span>);</code></pre>
            </div>

            <div class="hero-code__divider">
              <span class="hero-code__divider-text">Alt + Shift + Q</span>
            </div>

            <div class="hero-code__pane">
              <div class="hero-code__bar">
                <span class="hero-code__dot hero-code__dot--sql"></span>
                <span class="hero-code__label">实时预览 · 生成的 SQL</span>
              </div>
              <pre class="hero-code__body"><code><span class="tk-kw">SELECT</span> id, station_id, share_scheme_id
<span class="tk-kw">FROM</span> device_info_entity
<span class="tk-kw">WHERE</span> id = <span class="tk-num">1001</span>
    <span class="tk-kw">AND</span> station_id <span class="tk-kw">IS NOT NULL</span></code></pre>
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
  border-radius: 1rem;
  overflow: hidden;
  background-color: #10141b;
  border: 1px solid #2c3542;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
}

.hero-code__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: #171d26;
  border-bottom: 1px solid #2c3542;
}

.hero-code__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #86eaff;
  opacity: 0.85;
  flex-shrink: 0;
}

.hero-code__dot--sql {
  background-color: #ff997b;
}

.hero-code__label {
  font-size: 0.75rem;
  color: #a4adbc;
  letter-spacing: 0.02em;
}

.hero-code__body {
  margin: 0;
  padding: 1rem;
  font-size: 0.75rem;
  line-height: 1.7;
  color: #e5e8ed;
  white-space: pre;
  overflow-x: auto;
  scrollbar-width: thin;
}

.hero-code__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4375rem 1rem;
  background-color: #0d1016;
  border-top: 1px solid #2c3542;
  border-bottom: 1px solid #2c3542;
}

.hero-code__divider-text {
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #77818f;
}

/* 语法着色：取参考页（Payathon）的深色配色，青为主、橙为辅 */
.tk-type { color: #86eaff; }
.tk-fn { color: #82b5ff; }
.tk-key { color: #ff997b; }
.tk-num { color: #a9e6b6; }
.tk-kw { color: #ff997b; font-weight: 600; }

@media (max-width: 767px) {
  .hero-code__body {
    /* 窄屏缩一档，让最长的 Java 行尽量不触发横向滚动 */
    font-size: 0.6875rem;
    padding: 0.875rem;
  }
}
</style>

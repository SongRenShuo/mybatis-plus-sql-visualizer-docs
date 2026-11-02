<script setup>
import { usePluginVersion } from '../../composables/usePluginVersion'
import { useHomeContent } from '../../composables/useHomeContent'
import { trackDownload } from '../../composables/useTracker'

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
              @click="trackDownload('marketplace')"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{{ c.hero.install }}</span>
            </a>
            <a
              :href="c.hero.offlineHref"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-large btn-outline"
              @click="trackDownload(c.hero.offlineTrack)"
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
              <span class="hero-stat-label hud-label">{{ c.hero.statLabels[0] }}</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">2024.3+</span>
              <span class="hero-stat-label hud-label">{{ c.hero.statLabels[1] }}</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat-value">Apache-2.0</span>
              <span class="hero-stat-label hud-label">{{ c.hero.statLabels[2] }}</span>
            </div>
          </div>

          <!-- 安装路径一行：与三个数字放在一起，给「从哪装」一个直给答案 -->
          <p class="hero-install-path">{{ c.hero.installPath }}</p>
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
                <span class="hero-code__label hud-label">{{ c.hero.codeJavaLabel }}</span>
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
                <span class="hero-code__label hud-label">{{ c.hero.codeSqlLabel }}</span>
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

/* 三级信息的间距节奏（T5）：原先统一 1.5rem，三级挤成等权。
   现在按「一级 → 二级 → 三级」把间距拉开成递增——CTA 与标签同属行动区，
   留 1.75rem；标签到统计数据跨层，留 2.5rem。
   标题与简介之间保持原值的 1.5rem：那两级不属于本任务的三级信息。 */
.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-content > .btn-group {
  margin-top: 0.25rem;
}

.hero-content > .hero-stats {
  margin-top: 1rem;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
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

/* 一级（T5）：CTA 组是三级的最高层，尺寸上先拉开——
   字重/内边距比原值各提一档，让它与下方标签、数据明显不同级。
   宽度仍由文字决定（不撑满），换行时两个按钮各自成行。 */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-large {
  padding: 0.875rem 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* 主按钮：实心 + 品牌色。原 hover 只加了一层与亮色底几乎不可辨的阴影
   （0 20px 25px -5px rgba(0,0,0,0.1)），观感上「没反馈」。
   改为「底色加深 + 投影」双通道：深色由 color-mix 从 --primary-color 推出，
   暗色模式下同样成立（不依赖只在亮色定义的 --primary-dark）。 */
.btn-download {
  color: white;
  background-color: var(--primary-color);
}

.btn-download:hover {
  color: #ffffff;
  background-color: color-mix(in srgb, var(--primary-color) 88%, #000000);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.28);
}

/* 次按钮：保持描边（原实现已是 transparent + 2px 边框，不是填充，
   无需按「改成描边」处理）。层级靠三处压低——边框降到 1px、
   字色从 --primary-color 降到 --text-primary、hover 只给浅底，
   使其在视觉上明确从属于主按钮。 */
.btn-outline {
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  background-color: transparent;
}

.btn-outline:hover {
  background-color: var(--bg-secondary);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 二级（T5）：亮点标签。原先是「描边 + --bg-secondary + 继承字重」，
   与站内其它卡片共用同一组底色/边框值，观感上不成一级。
   现在改为「品牌色浅底 + 品牌色描边 + 提字重」：
   底色用 color-mix 从 --primary-color 派生，亮暗两模式自动跟随，
   不写死色值（暗色下 --bg-secondary 与 --border-color 的对比度本就低，
   浅底 route 比换 --bg-secondary 更可靠）。 */
.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hero-highlight {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.9375rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--primary-color) 28%, var(--border-color));
  background-color: color-mix(in srgb, var(--primary-color) 8%, var(--bg-primary));
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.highlight-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

/* 三级（T5）：统计数据。原先 gap 1.5rem 无分隔，数值 1.5rem / 标签 0.75rem
   只有 2:1，三级里最弱。现在：
   - 数值提到 1.75rem 并加 tabular-nums（版本号/协议名长度不同，
     等宽数字让三项基线对齐，不会因换行宽度不同而参差）
   - 标签降到 0.6875rem 并加字距、改 --text-muted，与数值拉开到约 2.6:1
   - 之间加发丝竖线分隔（实现见下方 .hero-stat + .hero-stat::before） */
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.5rem;
  row-gap: 1.25rem;
  padding-top: 0.5rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
}

.hero-stat-value {
  color: var(--primary-color);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.hero-stat-label {
  color: var(--text-muted);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  margin-top: 0.375rem;
}

/* 发丝竖线：只加在第 2、3 项左侧，颜色取 --border-color（亮暗两模式都有）。
   用 ::before 而非 border-left：border 会增加 content-box 宽度，
   三项总宽随之变化、在窄屏更容易触发换行；::before 作为 flex 子项参与排布，
   但宽度只有 1px，且与 column-gap 相加后正好补足 1.5rem 的原间距。 */
.hero-stat + .hero-stat::before {
  content: '';
  align-self: stretch;
  width: 1px;
  margin-right: 1.5rem;
  background-color: var(--border-color);
}

/* 安装路径 meta 小字：延续 hero-stat-label 的字号与次要色，负外边距
   收紧与数字行的间距（hero-content 的 gap 1.5rem 对这行太大） */
.hero-install-path {
  color: var(--text-secondary);
  font-size: 0.75rem;
  line-height: 1.6;
  margin: -0.75rem 0 0;
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

  /* 三级分层在窄屏的收法（T5）：
     - 统计数值从 1.75rem 回到 1.5rem。1.75rem 是为桌面端与上方 CTA 拉开层级
       才提的；窄屏三项会换行成三行，字号再大就成了三行巨型数字，反而压过 CTA。
     - 发丝竖线关掉：flex-wrap 下 CSS 无法判断某项是否行首，换行后
       .hero-stat + .hero-stat 会落在行首，线就成了一条悬在左边缘的竖道。
       整体停用，靠 column-gap 保持间隔。 */
  .hero-stat-value {
    font-size: 1.5rem;
  }

  .hero-stat + .hero-stat::before {
    content: none;
  }
}
</style>

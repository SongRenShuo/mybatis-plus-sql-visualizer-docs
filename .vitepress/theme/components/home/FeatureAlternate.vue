<script setup>
import { reactive, ref, onMounted } from 'vue'

const sectionEl = ref(null)

/** GIF 加载失败时置 gifError 摘除 GIF 叠层，poster 常驻兜底 */
function onImgError(e, item) {
  item.gifError = true
}

// GIF 命中 HTTP 缓存时 load 事件可能早于 Vue 挂载监听器触发（hydration 输掉竞态，
// gifReady 永不置位 → 叠层恒透明退化为静态 poster），挂载后按 complete 状态直接补位；
// v-for DOM 顺序与 features 一致，按序号回填
onMounted(() => {
  if (!sectionEl.value) return
  const imgs = sectionEl.value.querySelectorAll('img.feature-video--gif')
  imgs.forEach((img, index) => {
    if (!img.complete || !features[index]) return
    if (img.naturalWidth > 0) features[index].gifReady = true
    else features[index].gifError = true
  })
})

const features = reactive([
  {
    badge: 'Wrapper 预览',
    title: 'Wrapper → SQL 实时预览',
    description: 'LambdaQueryWrapper / MPJLambdaWrapper 等全类型静态解析，无需启动项目，直接预览最终 SQL',
    features: [
      { title: 'Lambda 链静态解析', description: '无需运行项目即可预览完整 SQL' },
      { title: '动态条件勾选', description: 'if / choose / where 等标签按需渲染' },
      { title: '11 种方言分页', description: 'MySQL / PG / Oracle 等全方言分页语法' },
    ],
    imageSrc: '/demo/wrapper-preview.gif',
    poster: '/demo/wrapper-preview.png',
    gifReady: false,
    gifError: false,
  },
  {
    badge: '日志还原',
    title: '控制台日志一键还原',
    description: '增强捕获为默认通道，无需应用开启 SQL 日志即得真实参数与耗时；控制台日志自动捕获还原',
    features: [
      { title: '增强捕获默认通道', description: '首次运行项目确认后自动采集，真实参数、精确耗时、影响行数开箱即得' },
      { title: '并发日志分桶还原', description: '自动识别 Preparing / Parameters，多线程交错按线程分桶，参数不错挂' },
      { title: '目标库角标', description: '条目标注 [MySQL]、[DM（达梦）] 等，11 种方言与 HSQL / GBASE 全识别' },
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
    badge: '智能生成',
    title: 'CRUD SQL 一键生成',
    description: '实体类 / 数据库表右键即出 SELECT / INSERT / UPDATE / DELETE 候选，选定进预览直接编辑、复制',
    features: [
      { title: '三入口覆盖', description: '实体类文件、项目视图节点、Database 表节点（Ultimate）' },
      { title: '候选浮层秒选', description: '打字即过滤，Enter / 双击选定，ESC 关闭' },
      { title: '语义对齐 MP 运行时', description: '乐观锁进 WHERE、自增主键默认不勾、逻辑删除出专用 DELETE 变体' },
    ],
    imageSrc: '/demo/crud-sql.gif',
    poster: '/demo/crud-sql.png',
    gifReady: false,
    gifError: false,
    reverse: true,
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
  },
  {
    badge: '跨生态',
    title: 'JPA / Hibernate SQL 预览',
    description: 'Repository 派生方法、JPQL / HQL、Criteria 链静态解析出 SQL，不启动 Spring 容器、不连数据库',
    features: [
      { title: '派生方法解析', description: 'findByXxx 命名规则全支持，gutter 图标点击即出' },
      { title: '@Query 全兼容', description: 'JPQL / 原生 SQL / @Modifying DML 直接预览' },
      { title: 'Criteria 链与 .hbm.xml', description: '静态解析，不依赖容器与数据库' },
    ],
    imageSrc: '/demo/jpa-preview.gif',
    poster: '/demo/jpa-preview.png',
    gifReady: false,
    gifError: false,
    reverse: true,
  },
  {
    badge: 'AI Agent 集成',
    title: 'MCP Server：给 AI Agent 的 SQL 工具',
    description: 'Claude Code / Cursor / AI Assistant / Codex 经 IDEA 内置 MCP Server 直连插件能力，IDE 里照常写代码，agent 在旁边干活',
    features: [
      { title: '确定性证据', description: '渲染链真实产出的可执行 SQL 本体交给 agent，不是置信度评分' },
      { title: '十一个只读工具', description: '渲染还原、表结构、EXPLAIN、写风险核查、回滚预案、性能建议、历史检索（IDEA 2025.2+）' },
      { title: '可控可审计', description: '设置页逐工具启停即时生效，SELECT 白名单拦截 + 每次调用审计留痕' },
    ],
    // 20260920 首页卡用「真实调用」那张（agent 经 ACP 调 sqlv_check_sql）；
    // 「开启设置」那张移到功能页「典型工作流」节。示意 SVG 仍保留在 features/mcp.md 开篇
    imageSrc: '/demo/mcp-agent.gif',
    poster: '/demo/mcp-agent.png',
    gifReady: false,
    gifError: false,
  },
])
</script>

<template>
  <section id="sec-capability" ref="sectionEl" class="features-section">
    <div class="container">
      <div class="section-header mp-reveal">
        <span class="section-eyebrow">Core Capabilities</span>
        <h2 class="section-title">大幅提升您的 SQL 调试效率</h2>
        <p class="section-description">
          更简单的工具，更清晰的逻辑。旨在优化每一个研发细节，让您在更短的时间内成就更多
        </p>
      </div>

      <div class="features-list">
        <div
          v-for="(item, index) in features"
          :key="index"
          class="feature-item mp-reveal"
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

@media (max-width: 767px) {
  /* 手机端演示图整行出血：抵消 section 与内层 .container 各 24px 的水平内边距，
     图片由 279px 提到接近视口宽（375px，+34%）。窄屏专属，桌面端布局不变。
     两层内边距叠加见 docs/开发计划/20260920-1230-首页功能卡手机端演示图过小修复-开发计划.md */
  .feature-video-wrapper {
    margin-left: -48px;
    margin-right: -48px;
  }
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
  /* 占位盒始终与素材原比例(1440×1034)一致：min-height 会在窄屏把横图拉成竖框，
     触发 cover 严重裁切（手机端横向约 1/3 画面丢失） */
  aspect-ratio: 1440 / 1034;
  border-radius: 1rem;
  background-color: var(--bg-secondary);
  /* 裁掉素材自带的浅灰窗框（暗色模式下呈白边），poster 与 GIF 叠层同类共用 */
  clip-path: inset(0.15% 0.6% 0.85% 0.6%);
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

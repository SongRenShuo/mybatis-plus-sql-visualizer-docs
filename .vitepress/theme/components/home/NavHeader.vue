<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import PagefindSearch from '../PagefindSearch.vue'
import SectionNav from './SectionNav.vue'
import { useHomeContent } from '../../composables/useHomeContent'
import { trackDownload } from '../../composables/useTracker'

const { isDark } = useData()
const { c } = useHomeContent()

const scrolled = ref(false)
const mobileOpen = ref(false)
// 首页走自定义导航（CoolHome，layout:false），拿不到 VitePress 自带的
// VPNavBarTranslations，语言切换需要自建；文档页仍是 VitePress 默认那一套。
const langOpen = ref(false)
const langRef = ref(null)

let scrollHandler = null

function onKeydown(e) {
  if (e.key === 'Escape') {
    mobileOpen.value = false
    langOpen.value = false
  }
}

// 点击语言菜单以外的地方收起
function onDocumentClick(e) {
  if (!langOpen.value) return
  if (langRef.value && !langRef.value.contains(e.target)) langOpen.value = false
}

// 全屏菜单展开期间锁定背景滚动，收起/卸载时兜底恢复
watch(mobileOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)
  scrollHandler()
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header
    class="nav-bar"
    :class="{ scrolled: scrolled || mobileOpen, transparent: !scrolled && !mobileOpen }"
  >
    <div class="container">
      <div class="nav-content">
        <!-- 品牌：原 logo 标记在左，新字标在右。≥768 用完整字标（含 Visualizer），
             窄屏换成独立标记；400 以下只留原 logo。
             字标用背景图而不是 <picture>：picture 的 source 在视口变化后不保证重新选择
             （实测从 1280 缩到 400 仍停在字标），背景图按媒体查询直接生效，
             且同一时刻只会下载命中的那一张 -->
        <span class="brand">
          <img src="/logo.svg" alt="" class="nav-mark" aria-hidden="true" />
          <span class="logo-area" role="img" aria-label="SQL Visualizer"></span>
        </span>

        <nav class="nav-links">
          <a v-for="link in c.nav.links" :key="link.href" :href="link.href" class="nav-link">
            {{ link.text }}
          </a>
        </nav>

        <div class="nav-actions">
          <!-- 工具簇：语言 / 主题 / 源码仓库 / 搜索统一 36×36、8px 圆角、悬浮软底，
               簇内 4px；与主 CTA 之间 16px。仓库图标只在 ≥768 出现，窄屏收进全屏菜单 -->
          <div class="nav-tools">
            <div ref="langRef" class="nav-lang">
              <button
                class="nav-lang-btn"
                :aria-expanded="langOpen"
                aria-haspopup="true"
                :title="c.nav.langMenuLabel"
                @click="langOpen = !langOpen"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nav-lang-icon">
                  <path d="M4 5h9M8.5 5c0 3.5-1.8 6.4-4.5 8.2" />
                  <path d="M6 9.2c1.2 2.1 3 3.6 5.2 4.5" />
                  <path d="M13 20l4-10 4 10M14.4 17h5.2" />
                </svg>
                <span class="nav-lang-label">{{ c.nav.langLabel }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-lang-chevron">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <Transition name="lang-fade">
                <div v-if="langOpen" class="nav-lang-menu">
                  <a
                    v-for="l in c.nav.langs"
                    :key="l.href"
                    :href="l.href"
                    class="nav-lang-item"
                    :class="{ 'is-active': l.active }"
                    :aria-current="l.active ? 'true' : undefined"
                  >
                    {{ l.text }}
                  </a>
                </div>
              </Transition>
            </div>

            <button
              class="theme-toggle"
              :title="isDark ? c.nav.themeToLight : c.nav.themeToDark"
              :aria-label="isDark ? c.nav.themeAriaLight : c.nav.themeAriaDark"
              @click="isDark = !isDark"
            >
              <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>
            <PagefindSearch compact />

            <a
              href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-gitee"
              :title="c.nav.giteeTitle"
            >
              <img src="/gitee-icon.png" alt="Gitee" class="nav-gitee-icon" />
            </a>
            <!-- 2026-10-22 双仓：GitHub 是镜像仓，源码链接也用它，故与 Gitee 并列展示 -->
            <a
              href="https://github.com/SongRenShuo/mybatis-plus-sql-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-gitee"
              :title="c.nav.githubTitle"
            >
              <img src="/github-icon.png" alt="GitHub" class="nav-gitee-icon" />
            </a>
          </div>

          <a
            href="https://plugins.jetbrains.com/plugin/33633-sql-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
            @click="trackDownload('marketplace')"
          >
            {{ c.nav.download }}
          </a>
          <button
            class="nav-hamburger"
            :class="{ open: mobileOpen }"
            :aria-expanded="mobileOpen"
            :aria-label="c.nav.menuLabel"
            @click="mobileOpen = !mobileOpen"
          >
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 页内章节导航：作为 header 的第二行，共用吸顶背景与投影，避免两条固定栏之间出现接缝。
         收起时高度为 0，顶栏在首屏维持原高度 -->
    <SectionNav :suppressed="mobileOpen" />

    <!-- 全屏导航层（对齐文档页 VPNavScreen 交互）：z-index -1 压在 header 背景之上、
         nav-content 之下，不依赖顶栏具体高度，logo 与关闭按钮保持可点；
         动画与 VPNavScreen 同配方——整屏 opacity .25s + 内部容器 translateY(-8px)→0 滑入 -->
    <Transition name="menu-fade">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-menu-container">
          <nav class="mobile-links">
            <a
              v-for="link in c.nav.links"
              :key="link.href"
              :href="link.href"
              class="mobile-link"
              @click="mobileOpen = false"
            >{{ link.text }}</a>
          </nav>

          <!-- 语言切换在移动端不进下拉，直接平铺各项 -->
          <div class="mobile-lang">
            <span class="mobile-lang-title">{{ c.nav.langTitle }}</span>
            <div class="mobile-lang-items">
              <a
                v-for="l in c.nav.langs"
                :key="l.href"
                :href="l.href"
                class="mobile-lang-item"
                :class="{ 'is-active': l.active }"
                @click="mobileOpen = false"
              >{{ l.text }}</a>
            </div>
          </div>

          <!-- 源码仓库入口在窄屏从顶栏收进菜单：顶栏图标位在 <768 留给语言/主题/搜索/CTA，
               否则 390 视口下动作区会占到 76% 宽 -->
          <div class="mobile-lang">
            <span class="mobile-lang-title">{{ c.nav.reposTitle }}</span>
            <div class="mobile-lang-items">
              <a
                href="https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-lang-item"
              >{{ c.nav.giteeTitle }}</a>
              <a
                href="https://github.com/SongRenShuo/mybatis-plus-sql-visualizer"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-lang-item"
              >{{ c.nav.githubTitle }}</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s;
}

.nav-bar.transparent {
  background-color: transparent;
}

.nav-bar.scrolled {
  background-color: var(--bg-primary);
  box-shadow: 0 3px 18px 2px var(--border-color);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.nav-mark {
  display: block;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .nav-mark {
    width: 34px;
    height: 34px;
  }
}

.logo-area {
  display: block;
  flex-shrink: 0;
  /* 标记 275×96（2.87:1），24px 高 → 69px 宽 */
  width: 69px;
  height: 24px;
  background-image: url(/logo-mark.png);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: contain;
}

@media (min-width: 768px) {
  /* 字标 685×96（7.14:1），32px 高 → 229px 宽。暗色版走 CSS 变量切换：
     scoped 样式里的 :global(.dark) 祖先选择器会被编译器吃掉（实测编译成 .dark{...}），
     变量放在 style.css 的 :root / .dark 里最稳 */
  .logo-area {
    width: 229px;
    height: 32px;
    background-image: var(--nav-logo-lockup);
  }
}

/* 768~1023 一档导航链接最多、空间最紧（品牌 242 + 链接 212 + 动作区 228 ≈ 682 / 705），
   标记回到 28、字标收到 24px 高（171 宽），链接间距 12px，占比压到 91% */
@media (min-width: 768px) and (max-width: 1023px) {
  .nav-mark {
    width: 28px;
    height: 28px;
  }

  .logo-area {
    width: 171px;
    height: 24px;
  }

  .nav-links {
    gap: 0.75rem;
  }
}

/* 480 以下只留原 logo：标记 + 字标 + 动作区在 400 视口正好 100%，
   没有余量留给字体放大 */
@media (max-width: 479px) {
  .logo-area {
    display: none;
  }
}

.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  color: var(--text-secondary);
  transition: color 0.3s;
  text-decoration: none;
  font-size: 0.875rem;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* 工具图标簇：簇内 4px，簇与主 CTA 之间由 .nav-actions 的 1rem 控制 */
.nav-tools {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 源码仓库两个图标与语言/主题/搜索同尺寸同形状：36×36、8px 圆角、悬浮软底。
   位图本身保持 20×20 不缩放，避免糊 */
.nav-gitee {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  transition: background-color 0.25s;
}

.nav-gitee:hover {
  background-color: var(--bg-hover);
}

@media (max-width: 767px) {
  /* 窄屏把仓库入口收进全屏菜单，顶栏只留语言 / 主题 / 搜索 / CTA */
  .nav-gitee {
    display: none;
  }
}

/* 768~1023 一档：四个导航链接 + 五个工具位 + CTA 塞不进内容宽（实测 816 / 705，
   溢出 111px）。这里把源码仓库入口和语言文字一起收掉，链接间距减半，
   三组宽度和降到约 626，留出余量；仓库入口在 <768 的全屏菜单里可点。 */
@media (max-width: 1023px) {
  .nav-gitee {
    display: none;
  }

  .nav-lang-label,
  .nav-lang-chevron {
    display: none;
  }

  .nav-links {
    gap: 1rem;
  }
}

/* 语言切换与明暗切换共用同一套按钮外观（对齐英文版 VitePress 默认导航的
   「图标按钮 + 悬浮软底」）：同高、同圆角、同悬浮反馈，避免两个控件观感不一致 */
.nav-lang-btn,
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s;
}

.nav-lang-btn:hover,
.theme-toggle:hover {
  color: var(--text-primary);
  background-color: var(--bg-hover);
}

.nav-lang-btn svg,
.theme-toggle svg {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.nav-lang-label {
  white-space: nowrap;
}

/* 搜索图标按钮与簇内其它图标同款：PagefindSearch 的 compact 变体自己带 9999px 圆角，
   这里用 :deep() 覆盖成 8px 方角软底（不动组件内部样式，避免影响文档页）。
   注意选择器要挂在 .nav-tools 上——PagefindSearch 是多根节点组件，传进去的 class
   不会落到 .pf-trigger 上，用 .nav-search 匹配不到。 */
.nav-tools :deep(.pf-trigger-icon) {
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  transition: color 0.25s, background-color 0.25s;
}

.nav-tools :deep(.pf-trigger-icon:hover) {
  color: var(--text-primary);
  background-color: var(--bg-hover);
}

.nav-lang-chevron {
  width: 0.75rem !important;
  height: 0.75rem !important;
  opacity: 0.7;
}

.nav-lang {
  position: relative;
}

.nav-lang-menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  min-width: 8.5rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.28);
  z-index: 60;
}

.nav-lang-item {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s, background-color 0.2s;
}

.nav-lang-item:hover {
  color: var(--text-primary);
  background-color: var(--bg-hover);
}

.nav-lang-item.is-active {
  color: var(--primary-color);
  font-weight: 600;
}

.lang-fade-enter-active,
.lang-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.lang-fade-enter-from,
.lang-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 480px) {
  /* 窄屏只留图标，避免顶栏拥挤溢出 */
  .nav-lang-label {
    display: none;
  }

  .nav-lang-chevron {
    display: none;
  }
}

.nav-gitee-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  color: white;
  background-color: var(--primary-color);
  border-radius: 9999px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-primary:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* 移动端汉堡导航（桌面端保持原有顶栏，不渲染任何新元素） */
.nav-hamburger {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  cursor: pointer;
}

.hamburger-bar {
  display: block;
  width: 1.125rem;
  height: 2px;
  border-radius: 1px;
  background-color: var(--text-primary);
  transition: transform 0.2s, opacity 0.2s;
}

.nav-hamburger.open .hamburger-bar:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.nav-hamburger.open .hamburger-bar:nth-child(2) {
  opacity: 0;
}

.nav-hamburger.open .hamburger-bar:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* 全屏导航层：桌面端兜底隐藏，菜单展开状态下拉大视口时不残留 */
.mobile-menu {
  display: none;
}

@media (max-width: 767px) {
  .nav-lang-menu {
    left: 0;
    right: auto;
  }

  .nav-hamburger {
    display: flex;
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: var(--bg-primary);
    overflow-y: auto;
    padding-top: 4.5rem;
  }
}

/* 内部容器承担 VPNavScreen 同款滑入位移，动画由 .menu-fade-* 类驱动 */
.mobile-menu-container {
  padding: 0.5rem 1.5rem 2rem;
}

.mobile-links {
  display: flex;
  flex-direction: column;
}

.mobile-link {
  display: block;
  padding: 0.875rem 0;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.05rem;
  border-bottom: 1px solid var(--border-color);
  transition: color 0.25s, border-color 0.25s;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-lang {
  margin-top: 1.5rem;
}

.mobile-lang-title {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.625rem;
}

.mobile-lang-items {
  display: flex;
  gap: 0.5rem;
}

.mobile-lang-item {
  flex: 1;
  text-align: center;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
}

.mobile-lang-item.is-active {
  color: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: 600;
}

.mobile-link:hover {
  color: var(--primary-color);
}

/* 展开/收起过渡：整屏淡入 + 内容自上下移 8px 滑入，与文档页 VPNavScreen 同配方 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.25s;
}

.menu-fade-enter-active .mobile-menu-container,
.menu-fade-leave-active .mobile-menu-container {
  transition: transform 0.25s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-fade-enter-from .mobile-menu-container,
.menu-fade-leave-to .mobile-menu-container {
  transform: translateY(-8px);
}

/* 小屏收紧：320px 视口顶栏不溢出不重叠 */
@media (max-width: 480px) {
  .nav-actions {
    gap: 0.5rem;
  }

  /* 图标按钮收到 32×32：390 下 logo + 品牌名 + 动作区要挤进 327px 内容宽 */
  .nav-lang-btn,
  .theme-toggle,
  .nav-hamburger {
    width: 2rem;
    height: 2rem;
  }

  .nav-tools :deep(.pf-trigger-icon) {
    width: 2rem;
    height: 2rem;
  }

  .btn-primary {
    padding: 0.375rem 0.75rem;
  }
}
</style>

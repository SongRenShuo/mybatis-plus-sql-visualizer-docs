<script setup>
import NavHeader from './NavHeader.vue'
import HeroSection from './HeroSection.vue'
import SocialProof from './SocialProof.vue'
import FeatureAlternate from './FeatureAlternate.vue'
import DocsShowcase from './DocsShowcase.vue'
import FeaturesGrid from './FeaturesGrid.vue'
import WelfareCard from './WelfareCard.vue'
import Testimonials from './Testimonials.vue'
import PricingSection from './PricingSection.vue'
import CtaSection from './CtaSection.vue'
import BackToTop from './BackToTop.vue'
import { useReveal } from '../../composables/useReveal'
import { useHomeContent } from '../../composables/useHomeContent'

const { c } = useHomeContent()

// 滚动揭示全页共用一个观察器：各区块自带 mp-reveal 类，这里统一挂观察。
// Vue 子组件先于父组件挂载，此处执行时子组件 DOM 已就位。
useReveal()
</script>

<template>
  <div class="cool-home">
    <NavHeader />
    <main>
      <HeroSection />
      <SocialProof />
      <FeatureAlternate />
      <DocsShowcase />
      <FeaturesGrid />
      <WelfareCard />
      <Testimonials />
      <PricingSection />
      <CtaSection />
    </main>
    <footer class="mp-footer">
      <div class="container">
        <p class="mp-footer__text">{{ c.footer }}</p>
      </div>
    </footer>
    <BackToTop />
  </div>
</template>

<style scoped>
.cool-home {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
  /* 裁剪 hero 装饰光斑等绝对定位元素造成的横向溢出 */
  overflow-x: clip;
}

.mp-footer {
  padding: 2rem 0;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.mp-footer__text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}
</style>

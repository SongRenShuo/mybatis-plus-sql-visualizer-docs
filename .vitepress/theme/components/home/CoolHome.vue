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
        <p class="mp-footer__text">基于 Apache-2.0 协议开源发布 · Copyright © 2026-present SongRenShuo</p>
      </div>
    </footer>
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

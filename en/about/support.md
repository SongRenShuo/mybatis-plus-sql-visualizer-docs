---
title: Support & Sponsor
description: SQL Visualizer is free and open source with no paid tier. If you would like to sponsor it, here are WeChat and Alipay payment codes — plus where the money goes.
---

# Support & Sponsor

SQL Visualizer is a free, open-source plugin ([Apache-2.0](https://opensource.org/licenses/Apache-2.0)): no paid tier, no ads, no usage tracking, and no feature is gated on whether you sponsor it.

If it has saved you some time, you can buy me a coffee with the payment codes below. It is entirely voluntary and changes nothing about the plugin.

## Where the money goes

- **Domain and hosting**: the documentation site runs on Cloudflare Pages, and the domain is renewed every year
- **Demo recording environment**: every feature GIF and screenshot is recorded for real in an IDE sandbox, which means maintaining several database instances
- **Real-engine dialect verification**: test environments and cloud resources for domestic databases such as Dameng, Kingbase, OceanBase and HighGo

<div class="donate-cards">
  <div class="donate-card">
    <img src="/donate/wechat-pay.png" width="220" height="220" alt="WeChat sponsorship QR code" class="donate-card__img"/>
    <div class="donate-card__title">WeChat</div>
    <div class="donate-card__desc">Scan in WeChat — any amount is fine.</div>
  </div>
  <div class="donate-card">
    <img src="/donate/alipay-pay.png" width="220" height="220" alt="Alipay payment QR code" class="donate-card__img"/>
    <div class="donate-card__title">Alipay</div>
    <div class="donate-card__desc">Scan in Alipay — any amount is fine.</div>
  </div>
</div>

## Supporters outside mainland China

Both WeChat and Alipay require a mainland China account. If you are elsewhere, leaving a note in [GitHub Discussions](https://github.com/SongRenShuo/mybatis-plus-sql-visualizer/discussions), filing an issue, or recommending the plugin to a colleague counts just as much.

## On acknowledgements

These payment codes give no callback about who paid, so there is no sponsor list here. Sponsorship also does not buy priority support or extra features — the plugin treats everyone the same.

<style>
.donate-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.donate-card {
  flex: 0 1 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
  transition: border-color 0.2s ease;
}

.donate-card:hover {
  border-color: var(--vp-c-brand);
}

.donate-card__img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  border-radius: 8px;
}

.donate-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0.75rem 0 0.375rem;
}

.donate-card__desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}
</style>

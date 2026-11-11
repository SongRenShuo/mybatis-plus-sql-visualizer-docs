---
title: 支持与赞助
description: SQL Visualizer 免费开源，不设付费版。如果你愿意赞助，这里放微信赞赏码与支付宝收款码，并说明赞助都花在了什么地方。
---

# 支持与赞助

SQL Visualizer 是免费开源插件（[Apache-2.0](https://opensource.org/licenses/Apache-2.0)）：没有付费版、没有广告、不收集使用数据，功能也不会因为是否赞助而有所不同。

如果它确实帮你省下了时间，可以通过下面的赞赏码请我喝杯咖啡。完全自愿，不影响任何功能。

## 钱花在哪

- **域名与托管**：文档站跑在 Cloudflare Pages 上，域名逐年续费
- **演示录制环境**：功能动图与截图都在 IDE 沙盒里真实录制，需要维护多套数据库实例
- **方言真机验证**：达梦、金仓、OceanBase、瀚高等国产数据库的实机测试环境与云资源

<div class="donate-cards">
  <div class="donate-card">
    <img src="/donate/wechat-pay.png" width="220" height="220" alt="微信赞赏码" class="donate-card__img"/>
    <div class="donate-card__title">微信赞赏</div>
    <div class="donate-card__desc">微信扫码，金额随意。</div>
  </div>
  <div class="donate-card">
    <img src="/donate/alipay-pay.png" width="220" height="220" alt="支付宝收款码" class="donate-card__img"/>
    <div class="donate-card__title">支付宝</div>
    <div class="donate-card__desc">支付宝扫码付款，金额随意。</div>
  </div>
</div>

## 海外朋友

微信与支付宝都需要中国大陆账户。人在海外的话，到 [GitHub Discussions](https://github.com/SongRenShuo/mybatis-plus-sql-visualizer/discussions) 留个言、提个 issue，或者把插件推荐给同事，同样是实实在在的支持。

## 关于鸣谢

赞赏码不会回调付款人信息，我看不到谁付了款，所以这里不设鸣谢名单。赞助也不会换来优先支持或额外功能——插件对所有人一视同仁。

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

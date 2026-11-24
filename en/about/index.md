---
prev: false
next:
  text: Changelog
  link: /en/about/changelog
description: "About MyBatis SQL Visualizer (SQL Visualizer): the author, contact details and project background."
---

# About

## Author

[**SongRenShuo**](https://gitee.com/songrenshuo) — Independent developer focused on IntelliJ Platform plugins and Java ecosystem tools.

SQL Visualizer is an independent community open-source project, not affiliated with MyBatis / MyBatis-Plus (baomidou) or JetBrains; references to those frameworks on this site describe functional compatibility only.

## Contact

| Channel | Link |
|---------|------|
| Source (primary) | [Gitee · songrenshuo/mybatis-plus-sql-visualizer](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer) |
| Source (mirror) | [GitHub · SongRenShuo/mybatis-plus-sql-visualizer](https://github.com/SongRenShuo/mybatis-plus-sql-visualizer) |
| Issues | [Feedback Pool](https://sql-visualizer.jvtools.cn/en/about/feedback) |
| Bug Bounty | [Report a bug and earn a bounty](https://sql-visualizer.jvtools.cn/en/about/bounty) |
| Marketplace | [JetBrains Plugin Page](https://plugins.jetbrains.com/plugin/33633-mybatis-sql-visualizer) |

## Social links

Write-ups and day-to-day notes live on 13 platforms, grouped by tech communities, content platforms, and code/distribution — all on one page.

<a class="matrix-cta" href="/en/links">
  <span class="matrix-cta__badge" aria-hidden="true">13</span>
  <span class="matrix-cta__body">
    <span class="matrix-cta__title">See every account</span>
    <span class="matrix-cta__sub">Zhihu · Juejin · CSDN · dev.to · 51CTO · Cnblogs · Tencent Cloud · Alibaba Cloud · Toutiao · Xiaohongshu · GitHub · Gitee · Marketplace</span>
  </span>
  <span class="matrix-cta__arrow" aria-hidden="true">→</span>
</a>

<style>
.matrix-cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0 0;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.matrix-cta:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px -14px var(--vp-c-brand-1);
}

.matrix-cta__badge {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, transparent);
}

.matrix-cta__body {
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-width: 0;
}

.matrix-cta__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.matrix-cta__sub {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.matrix-cta__arrow {
  margin-left: auto;
  font-size: 1.125rem;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease, color 0.2s ease;
}

.matrix-cta:hover .matrix-cta__arrow {
  transform: translateX(3px);
  color: var(--vp-c-brand-1);
}
</style>

## WeChat

<div class="qr-cards">
  <div class="qr-card">
    <img src="/wechat-qr.webp" width="180" height="180" alt="Author WeChat QR code" class="qr-card__img" loading="lazy" decoding="async"/>
    <div class="qr-card__title">Author WeChat</div>
    <div class="qr-card__desc">Scan to add the author as a friend. Questions about usage and development are both welcome — please note "SQL Visualizer" in your friend request.</div>
  </div>
  <div class="qr-card">
    <img src="/group-qr.webp" width="180" height="180" alt="User group QR code" class="qr-card__img" loading="lazy" decoding="async"/>
    <div class="qr-card__title">User Group</div>
    <div class="qr-card__desc">Scan to join the SQL Visualizer user group on WeChat. If the code has expired, add the author's WeChat and they will invite you in.</div>
  </div>
</div>

<style>
.qr-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.qr-card {
  flex: 0 1 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
  transition: border-color 0.2s ease;
}

.qr-card:hover {
  border-color: var(--vp-c-brand);
}

.qr-card__img {
  border-radius: 8px;
}

.qr-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0.75rem 0 0.375rem;
}

.qr-card__desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}
</style>

## License

[Apache-2.0](https://opensource.org/licenses/Apache-2.0) — Free to use, modify, and distribute.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Kotlin 2.3.20 |
| Platform | IntelliJ Platform Gradle Plugin 2.18.1 |
| IDE Compatibility | IDEA 2024.3+ |
| Dependencies | `com.intellij.java` (hard) + `com.intellij.database` (optional) |
| Tests | Three layers: unit, platform integration, real database engines; sharded runs finish in minutes |

## Acknowledgments

Thanks to all developers who help improve the plugin through Issues, PRs, and feedback.

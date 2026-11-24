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
  <span class="matrix-cta__bars" aria-hidden="true">
    <i style="--c:#0084FF;--h:56%"></i>
    <i style="--c:#007FFF;--h:82%"></i>
    <i style="--c:#FC5531;--h:66%"></i>
    <i style="--c:#0A0A0A;--h:96%"></i>
    <i style="--c:#E31136;--h:71%"></i>
    <i style="--c:#2E7ACC;--h:100%"></i>
    <i style="--c:#006EFF;--h:61%"></i>
    <i style="--c:#FF6A00;--h:87%"></i>
    <i style="--c:#FF373C;--h:73%"></i>
    <i style="--c:#FF2442;--h:93%"></i>
    <i style="--c:#181717;--h:64%"></i>
    <i style="--c:#C71D23;--h:89%"></i>
    <i style="--c:#000000;--h:77%"></i>
  </span>
  <span class="matrix-cta__body">
    <span class="matrix-cta__title">See every account</span>
    <span class="matrix-cta__sub">Zhihu · Juejin · CSDN · dev.to · 51CTO · Cnblogs · Tencent Cloud · Alibaba Cloud · Toutiao · Xiaohongshu · GitHub · Gitee · Marketplace</span>
  </span>
  <span class="matrix-cta__go" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
  </span>
</a>

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
.matrix-cta {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0 0;
  padding: 1.0625rem 1.125rem 1.0625rem 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease;
}

/* 左侧品牌渐变竖条，给卡片一个视觉锚点 */
.matrix-cta::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    var(--vp-c-brand-1),
    color-mix(in srgb, var(--vp-c-brand-1) 45%, #7c5cff)
  );
}

.matrix-cta:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  box-shadow: 0 12px 28px -18px color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);
}

/* 13 条品牌色短柱：替代实心方块，暗示「多个平台」且不抢视觉重量 */
.matrix-cta__bars {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 36px;
}

.matrix-cta__bars i {
  width: 3px;
  height: var(--h);
  border-radius: 2px;
  background: var(--c);
  opacity: 0.92;
}

/* 深色主题下纯黑品牌色（GitHub / dev.to / JetBrains）会消失，往白里提亮 */
html.dark .matrix-cta__bars i {
  background: color-mix(in srgb, var(--c) 76%, #ffffff);
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
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}

/* 压过 .vp-doc a 的默认下划线与链接色（其特异性 0,1,1 高于 .matrix-cta） */
.vp-doc a.matrix-cta,
.vp-doc a.matrix-cta:hover,
.vp-doc a.matrix-cta:visited {
  text-decoration: none;
}

.vp-doc a.matrix-cta .matrix-cta__title {
  color: var(--vp-c-text-1);
}

.vp-doc a.matrix-cta .matrix-cta__sub {
  color: var(--vp-c-text-3);
}

.matrix-cta__go {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-left: auto;
  border-radius: 50%;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.matrix-cta:hover .matrix-cta__go {
  color: #fff;
  background: var(--vp-c-brand-1);
  transform: translateX(2px);
}

@media (max-width: 560px) {
  .matrix-cta__bars {
    display: none;
  }

  .matrix-cta__sub {
    font-size: 0.6875rem;
  }
}

/* 微信二维码卡片 */
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

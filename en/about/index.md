---
prev: false
next:
  text: Changelog
  link: /en/about/changelog
---

# About

## Author

**SongRenShuo** — Independent developer focused on IntelliJ Platform plugins and Java ecosystem tools.

## Contact

| Channel | Link |
|---------|------|
| Gitee Repo | [songrenshuo/mybatis-plus-sql-visualizer](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer) |
| Issues | [Gitee Issues](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer/issues) |
| Marketplace | [JetBrains Plugin Page](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) |

## WeChat

<div class="qr-cards">
  <div class="qr-card">
    <img src="/wechat-qr.png" width="180" height="180" alt="Author WeChat QR code" class="qr-card__img"/>
    <div class="qr-card__title">Author WeChat</div>
    <div class="qr-card__desc">Scan to add the author as a friend. Questions about usage and development are both welcome.</div>
  </div>
  <div class="qr-card">
    <img src="/group-qr.png" width="180" height="180" alt="User group QR code" class="qr-card__img"/>
    <div class="qr-card__title">User Group</div>
    <div class="qr-card__desc">Scan to join the SQL Visualizer user group on WeChat. If the code has expired, grab the latest one from the Gitee repository README.</div>
  </div>
</div>

<style>
.qr-cards {
  display: flex;
  flex-wrap: wrap;
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
| Tests | 610+ unit tests all green |

## Acknowledgments

Thanks to all developers who help improve the plugin through Issues, PRs, and feedback.

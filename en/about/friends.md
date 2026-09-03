---
prev:
  text: Changelog
  link: /en/about/changelog
next:
  text: Roadmap
  link: /en/about/roadmap
---

# Friend Plugin Recommendations

Here are some quality IDEA plugins built by fellow independent developers. Worth checking out if you're doing backend API development.

<div class="friend-card">
  <a href="https://www.coolrequest.dev" target="_blank" rel="noopener noreferrer" class="friend-card__link">
    <img src="/cool-request-icon.svg" width="40" height="40" alt="Cool Request Logo" class="friend-card__icon"/>
    <div class="friend-card__info">
      <h3 class="friend-card__title">Cool Request</h3>
      <p class="friend-card__desc">An HTTP client plugin built right into IDEA — think Postman, but embedded in your IDE. Supports Spring Boot, Spring MVC, JAX-RS and more, with one-click requests, arbitrary method invocation, API timing stats, and online doc generation. Over a million downloads and counting.</p>
    </div>
  </a>
</div>

<div class="friend-card">
  <a href="https://cli-manager.github.io" target="_blank" rel="noopener noreferrer" class="friend-card__link">
    <div class="friend-card__icon friend-card__icon--placeholder">CLI</div>
    <div class="friend-card__info">
      <h3 class="friend-card__title">CLI Manager</h3>
      <p class="friend-card__desc">A cross-platform AI CLI workbench that unifies management of various AI command-line tools. Provides a consistent command-line environment across operating systems, making it easy to use and manage AI-powered CLI utilities.</p>
    </div>
  </a>
</div>

<style>
.friend-card {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease;
}

.friend-card:hover {
  border-color: var(--vp-c-brand);
}

.friend-card__link {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
}

.friend-card__icon {
  flex-shrink: 0;
  border-radius: 8px;
  margin-top: 2px;
}

.friend-card__icon--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.friend-card__info {
  flex: 1;
}

.friend-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.375rem;
}

.friend-card__desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0;
}
</style>

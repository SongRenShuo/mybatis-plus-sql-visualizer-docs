---
prev:
  text: 更新日志
  link: /about/changelog
next:
  text: 开发路线
  link: /about/roadmap
---

# 友情插件推荐

这里推荐一些同样由独立开发者打造的优质 IDEA 插件，如果你也在做后端 API 开发，值得一试。

<div class="friend-card">
  <a href="https://www.coolrequest.dev" target="_blank" rel="noopener noreferrer" class="friend-card__link">
    <img src="/cool-request-icon.svg" width="40" height="40" alt="Cool Request Logo" class="friend-card__icon"/>
    <div class="friend-card__info">
      <h3 class="friend-card__title">Cool Request</h3>
      <p class="friend-card__desc">IDEA 内置的 HTTP 客户端插件，类似 Postman 但直接嵌在 IDE 里。支持 Spring Boot、Spring MVC、JAX-RS 等框架，一键发送请求、调用任意对象方法、统计 API 耗时、生成在线文档，总下载量已超百万次。</p>
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

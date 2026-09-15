---
prev: false
next:
  text: 更新日志
  link: /about/changelog
---

# 关于

## 作者

**SongRenShuo** — 独立开发者，专注于 IntelliJ 平台插件与 Java 生态工具。

## 联系方式

| 渠道 | 链接 |
|------|------|
| Gitee 仓库 | [songrenshuo/mybatis-plus-sql-visualizer](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer) |
| 问题反馈 | [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) |
| Marketplace | [JetBrains Plugin Page](https://plugins.jetbrains.com/plugin/33633-sql-visualizer) |

## 微信交流

<div class="qr-cards">
  <div class="qr-card">
    <img src="/wechat-qr.png" width="180" height="180" alt="作者微信二维码" class="qr-card__img"/>
    <div class="qr-card__title">作者微信</div>
    <div class="qr-card__desc">扫码添加作者为朋友，欢迎交流插件使用与开发话题。</div>
  </div>
  <div class="qr-card">
    <img src="/group-qr.png" width="180" height="180" alt="交流群二维码" class="qr-card__img"/>
    <div class="qr-card__title">交流群</div>
    <div class="qr-card__desc">扫码加入 SQL Visualizer 交流群；群码失效时可从 Gitee 仓库 README 获取最新二维码。</div>
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

## 开源协议

[Apache-2.0](https://opensource.org/licenses/Apache-2.0) — 自由使用、修改、分发。

## 技术栈

| 层级 | 技术 |
|------|------|
| 语言 | Kotlin 2.3.20 |
| 平台 | IntelliJ Platform Gradle Plugin 2.18.1 |
| IDE 兼容 | IDEA 2024.3+ |
| 依赖 | `com.intellij.java`（硬）+ `com.intellij.database`（可选） |
| 测试 | 三层覆盖：单元 · 平台集成 · 多数据库引擎真机验证；分片并行回归，全量分钟级 |

## 致谢

感谢所有通过 Issues、PR、反馈帮助改进插件的开发者。

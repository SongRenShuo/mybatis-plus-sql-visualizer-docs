---
prev: false
next:
  text: 更新日志
  link: /about/changelog
description: "MyBatis SQL Visualizer（SQL Visualizer）的作者、联系方式与项目背景。"
---

# 关于

## 作者

[**SongRenShuo**](https://gitee.com/songrenshuo) — 独立开发者，专注于 IntelliJ 平台插件与 Java 生态工具。

SQL Visualizer 是独立开发者的社区开源项目，与 MyBatis / MyBatis-Plus（baomidou）、JetBrains 无隶属或合作关系；站内对上述框架的表述均为功能兼容性说明。

## 联系方式

| 渠道 | 链接 |
|------|------|
| 源码仓库（主） | [Gitee · songrenshuo/mybatis-plus-sql-visualizer](https://gitee.com/songrenshuo/mybatis-plus-sql-visualizer) |
| 源码仓库（镜像） | [GitHub · SongRenShuo/mybatis-plus-sql-visualizer](https://github.com/SongRenShuo/mybatis-plus-sql-visualizer) |
| 问题反馈 | [官网需求池](https://sql-visualizer.jvtools.cn/about/feedback) |
| Bug 悬赏 | [提交 Bug 报告，按等级领取悬赏](https://sql-visualizer.jvtools.cn/about/bounty) |
| Marketplace | [JetBrains Plugin Page](https://plugins.jetbrains.com/plugin/33633-mybatis-sql-visualizer) |

## 账号矩阵

文章和日常记录分散在 13 个平台，按技术社区、内容平台、代码与分发分组整理，一个页面看全。

<a class="matrix-cta" href="/links">
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
    <span class="matrix-cta__title">查看全部账号入口</span>
    <span class="matrix-cta__sub">知乎 · 掘金 · CSDN · dev.to · 51CTO · 博客园 · 腾讯云 · 阿里云 · 头条 · 小红书 · GitHub · Gitee · Marketplace</span>
  </span>
  <span class="matrix-cta__go" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
  </span>
</a>

## 微信交流

<div class="qr-cards">
  <div class="qr-card">
    <img src="/wechat-qr.webp" width="180" height="180" alt="作者微信二维码" class="qr-card__img" loading="lazy" decoding="async"/>
    <div class="qr-card__title">作者微信</div>
    <div class="qr-card__desc">扫码添加作者为朋友，欢迎交流插件使用与开发话题；加好友时请备注「SQL Visualizer」。</div>
  </div>
  <div class="qr-card">
    <img src="/group-qr.webp" width="180" height="180" alt="交流群二维码" class="qr-card__img" loading="lazy" decoding="async"/>
    <div class="qr-card__title">交流群</div>
    <div class="qr-card__desc">扫码加入 SQL Visualizer 交流群；群码失效时可添加作者微信。</div>
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

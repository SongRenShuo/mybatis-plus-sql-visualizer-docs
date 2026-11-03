---
title: 需求反馈池
layout: page
sidebar: false
---

<div class="feedback-community">

## 社区

- **GitHub Discussions**：<https://github.com/SongRenShuo/mybatis-plus-sql-visualizer/discussions> —— 英文用户建议走 Discussions，讨论公开存档、便于后来者检索
- **需求池**：即下方表单，类型与 IDE / 插件版本自动附上，跟进最直接
- **微信交流群**：二维码见[关于页](/about/)，群码失效时添加作者微信入群

</div>

<style>
/* layout: page 不提供 .vp-doc 排版，正文会渲染成无样式的裸文本，这里自带宽高与排版 */
.feedback-community {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.feedback-community h2 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.feedback-community ul {
  margin: 0;
  padding-left: 1.1rem;
  list-style: disc;
}

.feedback-community li {
  font-size: 13px;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}

.feedback-community a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

@media (max-width: 767px) {
  .feedback-community {
    padding: 16px 16px 0;
  }
}
</style>

<script setup>
import FeedbackPage from '@theme/components/feedback/FeedbackPage.vue'
</script>

<FeedbackPage api-base="/api/v1" />
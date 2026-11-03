---
title: Feedback Pool
layout: page
sidebar: false
---

<div class="feedback-community">

## Community

- **GitHub Discussions**: <https://github.com/SongRenShuo/mybatis-plus-sql-visualizer/discussions> — English-speaking users are encouraged to use Discussions; threads stay public and searchable
- **Feedback pool**: the form below, with type and IDE / plugin versions attached automatically — the most direct route to follow-up
- **WeChat group**: QR code on the [About page](/en/about/); if the code has expired, add the author on WeChat to get invited

</div>

<style>
/* layout: page ships no .vp-doc typography, so the body would render as unstyled bare text */
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
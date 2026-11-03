---
title: Bug Bounty
layout: page
sidebar: false
---

<script setup>
import BountyPage from '@theme/components/bounty/BountyPage.vue'
</script>

<BountyPage api-base="/api/v1" />

<div class="bounty-static">

## Rules and boundaries

### What counts as a valid report

- The issue can be reproduced reliably following your steps, and the cause is in the plugin itself;
- The report states the expected and actual behavior, and includes environment details (IDE / plugin / OS / JDK) where possible;
- The issue is directly related to plugin features. Problems in the IDE, database, other plugins, or project configuration do not qualify.

### What usually does not count

- Cannot be reproduced, or the steps are not enough to locate the issue;
- Usage questions, feature requests, or documentation improvements;
- The issue was already fixed in a newer version but is reported against an old one;
- Duplicates of an existing report (the earliest complete report wins).

### Duplicates and multiple submissions

When the same issue is reported more than once, we consider submission time, reproduction completeness, and the amount of useful information. Later duplicates are marked "Duplicate" and are not paid. If your report is marked duplicate but adds more complete information, mention it in the review thread.

### Security issues

If the issue involves a security risk, tick "This is a security issue; do not disclose details". Such reports are never promoted to a public feedback post, and review stays within the necessary scope. Do not post exploitation details or a full attack chain in the public feedback pool.

### Privacy and data

Your email is only used for review and payout contact and is never public. Looking up a report requires matching "ID + the email used at submission". Contact details of rejected reports are removed after 90 days. Attachments are only used to diagnose the issue and are never shown publicly.

### Amounts and payout

Rewards are paid by tier range and review result, up to ¥9.88 per report. The final amount is subject to review. After approval, an admin transfers the reward manually and records the payout time. Once the monthly bounty quota is used up, reports are still accepted and reviewed, but no monetary reward is paid.

## FAQ

::: details What counts as a valid bug?
It reproduces reliably, the cause is in the plugin, and the steps plus environment are enough to locate it. Reports that cannot be reproduced, are caused by third parties, or are really feature requests usually do not qualify. Review also considers impact and whether a record already exists.
:::

::: details How long does review take?
The initial review target is 72 hours. Actual time depends on volume and complexity; complex issues may need more information and take longer.
:::

::: details If several people report the same issue, who gets the reward?
Priority goes to the earliest report with enough information to locate the issue. If later reports add a more complete reproduction or key clues, review considers them together. Duplicates are marked "Duplicate" and are not paid.
:::

::: details Can I submit the same issue again?
Not recommended. Duplicate submissions do not increase the reward and may be marked duplicate. If the original record is missing information, add it there, or explain the relation in a new submission.
:::

::: details How do I receive the reward?
After approval, an admin contacts you at the email you submitted and transfers the reward manually. Use "ID + email" on the lookup page to see status and amount; once paid, the status shows "Paid".
:::

::: details Will my email be public?
No. Your email is only used for review and payout contact and never appears in the URL, public pages, or public API responses. Contact details of rejected reports are removed after 90 days.
:::

::: details What happens to submitted reports if the program is paused?
A pause only affects new submissions. Reports already submitted are still reviewed and paid, and the lookup page keeps working.
:::

::: details Can I submit to both the feedback pool and the bug bounty?
Yes. When submitting a Bug in the feedback pool, tick "Also apply for the Bug Bounty". The success toast then includes a "Continue to Bug Bounty" link that carries the feedback ID into the bounty form. The required fields of the two forms are independent.
:::

</div>

<style>
/* 页尾静态规则：与上方组件区同宽（内容 1100）同字阶（标题 28 / 小标题 14 / 正文 13） */
.bounty-static {
  max-width: 1148px;
  margin: 3.5rem auto 0;
  padding: 2.5rem 24px 64px;
  border-top: 1px solid var(--vp-c-border);
}

.bounty-static h2 {
  margin: 3rem 0 0.75rem;
  padding: 0;
  border: none;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.bounty-static > h2:first-child {
  margin-top: 0;
}

.bounty-static h3 {
  margin: 1.75rem 0 0.5rem;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.bounty-static p,
.bounty-static li {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  font-size: 13px;
}

.bounty-static ul {
  padding-left: 1.15rem;
}

.bounty-static li {
  margin: 4px 0;
}

.bounty-static a {
  color: var(--vp-c-brand-1);
}

.bounty-static details.custom-block {
  margin: 0.75rem 0;
  padding: 0 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--ui-radius-field, 12px);
  background: var(--vp-c-bg-soft);
}

.bounty-static details.custom-block summary {
  padding: 0.85rem 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.bounty-static details.custom-block .custom-block-content {
  padding-bottom: 0.75rem;
}

.bounty-static details.custom-block .custom-block-content > p:first-child {
  margin-top: 0;
}

.bounty-static details.custom-block .custom-block-content > p:last-child {
  margin-bottom: 0;
}

@media (max-width: 767px) {
  .bounty-static {
    margin-top: 2.5rem;
    padding: 2rem 16px 48px;
  }
}
</style>

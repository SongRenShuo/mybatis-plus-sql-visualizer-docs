---
title: Bug 悬赏
layout: page
sidebar: false
---

<script setup>
import BountyPage from '@theme/components/bounty/BountyPage.vue'
</script>

<BountyPage api-base="/api/v1" />

<div class="bounty-static">

## 规则与边界

### 什么样的报告算有效

- 能按复现步骤稳定复现，且问题出在插件自身；
- 描述里写清期望结果与实际结果，环境信息（IDE / 插件 / 操作系统 / JDK）尽量完整；
- 与插件功能直接相关。IDE、数据库、第三方插件或项目配置本身的问题不计入。

### 以下情况通常不算有效

- 无法复现，或步骤不足以定位问题；
- 只是使用咨询、功能建议、文档改进；
- 问题已在较新版本修复，但仍按旧版本提交；
- 与已有记录重复（以最早提交且信息完整的一条为准）。

### 重复与多人提交

同一问题多人提交时，按提交时间、复现完整度与信息量综合判断；后续重复记录会标记为「重复」，不进入发放。若你的记录被标记重复但提供了更完整的信息，可以在审核说明中补充。

### 安全问题

如果问题涉及安全风险，请勾选「这是安全问题，请勿公开细节」。这类记录不会转为公开需求帖，审核与沟通只在必要范围内进行。不要在公开需求池里贴利用细节或完整攻击链。

### 隐私与数据

邮箱仅用于审核与发放联系，不会公开；查询进度需要「编号 + 提交时使用的邮箱」匹配。未通过的记录会在 90 天后清除联系方式。附件仅用于问题定位，不会公开展示。

### 金额与发放

奖励按等级区间与审核结果发放，单笔不超过 ¥18.88。最终金额以审核为准；审核通过后由管理员人工转账，并在记录中登记发放时间。

## 常见问题

::: details 什么样的 Bug 算有效？
能稳定复现、问题在插件自身、步骤与环境信息足够定位。无法复现、第三方因素导致、或只是功能建议，通常不算有效。审核时还会结合影响范围和是否已有记录综合判断。
:::

::: details 审核需要多久？
初审目标为 72 小时内受理。实际时间受提交量和问题复杂度影响；复杂问题可能需要补充信息，时间会相应延长。
:::

::: details 同一问题多人提交，奖励给谁？
以最早提交且信息足以定位的记录为主；如果后续提交提供了更完整的复现或关键线索，审核会综合判断。重复记录会标记为「重复」，不进入发放。
:::

::: details 可以重复提交同一个问题吗？
不建议。重复提交不会提高奖励，还可能被标记为重复。如果原记录缺少信息，可以在原记录下补充，或在新的提交中说明与原记录的关系。
:::

::: details 如何收到奖励？
审核通过后，管理员会通过你提交的邮箱联系并人工转账。请在查询页用「编号 + 邮箱」查看审核状态与金额；发放完成后状态会显示「已发放」。
:::

::: details 邮箱会公开吗？
不会。邮箱只用于审核与发放联系，不出现在 URL、公开页面或公开接口响应中。未通过的记录 90 天后清除联系方式。
:::

::: details 计划暂停后，已提交的记录怎么办？
暂停只影响新提交。已经提交的记录仍会正常审核与发放，查询页也照常可用。
:::

::: details 可以同时提交到需求池和 Bug 悬赏吗？
可以。在需求池提交 Bug 时勾选「同时申请 Bug 悬赏」，提交成功后的提示里会出现「继续申请悬赏」链接，带上需求编号即可继续填写悬赏表单。两边的必填规则相互独立。
:::

</div>

<style>
.bounty-static {
  max-width: 980px;
  margin: 0 auto;
  padding: 1rem 24px 64px;
}

.bounty-static h2 {
  margin: 3rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-border);
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.3;
}

.bounty-static h3 {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}

.bounty-static p,
.bounty-static li {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  font-size: 0.925rem;
}

.bounty-static ul {
  padding-left: 1.25rem;
}

.bounty-static a {
  color: var(--vp-c-brand-1);
}

.bounty-static details.custom-block {
  margin: 0.75rem 0;
  padding: 0 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.bounty-static details.custom-block summary {
  padding: 0.85rem 0;
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
    padding: 0.5rem 16px 48px;
  }
}
</style>

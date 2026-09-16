---
name: alert-module
description: 安全预警+告警管理措施(IP封禁/一键处理) 20260905 已上线；两个 Pages 项目生产分支都是 main 部署须
  --branch=main；x-client-ip 信任边界与告警引擎设计
metadata:
  node_type: memory
  type: project
  originSessionId: sess_2335f4fe-8fae-4db3-964f-c7538ee647ce
---

安全预警与告警管理措施 2026-09-05 实施上线（admin 仓库 commit 9666d19 → 5849e7f → 6588d28）。验收记录在两份计划文档第六节：`docs/开发计划/20260905-1402-安全预警模块-开发计划.md`、`20260905-1535-告警管理措施-开发计划.md`。

**预警架构**：埋点（登录失败/401/限流429/推送失败漏斗 logNotification）→ `src/services/alert.ts` hitAlert（KV 滑窗计数 → 达阈值写 D1 `sys_alert_events` → 按级推送：high 立即、medium 15min KV 合并、low 只落库）→ `/admin/alerts` 接口 → SPA `Alerts.vue`。

**处置能力**：IP 封禁（`src/services/ipban.ts` 三层：内存60s缓存→KV `ban:{ip}` TTL→D1；中间件挂限流前，只拦匿名，管理员 JWT 旁路，POST /admin/login 整体豁免）；批量处理 `PATCH /admin/alerts/batch-status`（≤500）；封禁弹窗「封禁并解决」组合；自动封禁高危规则（默认关，`ban.auto_*` 配置，白名单 `ban.allowlist` 永不自动封）。所有封禁限时（手动默认24h），不做永久。

**通知日志=全系统台账**（commit df9eb56）：fb_notifications 加 alert_event_id；预警推送落 type=alert 日志（alert.ts 动态 import logNotification 破循环，失败自动计入 push_fail 无递归）；`POST /admin/notifications/:id/retry` 按原渠道/内容重发并落新日志（保留原类型与事件id），审计 notification_retry。重试不做 5 分钟去重（显式管理操作）。

**部署陷阱（关键，两个项目都中招过）**：docs 与 admin 两个 Pages 项目的生产分支**都是 `main`**，本地 git 分支是 master——`wrangler pages deploy` 必须显式 `--branch=main`，否则发成 preview、生产不动。20260905 曾因误记 docs=master 导致 docs 生产跑了半天旧代理（无 x-client-ip），验收 403 不生效才暴露。判别技巧：对比新部署 URL 与生产别名的行为差异。

**x-client-ip 信任边界**：Pages 代理 set() 覆盖写入访客真实 IP，Worker getClientIp 按 x-client-ip → cf-connecting-ip → x-forwarded-for；直连 workers.dev 可伪造该头，滥用时升级 HMAC 签名。代理 query 转发见 [[feedback-pool-frontend]]，安全审计线见 [[admin-security-audit]]。

**已知行为**：封禁/解禁经内存负缓存有最长 60s 生效延迟（设计取舍）；pushplus 拥堵时事件 notified 停 0（waitUntil 预算内未响应）；SPA 表格时间显示 UTC 墙钟（Date 解析无时区串，全站一致，用户未报障勿乱动）。预警页登录后首次进入偶发空数据（刷新即好，未复现）。

**Why:** 部署分支陷阱两个项目都会踩且后果隐蔽（preview 成功≠上线）；信任边界决定告警误报排查方向。

**How to apply:** 部署任一 Pages 项目一律 `--branch=main` 并用生产别名与部署 URL 行为差异核对；排查告警误报先看 detail.source_ip 是否真实访客 IP；阈值/自动封禁调优走预警页配置卡（sys_settings `alert.*`/`ban.*`），勿直接改库。

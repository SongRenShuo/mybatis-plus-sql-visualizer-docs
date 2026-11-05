import { onMounted, ref } from 'vue'
import pluginVersion from '../../data/plugin-version.json'
import { collectUpdates } from '../../../scripts/changelog-core.mjs'
import { getLiveUpdates } from './liveUpdates'

// 版本展示：构建期快照兜底，打开页面后以 Marketplace 实时值为准。
//
// 构建期：`scripts/sync-plugin-version.mjs` 在 build/deploy 时把版本写进
// .vitepress/data/plugin-version.json（env:PLUGIN_VERSION → 同级插件仓 gradle.properties
// → Marketplace API → 保留现值）。这个值同时是 SSR 首帧与 JSON-LD 的来源。
//
// 实时：发版后不重新部署也能跟上——拉 /api/changelog 取 Marketplace 最新一条。
// 首帧必须与 SSR 一致，所以只能在 onMounted 之后改值，不能在 setup 同步阶段改。
//
// 历史教训：曾经无条件用实时值覆盖，构建期版本比公开版新时（开发版已升、公开版
// 还没审过）页面会先显示新号再跳回旧号（实测 v2026.10.31 → v2026.10.30）。现在的
// 口径是「Marketplace 公开版就是最新版本」——实时值拿到即用，构建期只负责首帧与
// 拉取失败兜底；部署时钉住 PLUGIN_VERSION 为已发布版本，静态值与实时值一致，
// 不会出现可见的跳变。
const snapshot = String(pluginVersion.version ?? '').trim().replace(/^v/i, '')
const FALLBACK_VERSION = `v${snapshot}`

export function usePluginVersion() {
  const version = ref(FALLBACK_VERSION)

  onMounted(async () => {
    const raw = await getLiveUpdates()
    if (!raw) return
    let latest = ''
    try {
      latest = String(collectUpdates(raw)[0]?.version ?? '').trim().replace(/^v/i, '')
    } catch {
      return
    }
    if (latest) version.value = `v${latest}`
  })

  return { version }
}

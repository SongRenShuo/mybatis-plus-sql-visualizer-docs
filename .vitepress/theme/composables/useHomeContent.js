import { computed } from 'vue'
import { useData } from 'vitepress'
import { homeContent } from '../data/homeContent.js'

/**
 * 按当前 locale 取首页文案。
 *
 * locale 判定走 VitePress 的 `useData().lang`（root=zh-CN / en=en-US），
 * 不用 window.location：SSR 阶段没有 window，用它会产出中英不一致的首屏 HTML
 * 并触发 hydration 失配。
 *
 * 返回 `isEnglish` 供需要走不同链接前缀的场景使用（例如导航栏指向 /en/... ，
 * 这部分由 homeContent 的 nav.links 直接给全路径，一般用不到）。
 */
export function useHomeContent() {
  const { lang } = useData()
  const isEnglish = computed(() => String(lang.value ?? '').toLowerCase().startsWith('en'))
  const c = computed(() => (isEnglish.value ? homeContent.en : homeContent.zh))
  // 站内链接按 locale 加前缀：'/guide/x' → '/en/guide/x'。
  // 外链（https://…）原样返回，不要套前缀。
  const localePath = (path) => {
    if (/^https?:/i.test(path)) return path
    return isEnglish.value ? `/en${path}` : path
  }
  return { isEnglish, c, localePath }
}

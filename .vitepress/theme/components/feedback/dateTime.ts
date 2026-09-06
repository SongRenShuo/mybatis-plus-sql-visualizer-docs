/**
 * 需求池日期解析共享工具
 *
 * 后端 Cloudflare D1 的 CURRENT_TIMESTAMP 存的是 UTC，序列化为
 * "YYYY-MM-DD HH:MM:SS"（无时区标识）。直接 new Date() 解析该格式
 * 得到 Invalid Date；即便只把空格换成 T，也会被按本地时区理解，
 * UTC+8 下整体偏差 8 小时。这里统一显式按 UTC 解析。
 */

// 结尾已带 Z / ±HH:MM / ±HHMM 时区标识则不再补
const TRAILING_TZ = /(?:Z|[+-]\d{2}:?\d{2})$/i

/**
 * 解析后端日期字符串（"YYYY-MM-DD" 或 "YYYY-MM-DD HH:MM:SS" 或 ISO 串），
 * 无时区标识时按 UTC 解释。解析失败返回 null，调用方自行回退。
 */
export function parseUtcDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null
  let iso = String(dateStr).trim()
  if (!iso) return null
  if (!iso.includes('T')) {
    // "YYYY-MM-DD HH:MM:SS" → "YYYY-MM-DDTHH:MM:SS"；纯日期补零点
    iso = `${iso.replace(' ', 'T')}${iso.includes(' ') ? '' : 'T00:00:00'}`
  }
  if (!TRAILING_TZ.test(iso)) iso += 'Z'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

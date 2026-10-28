/**
 * 附件上传逻辑（自 FeedbackForm 的 T9–T13 交互标准复制而来）
 *
 * 为什么复制而不是直接抽 FeedbackForm：需求池表单是线上主功能，
 * 把它的上传逻辑改成共享 composable 会扩大回归面；悬赏表单按同一套
 * 交互标准独立实现，字段与错误文案各自可调，后续再择机合并。
 *
 * 行为约定：
 * - 最多 3 个附件、单个 5MB、类型白名单；
 * - 图片用本地 object URL 预览（提交前 /feedback/files/:key 反查不到关联行会 404）；
 * - 后端错误 message 优先透传，拿不到再用兜底文案；
 * - 移除 / 重置 / 组件卸载都回收 object URL。
 */

import { computed, markRaw, onBeforeUnmount, reactive, ref } from 'vue'
import { t, type Locale } from './i18n'

export interface UploadItem {
  id: string
  _file: File
  key: string
  fileName: string
  mimeType: string
  fileSize: number
  status: 'uploading' | 'success' | 'error'
  error: string
  previewUrl: string
}

export interface UploadOptions {
  apiBase: () => string
  locale: () => Locale
  maxAttachments?: number
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'txt', 'md']

export function useAttachmentUpload(options: UploadOptions) {
  const maxAttachments = options.maxAttachments ?? 3

  const items = ref<UploadItem[]>([])
  const uploadError = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)
  const hasUploading = computed(() => items.value.some((it) => it.status === 'uploading'))
  let uid = 0

  function isAllowedFile(file: File): boolean {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    return ALLOWED_EXTENSIONS.includes(ext)
  }

  function isImage(item: UploadItem): boolean {
    return item.mimeType.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(item.fileName)
  }

  function formatSize(bytes: number): string {
    if (bytes == null) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files || !input.files.length) return
    uploadError.value = ''
    const l = options.locale()
    const newFiles = Array.from(input.files)

    for (const file of newFiles) {
      if (items.value.length >= maxAttachments) {
        uploadError.value = t('form.maxAttachment', l)
        break
      }
      if (file.size > MAX_FILE_SIZE) {
        uploadError.value = `${file.name}: ${t('form.fileTooLarge', l)}`
        continue
      }
      if (!isAllowedFile(file)) {
        uploadError.value = `${file.name}: ${t('form.fileTypeError', l)}`
        continue
      }
      const item = reactive<UploadItem>({
        id: `att-${Date.now()}-${uid++}`,
        _file: markRaw(file),
        key: '',
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        fileSize: file.size,
        status: 'uploading',
        error: '',
        previewUrl: '',
      })
      if (isImage(item) && typeof URL !== 'undefined' && URL.createObjectURL) {
        item.previewUrl = URL.createObjectURL(file)
      }
      items.value.push(item)
      uploadItem(item)
    }
    input.value = ''
  }

  async function uploadItem(item: UploadItem) {
    const l = options.locale()
    item.status = 'uploading'
    item.error = ''
    try {
      const formData = new FormData()
      formData.append('file', item._file)
      // 悬赏不新增上传端点，沿用需求池的上传接口（R2 前缀 feed/）
      const res = await fetch(`${options.apiBase()}/feedback/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.code === 0) {
        item.key = data.data.key
        item.fileName = data.data.fileName || item.fileName
        item.mimeType = data.data.mimeType || item.mimeType
        item.fileSize = data.data.fileSize ?? item.fileSize
        item.status = 'success'
      } else {
        item.status = 'error'
        item.error = data.message || t('form.uploadFailed', l)
      }
    } catch (err) {
      item.status = 'error'
      item.error = t('form.uploadFailed', l)
      console.error(err)
    }
  }

  function revokePreview(item: UploadItem) {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl)
      item.previewUrl = ''
    }
  }

  function removeItem(item: UploadItem) {
    const idx = items.value.indexOf(item)
    if (idx > -1) items.value.splice(idx, 1)
    revokePreview(item)
    if (!items.value.length) uploadError.value = ''
  }

  function successfulAttachments() {
    return items.value
      .filter((it) => it.status === 'success' && it.key)
      .map((it) => ({ key: it.key, fileName: it.fileName, mimeType: it.mimeType, fileSize: it.fileSize }))
  }

  function reset() {
    items.value.forEach(revokePreview)
    items.value = []
    uploadError.value = ''
  }

  onBeforeUnmount(() => {
    items.value.forEach(revokePreview)
  })

  return {
    maxAttachments,
    items,
    uploadError,
    fileInput,
    hasUploading,
    handleFileSelect,
    uploadItem,
    removeItem,
    successfulAttachments,
    reset,
    formatSize,
    isImage,
  }
}

const fileBase = ((import.meta.env.VITE_FILE_BASE_URL || '') as string).replace(/\/$/, '')

export const resolveFileUrl = (value?: string | null) => {
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value

  let normalized = value.trim()
  if (!normalized.startsWith('/')) normalized = `/${normalized}`

  if (/^\/uploads\/\d{8}\//.test(normalized)) {
    normalized = normalized.replace(/^\/uploads\//, '/uploads/avatar/')
  }

  if (normalized.startsWith('/uploads/')) {
    if (fileBase) return `${fileBase}${normalized}`
    return normalized
  }

  return normalized
}

import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

const upload = (path: string, file: File): Promise<ApiResponse<{ url: string; name?: string; markdown?: string }>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadAvatarApi = (file: File) => upload('/uploads/avatar', file)
export const uploadPostImageApi = (file: File) => upload('/uploads/post-image', file)
export const uploadPostFileApi = (file: File) => upload('/uploads/post-file', file)

export const uploadEditorImageApi = (file: File) => upload('/uploads/editor-image', file)
export const uploadResourceCoverApi = (file: File) => upload('/uploads/resource-cover', file)

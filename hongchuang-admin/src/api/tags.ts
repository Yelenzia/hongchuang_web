import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface AdminTagRow {
  id: string
  name: string
  slug: string
  postCount: number
  status: number
}

export interface TagPayload {
  name: string
  slug: string
  status?: number
}

export const getTagListApi = (): Promise<ApiResponse<AdminTagRow[]>> => request.get('/admin/tags')
export const createTagApi = (data: TagPayload) => request.post('/admin/tags', data)
export const updateTagApi = (tagId: string, data: TagPayload) => request.put(`/admin/tags/${tagId}`, data)
export const deleteTagApi = (tagId: string) => request.delete(`/admin/tags/${tagId}`)

import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AnnouncementRow {
  id: string
  title: string
  summary?: string
  content: string
  isPinned: number
  publishStatus: number
  publishedAt?: string
  createdAt: string
}

export interface AnnouncementPayload {
  title: string
  summary?: string
  content: string
  isPinned?: number
  publishStatus?: number
}

export const getAnnouncementListApi = (params: { pageNo: number; pageSize: number }): Promise<ApiResponse<MpPageData<AnnouncementRow>>> => request.get('/admin/announcements', { params })
export const createAnnouncementApi = (data: AnnouncementPayload) => request.post('/admin/announcements', data)
export const updateAnnouncementApi = (id: string, data: AnnouncementPayload) => request.put(`/admin/announcements/${id}`, data)
export const deleteAnnouncementApi = (id: string) => request.delete(`/admin/announcements/${id}`)

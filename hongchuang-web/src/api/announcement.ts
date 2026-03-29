import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AnnouncementItem {
  id: string
  title: string
  summary?: string
  content: string
  isPinned: number
  publishStatus: number
  publishedAt?: string
  createdAt: string
}

export const getLatestAnnouncementApi = (): Promise<ApiResponse<AnnouncementItem[]>> => request.get('/announcements/latest')
export const getAnnouncementListApi = (params: { pageNo: number; pageSize: number }): Promise<ApiResponse<MpPageData<AnnouncementItem>>> => request.get('/announcements', { params })
export const getAnnouncementDetailApi = (id: string): Promise<ApiResponse<AnnouncementItem>> => request.get(`/announcements/${id}`)

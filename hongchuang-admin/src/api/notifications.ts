import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminNotificationRow {
  id: string
  userId: string
  username?: string | null
  nickname?: string | null
  type: string
  title: string
  content: string
  isRead: number
  relatedId?: string | null
  relatedType?: string | null
  createdAt: string
}

export const getNotificationListApi = (params: { pageNo: number; pageSize: number; keyword?: string; type?: string; isRead?: number }): Promise<ApiResponse<MpPageData<AdminNotificationRow>>> => request.get('/admin/notifications', { params })
export const deleteNotificationApi = (notificationId: string) => request.delete(`/admin/notifications/${notificationId}`)

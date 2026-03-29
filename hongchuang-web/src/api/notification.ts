import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { NotificationItem, PrivateMessageItem, PrivateMessageSessionItem } from '@/types/forum'

export const getNotificationListApi = (): Promise<ApiResponse<NotificationItem[]>> => request.get('/notifications')
export const getUnreadCountApi = (): Promise<ApiResponse<{ unreadCount: number }>> => request.get('/notifications/unread-count')
export const markNotificationReadApi = (id: string): Promise<ApiResponse<null>> => request.patch(`/notifications/${id}/read`)
export const markAllNotificationReadApi = (): Promise<ApiResponse<null>> => request.patch('/notifications/read-all')
export const sendPrivateMessageApi = (payload: { toUserId?: string; toUsername?: string; content: string }): Promise<ApiResponse<{ messageId: string }>> => request.post('/notifications/private-messages', payload)
export const getConversationApi = (params: { targetUserId?: string; targetUsername?: string }): Promise<ApiResponse<PrivateMessageItem[]>> => request.get('/notifications/private-messages/conversation', { params })

export const getPrivateMessageSessionsApi = (params?: { keyword?: string }): Promise<ApiResponse<PrivateMessageSessionItem[]>> => request.get('/notifications/private-messages/sessions', { params })

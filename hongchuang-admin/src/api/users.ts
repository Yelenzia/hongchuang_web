import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminUserRow {
  id: string
  username: string
  nickname?: string
  forumUid?: string
  email: string
  role: string
  status: number
  emailVerified?: number
  registerTime: string
  lastLoginAt?: string
  postCount: number
  commentCount: number
  bio?: string | null
  avatarUrl?: string | null
  signature?: string | null
  businessCard?: string | null
  userLevel?: number
  achievementCount?: number
}

export const getUserListApi = (params: { pageNo: number; pageSize: number; keyword?: string; status?: number }): Promise<ApiResponse<MpPageData<AdminUserRow>>> => request.get('/admin/users', { params })
export const getUserDetailApi = (userId: string): Promise<ApiResponse<AdminUserRow>> => request.get(`/admin/users/${userId}`)
export const banUserApi = (userId: string) => request.patch(`/admin/users/${userId}/ban`)
export const unbanUserApi = (userId: string) => request.patch(`/admin/users/${userId}/unban`)
export const updateUserRoleApi = (userId: string, role: 'USER' | 'ADMIN') => request.patch(`/admin/users/${userId}/role`, { role })
export const updateUserIdentityApi = (userId: string, businessCard: string | null, userLevel: number) => request.patch(`/admin/users/${userId}/identity`, { businessCard, userLevel })
export const resetUserPasswordApi = (userId: string, newPassword: string) => request.patch(`/admin/users/${userId}/password`, { newPassword })

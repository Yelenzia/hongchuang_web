import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface AdminAchievementItem {
  id: string
  code: string
  name: string
  description?: string
  icon?: string
  color?: string
  category?: string
  sortOrder: number
  status: number
}

export interface UserAchievementItem {
  id: string
  name: string
  code: string
  description?: string
  icon?: string
  color?: string
  obtainedAt?: string
  obtained?: boolean
}


export const getAchievementListApi = (): Promise<ApiResponse<AdminAchievementItem[]>> => request.get('/admin/achievements')
export const createAchievementApi = (data: Omit<AdminAchievementItem, 'id'>) => request.post('/admin/achievements', data)
export const updateAchievementApi = (id: string, data: Omit<AdminAchievementItem, 'id'>) => request.put(`/admin/achievements/${id}`, data)
export const getUserAchievementsApi = (userId: string): Promise<ApiResponse<UserAchievementItem[]>> => request.get(`/admin/achievements/users/${userId}`)
export const grantAchievementApi = (userId: string, code: string) => request.post(`/admin/achievements/users/${userId}/${code}`)

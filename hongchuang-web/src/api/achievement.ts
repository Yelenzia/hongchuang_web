import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { AchievementItem } from '@/types/forum'

export const getMyAchievementsApi = (): Promise<ApiResponse<AchievementItem[]>> => request.get('/achievements/me')
export const getUserAchievementsApi = (userId: string): Promise<ApiResponse<AchievementItem[]>> => request.get(`/achievements/users/${userId}`)

import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface DashboardTrendPoint {
  date: string
  value: number
}

export interface DashboardRankItem {
  name: string
  value: number
  extra?: string
}

export interface DashboardOverview {
  userCount: number
  todayUserCount: number
  postCount: number
  todayPostCount: number
  commentCount: number
  todayCommentCount: number
  resourceCount: number
  todayResourceCount: number
  privateMessageCount: number
  todayLoginCount: number
  activeSessionCount: number
  pendingReportCount: number
  pendingAnnouncementCount: number
  todoItems: string[]
  userTrend: DashboardTrendPoint[]
  postTrend: DashboardTrendPoint[]
  resourceTrend: DashboardTrendPoint[]
  topBoards: DashboardRankItem[]
  topTags: DashboardRankItem[]
  hotResources: DashboardRankItem[]
}

export const getDashboardApi = (): Promise<ApiResponse<DashboardOverview>> => request.get('/admin/dashboard')

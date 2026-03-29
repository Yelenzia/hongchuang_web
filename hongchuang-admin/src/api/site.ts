import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminSitePageItem {
  id: string
  pageCode: string
  pageName: string
  title?: string
  subtitle?: string
  contentJson: string
  status: number
  sortOrder: number
  updatedAt?: string
}

export const getAdminSitePageListApi = (params: { pageNo: number; pageSize: number; keyword?: string; status?: number }): Promise<ApiResponse<MpPageData<AdminSitePageItem>>> => request.get('/admin/site-pages', { params })
export const getAdminSitePageDetailApi = (id: string): Promise<ApiResponse<AdminSitePageItem>> => request.get(`/admin/site-pages/${id}`)
export const createAdminSitePageApi = (data: Record<string, unknown>) => request.post('/admin/site-pages', data)
export const updateAdminSitePageApi = (id: string, data: Record<string, unknown>) => request.put(`/admin/site-pages/${id}`, data)
export const updateAdminSitePageStatusApi = (id: string, status: number) => request.patch(`/admin/site-pages/${id}/status`, { status })

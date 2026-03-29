import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface SitePageItem {
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

export const getSitePageApi = (pageCode: string): Promise<ApiResponse<SitePageItem>> => request.get(`/site-pages/${pageCode}`)

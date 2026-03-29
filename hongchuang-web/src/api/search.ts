import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { SearchOverview } from '@/types/search'

export const searchAllApi = (params: { keyword: string; postLimit?: number; resourceLimit?: number; userLimit?: number }): Promise<ApiResponse<SearchOverview>> =>
  request.get('/search', { params })

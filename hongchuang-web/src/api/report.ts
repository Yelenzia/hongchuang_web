import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export const createReportApi = (data: { targetType: 'POST' | 'COMMENT'; targetId: string; reasonType: string; reasonDetail?: string }): Promise<ApiResponse<{ reportId: string }>> => request.post('/reports', data)

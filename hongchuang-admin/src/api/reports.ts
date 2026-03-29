import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminReportRow {
  id: string
  reporterId: string
  reporterName?: string
  targetType: string
  targetId: string
  reasonType: string
  reasonDetail?: string
  status: number
  createdAt: string
  handleNote?: string
}


export const getReportListApi = (params: { pageNo: number; pageSize: number }): Promise<ApiResponse<MpPageData<AdminReportRow>>> => request.get('/admin/reports', { params })
export const handleReportApi = (reportId: string, data: { status: number; handleNote?: string }) => request.patch(`/admin/reports/${reportId}/handle`, data)

import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminTemplateItem {
  id: string
  templateName: string
  templateType: string
  sceneCode: string
  titleExample?: string
  summaryExample?: string
  contentMarkdown?: string
  enabled: number
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface AdminDraftRow {
  id: string
  draftType: string
  sceneCode?: string
  ownerUserId: string
  username?: string
  nickname?: string
  title?: string
  summary?: string
  autoSaved?: number
  createdAt: string
  updatedAt: string
}

export interface AdminUploadLogRow {
  id: string
  userId?: string
  username?: string
  nickname?: string
  bizType: string
  fileName: string
  fileUrl: string
  fileExt?: string
  fileSize?: number
  contentType?: string
  createdAt: string
}

export const getAdminTemplateListApi = (params: { pageNo: number; pageSize: number; templateType?: string; keyword?: string; enabled?: number }): Promise<ApiResponse<MpPageData<AdminTemplateItem>>> => request.get('/admin/content-templates', { params })
export const getAdminTemplateDetailApi = (id: string): Promise<ApiResponse<AdminTemplateItem>> => request.get(`/admin/content-templates/${id}`)
export const createAdminTemplateApi = (data: Record<string, unknown>) => request.post('/admin/content-templates', data)
export const updateAdminTemplateApi = (id: string, data: Record<string, unknown>) => request.put(`/admin/content-templates/${id}`, data)
export const toggleAdminTemplateApi = (id: string, enabled: number) => request.patch(`/admin/content-templates/${id}/enabled`, { enabled })
export const deleteAdminTemplateApi = (id: string) => request.delete(`/admin/content-templates/${id}`)

export const getAdminDraftListApi = (params: { pageNo: number; pageSize: number; draftType?: string; ownerUserId?: string; keyword?: string }): Promise<ApiResponse<MpPageData<AdminDraftRow>>> => request.get('/admin/drafts', { params })
export const deleteAdminDraftApi = (id: string) => request.delete(`/admin/drafts/${id}`)
export const getAdminUploadLogsApi = (params: { pageNo: number; pageSize: number; bizType?: string; userId?: string }): Promise<ApiResponse<MpPageData<AdminUploadLogRow>>> => request.get('/admin/drafts/upload-logs', { params })

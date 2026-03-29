import request from '@/utils/request'
import type { ApiResponse, PageData, MpPageData } from '@/types/api'
import type { ContentDraftItem, ContentTemplateItem } from '@/types/content'

export const getContentTemplatesApi = (params?: { templateType?: string; sceneCode?: string }): Promise<ApiResponse<ContentTemplateItem[]>> =>
  request.get('/content-templates', { params })

export const saveDraftApi = (data: Record<string, unknown>): Promise<ApiResponse<{ draftId: string }>> =>
  request.post('/drafts', data)

export const getDraftListApi = (params: { pageNo?: number; pageSize?: number; draftType?: string }): Promise<ApiResponse<PageData<ContentDraftItem>>> =>
  request.get('/drafts', { params })

export const getDraftDetailApi = (draftId: string): Promise<ApiResponse<ContentDraftItem>> =>
  request.get(`/drafts/${draftId}`)

export const deleteDraftApi = (draftId: string) => request.delete(`/drafts/${draftId}`)

export const getAdminTemplateListApi = (params: { pageNo: number; pageSize: number; templateType?: string; keyword?: string; enabled?: number }): Promise<ApiResponse<MpPageData<ContentTemplateItem>>> =>
  request.get('/admin/content-templates', { params })

export const getAdminTemplateDetailApi = (id: string): Promise<ApiResponse<ContentTemplateItem>> =>
  request.get(`/admin/content-templates/${id}`)

export const createAdminTemplateApi = (data: Record<string, unknown>) => request.post('/admin/content-templates', data)
export const updateAdminTemplateApi = (id: string, data: Record<string, unknown>) => request.put(`/admin/content-templates/${id}`, data)
export const toggleAdminTemplateApi = (id: string, enabled: number) => request.patch(`/admin/content-templates/${id}/enabled`, { enabled })
export const deleteAdminTemplateApi = (id: string) => request.delete(`/admin/content-templates/${id}`)

export const getAdminDraftListApi = (params: { pageNo: number; pageSize: number; draftType?: string; ownerUserId?: string; keyword?: string }) =>
  request.get('/admin/drafts', { params })
export const deleteAdminDraftApi = (id: string) => request.delete(`/admin/drafts/${id}`)
export const getAdminUploadLogsApi = (params: { pageNo: number; pageSize: number; bizType?: string; userId?: string }) =>
  request.get('/admin/drafts/upload-logs', { params })

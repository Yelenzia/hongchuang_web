import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminResourceRow {
  id: string
  title: string
  categoryId: string
  categoryName: string
  summary?: string | null
  coverUrl?: string | null
  authorId: string
  authorName: string
  currentVersionNo?: string | null
  mcVersions?: string | null
  downloadCount: number
  favoriteCount: number
  likeCount: number
  commentCount: number
  status: number
  isRecommended: number
  auditRemark?: string | null
  createdAt: string
  updatedAt?: string
}

export interface AdminResourceVersion {
  id?: string
  versionNo?: string
  mcVersions?: string | null
  changelog?: string | null
  downloadType?: string | null
  downloadUrl?: string | null
  fileUrl?: string | null
  isCurrent?: number
  createdAt?: string
}

export interface AdminResourceTag {
  id: string
  name: string
}

export interface AdminResourceDetail extends AdminResourceRow {
  content?: string | null
  downloadType?: string | null
  downloadUrl?: string | null
  fileUrl?: string | null
  viewCount?: number
  tags: AdminResourceTag[]
  currentVersion?: AdminResourceVersion | null
  versions: AdminResourceVersion[]
}

export interface AdminResourceStats {
  totalResources: number
  publishedResources: number
  pendingResources: number
  totalDownloads: number
  totalViews: number
}

export interface AdminResourceCategoryRow {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  sortOrder?: number
  status?: number
  resourceCount?: number
}

export const getResourceStatsApi = (): Promise<ApiResponse<AdminResourceStats>> => request.get('/admin/resources/stats')
export const getResourceListApi = (params: { pageNo: number; pageSize: number; keyword?: string; categoryId?: string; status?: number }): Promise<ApiResponse<MpPageData<AdminResourceRow>>> => request.get('/admin/resources', { params })
export const getResourceDetailApi = (resourceId: string): Promise<ApiResponse<AdminResourceDetail>> => request.get(`/admin/resources/${resourceId}`)
export const auditResourceApi = (resourceId: string, data: { pass: boolean; remark?: string }) => request.patch(`/admin/resources/${resourceId}/audit`, data)
export const updateResourceStatusApi = (resourceId: string, status: number) => request.patch(`/admin/resources/${resourceId}/status`, { status })
export const updateResourceRecommendApi = (resourceId: string, recommended: boolean) => request.patch(`/admin/resources/${resourceId}/recommend`, { recommended })

export const getAdminResourceCategoriesApi = (): Promise<ApiResponse<AdminResourceCategoryRow[]>> => request.get('/admin/resource-categories')
export const createResourceCategoryApi = (data: Partial<AdminResourceCategoryRow>) => request.post('/admin/resource-categories', data)
export const updateResourceCategoryApi = (categoryId: string, data: Partial<AdminResourceCategoryRow>) => request.put(`/admin/resource-categories/${categoryId}`, data)
export const updateResourceCategoryStatusApi = (categoryId: string, status: number) => request.patch(`/admin/resource-categories/${categoryId}/status`, { status })
export const deleteResourceCategoryApi = (categoryId: string) => request.delete(`/admin/resource-categories/${categoryId}`)

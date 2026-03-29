import request from '@/utils/request'
import type { ApiResponse, PageData } from '@/types/api'
import type {
  ResourceCategoryItem,
  ResourceCommentItem,
  ResourceDetailItem,
  ResourceCardItem
} from '@/types/resource'

export const getResourceCategoriesApi = (): Promise<ApiResponse<ResourceCategoryItem[]>> =>
  request.get('/resource-categories')

export const getResourceListApi = (params: Record<string, unknown>): Promise<ApiResponse<PageData<ResourceCardItem>>> =>
  request.get('/resources', { params })

export const getRecommendResourcesApi = (params?: { size?: number }): Promise<ApiResponse<ResourceCardItem[]>> =>
  request.get('/resources/recommend', { params })

export const getResourceDetailApi = (resourceId: string): Promise<ApiResponse<ResourceDetailItem>> =>
  request.get(`/resources/${resourceId}`)

export const createResourceApi = (data: Record<string, unknown>) => request.post('/resources', data)
export const updateResourceApi = (resourceId: string, data: Record<string, unknown>) => request.put(`/resources/${resourceId}`, data)
export const submitResourceAuditApi = (resourceId: string) => request.post(`/resources/${resourceId}/submit-audit`)
export const updateResourceStatusApi = (resourceId: string, status: number) => request.patch(`/resources/${resourceId}/status`, { status })
export const favoriteResourceApi = (resourceId: string) => request.post(`/resources/${resourceId}/favorite`)
export const cancelFavoriteResourceApi = (resourceId: string) => request.delete(`/resources/${resourceId}/favorite`)
export const likeResourceApi = (resourceId: string) => request.post(`/resources/${resourceId}/like`)
export const cancelLikeResourceApi = (resourceId: string) => request.delete(`/resources/${resourceId}/like`)
export const downloadResourceApi = (resourceId: string) => request.post(`/resources/${resourceId}/download`)
export const getResourceCommentsApi = (resourceId: string): Promise<ApiResponse<ResourceCommentItem[]>> => request.get(`/resources/${resourceId}/comments`)
export const createResourceCommentApi = (resourceId: string, data: Record<string, unknown>) => request.post(`/resources/${resourceId}/comments`, data)
export const deleteResourceCommentApi = (commentId: string) => request.delete(`/resources/comments/${commentId}`)
export const getMyResourcesApi = (params: { pageNo?: number; pageSize?: number; status?: number }) => request.get('/resources/me', { params })

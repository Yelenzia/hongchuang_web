import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminPostRow {
  id: string
  title: string
  summary: string
  authorId: string
  author: string
  boardId: string
  board: string
  status: number
  isRecommended: number
  likeCount: number
  commentCount: number
  createdAt: string
}

export interface AdminPostDetail {
  id: string
  title: string
  summary: string
  contentMd: string
  authorId: string
  boardId: string
  boardName: string
  tags: Array<{ id: string; name: string }>
}

export interface AdminPostUpdatePayload {
  boardId: string
  title: string
  summary?: string
  contentMd: string
  tagIds?: string[]
}

export const getPostListApi = (params: { pageNo: number; pageSize: number; keyword?: string; status?: number }): Promise<ApiResponse<MpPageData<AdminPostRow>>> => request.get('/admin/posts', { params })
export const getPostDetailApi = (postId: string): Promise<ApiResponse<AdminPostDetail>> => request.get(`/posts/${postId}`)
export const updatePostApi = (postId: string, data: AdminPostUpdatePayload) => request.put(`/admin/posts/${postId}`, data)
export const deletePostApi = (postId: string) => request.delete(`/admin/posts/${postId}`)
export const recommendPostApi = (postId: string, recommended: boolean) => request.patch(`/admin/posts/${postId}/recommend`, { recommended })
export const updatePostStatusApi = (postId: string, status: number) => request.patch(`/admin/posts/${postId}/status`, { status })

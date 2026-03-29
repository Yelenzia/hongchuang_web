import request from '@/utils/request'
import type { ApiResponse, MpPageData } from '@/types/api'

export interface AdminCommentRow {
  id: string
  postId: string
  postTitle?: string
  authorId: string
  author: string
  content: string
  status: number
  createdAt: string
}

export const getCommentListApi = (params: { pageNo: number; pageSize: number; keyword?: string }): Promise<ApiResponse<MpPageData<AdminCommentRow>>> => request.get('/admin/comments', { params })
export const deleteCommentApi = (commentId: string) => request.delete(`/admin/comments/${commentId}`)

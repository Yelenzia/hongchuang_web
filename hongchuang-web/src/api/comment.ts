import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { CommentItem } from '@/types/forum'

export const getCommentsApi = (postId: string): Promise<ApiResponse<CommentItem[]>> => request.get(`/posts/${postId}/comments`)
export const createCommentApi = (postId: string, data: { parentId?: string; replyUserId?: string; content: string }): Promise<ApiResponse<{ commentId: string }>> => request.post(`/posts/${postId}/comments`, data)
export const deleteCommentApi = (commentId: string): Promise<ApiResponse<null>> => request.delete(`/comments/${commentId}`)

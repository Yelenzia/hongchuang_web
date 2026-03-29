import request from '@/utils/request'
import type { ApiResponse, PageData } from '@/types/api'
import type { PostDetail, PostItem } from '@/types/forum'

export interface PostListParams {
  pageNo?: number
  pageSize?: number
  boardId?: string
  tagId?: string
  authorId?: string
  keyword?: string
  sort?: 'newest' | 'hot'
}

export interface CreatePostPayload {
  boardId: string
  title: string
  summary?: string
  contentMd: string
  tagIds?: string[]
}

export const getPostListApi = (params: PostListParams): Promise<ApiResponse<PageData<PostItem>>> => request.get('/posts', { params })
export const getMyFavoritePostsApi = (params: { pageNo?: number; pageSize?: number }): Promise<ApiResponse<PageData<PostItem>>> => request.get('/posts/favorites/me', { params })
export const getPostDetailApi = (postId: string): Promise<ApiResponse<PostDetail>> => request.get(`/posts/${postId}`)
export const createPostApi = (data: CreatePostPayload): Promise<ApiResponse<{ postId: string }>> => request.post('/posts', data)
export const updatePostApi = (postId: string, data: CreatePostPayload): Promise<ApiResponse<null>> => request.put(`/posts/${postId}`, data)
export const deletePostApi = (postId: string): Promise<ApiResponse<null>> => request.delete(`/posts/${postId}`)
export const likePostApi = (postId: string): Promise<ApiResponse<null>> => request.post(`/posts/${postId}/like`)
export const cancelLikePostApi = (postId: string): Promise<ApiResponse<null>> => request.delete(`/posts/${postId}/like`)
export const favoritePostApi = (postId: string): Promise<ApiResponse<null>> => request.post(`/posts/${postId}/favorite`)
export const cancelFavoritePostApi = (postId: string): Promise<ApiResponse<null>> => request.delete(`/posts/${postId}/favorite`)
export const blockPostApi = (postId: string): Promise<ApiResponse<null>> => request.post(`/posts/${postId}/block`)
export const unblockPostApi = (postId: string): Promise<ApiResponse<null>> => request.delete(`/posts/${postId}/block`)

import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface AdminBoardRow {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  sortOrder: number
  postCount: number
  isPublic: number
  status: number
}

export interface BoardPayload {
  name: string
  slug: string
  description?: string
  icon?: string
  sortOrder?: number
  isPublic?: number
  status?: number
}

export const getBoardListApi = (): Promise<ApiResponse<AdminBoardRow[]>> => request.get('/admin/boards')
export const createBoardApi = (data: BoardPayload) => request.post('/admin/boards', data)
export const updateBoardApi = (boardId: string, data: BoardPayload) => request.put(`/admin/boards/${boardId}`, data)
export const deleteBoardApi = (boardId: string) => request.delete(`/admin/boards/${boardId}`)

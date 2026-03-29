import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { BoardItem } from '@/types/forum'

export const getBoardsApi = (): Promise<ApiResponse<BoardItem[]>> => request.get('/boards')

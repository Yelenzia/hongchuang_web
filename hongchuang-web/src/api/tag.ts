import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { TagItem } from '@/types/forum'

export const getHotTagsApi = (): Promise<ApiResponse<TagItem[]>> => request.get('/tags/hot')
export const getTagsApi = (): Promise<ApiResponse<TagItem[]>> => request.get('/tags')

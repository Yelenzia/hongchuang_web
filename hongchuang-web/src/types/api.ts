export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  requestId: string
}

export interface PageData<T> {
  list: T[]
  total: number
  pageNo: number
  pageSize: number
}

export interface MpPageData<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

import type { PostItem, UserSearchItem } from '@/types/forum'
import type { ResourceCardItem } from '@/types/resource'

export interface SearchOverview {
  keyword: string
  postTotal: number
  resourceTotal: number
  userTotal: number
  posts: PostItem[]
  resources: ResourceCardItem[]
  users: UserSearchItem[]
}

export interface LoginDeviceItem {
  sessionId: string
  deviceType: string
  deviceName: string
  browser: string
  os: string
  loginIp?: string | null
  loginTime?: string | null
  lastActiveAt?: string | null
  expiresAt?: string | null
  status: number
  current: boolean
}

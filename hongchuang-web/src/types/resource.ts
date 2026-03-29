import type { CommentItem, TagItem } from '@/types/forum'

export interface ResourceCategoryItem {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string | null
  sortOrder?: number
  status?: number
  resourceCount?: number
}

export interface ResourceVersionItem {
  id?: string
  resourceId?: string
  versionNo: string
  mcVersions?: string
  changelog?: string
  downloadType?: string
  downloadUrl?: string | null
  fileUrl?: string | null
  status?: number
  isCurrent?: number
  createdAt?: string
}

export interface ResourceCardItem {
  id: string
  title: string
  categoryId: string
  categoryName: string
  summary?: string
  content?: string
  coverUrl?: string | null
  authorId: string
  authorName: string
  authorAvatarUrl?: string | null
  currentVersionNo?: string | null
  mcVersions?: string | null
  downloadCount: number
  favoriteCount: number
  likeCount: number
  commentCount: number
  isRecommended?: number
  status?: number
  createdAt: string
  updatedAt?: string
  tags: TagItem[]
}

export interface ResourceCommentItem extends Omit<CommentItem, 'postId'> {
  resourceId: string
  children?: ResourceCommentItem[]
}

export interface ResourceDetailItem extends ResourceCardItem {
  content: string
  status: number
  isFavorited: boolean
  isLiked: boolean
  currentVersion?: ResourceVersionItem | null
  versions: ResourceVersionItem[]
  relatedResources: ResourceCardItem[]
  comments: ResourceCommentItem[]
  downloadType?: string
  downloadUrl?: string | null
  fileUrl?: string | null
  auditRemark?: string | null
}

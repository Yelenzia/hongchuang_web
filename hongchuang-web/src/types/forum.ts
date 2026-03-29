export interface TagItem {
  id: string
  name: string
  slug?: string
  postCount?: number
  status?: number
}

export interface BoardItem {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
  sortOrder?: number
  status?: number
}

export interface AchievementItem {
  id: string
  code: string
  name: string
  description?: string
  icon?: string
  color?: string
  obtained?: boolean
  obtainedAt?: string | null
}

export interface PostItem {
  id: string
  title: string
  summary: string
  authorId: string
  authorName: string
  authorForumUid?: string
  authorAvatarUrl?: string | null
  authorSignature?: string | null
  authorBusinessCard?: string | null
  authorUserLevel?: number
  boardId: string
  boardName: string
  likeCount: number
  favoriteCount?: number
  commentCount: number
  createdAt: string
  tags: TagItem[]
}

export interface PostDetail extends PostItem {
  contentMd: string
  contentHtml: string
  viewCount: number
  liked: boolean
  favorited: boolean
  blocked: boolean
}

export interface CommentItem {
  id: string
  postId: string
  userId: string
  forumUid?: string
  username?: string | null
  nickname: string
  avatarUrl?: string | null
  signature?: string | null
  businessCard?: string | null
  userLevel?: number
  parentId: string
  rootId: string
  replyUserId?: string | null
  replyNickname?: string | null
  replyForumUid?: string | null
  content: string
  createdAt: string
}

export interface PublicUserProfile {
  userId: string
  forumUid?: string
  username: string
  nickname: string
  avatarUrl?: string | null
  signature?: string | null
  businessCard?: string | null
  userLevel?: number
  experiencePoints?: number
  nextLevelExp?: number
  bio?: string | null
  registerTime: string
  postCount: number
  commentCount: number
  favoriteCount?: number
  followingCount?: number
  followerCount?: number
  followedByCurrentUser?: boolean
  achievementCount?: number
}

export interface UserRelationItem {
  userId: string
  forumUid?: string
  username: string
  nickname: string
  avatarUrl?: string | null
  signature?: string | null
  businessCard?: string | null
  userLevel?: number
  postCount?: number
  commentCount?: number
  followerCount?: number
  followingCount?: number
  followedByMe?: boolean
}


export interface UserSearchItem {
  userId: string
  forumUid?: string
  username: string
  nickname: string
  avatarUrl?: string | null
  signature?: string | null
  userLevel?: number
}

export interface PrivateMessageSessionItem {
  targetUserId: string
  username: string
  nickname: string
  avatarUrl?: string | null
  signature?: string | null
  userLevel?: number
  lastMessageContent?: string | null
  lastMessageTime?: string | null
  lastMessageId?: string | null
  unreadCount: number
}

export interface NotificationItem {
  id: string
  type: string
  title: string
  content: string
  isRead: number
  relatedId?: string
  relatedType?: string
  createdAt: string
}

export interface PrivateMessageItem {
  id: string
  fromUserId: string
  toUserId: string
  content: string
  isRead: number
  createdAt: string
}

export interface WalletInfo {
  diamond: number
  goldIngot: number
  ironIngot: number
  copperIngot: number
  totalCheckInDays: number
  streakDays: number
  lastCheckInDate?: string | null
  checkedInToday: boolean
}

export interface ShopRuleItem {
  id: string
  code: string
  name: string
  fromCurrency: string
  fromAmount: number
  toCurrency: string
  toAmount: number
  dailyLimit?: number
  status?: number
}

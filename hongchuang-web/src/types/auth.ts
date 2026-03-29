export interface LoginRequest {
  account: string
  password: string
  emailCode: string
  captchaId: string
  captchaCode: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  emailCode: string
  captchaId: string
  captchaCode: string
}

export interface CurrentUser {
  id: string
  forumUid?: string
  username: string
  nickname: string
  email?: string
  avatarUrl?: string | null
  signature?: string | null
  businessCard?: string | null
  userLevel?: number
  experiencePoints?: number
  nextLevelExp?: number
  bio?: string | null
  role: string
  registerTime?: string
  postCount?: number
  commentCount?: number
  favoriteCount?: number
  followingCount?: number
  followerCount?: number
  followedByCurrentUser?: boolean
  achievementCount?: number
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  userInfo: CurrentUser
}

export interface CaptchaData {
  captchaId: string
  imageBase64: string
}

export interface EmailCodeSendResult {
  sent: boolean
  message: string
  debugCode?: string | null
  cooldownSeconds?: number
}

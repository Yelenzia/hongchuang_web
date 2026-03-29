import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

export interface AdminLoginRequest {
  account: string
  password: string
  emailCode: string
  captchaId: string
  captchaCode: string
}

export interface AdminUserInfo {
  id: string
  username: string
  nickname: string
  role: string
  email?: string
}

export interface AdminLoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  userInfo: AdminUserInfo
}

export interface CaptchaData { captchaId: string; imageBase64: string }
export interface EmailCodeSendResult { sent: boolean; message: string; debugCode?: string | null }

export const getCaptchaApi = (): Promise<ApiResponse<CaptchaData>> => request.get('/auth/captcha')
export const sendEmailCodeApi = (data: { bizType: 'LOGIN'; account: string; captchaId: string; captchaCode: string }): Promise<ApiResponse<EmailCodeSendResult>> => request.post('/auth/email-code', data)
export const adminLoginApi = (data: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> => request.post('/auth/login', data)
export const adminMeApi = (): Promise<ApiResponse<AdminUserInfo>> => request.get('/auth/me')
export const adminLogoutApi = (): Promise<ApiResponse<null>> => request.post('/auth/logout')

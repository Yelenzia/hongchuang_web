import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { CaptchaData, CurrentUser, EmailCodeSendResult, LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth'

export const getCaptchaApi = (): Promise<ApiResponse<CaptchaData>> => request.get('/auth/captcha')
export const sendEmailCodeApi = (data: { bizType: 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD'; email?: string; account?: string; captchaId: string; captchaCode: string }): Promise<ApiResponse<EmailCodeSendResult>> => request.post('/auth/email-code', data)
export const loginApi = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => request.post('/auth/login', data)
export const registerApi = (data: RegisterRequest): Promise<ApiResponse<{ userId: string }>> => request.post('/auth/register', data)
export const logoutApi = (): Promise<ApiResponse<null>> => request.post('/auth/logout')
export const getMeApi = (): Promise<ApiResponse<CurrentUser>> => request.get('/auth/me')
export const forgotPasswordApi = (data: { email: string; captchaId: string; captchaCode: string }): Promise<ApiResponse<EmailCodeSendResult>> => request.post('/auth/forgot-password', data)
export const resetPasswordApi = (data: { email: string; code: string; newPassword: string; confirmPassword: string; captchaId: string; captchaCode: string }): Promise<ApiResponse<null>> => request.post('/auth/reset-password', data)

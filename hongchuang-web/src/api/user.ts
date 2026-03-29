import request from '@/utils/request'
import type { ApiResponse, PageData } from '@/types/api'
import type { EmailCodeSendResult } from '@/types/auth'
import type { PostItem, PublicUserProfile, UserRelationItem, UserSearchItem } from '@/types/forum'
import type { LoginDeviceItem } from '@/types/search'

export const getUserProfileApi = (userId: string): Promise<ApiResponse<PublicUserProfile>> => request.get(`/users/${userId}/profile`)
export const updateMyProfileApi = (data: { nickname: string; bio?: string; signature?: string; avatarUrl?: string }): Promise<ApiResponse<null>> => request.put('/users/me/profile', data)
export const changePasswordApi = (data: { oldPassword: string; newPassword: string; confirmPassword: string; emailCode: string; captchaId: string; captchaCode: string }): Promise<ApiResponse<null>> => request.put('/users/me/password', data)
export const updateMyPasswordApi = changePasswordApi
export const sendChangePasswordCodeApi = (data: { bizType: 'CHANGE_PASSWORD'; captchaId: string; captchaCode: string }): Promise<ApiResponse<EmailCodeSendResult>> => request.post('/users/me/password/email-code', data)
export const getUserPostsApi = (params: { pageNo?: number; pageSize?: number; authorId: string }): Promise<ApiResponse<PageData<PostItem>>> => request.get('/posts', { params })
export const followUserApi = (userId: string): Promise<ApiResponse<null>> => request.post(`/users/${userId}/follow`)
export const unfollowUserApi = (userId: string): Promise<ApiResponse<null>> => request.delete(`/users/${userId}/follow`)
export const getMyFollowingApi = (): Promise<ApiResponse<UserRelationItem[]>> => request.get('/users/me/follows')
export const getMyFansApi = (): Promise<ApiResponse<UserRelationItem[]>> => request.get('/users/me/fans')

export const searchUsersApi = (params: { keyword: string; limit?: number }): Promise<ApiResponse<UserSearchItem[]>> => request.get('/users/search', { params })

export const sendCancelAccountCodeApi = (data: { bizType: 'CANCEL_ACCOUNT'; captchaId: string; captchaCode: string }): Promise<ApiResponse<EmailCodeSendResult>> => request.post('/users/me/cancel/email-code', data)
export const cancelMyAccountApi = (data: { password: string; emailCode: string; captchaId: string; captchaCode: string; reason?: string }): Promise<ApiResponse<null>> => request.post('/users/me/cancel', data)


export const getMyLoginDevicesApi = (): Promise<ApiResponse<LoginDeviceItem[]>> => request.get('/users/me/devices')
export const revokeMyLoginDeviceApi = (sessionId: string): Promise<ApiResponse<null>> => request.delete(`/users/me/devices/${sessionId}`)
export const revokeOtherLoginDevicesApi = (): Promise<ApiResponse<null>> => request.delete('/users/me/devices/others')

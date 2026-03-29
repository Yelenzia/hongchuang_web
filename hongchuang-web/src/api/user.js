import request from '@/utils/request';
export const getUserProfileApi = (userId) => request.get(`/users/${userId}/profile`);
export const updateMyProfileApi = (data) => request.put('/users/me/profile', data);
export const changePasswordApi = (data) => request.put('/users/me/password', data);
export const updateMyPasswordApi = changePasswordApi;
export const sendChangePasswordCodeApi = (data) => request.post('/users/me/password/email-code', data);
export const getUserPostsApi = (params) => request.get('/posts', { params });
export const followUserApi = (userId) => request.post(`/users/${userId}/follow`);
export const unfollowUserApi = (userId) => request.delete(`/users/${userId}/follow`);
export const getMyFollowingApi = () => request.get('/users/me/follows');
export const getMyFansApi = () => request.get('/users/me/fans');
export const searchUsersApi = (params) => request.get('/users/search', { params });
export const sendCancelAccountCodeApi = (data) => request.post('/users/me/cancel/email-code', data);
export const cancelMyAccountApi = (data) => request.post('/users/me/cancel', data);
export const getMyLoginDevicesApi = () => request.get('/users/me/devices');
export const revokeMyLoginDeviceApi = (sessionId) => request.delete(`/users/me/devices/${sessionId}`);
export const revokeOtherLoginDevicesApi = () => request.delete('/users/me/devices/others');
//# sourceMappingURL=user.js.map
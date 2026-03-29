import request from '@/utils/request';
export const getUserListApi = (params) => request.get('/admin/users', { params });
export const getUserDetailApi = (userId) => request.get(`/admin/users/${userId}`);
export const banUserApi = (userId) => request.patch(`/admin/users/${userId}/ban`);
export const unbanUserApi = (userId) => request.patch(`/admin/users/${userId}/unban`);
export const updateUserRoleApi = (userId, role) => request.patch(`/admin/users/${userId}/role`, { role });
export const updateUserIdentityApi = (userId, businessCard, userLevel) => request.patch(`/admin/users/${userId}/identity`, { businessCard, userLevel });
export const resetUserPasswordApi = (userId, newPassword) => request.patch(`/admin/users/${userId}/password`, { newPassword });
//# sourceMappingURL=users.js.map
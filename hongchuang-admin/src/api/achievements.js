import request from '@/utils/request';
export const getAchievementListApi = () => request.get('/admin/achievements');
export const createAchievementApi = (data) => request.post('/admin/achievements', data);
export const updateAchievementApi = (id, data) => request.put(`/admin/achievements/${id}`, data);
export const getUserAchievementsApi = (userId) => request.get(`/admin/achievements/users/${userId}`);
export const grantAchievementApi = (userId, code) => request.post(`/admin/achievements/users/${userId}/${code}`);
//# sourceMappingURL=achievements.js.map
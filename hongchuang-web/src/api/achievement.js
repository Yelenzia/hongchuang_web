import request from '@/utils/request';
export const getMyAchievementsApi = () => request.get('/achievements/me');
export const getUserAchievementsApi = (userId) => request.get(`/achievements/users/${userId}`);
//# sourceMappingURL=achievement.js.map
import request from '@/utils/request';
export const getLatestAnnouncementApi = () => request.get('/announcements/latest');
export const getAnnouncementListApi = (params) => request.get('/announcements', { params });
export const getAnnouncementDetailApi = (id) => request.get(`/announcements/${id}`);
//# sourceMappingURL=announcement.js.map
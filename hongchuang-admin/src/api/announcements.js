import request from '@/utils/request';
export const getAnnouncementListApi = (params) => request.get('/admin/announcements', { params });
export const createAnnouncementApi = (data) => request.post('/admin/announcements', data);
export const updateAnnouncementApi = (id, data) => request.put(`/admin/announcements/${id}`, data);
export const deleteAnnouncementApi = (id) => request.delete(`/admin/announcements/${id}`);
//# sourceMappingURL=announcements.js.map
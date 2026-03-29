import request from '@/utils/request';
export const getAdminSitePageListApi = (params) => request.get('/admin/site-pages', { params });
export const getAdminSitePageDetailApi = (id) => request.get(`/admin/site-pages/${id}`);
export const createAdminSitePageApi = (data) => request.post('/admin/site-pages', data);
export const updateAdminSitePageApi = (id, data) => request.put(`/admin/site-pages/${id}`, data);
export const updateAdminSitePageStatusApi = (id, status) => request.patch(`/admin/site-pages/${id}/status`, { status });
//# sourceMappingURL=site.js.map
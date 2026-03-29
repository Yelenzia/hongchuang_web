import request from '@/utils/request';
export const getResourceStatsApi = () => request.get('/admin/resources/stats');
export const getResourceListApi = (params) => request.get('/admin/resources', { params });
export const getResourceDetailApi = (resourceId) => request.get(`/admin/resources/${resourceId}`);
export const auditResourceApi = (resourceId, data) => request.patch(`/admin/resources/${resourceId}/audit`, data);
export const updateResourceStatusApi = (resourceId, status) => request.patch(`/admin/resources/${resourceId}/status`, { status });
export const updateResourceRecommendApi = (resourceId, recommended) => request.patch(`/admin/resources/${resourceId}/recommend`, { recommended });
export const getAdminResourceCategoriesApi = () => request.get('/admin/resource-categories');
export const createResourceCategoryApi = (data) => request.post('/admin/resource-categories', data);
export const updateResourceCategoryApi = (categoryId, data) => request.put(`/admin/resource-categories/${categoryId}`, data);
export const updateResourceCategoryStatusApi = (categoryId, status) => request.patch(`/admin/resource-categories/${categoryId}/status`, { status });
export const deleteResourceCategoryApi = (categoryId) => request.delete(`/admin/resource-categories/${categoryId}`);
//# sourceMappingURL=resources.js.map
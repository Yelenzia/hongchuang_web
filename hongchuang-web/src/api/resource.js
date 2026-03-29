import request from '@/utils/request';
export const getResourceCategoriesApi = () => request.get('/resource-categories');
export const getResourceListApi = (params) => request.get('/resources', { params });
export const getRecommendResourcesApi = (params) => request.get('/resources/recommend', { params });
export const getResourceDetailApi = (resourceId) => request.get(`/resources/${resourceId}`);
export const createResourceApi = (data) => request.post('/resources', data);
export const updateResourceApi = (resourceId, data) => request.put(`/resources/${resourceId}`, data);
export const submitResourceAuditApi = (resourceId) => request.post(`/resources/${resourceId}/submit-audit`);
export const updateResourceStatusApi = (resourceId, status) => request.patch(`/resources/${resourceId}/status`, { status });
export const favoriteResourceApi = (resourceId) => request.post(`/resources/${resourceId}/favorite`);
export const cancelFavoriteResourceApi = (resourceId) => request.delete(`/resources/${resourceId}/favorite`);
export const likeResourceApi = (resourceId) => request.post(`/resources/${resourceId}/like`);
export const cancelLikeResourceApi = (resourceId) => request.delete(`/resources/${resourceId}/like`);
export const downloadResourceApi = (resourceId) => request.post(`/resources/${resourceId}/download`);
export const getResourceCommentsApi = (resourceId) => request.get(`/resources/${resourceId}/comments`);
export const createResourceCommentApi = (resourceId, data) => request.post(`/resources/${resourceId}/comments`, data);
export const deleteResourceCommentApi = (commentId) => request.delete(`/resources/comments/${commentId}`);
export const getMyResourcesApi = (params) => request.get('/resources/me', { params });
//# sourceMappingURL=resource.js.map
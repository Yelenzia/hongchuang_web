import request from '@/utils/request';
export const getTagListApi = () => request.get('/admin/tags');
export const createTagApi = (data) => request.post('/admin/tags', data);
export const updateTagApi = (tagId, data) => request.put(`/admin/tags/${tagId}`, data);
export const deleteTagApi = (tagId) => request.delete(`/admin/tags/${tagId}`);
//# sourceMappingURL=tags.js.map
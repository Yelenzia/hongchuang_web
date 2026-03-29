import request from '@/utils/request';
export const getContentTemplatesApi = (params) => request.get('/content-templates', { params });
export const saveDraftApi = (data) => request.post('/drafts', data);
export const getDraftListApi = (params) => request.get('/drafts', { params });
export const getDraftDetailApi = (draftId) => request.get(`/drafts/${draftId}`);
export const deleteDraftApi = (draftId) => request.delete(`/drafts/${draftId}`);
export const getAdminTemplateListApi = (params) => request.get('/admin/content-templates', { params });
export const getAdminTemplateDetailApi = (id) => request.get(`/admin/content-templates/${id}`);
export const createAdminTemplateApi = (data) => request.post('/admin/content-templates', data);
export const updateAdminTemplateApi = (id, data) => request.put(`/admin/content-templates/${id}`, data);
export const toggleAdminTemplateApi = (id, enabled) => request.patch(`/admin/content-templates/${id}/enabled`, { enabled });
export const deleteAdminTemplateApi = (id) => request.delete(`/admin/content-templates/${id}`);
export const getAdminDraftListApi = (params) => request.get('/admin/drafts', { params });
export const deleteAdminDraftApi = (id) => request.delete(`/admin/drafts/${id}`);
export const getAdminUploadLogsApi = (params) => request.get('/admin/drafts/upload-logs', { params });
//# sourceMappingURL=content.js.map
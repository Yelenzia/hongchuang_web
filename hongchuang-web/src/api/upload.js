import request from '@/utils/request';
const upload = (path, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post(path, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const uploadAvatarApi = (file) => upload('/uploads/avatar', file);
export const uploadPostImageApi = (file) => upload('/uploads/post-image', file);
export const uploadPostFileApi = (file) => upload('/uploads/post-file', file);
export const uploadEditorImageApi = (file) => upload('/uploads/editor-image', file);
export const uploadResourceCoverApi = (file) => upload('/uploads/resource-cover', file);
//# sourceMappingURL=upload.js.map
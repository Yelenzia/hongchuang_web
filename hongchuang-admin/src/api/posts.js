import request from '@/utils/request';
export const getPostListApi = (params) => request.get('/admin/posts', { params });
export const getPostDetailApi = (postId) => request.get(`/posts/${postId}`);
export const updatePostApi = (postId, data) => request.put(`/admin/posts/${postId}`, data);
export const deletePostApi = (postId) => request.delete(`/admin/posts/${postId}`);
export const recommendPostApi = (postId, recommended) => request.patch(`/admin/posts/${postId}/recommend`, { recommended });
export const updatePostStatusApi = (postId, status) => request.patch(`/admin/posts/${postId}/status`, { status });
//# sourceMappingURL=posts.js.map
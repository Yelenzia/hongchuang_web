import request from '@/utils/request';
export const getCommentListApi = (params) => request.get('/admin/comments', { params });
export const deleteCommentApi = (commentId) => request.delete(`/admin/comments/${commentId}`);
//# sourceMappingURL=comments.js.map
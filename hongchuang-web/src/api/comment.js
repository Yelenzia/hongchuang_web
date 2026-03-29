import request from '@/utils/request';
export const getCommentsApi = (postId) => request.get(`/posts/${postId}/comments`);
export const createCommentApi = (postId, data) => request.post(`/posts/${postId}/comments`, data);
export const deleteCommentApi = (commentId) => request.delete(`/comments/${commentId}`);
//# sourceMappingURL=comment.js.map
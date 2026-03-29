import request from '@/utils/request';
export const getPostListApi = (params) => request.get('/posts', { params });
export const getMyFavoritePostsApi = (params) => request.get('/posts/favorites/me', { params });
export const getPostDetailApi = (postId) => request.get(`/posts/${postId}`);
export const createPostApi = (data) => request.post('/posts', data);
export const updatePostApi = (postId, data) => request.put(`/posts/${postId}`, data);
export const deletePostApi = (postId) => request.delete(`/posts/${postId}`);
export const likePostApi = (postId) => request.post(`/posts/${postId}/like`);
export const cancelLikePostApi = (postId) => request.delete(`/posts/${postId}/like`);
export const favoritePostApi = (postId) => request.post(`/posts/${postId}/favorite`);
export const cancelFavoritePostApi = (postId) => request.delete(`/posts/${postId}/favorite`);
export const blockPostApi = (postId) => request.post(`/posts/${postId}/block`);
export const unblockPostApi = (postId) => request.delete(`/posts/${postId}/block`);
//# sourceMappingURL=post.js.map
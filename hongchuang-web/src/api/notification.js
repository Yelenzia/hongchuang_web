import request from '@/utils/request';
export const getNotificationListApi = () => request.get('/notifications');
export const getUnreadCountApi = () => request.get('/notifications/unread-count');
export const markNotificationReadApi = (id) => request.patch(`/notifications/${id}/read`);
export const markAllNotificationReadApi = () => request.patch('/notifications/read-all');
export const sendPrivateMessageApi = (payload) => request.post('/notifications/private-messages', payload);
export const getConversationApi = (params) => request.get('/notifications/private-messages/conversation', { params });
export const getPrivateMessageSessionsApi = (params) => request.get('/notifications/private-messages/sessions', { params });
//# sourceMappingURL=notification.js.map
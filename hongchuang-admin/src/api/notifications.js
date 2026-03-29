import request from '@/utils/request';
export const getNotificationListApi = (params) => request.get('/admin/notifications', { params });
export const deleteNotificationApi = (notificationId) => request.delete(`/admin/notifications/${notificationId}`);
//# sourceMappingURL=notifications.js.map
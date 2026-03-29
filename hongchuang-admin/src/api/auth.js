import request from '@/utils/request';
export const getCaptchaApi = () => request.get('/auth/captcha');
export const sendEmailCodeApi = (data) => request.post('/auth/email-code', data);
export const adminLoginApi = (data) => request.post('/auth/login', data);
export const adminMeApi = () => request.get('/auth/me');
export const adminLogoutApi = () => request.post('/auth/logout');
//# sourceMappingURL=auth.js.map
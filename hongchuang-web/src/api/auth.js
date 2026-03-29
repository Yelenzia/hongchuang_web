import request from '@/utils/request';
export const getCaptchaApi = () => request.get('/auth/captcha');
export const sendEmailCodeApi = (data) => request.post('/auth/email-code', data);
export const loginApi = (data) => request.post('/auth/login', data);
export const registerApi = (data) => request.post('/auth/register', data);
export const logoutApi = () => request.post('/auth/logout');
export const getMeApi = () => request.get('/auth/me');
export const forgotPasswordApi = (data) => request.post('/auth/forgot-password', data);
export const resetPasswordApi = (data) => request.post('/auth/reset-password', data);
//# sourceMappingURL=auth.js.map
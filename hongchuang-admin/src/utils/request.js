import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAdminAuthStore } from '@/store/auth';
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 12000
});
request.interceptors.request.use((config) => {
    const store = useAdminAuthStore();
    if (store.accessToken) {
        config.headers.Authorization = `Bearer ${store.accessToken}`;
    }
    return config;
});
request.interceptors.response.use((response) => {
    const body = response.data;
    if (body?.code === 0 || body?.code === undefined)
        return body;
    ElMessage.error(body?.message || '请求失败');
    return Promise.reject(body);
}, (error) => {
    const store = useAdminAuthStore();
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || '网络异常';
    if (status === 401 || status === 403) {
        store.clearAuth();
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    if (status !== 401 && status !== 403) {
        ElMessage.error(message);
    }
    return Promise.reject(error);
});
export default request;
//# sourceMappingURL=request.js.map
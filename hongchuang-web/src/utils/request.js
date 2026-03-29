import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/auth';
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 12000
});
request.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
});
request.interceptors.response.use((response) => {
    const body = response.data;
    if (body?.code === 0 || body?.code === undefined) {
        return body;
    }
    ElMessage.error(body?.message || '请求失败');
    return Promise.reject(body);
}, (error) => {
    const authStore = useAuthStore();
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || '网络异常';
    if (status === 401) {
        authStore.clearAuth();
        if (!['/login', '/register', '/forgot-password'].includes(window.location.pathname)) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
    }
    if (status !== 401) {
        ElMessage.error(message);
    }
    return Promise.reject(error);
});
export default request;
//# sourceMappingURL=request.js.map
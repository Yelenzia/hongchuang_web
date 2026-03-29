import { defineStore } from 'pinia';
import { adminLoginApi, adminLogoutApi, adminMeApi } from '@/api/auth';
export const useAdminAuthStore = defineStore('adminAuth', {
    state: () => ({
        accessToken: localStorage.getItem('hc_admin_access_token') || '',
        userInfo: JSON.parse(localStorage.getItem('hc_admin_user_info') || 'null'),
        initialized: false
    }),
    getters: {
        isLogin: (state) => Boolean(state.accessToken),
        isAdmin: (state) => state.userInfo?.role === 'ADMIN'
    },
    actions: {
        setAuth(token, userInfo) {
            this.accessToken = token;
            this.userInfo = userInfo;
            this.initialized = true;
            localStorage.setItem('hc_admin_access_token', token);
            localStorage.setItem('hc_admin_user_info', JSON.stringify(userInfo));
        },
        clearAuth() {
            this.accessToken = '';
            this.userInfo = null;
            this.initialized = true;
            localStorage.removeItem('hc_admin_access_token');
            localStorage.removeItem('hc_admin_user_info');
        },
        async login(payload) {
            const { data } = await adminLoginApi(payload);
            if (data.userInfo.role !== 'ADMIN') {
                this.clearAuth();
                throw new Error('当前账号不是管理员，禁止进入后台');
            }
            this.setAuth(data.accessToken, data.userInfo);
            return data;
        },
        async fetchMe() {
            const { data } = await adminMeApi();
            if (data.role !== 'ADMIN') {
                this.clearAuth();
                throw new Error('当前账号不是管理员，禁止进入后台');
            }
            this.userInfo = data;
            this.initialized = true;
            localStorage.setItem('hc_admin_user_info', JSON.stringify(data));
            return data;
        },
        async initialize() {
            if (this.initialized) {
                return this.userInfo;
            }
            if (!this.accessToken) {
                this.initialized = true;
                return null;
            }
            try {
                return await this.fetchMe();
            }
            catch (error) {
                this.clearAuth();
                throw error;
            }
        },
        async logout() {
            try {
                if (this.accessToken) {
                    await adminLogoutApi();
                }
            }
            finally {
                this.clearAuth();
            }
        }
    }
});
//# sourceMappingURL=auth.js.map
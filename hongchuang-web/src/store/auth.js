import { defineStore } from 'pinia';
import { getMeApi, loginApi, logoutApi } from '@/api/auth';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem('hc_access_token') || '',
        userInfo: JSON.parse(localStorage.getItem('hc_user_info') || 'null'),
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
            localStorage.setItem('hc_access_token', token);
            localStorage.setItem('hc_user_info', JSON.stringify(userInfo));
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
            this.initialized = true;
            if (userInfo) {
                localStorage.setItem('hc_user_info', JSON.stringify(userInfo));
            }
            else {
                localStorage.removeItem('hc_user_info');
            }
        },
        clearAuth() {
            this.accessToken = '';
            this.userInfo = null;
            this.initialized = true;
            localStorage.removeItem('hc_access_token');
            localStorage.removeItem('hc_user_info');
        },
        async login(payload) {
            const { data } = await loginApi(payload);
            this.setAuth(data.accessToken, data.userInfo);
            return data;
        },
        async fetchMe() {
            const { data } = await getMeApi();
            this.setUserInfo(data);
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
                    await logoutApi();
                }
            }
            finally {
                this.clearAuth();
            }
        }
    }
});
//# sourceMappingURL=auth.js.map
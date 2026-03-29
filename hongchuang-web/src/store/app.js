import { defineStore } from 'pinia';
import { getHotTagsApi } from '@/api/tag';
import { getUnreadCountApi } from '@/api/notification';
export const useAppStore = defineStore('app', {
    state: () => ({
        hotTags: [],
        loadingHotTags: false,
        unreadCount: 0
    }),
    actions: {
        async loadHotTags(force = false) {
            if (this.hotTags.length > 0 && !force) {
                return this.hotTags;
            }
            this.loadingHotTags = true;
            try {
                const { data } = await getHotTagsApi();
                this.hotTags = data;
                return data;
            }
            finally {
                this.loadingHotTags = false;
            }
        },
        async refreshUnreadCount() {
            try {
                const { data } = await getUnreadCountApi();
                this.unreadCount = data.unreadCount || 0;
            }
            catch {
                this.unreadCount = 0;
            }
        }
    }
});
//# sourceMappingURL=app.js.map
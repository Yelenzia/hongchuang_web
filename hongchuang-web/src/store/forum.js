import { defineStore } from 'pinia';
import { getBoardsApi } from '@/api/board';
export const useForumStore = defineStore('forum', {
    state: () => ({
        boards: [],
        loadingBoards: false
    }),
    actions: {
        async loadBoards(force = false) {
            if (this.boards.length > 0 && !force) {
                return this.boards;
            }
            this.loadingBoards = true;
            try {
                const { data } = await getBoardsApi();
                this.boards = data;
                return data;
            }
            finally {
                this.loadingBoards = false;
            }
        }
    }
});
//# sourceMappingURL=forum.js.map
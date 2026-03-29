import { defineStore } from 'pinia'
import { getBoardsApi } from '@/api/board'
import type { BoardItem } from '@/types/forum'

interface ForumState {
  boards: BoardItem[]
  loadingBoards: boolean
}

export const useForumStore = defineStore('forum', {
  state: (): ForumState => ({
    boards: [],
    loadingBoards: false
  }),
  actions: {
    async loadBoards(force = false) {
      if (this.boards.length > 0 && !force) {
        return this.boards
      }
      this.loadingBoards = true
      try {
        const { data } = await getBoardsApi()
        this.boards = data
        return data
      } finally {
        this.loadingBoards = false
      }
    }
  }
})

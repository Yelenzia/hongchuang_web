<template>
  <div class="board-grid" v-loading="forumStore.loadingBoards">
    <RouterLink
      v-for="board in boards"
      :key="board.id"
      class="hc-card board-item"
      :to="`/forum/board/${board.slug}`"
    >
      <div class="title">{{ board.name }}</div>
      <div class="desc">{{ board.description }}</div>
      <div class="count">{{ board.postCount }} 篇帖子</div>
    </RouterLink>

    <div v-if="!forumStore.loadingBoards && boards.length === 0" class="hc-card board-item empty">暂无板块数据</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useForumStore } from '@/store/forum'

const forumStore = useForumStore()
const boards = computed(() => forumStore.boards)
</script>

<style scoped lang="scss">
.board-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.board-item {
  padding: 18px;
  transition: .2s ease;
}
.board-item:hover {
  transform: translateY(-2px);
}
.empty {
  color: var(--hc-text-secondary);
}
.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.desc, .count {
  color: var(--hc-text-secondary);
  line-height: 1.7;
}
.count {
  margin-top: 12px;
  color: var(--hc-primary-deep);
}
@media (max-width: 900px) {
  .board-grid {
    grid-template-columns: 1fr;
  }
}
</style>

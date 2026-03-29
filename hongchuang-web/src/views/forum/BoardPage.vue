<template>
  <div class="hc-container board-page">
    <div class="hc-card hero">
      <div class="badge">论坛板块</div>
      <h1>{{ currentBoard?.name || '板块详情' }}</h1>
      <p>{{ currentBoard?.description || '板块说明加载中…' }}</p>
    </div>

    <div v-loading="loading" class="list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
      <EmptyState v-if="!loading && posts.length === 0" title="该板块暂无帖子" />
    </div>

    <div class="pager hc-card">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForumStore } from '@/store/forum'
import PostCard from '@/components/forum/PostCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getPostListApi } from '@/api/post'
import type { PostItem } from '@/types/forum'

const route = useRoute()
const forumStore = useForumStore()
const currentBoard = computed(() => forumStore.boards.find((item) => item.slug === route.params.slug))
const posts = ref<PostItem[]>([])
const loading = ref(false)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const loadPosts = async () => {
  if (!currentBoard.value) return
  loading.value = true
  try {
    const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, boardId: currentBoard.value.id, sort: 'newest' })
    posts.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadPosts()
}

watch(currentBoard, async () => {
  pageNo.value = 1
  await loadPosts()
})

onMounted(async () => {
  await forumStore.loadBoards()
  await loadPosts()
})
</script>

<style scoped lang="scss">
.board-page {
  padding-top: 108px;
  padding-bottom: 48px;
}
.hero {
  padding: 28px;
  margin-bottom: 20px;
}
.badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(18, 181, 203, 0.08);
  color: var(--hc-primary-deep);
  font-weight: 700;
}
.hero h1 {
  margin: 16px 0 12px;
}
.hero p {
  margin: 0;
  color: var(--hc-text-secondary);
  line-height: 1.75;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pager {
  margin-top: 20px;
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="favorites-page">
    <div class="page-head">
      <div>
        <div class="section-title">我的收藏</div>
        <div class="sub">这里会展示你收藏过的帖子，方便回看和持续追更。</div>
      </div>
    </div>

    <div v-loading="loading" class="list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
      <EmptyState v-if="!loading && posts.length === 0" title="你还没有收藏任何帖子" description="看到喜欢的内容时，可以在帖子详情页点击收藏。" />
    </div>

    <div v-if="total > pageSize" class="pager">
      <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PostCard from '@/components/forum/PostCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getMyFavoritePostsApi } from '@/api/post'
import type { PostItem } from '@/types/forum'

const loading = ref(false)
const posts = ref<PostItem[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getMyFavoritePostsApi({ pageNo: pageNo.value, pageSize })
    posts.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.favorites-page { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 22px; font-weight: 700; }
.sub { color: var(--hc-text-secondary); margin-top: 6px; }
.list { display: flex; flex-direction: column; gap: 14px; }
.pager { display: flex; justify-content: flex-end; }
</style>

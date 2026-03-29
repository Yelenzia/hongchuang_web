<template>
  <div>
    <div class="page-head">
      <div>
        <h2>我的帖子</h2>
        <p>这里展示当前账号已发布的帖子，你可以继续编辑或删除。</p>
      </div>
      <RouterLink to="/post/create">
        <el-button type="primary">新建帖子</el-button>
      </RouterLink>
    </div>

    <div v-loading="loading" class="list">
      <div v-for="post in posts" :key="post.id" class="post-item-wrap">
        <PostCard :post="post" />
        <div class="item-actions">
          <el-button link type="primary" @click="router.push(`/post/${post.id}/edit`)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(post.id, post.title)">删除</el-button>
        </div>
      </div>
      <EmptyState v-if="!loading && posts.length === 0" title="你还没有发布过帖子" />
    </div>

    <div class="pager" v-if="total > pageSize">
      <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import PostCard from '@/components/forum/PostCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useAuthStore } from '@/store/auth'
import { deletePostApi, getPostListApi } from '@/api/post'
import type { PostItem } from '@/types/forum'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const posts = ref<PostItem[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)

const loadPosts = async () => {
  if (!authStore.userInfo?.id) return
  loading.value = true
  try {
    const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, authorId: authStore.userInfo.id, sort: 'newest' })
    posts.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleDelete = async (postId: string, title: string) => {
  await ElMessageBox.confirm(`确定删除帖子《${title}》吗？`, '删除确认', { type: 'warning' })
  await deletePostApi(postId)
  ElMessage.success('帖子已删除')
  await loadPosts()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadPosts()
}

onMounted(async () => {
  await authStore.initialize()
  await loadPosts()
})
</script>

<style scoped lang="scss">
.page-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
}
.page-head h2 {
  margin: 0 0 10px;
}
.page-head p {
  margin: 0;
  color: var(--hc-text-secondary);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.post-item-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 8px;
}
.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 700px) {
  .page-head {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

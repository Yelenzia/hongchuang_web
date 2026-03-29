<template>
  <div class="hc-container forum-page">
    <aside class="left">
      <BaseCard>
        <div class="side-title">近期热门标签</div>
        <div v-loading="appStore.loadingHotTags" class="tag-list">
          <TagChip v-for="tag in hotTags" :key="tag.id" :label="tag.name" clickable @click="handleSelectTag(tag.id)" />
          <EmptyState v-if="!appStore.loadingHotTags && hotTags.length === 0" title="暂无热门标签" />
        </div>
      </BaseCard>

      <BaseCard>
        <div class="side-title">热门板块</div>
        <div v-loading="forumStore.loadingBoards">
          <div class="side-link" v-for="board in boards" :key="board.id">
            <RouterLink :to="`/forum/board/${board.slug}`">{{ board.name }}</RouterLink>
            <span>{{ board.postCount }}</span>
          </div>
          <EmptyState v-if="!forumStore.loadingBoards && boards.length === 0" title="暂无板块数据" />
        </div>
      </BaseCard>

      <BaseCard>
        <div class="side-title">筛选条件</div>
        <el-radio-group v-model="sortType" class="radio-group" @change="handleRefresh">
          <el-radio-button label="newest">最新</el-radio-button>
          <el-radio-button label="hot">最热</el-radio-button>
        </el-radio-group>
        <div v-if="selectedTagName" class="tag-filter-bar">
          <span>当前标签：{{ selectedTagName }}</span>
          <el-button link @click="clearTagFilter">清除</el-button>
        </div>
      </BaseCard>
    </aside>

    <section class="right">
      <div class="top-bar hc-card">
        <div class="title-wrap">
          <h1>论坛社区</h1>
          <p>这里适合讨论服务器、插件、贴图模型、MOD 与日常游戏交流。</p>
        </div>
        <div class="toolbar">
          <el-input v-model="keyword" placeholder="搜索帖子 / 关键词" clearable @keyup.enter="handleSearch" @clear="handleSearch" />
          <el-button @click="handleSearch">搜索</el-button>
          <RouterLink to="/post/create">
            <el-button type="primary">发布帖子</el-button>
          </RouterLink>
        </div>
      </div>

      <BoardNav />

      <div v-loading="loading" class="post-list">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
        <EmptyState v-if="!loading && posts.length === 0" title="暂无帖子" desc="可以试试切换排序方式或更换关键词。" />
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/common/BaseCard.vue'
import TagChip from '@/components/common/TagChip.vue'
import BoardNav from '@/components/forum/BoardNav.vue'
import PostCard from '@/components/forum/PostCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForumStore } from '@/store/forum'
import { useAppStore } from '@/store/app'
import { getPostListApi } from '@/api/post'
import type { PostItem } from '@/types/forum'

const route = useRoute()
const router = useRouter()
const keyword = ref(String(route.query.keyword || ''))
const sortType = ref<'newest' | 'hot'>((route.query.sort as 'newest' | 'hot') || 'newest')
const selectedTagId = ref<string | undefined>(route.query.tagId ? String(route.query.tagId) : undefined)
const pageNo = ref(Number(route.query.pageNo || 1))
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const posts = ref<PostItem[]>([])
const forumStore = useForumStore()
const appStore = useAppStore()

const boards = computed(() => forumStore.boards)
const hotTags = computed(() => appStore.hotTags)
const selectedTagName = computed(() => hotTags.value.find(item => item.id === selectedTagId.value)?.name || '')

const loadPosts = async () => {
  loading.value = true
  try {
    const { data } = await getPostListApi({
      pageNo: pageNo.value,
      pageSize,
      keyword: keyword.value || undefined,
      tagId: selectedTagId.value,
      sort: sortType.value
    })
    posts.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const syncQuery = () => {
  router.replace({
    path: '/forum',
    query: {
      ...(keyword.value ? { keyword: keyword.value } : {}),
      ...(selectedTagId.value ? { tagId: String(selectedTagId.value) } : {}),
      sort: sortType.value,
      pageNo: String(pageNo.value)
    }
  })
}

const handleSelectTag = async (tagId: string) => {
  selectedTagId.value = tagId
  pageNo.value = 1
  syncQuery()
  await loadPosts()
}

const clearTagFilter = async () => {
  selectedTagId.value = undefined
  pageNo.value = 1
  syncQuery()
  await loadPosts()
}

const handleSearch = async () => {
  pageNo.value = 1
  syncQuery()
  await loadPosts()
}

const handleRefresh = async () => {
  pageNo.value = 1
  syncQuery()
  await loadPosts()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  syncQuery()
  await loadPosts()
}

onMounted(async () => {
  await Promise.allSettled([
    forumStore.loadBoards(),
    appStore.loadHotTags(),
    loadPosts()
  ])
})
</script>

<style scoped lang="scss">
.forum-page {
  padding-top: 108px;
  padding-bottom: 48px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;
}
.left {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.right {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.side-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-filter-bar {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: var(--hc-text-secondary);
}
.side-link {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
}
.side-link:last-child {
  border-bottom: none;
}
.top-bar {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
}
.title-wrap h1 {
  margin: 0 0 10px;
}
.title-wrap p {
  margin: 0;
  color: var(--hc-text-secondary);
  line-height: 1.75;
}
.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pager {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}
@media (max-width: 980px) {
  .forum-page {
    grid-template-columns: 1fr;
  }
  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar {
    flex-wrap: wrap;
  }
}
</style>

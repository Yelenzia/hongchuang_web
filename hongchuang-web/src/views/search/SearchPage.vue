<template>
  <div class="search-page hc-container">
    <section class="search-hero hc-card minecraft-card">
      <div>
        <div class="badge">全站搜索</div>
        <h1>搜索帖子、资源和用户</h1>
        <p>想找帖子、资源或某位用户时，可以直接在这里搜索，常用内容会一起展示出来。</p>
      </div>
      <div class="hero-form">
        <el-input v-model="keyword" size="large" clearable placeholder="例如：插件 / 贴图 / 教程 / 用户名" @keyup.enter="handleSearch">
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </section>

    <section class="result-summary" v-if="searchedKeyword">
      <div class="summary-card hc-card"><strong>{{ overview?.postTotal ?? 0 }}</strong><span>帖子结果</span></div>
      <div class="summary-card hc-card"><strong>{{ overview?.resourceTotal ?? 0 }}</strong><span>资源结果</span></div>
      <div class="summary-card hc-card"><strong>{{ overview?.userTotal ?? 0 }}</strong><span>用户结果</span></div>
    </section>

    <section class="result-grid" v-loading="loading">
      <div class="hc-card block minecraft-card">
        <div class="block-head">
          <div>
            <div class="block-title">帖子</div>
            <div class="block-sub">优先显示标题和摘要匹配的社区内容</div>
          </div>
        </div>
        <div v-if="overview?.posts?.length" class="result-list">
          <RouterLink v-for="item in overview.posts" :key="item.id" :to="`/post/${item.id}`" class="result-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-desc">{{ item.summary || '暂无摘要' }}</div>
            <div class="item-meta">{{ item.authorName }} · {{ item.boardName }} · {{ item.commentCount }} 条评论</div>
          </RouterLink>
        </div>
        <el-empty v-else description="没有找到相关帖子" />
      </div>

      <div class="hc-card block minecraft-card">
        <div class="block-head">
          <div>
            <div class="block-title">资源</div>
            <div class="block-sub">集中查看插件、贴图、模型和其他资源内容</div>
          </div>
        </div>
        <div v-if="overview?.resources?.length" class="result-list">
          <RouterLink v-for="item in overview.resources" :key="item.id" :to="`/resources/${item.id}`" class="result-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-desc">{{ item.summary || '暂无简介' }}</div>
            <div class="item-meta">{{ item.authorName }} · {{ item.categoryName }} · 下载 {{ item.downloadCount }}</div>
          </RouterLink>
        </div>
        <el-empty v-else description="没有找到相关资源" />
      </div>

      <div class="hc-card block minecraft-card full-width">
        <div class="block-head">
          <div>
            <div class="block-title">用户</div>
            <div class="block-sub">支持按用户名或昵称快速找到想联系的人</div>
          </div>
        </div>
        <div v-if="overview?.users?.length" class="user-grid">
          <RouterLink v-for="item in overview.users" :key="item.userId" :to="`/user/${item.userId}`" class="user-card">
            <img :src="item.avatarUrl || fallbackAvatar" alt="avatar" class="avatar" />
            <div>
              <div class="item-title">{{ item.nickname || item.username }}</div>
              <div class="item-meta">@{{ item.username }} · Lv.{{ item.userLevel || 1 }}</div>
              <div class="item-desc">{{ item.signature || '这个人很懒，还没有写签名。' }}</div>
            </div>
          </RouterLink>
        </div>
        <el-empty v-else description="没有找到相关用户" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { searchAllApi } from '@/api/search'
import type { SearchOverview } from '@/types/search'
import logoUrl from '@/assets/images/logo.png'

const fallbackAvatar = logoUrl
const route = useRoute()
const router = useRouter()
const keyword = ref('')
const searchedKeyword = ref('')
const loading = ref(false)
const overview = ref<SearchOverview | null>(null)

const load = async (value?: string | null) => {
  const current = String(value || '').trim()
  keyword.value = current
  if (!current) {
    overview.value = null
    searchedKeyword.value = ''
    return
  }
  loading.value = true
  try {
    const { data } = await searchAllApi({ keyword: current })
    overview.value = data
    searchedKeyword.value = current
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  const current = keyword.value.trim()
  if (!current) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  await router.push({ name: 'search', query: { keyword: current } })
}

watch(() => route.query.keyword, async (value) => {
  await load(String(value || ''))
})

onMounted(async () => {
  await load(String(route.query.keyword || ''))
})
</script>

<style scoped lang="scss">
.search-page { padding-top: 108px; padding-bottom: 48px; display: grid; gap: 18px; }
.search-hero { padding: 24px; display: grid; gap: 18px; }
.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(14,165,233,.12); color: #0369a1; font-weight: 700; margin-bottom: 12px; }
.hero-form { max-width: 720px; }
.result-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.summary-card { padding: 20px; display: grid; gap: 8px; }
.summary-card strong { font-size: 28px; }
.summary-card span { color: var(--hc-text-secondary); }
.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.block { padding: 22px; }
.full-width { grid-column: 1 / -1; }
.block-head { margin-bottom: 14px; }
.block-title { font-size: 20px; font-weight: 700; }
.block-sub { color: var(--hc-text-secondary); margin-top: 6px; }
.result-list, .user-grid { display: grid; gap: 12px; }
.result-item, .user-card { padding: 16px; border-radius: 16px; background: rgba(15,23,42,.04); text-decoration: none; display: grid; gap: 8px; }
.user-card { grid-template-columns: 64px 1fr; align-items: start; }
.avatar { width: 64px; height: 64px; border-radius: 18px; object-fit: cover; }
.item-title { font-size: 16px; font-weight: 700; color: var(--hc-text-primary); }
.item-desc { color: var(--hc-text-secondary); line-height: 1.75; }
.item-meta { color: var(--hc-text-secondary); font-size: 13px; }
@media (max-width: 980px) { .result-summary, .result-grid { grid-template-columns: 1fr; } }
</style>

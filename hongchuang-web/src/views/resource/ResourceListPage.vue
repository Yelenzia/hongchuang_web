<template>
  <div class="resource-list-page hc-container">
    <section class="banner hc-card minecraft-card">
      <div>
        <div class="badge">资源中心</div>
        <h1>Minecraft 资源社区平台</h1>
        <p>统一浏览插件、贴图、模型与 MOD 资源，现在支持标签筛选、版本日志和内容模板。</p>
      </div>
      <RouterLink to="/resources/create"><el-button type="primary" size="large">发布资源</el-button></RouterLink>
    </section>

    <section class="filter hc-card minecraft-card">
      <div class="filter-row">
        <el-input v-model="keyword" placeholder="搜索资源标题 / 简介" clearable @keyup.enter="loadData" />
        <el-select v-model="categoryId" clearable placeholder="全部分类">
          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="tagId" clearable filterable placeholder="全部标签">
          <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="sort" placeholder="排序方式">
          <el-option label="最新发布" value="latest" />
          <el-option label="热门优先" value="hot" />
          <el-option label="下载最多" value="downloads" />
        </el-select>
        <el-button type="primary" @click="loadData">筛选</el-button>
      </div>

      <div v-if="tags.length" class="tag-cloud">
        <button class="tag-chip" :class="{ active: !tagId }" @click="setTag('')">全部</button>
        <button v-for="item in tags.slice(0, 12)" :key="item.id" class="tag-chip" :class="{ active: tagId === item.id }" @click="setTag(item.id)">
          # {{ item.name }}
        </button>
      </div>
    </section>

    <section v-loading="loading" class="grid">
      <EmptyState v-if="!rows.length" title="还没有资源" desc="可以先发布你的第一个资源，或者稍后再来看看。" />
      <RouterLink v-for="item in rows" :key="item.id" :to="`/resources/${item.id}`" class="hc-card resource-card minecraft-card">
        <img v-if="item.coverUrl" :src="resolveFileUrl(item.coverUrl)" class="cover" alt="cover" />
        <div class="body">
          <div class="meta-row"><span>{{ item.categoryName }}</span><span>{{ item.currentVersionNo || '未设置版本' }}</span></div>
          <div class="title">{{ item.title }}</div>
          <div class="summary">{{ item.summary }}</div>
          <div class="resource-tags">
            <span v-for="tag in item.tags" :key="tag.id" class="resource-tag" @click.prevent="setTag(tag.id)"># {{ tag.name }}</span>
          </div>
          <div class="stat-row"><span>作者：{{ item.authorName }}</span><span>下载：{{ item.downloadCount }}</span></div>
        </div>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { resolveFileUrl } from '@/utils/file'
import { getResourceCategoriesApi, getResourceListApi } from '@/api/resource'
import { getTagsApi } from '@/api/tag'
import type { TagItem } from '@/types/forum'
import type { ResourceCardItem, ResourceCategoryItem } from '@/types/resource'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const categories = ref<ResourceCategoryItem[]>([])
const tags = ref<TagItem[]>([])
const rows = ref<ResourceCardItem[]>([])
const keyword = ref(String(route.query.keyword || ''))
const categoryId = ref(String(route.query.categoryId || ''))
const tagId = ref(String(route.query.tagId || ''))
const sort = ref<'latest' | 'hot' | 'downloads'>((route.query.sort as 'latest' | 'hot' | 'downloads') || 'latest')

const syncQuery = () => {
  router.replace({
    query: {
      keyword: keyword.value || undefined,
      categoryId: categoryId.value || undefined,
      tagId: tagId.value || undefined,
      sort: sort.value !== 'latest' ? sort.value : undefined
    }
  })
}

const loadData = async () => {
  loading.value = true
  try {
    const [{ data: categoryData }, { data: tagData }, { data }] = await Promise.all([
      getResourceCategoriesApi(),
      getTagsApi(),
      getResourceListApi({
        pageNo: 1,
        pageSize: 24,
        keyword: keyword.value || undefined,
        categoryId: categoryId.value || undefined,
        tagId: tagId.value || undefined,
        sort: sort.value
      })
    ])
    categories.value = categoryData
    tags.value = tagData.filter(item => item.status !== 0)
    rows.value = data.list
    syncQuery()
  } finally {
    loading.value = false
  }
}

const setTag = (value: string) => {
  tagId.value = value
  loadData()
}

watch(() => route.query, () => {
  keyword.value = String(route.query.keyword || '')
  categoryId.value = String(route.query.categoryId || '')
  tagId.value = String(route.query.tagId || '')
  sort.value = (route.query.sort as 'latest' | 'hot' | 'downloads') || 'latest'
})

onMounted(loadData)
</script>

<style scoped lang="scss">
.resource-list-page { padding-top: 108px; padding-bottom: 48px; }
.banner, .filter { padding: 20px; margin-bottom: 18px; display: flex; justify-content: space-between; gap: 16px; align-items: center; }
.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(34, 197, 94, 0.1); color: #166534; font-weight: 700; }
.filter { flex-direction: column; align-items: stretch; }
.filter-row { display: grid; grid-template-columns: 1.2fr 200px 200px 200px auto; gap: 12px; width: 100%; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.tag-chip { border: none; cursor: pointer; padding: 8px 12px; border-radius: 999px; background: rgba(15, 23, 42, 0.06); color: var(--hc-text-primary); }
.tag-chip.active { background: rgba(34, 197, 94, 0.14); color: #166534; font-weight: 700; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.resource-card { overflow: hidden; }
.cover { width: 100%; height: 180px; object-fit: cover; }
.body { padding: 16px; }
.meta-row, .stat-row { display: flex; justify-content: space-between; gap: 10px; color: var(--hc-text-secondary); font-size: 13px; }
.title { font-size: 18px; font-weight: 700; margin: 10px 0; }
.summary { color: var(--hc-text-secondary); line-height: 1.8; min-height: 52px; }
.resource-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; min-height: 28px; }
.resource-tag { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: rgba(34, 197, 94, 0.1); color: #166534; font-size: 12px; cursor: pointer; }
@media (max-width: 900px) {
  .banner, .filter { flex-direction: column; align-items: stretch; }
  .filter-row { grid-template-columns: 1fr; }
}
</style>

<template>
  <div class="resource-detail-page hc-container">
    <div v-loading="loading">
      <EmptyState v-if="!detail" title="资源不存在或暂未发布" desc="该资源可能还在审核中，或者已经下架。" />
      <template v-else>
        <article class="hc-card detail minecraft-card">
          <img v-if="detail.coverUrl" :src="resolveFileUrl(detail.coverUrl)" class="cover" alt="cover" />
          <div class="body">
            <div class="top-meta">
              <span>{{ detail.categoryName }}</span>
              <span>作者：{{ detail.authorName }}</span>
              <span>下载：{{ detail.downloadCount }}</span>
              <span>点赞：{{ detail.likeCount }}</span>
            </div>
            <h1>{{ detail.title }}</h1>
            <p class="summary">{{ detail.summary }}</p>
            <div class="tags" v-if="detail.tags?.length">
              <RouterLink v-for="tag in detail.tags" :key="tag.id" :to="{ path: '/resources', query: { tagId: tag.id } }" class="tag-link"># {{ tag.name }}</RouterLink>
            </div>
            <div class="actions">
              <el-button type="primary" @click="handleDownload">下载资源</el-button>
              <el-button type="warning" plain @click="toggleFavorite">{{ detail.isFavorited ? '取消收藏' : '收藏资源' }}</el-button>
              <el-button plain @click="toggleLike">{{ detail.isLiked ? '取消点赞' : '点赞支持' }}</el-button>
            </div>
            <MarkdownPreview :content="detail.content" />
          </div>
        </article>

        <section class="hc-card minecraft-card sub-card">
          <h2>当前版本</h2>
          <div class="version-box">
            <div>版本号：{{ detail.currentVersion?.versionNo || detail.currentVersionNo || '未设置' }}</div>
            <div>支持版本：{{ detail.currentVersion?.mcVersions || detail.mcVersions || '未填写' }}</div>
            <div>下载方式：{{ detail.currentVersion?.downloadType || detail.downloadType || 'LINK' }}</div>
          </div>
          <h3>更新日志</h3>
          <MarkdownPreview :content="detail.currentVersion?.changelog || ''" />
        </section>

        <section v-if="detail.relatedResources?.length" class="hc-card minecraft-card sub-card">
          <div class="section-header">
            <h2>相关资源</h2>
            <RouterLink to="/resources">查看更多</RouterLink>
          </div>
          <div class="related-grid">
            <RouterLink v-for="item in detail.relatedResources" :key="item.id" :to="`/resources/${item.id}`" class="related-item">
              <div class="related-title">{{ item.title }}</div>
              <div class="related-meta">{{ item.categoryName }} · 下载 {{ item.downloadCount }}</div>
            </RouterLink>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import EmptyState from '@/components/common/EmptyState.vue'
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue'
import { resolveFileUrl } from '@/utils/file'
import { cancelFavoriteResourceApi, cancelLikeResourceApi, downloadResourceApi, favoriteResourceApi, getResourceDetailApi, likeResourceApi } from '@/api/resource'
import { useAuthStore } from '@/store/auth'
import type { ResourceDetailItem } from '@/types/resource'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const detail = ref<ResourceDetailItem | null>(null)
const resourceId = computed(() => String(route.params.id || ''))

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getResourceDetailApi(resourceId.value)
    detail.value = data
  } finally {
    loading.value = false
  }
}

const ensureLogin = () => {
  if (authStore.isLogin) return true
  router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
  return false
}

const toggleFavorite = async () => {
  if (!detail.value || !ensureLogin()) return
  if (detail.value.isFavorited) {
    await cancelFavoriteResourceApi(detail.value.id)
    detail.value.isFavorited = false
    detail.value.favoriteCount = Math.max((detail.value.favoriteCount || 1) - 1, 0)
  } else {
    await favoriteResourceApi(detail.value.id)
    detail.value.isFavorited = true
    detail.value.favoriteCount = (detail.value.favoriteCount || 0) + 1
  }
}

const toggleLike = async () => {
  if (!detail.value || !ensureLogin()) return
  if (detail.value.isLiked) {
    await cancelLikeResourceApi(detail.value.id)
    detail.value.isLiked = false
    detail.value.likeCount = Math.max((detail.value.likeCount || 1) - 1, 0)
  } else {
    await likeResourceApi(detail.value.id)
    detail.value.isLiked = true
    detail.value.likeCount = (detail.value.likeCount || 0) + 1
  }
}

const handleDownload = async () => {
  if (!detail.value) return
  const { data } = await downloadResourceApi(detail.value.id)
  const target = data.url || detail.value.downloadUrl || detail.value.fileUrl || detail.value.currentVersion?.downloadUrl || detail.value.currentVersion?.fileUrl
  if (target) window.open(resolveFileUrl(target), '_blank')
  ElMessage.success('已开始下载')
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.resource-detail-page { padding-top: 108px; padding-bottom: 48px; }
.detail { display: grid; grid-template-columns: 360px 1fr; gap: 22px; padding: 20px; }
.cover { width: 100%; border-radius: 18px; aspect-ratio: 16/10; object-fit: cover; }
.top-meta { display: flex; gap: 12px; flex-wrap: wrap; color: var(--hc-text-secondary); font-size: 13px; }
.summary { color: var(--hc-text-secondary); line-height: 1.8; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 4px; }
.tag-link { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: rgba(34, 197, 94, 0.1); color: #166534; text-decoration: none; font-size: 12px; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0; }
.sub-card { margin-top: 18px; padding: 20px; }
.version-box { display: grid; gap: 8px; color: var(--hc-text-secondary); margin-bottom: 14px; }
.section-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
.related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.related-item { padding: 14px; border-radius: 14px; background: rgba(15, 23, 42, 0.04); text-decoration: none; }
.related-title { color: var(--hc-text-primary); font-weight: 700; margin-bottom: 6px; }
.related-meta { color: var(--hc-text-secondary); font-size: 13px; }
@media (max-width: 900px) { .detail { grid-template-columns: 1fr; } }
</style>

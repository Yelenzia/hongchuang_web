<template>
  <div class="drafts-page">
    <div class="top-bar">
      <div>
        <div class="section-title">草稿箱</div>
        <div class="section-desc">这里会保存你的论坛发帖草稿和资源发布草稿，支持继续编辑与删除。</div>
      </div>
      <el-select v-model="draftType" clearable style="width: 180px" placeholder="全部草稿类型" @change="loadData">
        <el-option label="论坛帖子草稿" value="POST" />
        <el-option label="资源发布草稿" value="RESOURCE" />
      </el-select>
    </div>

    <div v-loading="loading">
      <EmptyState v-if="!rows.length" title="还没有草稿" desc="你可以在发帖页或资源发布页保存草稿，自动保存也会进入这里。" />
      <div v-else class="draft-list">
        <div v-for="item in rows" :key="item.id" class="hc-card draft-item minecraft-card">
          <div class="main">
            <div class="title">{{ item.title || '未命名草稿' }}</div>
            <div class="meta">
              <span>{{ item.draftType === 'POST' ? '论坛帖子' : '资源发布' }}</span>
              <span>场景：{{ item.sceneCode || '通用' }}</span>
              <span>更新时间：{{ item.updatedAt }}</span>
              <span>{{ item.autoSaved === 1 ? '自动保存' : '手动保存' }}</span>
            </div>
            <div class="summary">{{ item.summary || item.contentMarkdown?.slice(0, 120) || '暂无摘要' }}</div>
          </div>
          <div class="actions">
            <el-button type="primary" plain @click="continueEdit(item)">继续编辑</el-button>
            <el-button type="danger" plain @click="remove(item.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import { deleteDraftApi, getDraftListApi } from '@/api/content'
import type { ContentDraftItem } from '@/types/content'

const router = useRouter()
const loading = ref(false)
const rows = ref<ContentDraftItem[]>([])
const draftType = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getDraftListApi({ pageNo: 1, pageSize: 50, draftType: draftType.value || undefined })
    rows.value = data.list
  } finally {
    loading.value = false
  }
}

const continueEdit = (item: ContentDraftItem) => {
  if (item.draftType === 'RESOURCE') {
    router.push(`/resources/create?draftId=${item.id}`)
    return
  }
  router.push(`/post/create?draftId=${item.id}`)
}

const remove = async (draftId: string) => {
  await ElMessageBox.confirm('确定删除这份草稿吗？删除后无法恢复。', '删除草稿', { type: 'warning' })
  await deleteDraftApi(draftId)
  ElMessage.success('草稿已删除')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.top-bar { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
.section-title { font-size: 24px; font-weight: 700; }
.section-desc { color: var(--hc-text-secondary); margin-top: 6px; }
.draft-list { display: grid; gap: 14px; }
.draft-item { display: flex; justify-content: space-between; gap: 16px; padding: 18px; }
.title { font-size: 18px; font-weight: 700; }
.meta { display: flex; gap: 12px; flex-wrap: wrap; color: var(--hc-text-secondary); font-size: 13px; margin: 10px 0; }
.summary { color: var(--hc-text-secondary); line-height: 1.8; }
.actions { display: flex; gap: 10px; align-items: center; }
@media (max-width: 900px) {
  .top-bar, .draft-item { flex-direction: column; align-items: stretch; }
  .actions { justify-content: flex-end; }
}
</style>

<template>
  <div>
    <PageHeader title="草稿治理" desc="查看当前平台草稿与上传记录，便于清理异常内容与预留后续治理能力。" />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="草稿列表" name="drafts">
        <el-card>
          <div class="toolbar">
            <el-select v-model="draftType" clearable placeholder="草稿类型" style="width: 160px">
              <el-option label="论坛帖子草稿" value="POST" />
              <el-option label="资源草稿" value="RESOURCE" />
            </el-select>
            <el-input v-model="keyword" placeholder="搜索标题/摘要/正文" clearable style="width: 280px" />
            <el-button @click="loadDrafts">筛选</el-button>
          </div>
          <el-table v-loading="loadingDrafts" :data="draftRows">
            <el-table-column prop="title" label="标题" min-width="220" />
            <el-table-column prop="draftType" label="类型" min-width="100" />
            <el-table-column label="作者" min-width="160">
              <template #default="{ row }">{{ row.nickname || row.username || row.ownerUserId }}</template>
            </el-table-column>
            <el-table-column label="保存方式" min-width="100">
              <template #default="{ row }">{{ row.autoSaved === 1 ? '自动保存' : '手动保存' }}</template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="更新时间" min-width="180" />
            <el-table-column label="操作" min-width="120">
              <template #default="{ row }">
                <el-button link type="danger" @click="removeDraft(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="上传记录" name="uploads">
        <el-card>
          <div class="toolbar">
            <el-select v-model="bizType" clearable placeholder="业务类型" style="width: 180px">
              <el-option label="编辑器图片" value="EDITOR_IMAGE" />
              <el-option label="资源封面" value="RESOURCE_COVER" />
              <el-option label="帖子图片" value="POST_IMAGE" />
              <el-option label="附件" value="POST_FILE" />
            </el-select>
            <el-button @click="loadUploads">筛选</el-button>
          </div>
          <el-table v-loading="loadingUploads" :data="uploadRows">
            <el-table-column prop="fileName" label="文件名" min-width="220" />
            <el-table-column prop="bizType" label="业务类型" min-width="120" />
            <el-table-column label="上传用户" min-width="160">
              <template #default="{ row }">{{ row.nickname || row.username || row.userId || '匿名' }}</template>
            </el-table-column>
            <el-table-column prop="fileSize" label="大小" min-width="100" />
            <el-table-column prop="createdAt" label="上传时间" min-width="180" />
            <el-table-column label="文件地址" min-width="240">
              <template #default="{ row }">
                <a :href="row.fileUrl" target="_blank" rel="noopener noreferrer">{{ row.fileUrl }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { deleteAdminDraftApi, getAdminDraftListApi, getAdminUploadLogsApi } from '@/api/content'

const activeTab = ref('drafts')
const loadingDrafts = ref(false)
const loadingUploads = ref(false)
const draftRows = ref<any[]>([])
const uploadRows = ref<any[]>([])
const draftType = ref('')
const keyword = ref('')
const bizType = ref('')

const loadDrafts = async () => {
  loadingDrafts.value = true
  try {
    const { data } = await getAdminDraftListApi({ pageNo: 1, pageSize: 50, draftType: draftType.value || undefined, keyword: keyword.value || undefined })
    draftRows.value = data.records
  } finally {
    loadingDrafts.value = false
  }
}

const loadUploads = async () => {
  loadingUploads.value = true
  try {
    const { data } = await getAdminUploadLogsApi({ pageNo: 1, pageSize: 50, bizType: bizType.value || undefined })
    uploadRows.value = data.records
  } finally {
    loadingUploads.value = false
  }
}

const removeDraft = async (id: string) => {
  await ElMessageBox.confirm('确定删除这份草稿吗？', '删除草稿', { type: 'warning' })
  await deleteAdminDraftApi(id)
  ElMessage.success('草稿已删除')
  await loadDrafts()
}

onMounted(async () => {
  await loadDrafts()
  await loadUploads()
})
</script>

<style scoped lang="scss">
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
</style>

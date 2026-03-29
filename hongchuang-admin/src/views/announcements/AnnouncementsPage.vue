<template>
  <div>
    <PageHeader title="公告管理" desc="发布、编辑和下线官网与社区公告。">
      <el-button type="primary" @click="openCreate">发布公告</el-button>
    </PageHeader>

    <el-card>
      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.publishStatus === 2 ? 'success' : 'info'">{{ row.publishStatus === 2 ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="置顶" min-width="80">
          <template #default="{ row }">{{ row.isPinned === 1 ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column prop="publishedAt" label="发布时间" min-width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeRow(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑公告' : '发布公告'" width="620px">
      <el-form :model="form" label-position="top">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="摘要"><el-input v-model="form.summary" /></el-form-item>
        <el-form-item label="正文"><el-input v-model="form.content" type="textarea" :rows="8" /></el-form-item>
        <el-form-item label="是否置顶"><el-switch v-model="pinnedSwitch" /></el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="form.publishStatus" style="width: 100%">
            <el-option label="草稿" :value="1" />
            <el-option label="发布" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { createAnnouncementApi, deleteAnnouncementApi, getAnnouncementListApi, type AnnouncementRow, updateAnnouncementApi } from '@/api/announcements'

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<string | null>(null)
const rows = ref<AnnouncementRow[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const form = reactive({ title: '', summary: '', content: '', isPinned: 0, publishStatus: 1 })
const pinnedSwitch = computed({ get: () => form.isPinned === 1, set: (value: boolean) => { form.isPinned = value ? 1 : 0 } })

const resetForm = () => {
  editingId.value = null
  form.title = ''
  form.summary = ''
  form.content = ''
  form.isPinned = 0
  form.publishStatus = 1
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getAnnouncementListApi({ pageNo: pageNo.value, pageSize })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AnnouncementRow) => {
  editingId.value = row.id
  form.title = row.title
  form.summary = row.summary || ''
  form.content = row.content
  form.isPinned = row.isPinned
  form.publishStatus = row.publishStatus
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editingId.value) {
      await updateAnnouncementApi(editingId.value, form)
      ElMessage.success('公告已更新')
    } else {
      await createAnnouncementApi(form)
      ElMessage.success('公告已创建')
    }
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (id: string) => {
  await ElMessageBox.confirm('确定删除这条公告吗？', '删除确认', { type: 'warning' })
  await deleteAnnouncementApi(id)
  ElMessage.success('公告已删除')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div>
    <PageHeader title="内容模板管理" desc="管理论坛发帖模板和资源发布模板，控制启用状态与排序。">
      <el-button type="primary" @click="openCreate">新增模板</el-button>
    </PageHeader>

    <el-card>
      <div class="toolbar">
        <el-select v-model="templateType" clearable placeholder="模板类型" style="width: 160px">
          <el-option label="论坛模板" value="POST" />
          <el-option label="资源模板" value="RESOURCE" />
        </el-select>
        <el-select v-model="enabled" clearable placeholder="启用状态" style="width: 160px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索模板名/场景编码" clearable style="width: 260px" />
        <el-button @click="loadData">筛选</el-button>
      </div>

      <el-table v-loading="loading" :data="rows">
        <el-table-column prop="templateName" label="模板名称" min-width="180" />
        <el-table-column prop="templateType" label="类型" min-width="100" />
        <el-table-column prop="sceneCode" label="场景编码" min-width="140" />
        <el-table-column prop="sortOrder" label="排序" min-width="80" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.enabled === 1 ? 'success' : 'info'">{{ row.enabled === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" min-width="180" />
        <el-table-column label="操作" min-width="240">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row.id)">编辑</el-button>
            <el-button link @click="toggleEnabled(row)">{{ row.enabled === 1 ? '禁用' : '启用' }}</el-button>
            <el-button link type="danger" @click="remove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑模板' : '新增模板'" width="760px">
      <el-form :model="form" label-position="top">
        <div class="grid-2">
          <el-form-item label="模板名称"><el-input v-model="form.templateName" /></el-form-item>
          <el-form-item label="模板类型">
            <el-select v-model="form.templateType" style="width: 100%">
              <el-option label="论坛模板" value="POST" />
              <el-option label="资源模板" value="RESOURCE" />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid-2">
          <el-form-item label="场景编码"><el-input v-model="form.sceneCode" /></el-form-item>
          <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" /></el-form-item>
        </div>
        <el-form-item label="示例标题"><el-input v-model="form.titleExample" /></el-form-item>
        <el-form-item label="示例摘要"><el-input v-model="form.summaryExample" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="模板正文"><el-input v-model="form.contentMarkdown" type="textarea" :rows="14" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  createAdminTemplateApi,
  deleteAdminTemplateApi,
  getAdminTemplateDetailApi,
  getAdminTemplateListApi,
  toggleAdminTemplateApi,
  updateAdminTemplateApi
} from '@/api/content'

const loading = ref(false)
const submitting = ref(false)
const rows = ref<any[]>([])
const keyword = ref('')
const templateType = ref('')
const enabled = ref<number>()
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref('')
const form = reactive({
  templateName: '',
  templateType: 'POST',
  sceneCode: '',
  titleExample: '',
  summaryExample: '',
  contentMarkdown: '',
  enabled: 1,
  sortOrder: 0
})

const resetForm = () => {
  form.templateName = ''
  form.templateType = 'POST'
  form.sceneCode = ''
  form.titleExample = ''
  form.summaryExample = ''
  form.contentMarkdown = ''
  form.enabled = 1
  form.sortOrder = 0
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getAdminTemplateListApi({ pageNo: 1, pageSize: 50, templateType: templateType.value || undefined, keyword: keyword.value || undefined, enabled: enabled.value })
    rows.value = data.records
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  isEdit.value = false
  currentId.value = ''
  resetForm()
  dialogVisible.value = true
}

const openEdit = async (id: string) => {
  const { data } = await getAdminTemplateDetailApi(id)
  isEdit.value = true
  currentId.value = id
  form.templateName = data.templateName
  form.templateType = data.templateType
  form.sceneCode = data.sceneCode
  form.titleExample = data.titleExample || ''
  form.summaryExample = data.summaryExample || ''
  form.contentMarkdown = data.contentMarkdown || ''
  form.enabled = data.enabled || 1
  form.sortOrder = data.sortOrder || 0
  dialogVisible.value = true
}

const submit = async () => {
  submitting.value = true
  try {
    const payload = { ...form }
    if (isEdit.value) {
      await updateAdminTemplateApi(currentId.value, payload)
    } else {
      await createAdminTemplateApi(payload)
    }
    ElMessage.success('模板已保存')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const toggleEnabled = async (row: any) => {
  await toggleAdminTemplateApi(row.id, row.enabled === 1 ? 0 : 1)
  ElMessage.success('模板状态已更新')
  await loadData()
}

const remove = async (id: string) => {
  await ElMessageBox.confirm('确定删除这个模板吗？', '删除模板', { type: 'warning' })
  await deleteAdminTemplateApi(id)
  ElMessage.success('模板已删除')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }
</style>

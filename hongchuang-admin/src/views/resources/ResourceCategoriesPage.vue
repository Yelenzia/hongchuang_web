<template>
  <div>
    <PageHeader title="资源分类" desc="维护资源分类、排序、启用状态和说明文案。">
      <el-button type="primary" @click="openCreate">新建分类</el-button>
    </PageHeader>

    <el-card>
      <el-table v-loading="loading" :data="rows" border>
        <el-table-column prop="name" label="分类名称" min-width="160" />
        <el-table-column prop="slug" label="分类标识" min-width="160" />
        <el-table-column prop="description" label="分类说明" min-width="280" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column prop="resourceCount" label="资源数" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link @click="toggleStatus(row)">{{ row.status === 1 ? '停用' : '启用' }}</el-button>
            <el-button link type="danger" @click="removeRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑资源分类' : '新建资源分类'" width="520px">
      <el-form :model="form" label-position="top">
        <el-form-item label="分类名称"><el-input v-model="form.name" maxlength="30" show-word-limit /></el-form-item>
        <el-form-item label="分类标识"><el-input v-model="form.slug" maxlength="40" show-word-limit placeholder="例如 plugin-resource" /></el-form-item>
        <el-form-item label="分类说明"><el-input v-model="form.description" type="textarea" :rows="4" maxlength="200" show-word-limit /></el-form-item>
        <div class="grid-2">
          <el-form-item label="图标"><el-input v-model="form.icon" placeholder="可选：emoji 或图标名" /></el-form-item>
          <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="9999" style="width: 100%" /></el-form-item>
        </div>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
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
  createResourceCategoryApi,
  deleteResourceCategoryApi,
  getAdminResourceCategoriesApi,
  updateResourceCategoryApi,
  updateResourceCategoryStatusApi,
  type AdminResourceCategoryRow
} from '@/api/resources'

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<string | null>(null)
const rows = ref<AdminResourceCategoryRow[]>([])
const form = reactive({ name: '', slug: '', description: '', icon: '', sortOrder: 0, status: 1 })

const resetForm = () => {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.icon = ''
  form.sortOrder = 0
  form.status = 1
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getAdminResourceCategoriesApi()
    rows.value = data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AdminResourceCategoryRow) => {
  editingId.value = row.id
  form.name = row.name
  form.slug = row.slug
  form.description = row.description || ''
  form.icon = row.icon || ''
  form.sortOrder = row.sortOrder || 0
  form.status = row.status ?? 1
  dialogVisible.value = true
}

const submit = async () => {
  if (!form.name.trim() || !form.slug.trim()) {
    ElMessage.warning('请填写分类名称和分类标识')
    return
  }
  submitting.value = true
  try {
    const payload = { ...form }
    if (editingId.value) {
      await updateResourceCategoryApi(editingId.value, payload)
      ElMessage.success('分类已更新')
    } else {
      await createResourceCategoryApi(payload)
      ElMessage.success('分类已创建')
    }
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (row: AdminResourceCategoryRow) => {
  await updateResourceCategoryStatusApi(row.id, row.status === 1 ? 0 : 1)
  ElMessage.success('分类状态已更新')
  await loadData()
}

const removeRow = async (row: AdminResourceCategoryRow) => {
  await ElMessageBox.confirm(`确定删除分类「${row.name}」吗？`, '删除确认', { type: 'warning' })
  await deleteResourceCategoryApi(row.id)
  ElMessage.success('分类已删除')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
@media (max-width: 700px) { .grid-2 { grid-template-columns: 1fr; } }
</style>

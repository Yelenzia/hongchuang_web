<template>
  <div>
    <PageHeader title="板块管理" desc="维护论坛板块名称、说明与展示状态。">
      <el-button type="primary" @click="openCreate">新增板块</el-button>
    </PageHeader>

    <el-card>
      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="name" label="板块名称" min-width="160" />
        <el-table-column prop="slug" label="路由标识" min-width="160" />
        <el-table-column prop="postCount" label="帖子数" min-width="100" />
        <el-table-column label="是否公开" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.isPublic === 1 ? 'success' : 'info'">{{ row.isPublic === 1 ? '公开' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeRow(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑板块' : '新增板块'" width="520px">
      <el-form :model="form" label-position="top">
        <el-form-item label="板块名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="路由标识"><el-input v-model="form.slug" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="是否公开"><el-switch v-model="isPublicSwitch" /></el-form-item>
        <el-form-item label="是否启用"><el-switch v-model="statusSwitch" /></el-form-item>
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
import { createBoardApi, deleteBoardApi, getBoardListApi, type AdminBoardRow, updateBoardApi } from '@/api/boards'

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<string | null>(null)
const rows = ref<AdminBoardRow[]>([])
const form = reactive({ name: '', slug: '', description: '', sortOrder: 0, isPublic: 1, status: 1 })
const isPublicSwitch = computed({ get: () => form.isPublic === 1, set: (value: boolean) => { form.isPublic = value ? 1 : 0 } })
const statusSwitch = computed({ get: () => form.status === 1, set: (value: boolean) => { form.status = value ? 1 : 0 } })

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.description = ''
  form.sortOrder = 0
  form.isPublic = 1
  form.status = 1
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getBoardListApi()
    rows.value = data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AdminBoardRow) => {
  editingId.value = row.id
  form.name = row.name
  form.slug = row.slug
  form.description = row.description || ''
  form.sortOrder = row.sortOrder || 0
  form.isPublic = row.isPublic ?? 1
  form.status = row.status ?? 1
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editingId.value) {
      await updateBoardApi(editingId.value, form)
      ElMessage.success('板块已更新')
    } else {
      await createBoardApi(form)
      ElMessage.success('板块已创建')
    }
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (id: string) => {
  await ElMessageBox.confirm('确定删除这个板块吗？', '删除确认', { type: 'warning' })
  await deleteBoardApi(id)
  ElMessage.success('板块已删除')
  await loadData()
}

onMounted(loadData)
</script>

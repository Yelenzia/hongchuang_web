<template>
  <div>
    <PageHeader title="标签管理" desc="维护社区标签体系与热门标签入口。">
      <el-button type="primary" @click="openCreate">新增标签</el-button>
    </PageHeader>

    <el-card>
      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="name" label="标签名称" min-width="160" />
        <el-table-column prop="slug" label="标识" min-width="160" />
        <el-table-column prop="postCount" label="帖子数" min-width="100" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑标签' : '新增标签'" width="480px">
      <el-form :model="form" label-position="top">
        <el-form-item label="标签名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="标识"><el-input v-model="form.slug" /></el-form-item>
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
import { createTagApi, deleteTagApi, getTagListApi, type AdminTagRow, updateTagApi } from '@/api/tags'

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<string | null>(null)
const rows = ref<AdminTagRow[]>([])
const form = reactive({ name: '', slug: '', status: 1 })
const statusSwitch = computed({ get: () => form.status === 1, set: (value: boolean) => { form.status = value ? 1 : 0 } })

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.slug = ''
  form.status = 1
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getTagListApi()
    rows.value = data
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AdminTagRow) => {
  editingId.value = row.id
  form.name = row.name
  form.slug = row.slug
  form.status = row.status
  dialogVisible.value = true
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editingId.value) {
      await updateTagApi(editingId.value, form)
      ElMessage.success('标签已更新')
    } else {
      await createTagApi(form)
      ElMessage.success('标签已创建')
    }
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const removeRow = async (id: string) => {
  await ElMessageBox.confirm('确定删除这个标签吗？', '删除确认', { type: 'warning' })
  await deleteTagApi(id)
  ElMessage.success('标签已删除')
  await loadData()
}

onMounted(loadData)
</script>

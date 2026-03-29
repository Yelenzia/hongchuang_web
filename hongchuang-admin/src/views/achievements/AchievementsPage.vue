<template>
  <div>
    <PageHeader title="成就管理" desc="维护社区成就规则，用于用户成长展示与荣誉发放。" />

    <el-card>
      <div class="toolbar">
        <el-button type="primary" @click="openCreate">新增成就</el-button>
      </div>
      <el-table v-loading="loading" :data="rows">
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="code" label="编码" min-width="150" />
        <el-table-column prop="name" label="名称" min-width="140" />
        <el-table-column prop="description" label="说明" min-width="220" show-overflow-tooltip />
        <el-table-column prop="color" label="颜色" width="120" />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑成就' : '新增成就'" width="520px">
      <el-form label-position="top">
        <el-form-item label="编码"><el-input v-model="form.code" /></el-form-item>
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="图标标识"><el-input v-model="form.icon" /></el-form-item>
        <el-form-item label="颜色"><el-input v-model="form.color" placeholder="#22c55e" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { createAchievementApi, getAchievementListApi, updateAchievementApi, type AdminAchievementItem } from '@/api/achievements'

const loading = ref(false)
const submitting = ref(false)
const rows = ref<AdminAchievementItem[]>([])
const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const enabled = ref(true)
const form = reactive({
  code: '',
  name: '',
  description: '',
  icon: '',
  color: '#22c55e',
  sortOrder: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getAchievementListApi()
    rows.value = data
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editingId.value = null
  form.code = ''
  form.name = ''
  form.description = ''
  form.icon = ''
  form.color = '#22c55e'
  form.sortOrder = 0
  enabled.value = true
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (row: AdminAchievementItem) => {
  editingId.value = row.id
  form.code = row.code
  form.name = row.name
  form.description = row.description || ''
  form.icon = row.icon || ''
  form.color = row.color || '#22c55e'
  form.sortOrder = row.sortOrder
  enabled.value = row.status === 1
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = { ...form, status: enabled.value ? 1 : 0 }
    if (editingId.value) {
      await updateAchievementApi(editingId.value, payload)
      ElMessage.success('成就已更新')
    } else {
      await createAchievementApi(payload)
      ElMessage.success('成就已创建')
    }
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
</style>

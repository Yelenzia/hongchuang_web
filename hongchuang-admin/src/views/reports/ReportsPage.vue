<template>
  <div>
    <PageHeader title="举报处理" desc="查看用户举报并完成审核处理。" />

    <el-card>
      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="targetType" label="目标类型" min-width="100" />
        <el-table-column prop="targetId" label="目标ID" min-width="120" />
        <el-table-column prop="reasonType" label="举报类型" min-width="120" />
        <el-table-column prop="reasonDetail" label="说明" min-width="220" show-overflow-tooltip />
        <el-table-column label="处理状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'warning' : row.status === 2 ? 'success' : 'info'">
              {{ row.status === 1 ? '待处理' : row.status === 2 ? '已处理' : '已驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openHandle(row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="处理举报" width="480px">
      <el-form :model="form" label-position="top">
        <el-form-item label="处理结果">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="处理完成" :value="2" />
            <el-option label="驳回举报" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="form.handleNote" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitHandle">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { getReportListApi, handleReportApi, type AdminReportRow } from '@/api/reports'

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const currentId = ref<string | null>(null)
const rows = ref<AdminReportRow[]>([])
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const form = reactive({ status: 2, handleNote: '' })

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getReportListApi({ pageNo: pageNo.value, pageSize })
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

const openHandle = (row: AdminReportRow) => {
  currentId.value = row.id
  form.status = row.status === 1 ? 2 : row.status
  form.handleNote = row.handleNote || ''
  dialogVisible.value = true
}

const submitHandle = async () => {
  if (!currentId.value) return
  submitting.value = true
  try {
    await handleReportApi(currentId.value, form)
    ElMessage.success('举报处理完成')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
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

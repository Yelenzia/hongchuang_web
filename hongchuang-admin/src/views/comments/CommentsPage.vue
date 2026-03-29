<template>
  <div>
    <PageHeader title="评论管理" desc="处理评论区违规内容与社区互动质量。" />

    <el-card>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索评论内容" clearable style="width: 280px" @keyup.enter="handleSearch" />
        <el-button @click="handleSearch">筛选</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="postTitle" label="所属帖子" min-width="220" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" min-width="120" />
        <el-table-column prop="content" label="评论内容" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">{{ row.status === 1 ? '正常' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="removeComment(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { deleteCommentApi, getCommentListApi, type AdminCommentRow } from '@/api/comments'

const loading = ref(false)
const keyword = ref('')
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const rows = ref<AdminCommentRow[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getCommentListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  pageNo.value = 1
  await loadData()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

const removeComment = async (row: AdminCommentRow) => {
  await ElMessageBox.confirm('确定删除这条评论吗？', '删除确认', { type: 'warning' })
  await deleteCommentApi(row.id)
  ElMessage.success('评论已删除')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

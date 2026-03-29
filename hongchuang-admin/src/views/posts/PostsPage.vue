<template>
  <div>
    <PageHeader title="帖子管理" desc="管理帖子内容、推荐状态与违规处理。" />

    <el-card>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索标题或摘要" clearable style="width: 280px" @keyup.enter="handleSearch" />
        <el-select v-model="status" clearable placeholder="状态" style="width: 140px">
          <el-option label="已发布" :value="1" />
          <el-option label="已下架" :value="3" />
        </el-select>
        <el-button @click="handleSearch">筛选</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="title" label="标题" min-width="240" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" min-width="120" />
        <el-table-column prop="board" label="板块" min-width="120" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">{{ row.status === 1 ? '已发布' : '已下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推荐" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.isRecommended === 1 ? 'success' : 'info'">{{ row.isRecommended === 1 ? '已推荐' : '普通' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞" min-width="80" />
        <el-table-column prop="commentCount" label="评论" min-width="80" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row.id)">编辑</el-button>
            <el-button link type="primary" @click="toggleRecommend(row)">{{ row.isRecommended === 1 ? '取消推荐' : '推荐' }}</el-button>
            <el-button link @click="toggleStatus(row)">{{ row.status === 1 ? '下架' : '恢复' }}</el-button>
            <el-button link type="danger" @click="removePost(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑帖子" width="700px">
      <el-form v-loading="detailLoading" :model="form" label-position="top">
        <el-form-item label="所属板块">
          <el-select v-model="form.boardId" style="width: 100%">
            <el-option v-for="board in boards" :key="board.id" :label="board.name" :value="board.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" maxlength="150" show-word-limit />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" maxlength="300" show-word-limit />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tagIds" multiple collapse-tags style="width: 100%">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="form.contentMd" type="textarea" :rows="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { deletePostApi, getPostDetailApi, getPostListApi, recommendPostApi, type AdminPostRow, updatePostApi, updatePostStatusApi } from '@/api/posts'
import { getBoardListApi, type AdminBoardRow } from '@/api/boards'
import { getTagListApi, type AdminTagRow } from '@/api/tags'

const loading = ref(false)
const detailLoading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const currentPostId = ref<string | null>(null)
const keyword = ref('')
const status = ref<number | undefined>()
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const rows = ref<AdminPostRow[]>([])
const boards = ref<AdminBoardRow[]>([])
const tags = ref<AdminTagRow[]>([])
const form = reactive({ boardId: undefined as string | undefined, title: '', summary: '', contentMd: '', tagIds: [] as string[] })

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, status: status.value })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const loadMeta = async () => {
  const [{ data: boardData }, { data: tagData }] = await Promise.all([getBoardListApi(), getTagListApi()])
  boards.value = boardData
  tags.value = tagData
}

const handleSearch = async () => {
  pageNo.value = 1
  await loadData()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

const openEdit = async (postId: string) => {
  currentPostId.value = postId
  dialogVisible.value = true
  detailLoading.value = true
  try {
    await loadMeta()
    const { data } = await getPostDetailApi(postId)
    form.boardId = data.boardId
    form.title = data.title
    form.summary = data.summary || ''
    form.contentMd = data.contentMd
    form.tagIds = data.tags.map(tag => tag.id)
  } finally {
    detailLoading.value = false
  }
}

const submitEdit = async () => {
  if (!currentPostId.value || !form.boardId || !form.title.trim() || !form.contentMd.trim()) {
    ElMessage.warning('请补全帖子标题、板块和正文')
    return
  }
  submitting.value = true
  try {
    await updatePostApi(currentPostId.value, {
      boardId: form.boardId,
      title: form.title,
      summary: form.summary,
      contentMd: form.contentMd,
      tagIds: form.tagIds
    })
    ElMessage.success('帖子已更新')
    dialogVisible.value = false
    await loadData()
  } finally {
    submitting.value = false
  }
}

const toggleRecommend = async (row: AdminPostRow) => {
  await recommendPostApi(row.id, row.isRecommended !== 1)
  ElMessage.success('推荐状态已更新')
  await loadData()
}

const toggleStatus = async (row: AdminPostRow) => {
  await updatePostStatusApi(row.id, row.status === 1 ? 3 : 1)
  ElMessage.success('帖子状态已更新')
  await loadData()
}

const removePost = async (row: AdminPostRow) => {
  await ElMessageBox.confirm(`确定删除帖子《${row.title}》吗？`, '删除确认', { type: 'warning' })
  await deletePostApi(row.id)
  ElMessage.success('帖子已删除')
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

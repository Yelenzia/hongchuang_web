<template>
  <div>
    <PageHeader title="通知治理" desc="查看收藏、评论、@提醒、关注等通知数据，并清理异常通知。" />

    <el-card>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索通知标题或内容" clearable style="width: 280px" @keyup.enter="handleSearch" />
        <el-select v-model="type" clearable placeholder="通知类型" style="width: 180px">
          <el-option label="帖子收藏" value="POST_FAVORITE" />
          <el-option label="帖子评论" value="POST_COMMENT" />
          <el-option label="评论回复" value="COMMENT_REPLY" />
          <el-option label="@提醒" value="COMMENT_MENTION" />
          <el-option label="用户关注" value="USER_FOLLOW" />
          <el-option label="私信" value="PRIVATE_MESSAGE" />
          <el-option label="系统消息" value="SYSTEM_WARNING" />
        </el-select>
        <el-select v-model="isRead" clearable placeholder="读取状态" style="width: 140px">
          <el-option label="未读" :value="0" />
          <el-option label="已读" :value="1" />
        </el-select>
        <el-button @click="handleSearch">筛选</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="150" />
        <el-table-column label="接收用户" min-width="180">
          <template #default="{ row }">
            {{ row.nickname || row.username || '-' }}
            <span v-if="row.username" class="sub">@{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="150" />
        <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.isRead === 1 ? 'success' : 'warning'">{{ row.isRead === 1 ? '已读' : '未读' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row.id)">清理</el-button>
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
import { deleteNotificationApi, getNotificationListApi, type AdminNotificationRow } from '@/api/notifications'

const loading = ref(false)
const keyword = ref('')
const type = ref<string | undefined>()
const isRead = ref<number | undefined>()
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const rows = ref<AdminNotificationRow[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getNotificationListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, type: type.value, isRead: isRead.value })
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

const handleDelete = async (notificationId: string) => {
  await ElMessageBox.confirm('确定清理这条通知吗？', '清理确认', { type: 'warning' })
  await deleteNotificationApi(notificationId)
  ElMessage.success('通知已清理')
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pager { margin-top: 16px; display: flex; justify-content: flex-end; }
.sub { margin-left: 8px; color: var(--admin-sub); font-size: 12px; }
</style>

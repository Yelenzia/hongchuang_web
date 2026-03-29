<template>
  <div>
    <PageHeader title="资源管理" desc="处理资源审核、推荐位、上下架和内容巡检。" />

    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-label">资源总数</div>
        <div class="stat-value">{{ stats.totalResources }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">已发布</div>
        <div class="stat-value">{{ stats.publishedResources }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">待审核</div>
        <div class="stat-value warning">{{ stats.pendingResources }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-label">累计下载</div>
        <div class="stat-value">{{ stats.totalDownloads }}</div>
      </el-card>
    </div>

    <el-card>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索标题 / 作者" clearable style="width: 240px" @keyup.enter="handleSearch" />
        <el-select v-model="categoryId" clearable placeholder="资源分类" style="width: 180px">
          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="status" clearable placeholder="资源状态" style="width: 180px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">筛选</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" border>
        <el-table-column prop="title" label="资源标题" min-width="260">
          <template #default="{ row }">
            <div class="title-cell">
              <div class="title-text">{{ row.title }}</div>
              <div class="meta-text">{{ row.authorName }} · {{ row.categoryName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currentVersionNo" label="版本号" min-width="110" />
        <el-table-column prop="mcVersions" label="支持版本" min-width="140" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="90">
          <template #default="{ row }">
            <el-tag :type="row.isRecommended === 1 ? 'success' : 'info'">{{ row.isRecommended === 1 ? '已推荐' : '普通' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="downloadCount" label="下载" width="90" />
        <el-table-column prop="commentCount" label="评论" width="90" />
        <el-table-column prop="createdAt" label="创建时间" min-width="170" />
        <el-table-column label="操作" min-width="360" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row.id)">详情</el-button>
            <el-button link type="primary" @click="toggleRecommend(row)">{{ row.isRecommended === 1 ? '取消推荐' : '设为推荐' }}</el-button>
            <el-button v-if="row.status === 1" link type="success" @click="approve(row)">通过</el-button>
            <el-button v-if="row.status === 1" link type="warning" @click="reject(row)">驳回</el-button>
            <el-button v-if="row.status === 2" link @click="changeStatus(row, 3)">下架</el-button>
            <el-button v-if="row.status === 3" link @click="changeStatus(row, 2)">恢复</el-button>
            <el-button v-if="row.status !== 4" link type="danger" @click="changeStatus(row, 4)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="资源详情" size="720px">
      <div v-loading="detailLoading" class="detail-wrap" v-if="detail">
        <div class="detail-head">
          <div>
            <div class="detail-title">{{ detail.title }}</div>
            <div class="detail-sub">{{ detail.authorName }} · {{ detail.categoryName }} · {{ statusText(detail.status) }}</div>
          </div>
          <el-tag :type="detail.isRecommended === 1 ? 'success' : 'info'">{{ detail.isRecommended === 1 ? '推荐中' : '普通' }}</el-tag>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="版本号">{{ detail.currentVersion?.versionNo || detail.currentVersionNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="支持版本">{{ detail.currentVersion?.mcVersions || detail.mcVersions || '-' }}</el-descriptions-item>
          <el-descriptions-item label="下载方式">{{ detail.currentVersion?.downloadType || detail.downloadType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="下载量 / 浏览量">{{ detail.downloadCount }} / {{ detail.viewCount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="审核备注" :span="2">{{ detail.auditRemark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">{{ detail.tags?.length ? detail.tags.map(item => item.name).join('、') : '暂无' }}</el-descriptions-item>
          <el-descriptions-item label="资源简介" :span="2">{{ detail.summary || '-' }}</el-descriptions-item>
        </el-descriptions>
        <div class="content-block">
          <div class="content-title">正文</div>
          <pre class="content-text">{{ detail.content || '暂无内容' }}</pre>
        </div>
        <div class="content-block" v-if="detail.versions?.length">
          <div class="content-title">版本记录</div>
          <el-timeline>
            <el-timeline-item v-for="item in detail.versions" :key="item.id || item.versionNo" :timestamp="item.createdAt || '-'">
              <div class="version-title">{{ item.versionNo || '-' }} · {{ item.mcVersions || '未填写支持版本' }}</div>
              <div class="version-text">{{ item.changelog || '暂无更新日志' }}</div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  auditResourceApi,
  getAdminResourceCategoriesApi,
  getResourceDetailApi,
  getResourceListApi,
  getResourceStatsApi,
  updateResourceRecommendApi,
  updateResourceStatusApi,
  type AdminResourceCategoryRow,
  type AdminResourceDetail,
  type AdminResourceRow,
  type AdminResourceStats
} from '@/api/resources'

const statusOptions = [
  { label: '草稿', value: 0 },
  { label: '待审核', value: 1 },
  { label: '已发布', value: 2 },
  { label: '已下架', value: 3 },
  { label: '已删除', value: 4 }
]

const loading = ref(false)
const detailLoading = ref(false)
const detailVisible = ref(false)
const keyword = ref('')
const categoryId = ref<string | undefined>()
const status = ref<number | undefined>()
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const rows = ref<AdminResourceRow[]>([])
const categories = ref<AdminResourceCategoryRow[]>([])
const detail = ref<AdminResourceDetail | null>(null)
const stats = reactive<AdminResourceStats>({ totalResources: 0, publishedResources: 0, pendingResources: 0, totalDownloads: 0, totalViews: 0 })

const statusText = (value?: number) => statusOptions.find(item => item.value === value)?.label || '未知'
const statusTagType = (value?: number) => ({ 0: 'info', 1: 'warning', 2: 'success', 3: '', 4: 'danger' }[value ?? -1] || 'info')

const loadMeta = async () => {
  const { data } = await getAdminResourceCategoriesApi()
  categories.value = data
}

const loadStats = async () => {
  const { data } = await getResourceStatsApi()
  Object.assign(stats, data)
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getResourceListApi({
      pageNo: pageNo.value,
      pageSize,
      keyword: keyword.value || undefined,
      categoryId: categoryId.value,
      status: status.value
    })
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

const resetSearch = async () => {
  keyword.value = ''
  categoryId.value = undefined
  status.value = undefined
  pageNo.value = 1
  await loadData()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

const openDetail = async (resourceId: string) => {
  detailVisible.value = true
  detailLoading.value = true
  try {
    const { data } = await getResourceDetailApi(resourceId)
    detail.value = data
  } finally {
    detailLoading.value = false
  }
}

const approve = async (row: AdminResourceRow) => {
  await auditResourceApi(row.id, { pass: true, remark: '后台审核通过' })
  ElMessage.success('资源已审核通过')
  await Promise.all([loadData(), loadStats()])
}

const reject = async (row: AdminResourceRow) => {
  const { value } = await ElMessageBox.prompt(`请填写驳回《${row.title}》的原因`, '驳回资源', {
    confirmButtonText: '提交驳回',
    cancelButtonText: '取消',
    inputPlaceholder: '例如：封面缺失、下载地址无效、说明过少'
  })
  await auditResourceApi(row.id, { pass: false, remark: value || '请完善后重新提交' })
  ElMessage.success('资源已驳回')
  await Promise.all([loadData(), loadStats()])
}

const changeStatus = async (row: AdminResourceRow, nextStatus: number) => {
  const actionText = statusText(nextStatus)
  await ElMessageBox.confirm(`确定将资源《${row.title}》改为${actionText}吗？`, '状态确认', { type: 'warning' })
  await updateResourceStatusApi(row.id, nextStatus)
  ElMessage.success('资源状态已更新')
  await Promise.all([loadData(), loadStats()])
}

const toggleRecommend = async (row: AdminResourceRow) => {
  await updateResourceRecommendApi(row.id, row.isRecommended !== 1)
  ElMessage.success('推荐状态已更新')
  await loadData()
}

onMounted(async () => {
  await Promise.all([loadMeta(), loadStats(), loadData()])
})
</script>

<style scoped lang="scss">
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 18px; }
.stat-card { border-radius: 18px; }
.stat-label { color: var(--admin-sub); margin-bottom: 10px; }
.stat-value { font-size: 30px; font-weight: 700; }
.stat-value.warning { color: #d97706; }
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.title-cell { display: grid; gap: 6px; }
.title-text { font-weight: 600; }
.meta-text { font-size: 12px; color: var(--admin-sub); }
.pager { margin-top: 16px; display: flex; justify-content: flex-end; }
.detail-wrap { display: grid; gap: 18px; }
.detail-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.detail-title { font-size: 22px; font-weight: 700; }
.detail-sub { margin-top: 8px; color: var(--admin-sub); }
.content-block { display: grid; gap: 10px; }
.content-title { font-size: 16px; font-weight: 700; }
.content-text { white-space: pre-wrap; background: #f8fafc; border-radius: 16px; padding: 14px; margin: 0; line-height: 1.8; }
.version-title { font-weight: 600; margin-bottom: 6px; }
.version-text { color: var(--admin-sub); white-space: pre-wrap; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .stats-grid { grid-template-columns: 1fr; } }
</style>

<template>
  <div class="hc-container ann-page">
    <div class="page-head">
      <div>
        <div class="badge">公告中心</div>
        <h1>工作室公告与社区动态</h1>
        <p>查看鸿创工作室最新的产品进展、平台公告和社区通知。</p>
      </div>
    </div>

    <div v-loading="loading" class="ann-list">
      <RouterLink v-for="item in list" :key="item.id" :to="`/announcements/${item.id}`" class="hc-card ann-card">
        <div class="card-top">
          <el-tag size="small" :type="item.isPinned === 1 ? 'primary' : 'info'">{{ item.isPinned === 1 ? '置顶' : '公告' }}</el-tag>
          <span class="time">{{ item.publishedAt || item.createdAt }}</span>
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="summary">{{ item.summary || item.content }}</div>
      </RouterLink>
    </div>

    <div class="pager" v-if="total > pageSize">
      <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAnnouncementListApi, type AnnouncementItem } from '@/api/announcement'

const loading = ref(false)
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const list = ref<AnnouncementItem[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getAnnouncementListApi({ pageNo: pageNo.value, pageSize })
    list.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.ann-page {
  padding-top: 108px;
  padding-bottom: 48px;
}
.badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(18, 181, 203, 0.08);
  color: var(--hc-primary-deep);
  font-weight: 700;
}
.page-head h1 {
  margin: 16px 0 10px;
}
.page-head p {
  color: var(--hc-text-secondary);
}
.ann-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ann-card {
  padding: 20px;
}
.card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: var(--hc-text);
  margin-bottom: 10px;
}
.summary, .time {
  color: var(--hc-text-secondary);
  line-height: 1.8;
}
.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="hc-container ann-detail-page">
    <article v-loading="loading" class="hc-card ann-detail">
      <template v-if="announcement">
        <div class="meta">
          <el-tag size="small" :type="announcement.isPinned === 1 ? 'primary' : 'info'">{{ announcement.isPinned === 1 ? '置顶公告' : '公告' }}</el-tag>
          <span>{{ announcement.publishedAt || announcement.createdAt }}</span>
        </div>
        <h1>{{ announcement.title }}</h1>
        <p v-if="announcement.summary" class="summary">{{ announcement.summary }}</p>
        <div class="content" v-html="announcement.content"></div>
      </template>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAnnouncementDetailApi, type AnnouncementItem } from '@/api/announcement'

const route = useRoute()
const loading = ref(false)
const announcement = ref<AnnouncementItem | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getAnnouncementDetailApi(String(route.params.id || ''))
    announcement.value = data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.ann-detail-page {
  padding-top: 108px;
  padding-bottom: 48px;
}
.ann-detail {
  padding: 28px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--hc-text-secondary);
}
h1 {
  margin: 18px 0 12px;
  font-size: 36px;
}
.summary {
  margin: 0 0 18px;
  color: var(--hc-text-secondary);
  line-height: 1.8;
  font-size: 16px;
}
.content {
  line-height: 1.9;
}
</style>

<template>
  <div class="notification-page" v-loading="loading">
    <div class="top-bar">
      <div>
        <div class="section-title">消息中心</div>
        <div class="sub">收藏、评论、回复、@提醒、关注、私信和系统消息都会出现在这里。</div>
      </div>
      <el-button plain @click="readAll">全部已读</el-button>
    </div>
    <div class="list">
      <div v-for="item in items" :key="item.id" class="hc-card notice-item minecraft-card" :class="{ unread: item.isRead === 0 }">
        <div class="notice-head">
          <div>
            <strong>{{ item.title }}</strong>
            <span class="type">{{ getTypeLabel(item.type) }}</span>
          </div>
          <span>{{ item.createdAt }}</span>
        </div>
        <div class="content">{{ item.content }}</div>
        <div class="actions">
          <el-button v-if="item.isRead === 0" link type="primary" @click="readOne(item.id)">标记已读</el-button>
          <RouterLink v-if="resolveNotificationLink(item)" :to="resolveNotificationLink(item)!">查看详情</RouterLink>
        </div>
      </div>
      <div v-if="!loading && items.length === 0" class="hc-card empty-card">暂无消息通知</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getNotificationListApi, markAllNotificationReadApi, markNotificationReadApi } from '@/api/notification'
import { useAppStore } from '@/store/app'
import type { NotificationItem } from '@/types/forum'

const appStore = useAppStore()
const loading = ref(false)
const items = ref<NotificationItem[]>([])

const typeLabelMap: Record<string, string> = {
  POST_FAVORITE: '帖子收藏',
  POST_COMMENT: '帖子评论',
  COMMENT_REPLY: '评论回复',
  COMMENT_MENTION: '@提醒',
  USER_FOLLOW: '用户关注',
  PRIVATE_MESSAGE: '私信',
  SYSTEM_DELETE_POST: '删帖通知',
  SYSTEM_POST_STATUS: '帖子状态',
  SYSTEM_WARNING: '系统警告',
  SYSTEM_BAN: '账号封禁',
  SYSTEM_UNBAN: '账号解封'
}

const getTypeLabel = (type: string) => typeLabelMap[type] || type

const resolveNotificationLink = (item: NotificationItem) => {
  if (!item.relatedId) return ''
  if (item.relatedType === 'POST') return `/post/${item.relatedId}`
  if (item.relatedType === 'USER') return `/user/${item.relatedId}`
  return ''
}

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getNotificationListApi()
    items.value = data
    await appStore.refreshUnreadCount()
  } finally {
    loading.value = false
  }
}

const readOne = async (id: string) => {
  await markNotificationReadApi(id)
  ElMessage.success('已标记为已读')
  await loadData()
}

const readAll = async () => {
  await markAllNotificationReadApi()
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.notification-page { display: flex; flex-direction: column; gap: 16px; }
.top-bar { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
.section-title { font-size: 22px; font-weight: 700; }
.sub { color: var(--hc-text-secondary); margin-top: 6px; }
.list { display: flex; flex-direction: column; gap: 12px; }
.notice-item { padding: 18px; border-left: 4px solid transparent; }
.notice-item.unread { border-left-color: #0ea5b7; background: rgba(14,165,183,.04); }
.notice-head { display: flex; justify-content: space-between; gap: 12px; color: var(--hc-text-secondary); }
.type { margin-left: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(34,197,94,.1); color: #166534; font-size: 12px; font-weight: 700; }
.content { margin-top: 10px; line-height: 1.8; }
.actions { margin-top: 10px; display: flex; gap: 12px; }
.empty-card { padding: 28px; text-align: center; color: var(--hc-text-secondary); }
</style>

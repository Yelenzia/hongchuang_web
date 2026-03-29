<template>
  <div class="wechat-page">
    <div class="wechat-shell hc-card">
      <aside class="wechat-sidebar" :class="{ 'mobile-hidden': targetUserId && !showSessionListOnMobile }">
        <div class="sidebar-header">
          <div>
            <div class="sidebar-title">私信</div>
            <div class="sidebar-sub">像聊天软件一样查看最近会话与历史消息</div>
          </div>
          <div class="sidebar-unread">{{ unreadSessionCount }} 未读</div>
        </div>

        <div class="sidebar-search">
          <el-input
            v-model="sessionKeyword"
            clearable
            placeholder="搜索会话"
            @input="loadSessions"
          />
        </div>

        <div class="sidebar-search">
          <el-select
            v-model="searchUserId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="搜索用户并发起新聊天"
            :remote-method="remoteSearchUsers"
            :loading="searchingUsers"
            style="width: 100%"
            @change="handleSelectUser"
          >
            <el-option
              v-for="item in searchResults"
              :key="item.userId"
              :label="`${item.nickname} (@${item.username})`"
              :value="item.userId"
            >
              <div class="user-option">
                <div class="user-option-main">
                  <el-avatar :size="30" :src="item.avatarUrl || undefined">{{ getAvatarText(item.nickname || item.username) }}</el-avatar>
                  <div>
                    <div class="user-option-name">{{ item.nickname }}</div>
                    <div class="user-option-sub">@{{ item.username }}</div>
                  </div>
                </div>
                <span class="user-option-level">Lv.{{ item.userLevel || 1 }}</span>
              </div>
            </el-option>
          </el-select>
        </div>

        <div class="session-list" v-loading="sessionsLoading">
          <template v-if="sessions.length">
            <button
              v-for="item in sessions"
              :key="item.targetUserId"
              class="session-item"
              :class="{ active: item.targetUserId === targetUserId }"
              @click="selectSession(item)"
            >
              <el-avatar class="session-avatar" :size="44" :src="item.avatarUrl || undefined">{{ getAvatarText(item.nickname || item.username) }}</el-avatar>
              <div class="session-content">
                <div class="session-row session-row-top">
                  <span class="session-name">{{ item.nickname || item.username }}</span>
                  <span class="session-time">{{ formatSessionTime(item.lastMessageTime) }}</span>
                </div>
                <div class="session-row session-row-bottom">
                  <span class="session-preview">{{ item.lastMessageContent || '发一条消息，开始聊天吧' }}</span>
                  <el-badge v-if="item.unreadCount > 0" :value="item.unreadCount" :max="99" />
                </div>
              </div>
            </button>
          </template>
          <div v-else class="empty-state">
            <div class="empty-state-icon">💬</div>
            <div class="empty-state-title">还没有聊天</div>
            <div class="empty-state-sub">去用户主页发起第一条私信吧。</div>
          </div>
        </div>
      </aside>

      <section class="wechat-chat" :class="{ 'mobile-visible': targetUserId && !showSessionListOnMobile }">
        <template v-if="activeSession">
          <header class="chat-header">
            <div class="chat-user-wrap">
              <button class="mobile-back" type="button" @click="showSessionListOnMobile = true">‹</button>
              <el-avatar :size="42" :src="activeSession.avatarUrl || undefined">{{ getAvatarText(activeSession.nickname || activeSession.username) }}</el-avatar>
              <div class="chat-user-meta">
                <div class="chat-user-name">{{ activeSession.nickname || activeSession.username }}</div>
                <div class="chat-user-sub">@{{ activeSession.username }}<span v-if="activeSession.signature"> · {{ activeSession.signature }}</span></div>
              </div>
            </div>
            <RouterLink :to="`/user/${activeSession.targetUserId}`" class="profile-link">查看主页</RouterLink>
          </header>

          <div class="chat-scroll" ref="messageContainerRef" @scroll="handleMessageScroll" v-loading="loadingConversation">
            <template v-if="displayMessages.length">
              <template v-for="item in displayMessages" :key="item.key">
                <div v-if="item.type === 'time'" class="time-divider">{{ item.label }}</div>
                <div
                  v-else
                  class="message-row"
                  :class="{ mine: item.message.fromUserId === currentUserId }"
                >
                  <el-avatar
                    v-if="item.message.fromUserId !== currentUserId"
                    class="bubble-avatar"
                    :size="36"
                    :src="activeSession.avatarUrl || undefined"
                  >
                    {{ getAvatarText(activeSession.nickname || activeSession.username) }}
                  </el-avatar>

                  <div class="bubble-group">
                    <div class="bubble" :class="{ mine: item.message.fromUserId === currentUserId }">
                      <div class="bubble-content">{{ item.message.content }}</div>
                    </div>
                    <div class="bubble-meta" :class="{ mine: item.message.fromUserId === currentUserId }">
                      <span>{{ formatMessageTime(item.message.createdAt) }}</span>
                      <span v-if="item.message.fromUserId === currentUserId">{{ Number(item.message.isRead || 0) === 1 ? '已读' : '已发送' }}</span>
                    </div>
                  </div>

                  <el-avatar
                    v-if="item.message.fromUserId === currentUserId"
                    class="bubble-avatar"
                    :size="36"
                    :src="authStore.userInfo?.avatarUrl || undefined"
                  >
                    {{ getAvatarText(authStore.userInfo?.nickname || authStore.userInfo?.username || '我') }}
                  </el-avatar>
                </div>
              </template>
            </template>

            <div v-else class="empty-chat-state">
              <div class="empty-state-icon">👋</div>
              <div class="empty-state-title">开始聊天吧</div>
              <div class="empty-state-sub">给 {{ activeSession.nickname || activeSession.username }} 发第一条消息。</div>
            </div>
          </div>

          <footer class="chat-composer">
            <div class="composer-toolbar">
              <span>Enter 发送</span>
              <span>Shift + Enter 换行</span>
            </div>
            <el-input
              v-model="content"
              type="textarea"
              resize="none"
              :rows="4"
              maxlength="1000"
              show-word-limit
              placeholder="输入消息..."
              @keydown="handleComposerKeydown"
            />
            <div class="composer-actions">
              <span class="composer-tip">仅支持文字消息，已自动同步历史会话。</span>
              <el-button type="primary" :loading="sending" :disabled="!canSend" @click="sendMessage">发送</el-button>
            </div>
          </footer>
        </template>

        <div v-else class="empty-chat-state whole">
          <div class="empty-state-icon">📨</div>
          <div class="empty-state-title">选择一个会话</div>
          <div class="empty-state-sub">左侧选择聊天，或者先搜索用户发起新消息。</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getConversationApi, getPrivateMessageSessionsApi, sendPrivateMessageApi } from '@/api/notification'
import { getUserProfileApi, searchUsersApi } from '@/api/user'
import type { PrivateMessageItem, PrivateMessageSessionItem, UserSearchItem } from '@/types/forum'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'

interface TimeDividerItem {
  type: 'time'
  key: string
  label: string
}

interface BubbleItem {
  type: 'message'
  key: string
  message: PrivateMessageItem
}

const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const targetUserId = ref('')
const targetUsername = ref('')
const searchUserId = ref('')
const content = ref('')
const loadingConversation = ref(false)
const sessionsLoading = ref(false)
const searchingUsers = ref(false)
const sending = ref(false)
const sessionKeyword = ref('')
const messages = ref<PrivateMessageItem[]>([])
const sessions = ref<PrivateMessageSessionItem[]>([])
const searchResults = ref<UserSearchItem[]>([])
const messageContainerRef = ref<HTMLDivElement | null>(null)
const showSessionListOnMobile = ref(true)
let refreshTimer: number | undefined

const normalizeId = (value: string | number | null | undefined) => value == null ? '' : String(value)

const normalizeSession = (item: PrivateMessageSessionItem): PrivateMessageSessionItem => ({
  ...item,
  targetUserId: normalizeId(item.targetUserId),
  lastMessageId: item.lastMessageId == null ? null : String(item.lastMessageId),
  unreadCount: Number(item.unreadCount || 0)
})

const normalizeMessage = (item: PrivateMessageItem): PrivateMessageItem => ({
  ...item,
  id: normalizeId(item.id),
  fromUserId: normalizeId(item.fromUserId),
  toUserId: normalizeId(item.toUserId),
  isRead: Number(item.isRead || 0)
})

const currentUserId = computed(() => normalizeId(authStore.userInfo?.id))
const activeSession = computed(() => sessions.value.find(item => targetUserId.value && item.targetUserId === targetUserId.value) || sessions.value.find(item => targetUsername.value && item.username === targetUsername.value) || null)
const unreadSessionCount = computed(() => sessions.value.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0))
const activeTargetUserId = computed(() => normalizeId(activeSession.value?.targetUserId || targetUserId.value))
const activeTargetUsername = computed(() => (activeSession.value?.username || targetUsername.value || '').trim())
const canSend = computed(() => Boolean((activeTargetUserId.value || activeTargetUsername.value) && content.value.trim() && !sending.value))

const getAvatarText = (name?: string | null) => {
  const text = (name || '').trim()
  return text ? text.slice(-2) : '聊'
}

const formatSessionTime = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  if (startOfToday === startOfTarget) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  if (startOfToday - startOfTarget === 24 * 60 * 60 * 1000) {
    return '昨天'
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString('zh-CN', { weekday: 'short' })
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const formatMessageTime = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const formatDividerTime = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const timeText = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (startOfToday === startOfTarget) {
    return `今天 ${timeText}`
  }
  if (startOfToday - startOfTarget === 24 * 60 * 60 * 1000) {
    return `昨天 ${timeText}`
  }
  return `${date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} ${timeText}`
}

const displayMessages = computed<(TimeDividerItem | BubbleItem)[]>(() => {
  const result: (TimeDividerItem | BubbleItem)[] = []
  let previousTimestamp = 0
  messages.value.forEach((message) => {
    const currentTimestamp = new Date(message.createdAt).getTime()
    if (!previousTimestamp || Number.isNaN(currentTimestamp) || currentTimestamp - previousTimestamp > 5 * 60 * 1000) {
      result.push({
        type: 'time',
        key: `time-${message.id}`,
        label: formatDividerTime(message.createdAt)
      })
    }
    result.push({
      type: 'message',
      key: `msg-${message.id}`,
      message
    })
    previousTimestamp = currentTimestamp
  })
  return result
})

const isNearBottom = () => {
  const el = messageContainerRef.value
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight < 120
}

const scrollToBottom = async (force = false) => {
  await nextTick()
  const el = messageContainerRef.value
  if (!el) return
  if (force || isNearBottom()) {
    el.scrollTop = el.scrollHeight
  }
}

const handleMessageScroll = () => {
  // 预留滚动状态判断，当前逻辑由 scrollToBottom 内部判断是否贴底
}

const ensureSessionPlaceholderById = async (userId: string) => {
  const normalizedUserId = normalizeId(userId)
  if (!normalizedUserId || sessions.value.some(item => item.targetUserId === normalizedUserId)) {
    return
  }
  try {
    const { data } = await getUserProfileApi(normalizedUserId)
    sessions.value = [
      {
        targetUserId: normalizeId(data.userId),
        username: data.username,
        nickname: data.nickname,
        avatarUrl: data.avatarUrl,
        signature: data.signature,
        userLevel: data.userLevel,
        lastMessageContent: '',
        lastMessageTime: null,
        lastMessageId: null,
        unreadCount: 0
      },
      ...sessions.value
    ]
    targetUserId.value = normalizeId(data.userId)
    targetUsername.value = data.username || ''
  } catch {
    // 忽略占位会话加载失败
  }
}

const ensureSessionPlaceholderByUsername = async (username: string) => {
  const normalizedUsername = (username || '').trim()
  if (!normalizedUsername || sessions.value.some(item => item.username === normalizedUsername)) {
    return
  }
  try {
    const { data } = await searchUsersApi({ keyword: normalizedUsername, limit: 10 })
    const matched = (Array.isArray(data) ? data : []).find(item => item.username === normalizedUsername)
    if (!matched) return
    sessions.value = [
      {
        targetUserId: normalizeId(matched.userId),
        username: matched.username,
        nickname: matched.nickname,
        avatarUrl: matched.avatarUrl,
        signature: matched.signature,
        userLevel: matched.userLevel,
        lastMessageContent: '',
        lastMessageTime: null,
        lastMessageId: null,
        unreadCount: 0
      },
      ...sessions.value
    ]
    targetUserId.value = normalizeId(matched.userId)
    targetUsername.value = matched.username || ''
  } catch {
    // 忽略占位会话加载失败
  }
}

const syncActiveSessionTarget = () => {
  const matched = sessions.value.find(item => targetUserId.value && item.targetUserId === targetUserId.value)
    || sessions.value.find(item => targetUsername.value && item.username === targetUsername.value)
  if (!matched) return
  targetUserId.value = normalizeId(matched.targetUserId)
  targetUsername.value = matched.username || ''
}

const loadSessions = async () => {
  sessionsLoading.value = true
  try {
    const { data } = await getPrivateMessageSessionsApi({ keyword: sessionKeyword.value || undefined })
    sessions.value = (Array.isArray(data) ? data : []).map(normalizeSession)
    if (targetUsername.value) {
      await ensureSessionPlaceholderByUsername(targetUsername.value)
    } else if (targetUserId.value) {
      await ensureSessionPlaceholderById(targetUserId.value)
    }
    syncActiveSessionTarget()
  } finally {
    sessionsLoading.value = false
  }
}

const loadConversation = async (forceScroll = false) => {
  let resolvedTargetUserId = activeTargetUserId.value || targetUserId.value
  let resolvedTargetUsername = activeTargetUsername.value || targetUsername.value
  if (!resolvedTargetUserId && !resolvedTargetUsername) return
  loadingConversation.value = true
  try {
    if (targetUsername.value) {
      await ensureSessionPlaceholderByUsername(targetUsername.value)
    } else if (targetUserId.value) {
      await ensureSessionPlaceholderById(targetUserId.value)
    }
    syncActiveSessionTarget()
    resolvedTargetUserId = activeTargetUserId.value || targetUserId.value
    resolvedTargetUsername = activeTargetUsername.value || targetUsername.value
    const requestParams = resolvedTargetUsername
      ? { targetUsername: resolvedTargetUsername }
      : { targetUserId: resolvedTargetUserId || undefined }
    const { data } = await getConversationApi(requestParams)
    messages.value = (Array.isArray(data) ? data : []).map(normalizeMessage)
    await Promise.all([loadSessions(), appStore.refreshUnreadCount()])
    await scrollToBottom(forceScroll)
  } finally {
    loadingConversation.value = false
  }
}

const selectSession = async (session: PrivateMessageSessionItem) => {
  targetUserId.value = normalizeId(session.targetUserId)
  targetUsername.value = session.username || ''
  showSessionListOnMobile.value = false
  await loadConversation(true)
}

const remoteSearchUsers = async (keyword: string) => {
  if (!keyword.trim()) {
    searchResults.value = []
    return
  }
  searchingUsers.value = true
  try {
    const { data } = await searchUsersApi({ keyword, limit: 12 })
    searchResults.value = (Array.isArray(data) ? data : [])
      .map(item => ({ ...item, userId: normalizeId(item.userId) }))
      .filter(item => item.userId !== currentUserId.value)
  } finally {
    searchingUsers.value = false
  }
}

const handleSelectUser = async (userId: string) => {
  const normalizedUserId = normalizeId(userId)
  if (!normalizedUserId) return
  targetUserId.value = normalizedUserId
  const selected = searchResults.value.find(item => item.userId === normalizedUserId)
  targetUsername.value = selected?.username || ''
  showSessionListOnMobile.value = false
  if (selected && !sessions.value.some(item => item.username === selected.username || item.targetUserId === normalizedUserId)) {
    sessions.value = [
      {
        targetUserId: selected.userId,
        username: selected.username,
        nickname: selected.nickname,
        avatarUrl: selected.avatarUrl,
        signature: selected.signature,
        userLevel: selected.userLevel,
        lastMessageContent: '',
        lastMessageTime: null,
        lastMessageId: null,
        unreadCount: 0
      },
      ...sessions.value
    ]
  }
  await loadConversation(true)
}

const handleComposerKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (canSend.value) {
      await sendMessage()
    }
  }
}

const sendMessage = async () => {
  if (!canSend.value) {
    ElMessage.warning('请填写私信内容')
    return
  }
  const text = content.value.trim()
  sending.value = true
  try {
    const resolvedTargetUsername = activeTargetUsername.value || targetUsername.value || undefined
    const resolvedTargetUserId = activeTargetUserId.value || targetUserId.value || undefined
    await sendPrivateMessageApi({
      toUsername: resolvedTargetUsername,
      toUserId: resolvedTargetUsername ? undefined : resolvedTargetUserId,
      content: text
    })
    content.value = ''
    await loadConversation(true)
  } finally {
    sending.value = false
  }
}

watch(() => [route.query.to, route.query.username], async ([toValue, usernameValue]) => {
  const normalizedUsername = String(usernameValue || '').trim()
  const normalizedUserId = normalizeId(toValue as string)
  if (!normalizedUsername && !normalizedUserId) return
  if (normalizedUsername) {
    targetUsername.value = normalizedUsername
  }
  if (normalizedUserId) {
    targetUserId.value = normalizedUserId
  }
  showSessionListOnMobile.value = false
  await loadConversation(true)
})

onMounted(async () => {
  await loadSessions()
  const initialUsername = String(route.query.username || '').trim()
  const initialUserId = normalizeId(route.query.to as string)
  if (initialUsername || initialUserId) {
    targetUsername.value = initialUsername
    targetUserId.value = initialUserId
    showSessionListOnMobile.value = false
    await loadConversation(true)
  } else if (sessions.value[0]) {
    targetUserId.value = normalizeId(sessions.value[0].targetUserId)
    targetUsername.value = sessions.value[0].username || ''
    showSessionListOnMobile.value = false
    await loadConversation(true)
  }

  refreshTimer = window.setInterval(async () => {
    if (document.hidden) return
    await loadSessions()
    const resolvedTargetUserId = activeTargetUserId.value || targetUserId.value
    const resolvedTargetUsername = activeTargetUsername.value || targetUsername.value
    if (resolvedTargetUserId || resolvedTargetUsername) {
      const nearBottomBeforeRefresh = isNearBottom()
      const requestParams = resolvedTargetUsername
        ? { targetUsername: resolvedTargetUsername }
        : { targetUserId: resolvedTargetUserId || undefined }
      const { data } = await getConversationApi(requestParams)
      messages.value = (Array.isArray(data) ? data : []).map(normalizeMessage)
      syncActiveSessionTarget()
      await scrollToBottom(nearBottomBeforeRefresh)
    }
  }, 8000)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer)
  }
})
</script>

<style scoped lang="scss">
.wechat-page {
  min-height: calc(100vh - 180px);
}

.wechat-shell {
  display: grid;
  grid-template-columns: 340px 1fr;
  height: clamp(680px, calc(100vh - 150px), 860px);
  min-height: 680px;
  max-height: calc(100vh - 110px);
  overflow: hidden;
  padding: 0;
  border-radius: 26px;
  background: #f5f5f5;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.wechat-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #ededed;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 24px 20px 14px;
}

.sidebar-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.sidebar-sub,
.sidebar-unread,
.chat-user-sub,
.composer-toolbar,
.composer-tip,
.user-option-sub,
.session-time,
.bubble-meta,
.empty-state-sub,
.profile-link {
  color: #6b7280;
}

.sidebar-sub {
  margin-top: 4px;
  font-size: 13px;
}

.sidebar-unread {
  font-size: 13px;
  white-space: nowrap;
}

.sidebar-search {
  padding: 0 16px 12px;
}

.session-list {
  flex: 1;
  overflow: auto;
  padding: 0 8px 12px;
}

.session-item {
  width: 100%;
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 12px;
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 18px;
  padding: 12px;
  cursor: pointer;
  text-align: left;
  transition: background .2s ease, transform .2s ease;
}

.session-item:hover,
.session-item.active {
  background: rgba(255, 255, 255, 0.82);
}

.session-item:active {
  transform: scale(0.995);
}

.session-avatar {
  flex-shrink: 0;
}

.session-content {
  min-width: 0;
}

.session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.session-row-bottom {
  margin-top: 6px;
}

.session-name,
.chat-user-name,
.user-option-name,
.empty-state-title {
  font-weight: 700;
  color: #111827;
}

.session-preview {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wechat-chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  padding: 18px 22px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.chat-user-wrap,
.user-option-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.chat-user-meta {
  min-width: 0;
}

.chat-user-name {
  font-size: 18px;
}

.chat-user-sub {
  font-size: 13px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-link {
  font-size: 13px;
  text-decoration: none;
}

.mobile-back {
  display: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.06);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.chat-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 22px 8px;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.18)),
    #e9f0f3;
}

.time-divider {
  width: fit-content;
  margin: 14px auto;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: #6b7280;
  font-size: 12px;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 16px;
}

.message-row.mine {
  justify-content: flex-end;
}

.bubble-avatar {
  flex-shrink: 0;
}

.bubble-group {
  max-width: min(70%, 560px);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bubble {
  position: relative;
  padding: 12px 14px;
  border-radius: 8px 18px 18px 18px;
  background: #ffffff;
  color: #111827;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.bubble.mine {
  background: #95ec69;
  border-radius: 18px 8px 18px 18px;
}

.bubble-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.7;
  font-size: 14px;
}

.bubble-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  padding-left: 4px;
}

.bubble-meta.mine {
  justify-content: flex-end;
  padding-right: 4px;
}

.chat-composer {
  flex-shrink: 0;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.96);
  padding: 16px 18px 18px;
}

.composer-toolbar {
  display: flex;
  gap: 14px;
  align-items: center;
  font-size: 12px;
  margin-bottom: 10px;
}

.composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.composer-tip {
  font-size: 12px;
}

.empty-state,
.empty-chat-state {
  min-height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 36px 20px;
}

.empty-chat-state {
  align-content: center;
}

.empty-chat-state.whole {
  flex: 1;
}

.empty-state-icon {
  font-size: 34px;
  margin-bottom: 12px;
}

.empty-state-title {
  font-size: 18px;
  margin-bottom: 6px;
}

.user-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.user-option-level {
  font-size: 12px;
  color: #0f766e;
  white-space: nowrap;
}

:deep(.el-textarea__inner) {
  min-height: 96px !important;
  max-height: 160px;
  border-radius: 18px;
  padding: 14px 16px;
  line-height: 1.75;
  resize: none;
}

:deep(.el-input__wrapper) {
  border-radius: 14px;
}

@media (max-width: 980px) {
  .wechat-page {
    min-height: calc(100dvh - 96px);
  }

  .wechat-shell {
    grid-template-columns: 1fr;
    height: calc(100dvh - 96px);
    min-height: calc(100dvh - 96px);
    max-height: calc(100dvh - 96px);
    border-radius: 20px;
  }

  .wechat-sidebar,
  .wechat-chat {
    min-height: 0;
  }

  .wechat-sidebar.mobile-hidden,
  .wechat-chat:not(.mobile-visible) {
    display: none;
  }

  .mobile-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .chat-composer {
    padding-bottom: 20px;
  }

  .bubble-group {
    max-width: 82%;
  }

  .composer-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

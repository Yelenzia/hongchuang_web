<template>
  <div class="comment-list">
    <article v-for="item in comments" :key="item.id" class="hc-card comment-item minecraft-card">
      <div class="comment-head">
        <div class="user-box">
          <img v-if="item.avatarUrl" :src="avatarOf(item.avatarUrl)" class="avatar" alt="avatar" />
          <div v-else class="avatar fallback">{{ item.nickname.slice(0, 1) }}</div>
          <div>
            <div>
              <RouterLink class="name" :to="`/user/${item.userId}`">{{ item.nickname }}</RouterLink>
              <span v-if="item.forumUid" class="forum-id">#{{ item.forumUid }}</span>
            </div>
            <div class="chips">
              <span v-if="item.businessCard" class="card-chip">{{ item.businessCard }}</span>
              <span class="level-chip">Lv{{ item.userLevel || 1 }}用户</span>
            </div>
            <div v-if="item.signature" class="signature">{{ item.signature }}</div>
            <div v-if="item.replyUserId" class="reply-mark">
              回复
              <RouterLink class="reply-user" :to="`/user/${item.replyUserId}`">
                {{ item.replyNickname || `用户 ${item.replyUserId}` }}
              </RouterLink>
              <span v-if="item.replyForumUid">（#{{ item.replyForumUid }}）</span>
            </div>
          </div>
        </div>
        <div class="time">{{ formatDateTime(item.createdAt) }}</div>
      </div>
      <div class="content" v-html="renderCommentContent(item.content)"></div>
      <div class="comment-actions">
        <el-button link type="primary" @click="$emit('reply', item)">回复</el-button>
        <el-button link @click="$emit('report', item)">举报</el-button>
        <el-button v-if="showDelete && (!currentUserId || currentUserId === item.userId)" link type="danger" @click="$emit('delete', item.id)">删除</el-button>
      </div>
      <div v-if="item.children?.length" class="children-wrap">
        <CommentList :comments="item.children" :show-delete="showDelete" :current-user-id="currentUserId" @delete="$emit('delete', $event)" @reply="$emit('reply', $event)" @report="$emit('report', $event)" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { CommentItem } from '@/types/forum'
import { formatDateTime } from '@/utils/format'
import { resolveFileUrl } from '@/utils/file'

defineOptions({ name: 'CommentList' })

defineProps<{
  comments: (CommentItem & { children?: (CommentItem & { children?: CommentItem[] })[] })[]
  showDelete?: boolean
  currentUserId?: string
}>()

defineEmits<{
  (e: 'delete', id: string): void
  (e: 'reply', item: CommentItem): void
  (e: 'report', item: CommentItem): void
}>()

const avatarOf = (value?: string | null) => resolveFileUrl(value)

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const renderCommentContent = (value: string) => escapeHtml(value || '')
  .replace(/(@[A-Za-z0-9_\-\u4e00-\u9fa5]{2,32})/g, '<span class="mention">$1</span>')
  .replace(/\n/g, '<br>')
</script>

<style scoped lang="scss">
.comment-list { display: flex; flex-direction: column; gap: 14px; }
.comment-item { padding: 16px; }
.comment-head { display: flex; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
.user-box { display: flex; gap: 12px; }
.avatar { width: 42px; height: 42px; border-radius: 14px; object-fit: cover; }
.fallback { display: grid; place-items: center; color: white; font-weight: 700; background: linear-gradient(135deg, #166534, #0ea5b7); }
.name { font-weight: 700; }
.forum-id { margin-left: 8px; display: inline-flex; padding: 3px 8px; border-radius: 999px; background: rgba(34, 197, 94, 0.08); color: #166534; font-size: 12px; font-weight: 700; }
.reply-mark, .time, .content, .signature { color: var(--hc-text-secondary); }
.signature { font-size: 13px; margin-top: 4px; }
.reply-user { font-weight: 600; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.card-chip, .level-chip { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.card-chip { background: rgba(59,130,246,.10); color: #1d4ed8; }
.level-chip { background: rgba(168,85,247,.10); color: #7e22ce; }
.content { line-height: 1.8; }
:deep(.mention) { color: #0f766e; font-weight: 700; background: rgba(13, 148, 136, 0.08); padding: 0 4px; border-radius: 6px; }
.comment-actions { margin-top: 10px; display: flex; justify-content: flex-end; gap: 8px; }
.children-wrap { margin-top: 14px; margin-left: 24px; padding-left: 14px; border-left: 2px solid rgba(34, 197, 94, 0.16); }
@media (max-width: 768px) { .children-wrap { margin-left: 12px; padding-left: 10px; } }
</style>

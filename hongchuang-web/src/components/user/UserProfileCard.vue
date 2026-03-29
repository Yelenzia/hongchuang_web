<template>
  <div class="hc-card profile-card minecraft-card">
    <div class="avatar-wrap">
      <img v-if="avatarUrl" :src="avatarOf(avatarUrl)" alt="avatar" class="avatar-img" />
      <div v-else class="avatar">{{ (displayName || '?').slice(0, 1) }}</div>
    </div>
    <div class="content">
      <div class="name-row">
        <div class="name">{{ displayName }}</div>
        <div v-if="forumId" class="forum-id pixel-chip">UID #{{ forumId }}</div>
        <div v-if="businessCard" class="card-chip">{{ businessCard }}</div>
        <div class="level-chip">Lv{{ userLevel || 1 }}用户</div>
        <div v-if="achievementCount !== undefined" class="achievement-chip">成就 {{ achievementCount }}</div>
      </div>
      <div v-if="signature" class="signature">{{ signature }}</div>
      <div class="meta">邮箱：{{ email }}</div>
      <div class="meta">注册时间：{{ registerTime }}</div>
      <div class="stats">
        <span>发帖 {{ postCount }}</span>
        <span>评论 {{ commentCount }}</span>
        <span>收藏 {{ favoriteCount || 0 }}</span>
        <span>关注 {{ followingCount || 0 }}</span>
        <span>粉丝 {{ followerCount || 0 }}</span>
      </div>
      <div v-if="experiencePoints !== undefined" class="exp-box">
        <div class="exp-head">
          <span>成长值 {{ experiencePoints }}</span>
          <span v-if="nextLevelExp && nextLevelExp > 0">距下一级 {{ Math.max(nextLevelExp - (experiencePoints || 0), 0) }}</span>
          <span v-else>已满级</span>
        </div>
        <el-progress :percentage="nextLevelExp && nextLevelExp > 0 ? Math.min(Math.round(((experiencePoints || 0) / nextLevelExp) * 100), 100) : 100" :show-text="false" />
      </div>
      <div v-if="bio" class="bio">{{ bio }}</div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveFileUrl } from '@/utils/file'

defineProps<{
  displayName: string
  email: string
  registerTime: string
  postCount: number
  commentCount: number
  favoriteCount?: number
  followingCount?: number
  followerCount?: number
  bio?: string
  forumId?: string
  signature?: string | null
  avatarUrl?: string | null
  businessCard?: string | null
  userLevel?: number
  achievementCount?: number
  experiencePoints?: number
  nextLevelExp?: number
}>()

const avatarOf = (value?: string | null) => resolveFileUrl(value)
</script>

<style scoped lang="scss">
.profile-card { padding: 24px; display: flex; gap: 20px; align-items: center; }
.avatar-wrap { width: 82px; height: 82px; border-radius: 22px; overflow: hidden; flex-shrink: 0; background: linear-gradient(135deg, #0f172a, #0ea5b7); }
.avatar-img, .avatar { width: 100%; height: 100%; }
.avatar-img { object-fit: cover; }
.avatar { display: grid; place-items: center; color: white; font-size: 28px; font-weight: 700; }
.name-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.name { font-size: 24px; font-weight: 700; }
.forum-id, .achievement-chip, .card-chip, .level-chip { padding: 6px 12px; border-radius: 999px; font-weight: 700; font-size: 12px; }
.forum-id { background: rgba(34, 197, 94, 0.10); color: #166534; }
.achievement-chip { background: rgba(245, 158, 11, 0.10); color: #92400e; }
.card-chip { background: rgba(59,130,246,.10); color: #1d4ed8; }
.level-chip { background: rgba(168,85,247,.10); color: #7e22ce; }
.meta { color: var(--hc-text-secondary); line-height: 1.8; }
.signature { margin: 10px 0 6px; color: var(--hc-primary-deep); font-weight: 600; }
.stats { display: flex; gap: 14px; margin-top: 14px; color: var(--hc-primary-deep); font-weight: 600; flex-wrap: wrap; }
.exp-box { margin-top: 14px; }
.exp-head { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; color: var(--hc-text-secondary); margin-bottom: 8px; }
.bio { margin-top: 14px; color: var(--hc-text-secondary); line-height: 1.8; }
@media (max-width: 700px) { .profile-card { flex-direction: column; align-items: flex-start; } }
</style>

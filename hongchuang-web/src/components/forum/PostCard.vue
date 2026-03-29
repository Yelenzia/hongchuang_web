<template>
  <RouterLink :to="`/post/${post.id}`" class="card-link">
    <article class="hc-card post-card minecraft-card">
      <div class="head">
        <div>
          <div class="board">{{ post.boardName }}</div>
          <h3 class="title">{{ post.title }}</h3>
        </div>
        <div class="meta">{{ formatDateTime(post.createdAt) }}</div>
      </div>
      <p class="summary">{{ post.summary || '暂无摘要' }}</p>
      <div class="tags">
        <TagChip v-for="tag in post.tags" :key="tag.id" :label="tag.name" />
      </div>
      <div class="foot">
        <div class="author-box">
          <img v-if="post.authorAvatarUrl" :src="avatarOf(post.authorAvatarUrl)" class="avatar" alt="avatar" />
          <div class="avatar fallback" v-else>{{ post.authorName.slice(0, 1) }}</div>
          <div>
            <div class="author">作者：{{ post.authorName }} <span v-if="post.authorForumUid" class="uid">#{{ post.authorForumUid }}</span></div>
            <div class="chips">
              <span v-if="post.authorBusinessCard" class="card-chip">{{ post.authorBusinessCard }}</span>
              <span class="level-chip">Lv{{ post.authorUserLevel || 1 }}用户</span>
            </div>
            <div v-if="post.authorSignature" class="signature">{{ post.authorSignature }}</div>
          </div>
        </div>
        <div class="stats">
          <span>👍 {{ post.likeCount }}</span>
          <span>⭐ {{ post.favoriteCount || 0 }}</span>
          <span>💬 {{ post.commentCount }}</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
import TagChip from '@/components/common/TagChip.vue'
import type { PostItem } from '@/types/forum'
import { formatDateTime } from '@/utils/format'
import { resolveFileUrl } from '@/utils/file'

defineProps<{ post: PostItem }>()

const avatarOf = (value?: string | null) => resolveFileUrl(value)
</script>

<style scoped lang="scss">
.card-link { display: block; }
.post-card { padding: 20px; transition: transform .2s ease, box-shadow .2s ease; }
.post-card:hover { transform: translateY(-2px); box-shadow: 0 12px 34px rgba(15, 23, 42, 0.12); }
.head { display: flex; justify-content: space-between; gap: 20px; }
.board { font-size: 12px; color: #166534; font-weight: 700; margin-bottom: 8px; }
.title { margin: 0; font-size: 22px; }
.summary { color: var(--hc-text-secondary); line-height: 1.75; margin: 16px 0; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.foot { margin-top: 18px; display: flex; justify-content: space-between; color: var(--hc-text-secondary); gap: 12px; }
.author-box { display: flex; align-items: center; gap: 12px; }
.avatar { width: 42px; height: 42px; border-radius: 14px; object-fit: cover; }
.fallback { display: grid; place-items: center; color: white; font-weight: 700; background: linear-gradient(135deg, #166534, #0ea5b7); }
.author { color: var(--hc-text); font-weight: 600; }
.uid { color: #166534; font-weight: 700; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.card-chip, .level-chip { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.card-chip { background: rgba(59,130,246,.10); color: #1d4ed8; }
.level-chip { background: rgba(168,85,247,.10); color: #7e22ce; }
.signature { font-size: 13px; }
.stats { display: flex; gap: 14px; }
@media (max-width: 700px) { .head, .foot { flex-direction: column; } }
</style>

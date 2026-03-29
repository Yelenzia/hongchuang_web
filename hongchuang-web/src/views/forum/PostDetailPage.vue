<template>
  <div class="hc-container detail-page">
    <article v-loading="loading" class="hc-card detail minecraft-card">
      <template v-if="post">
        <div class="meta-top">
          <span class="board">{{ post.boardName }}</span>
          <span class="time">{{ formatDateTime(post.createdAt) }}</span>
        </div>
        <h1 class="title">{{ post.title }}</h1>
        <div class="author-panel">
          <div class="author-box">
            <img v-if="post.authorAvatarUrl" :src="avatarOf(post.authorAvatarUrl)" class="avatar" alt="avatar" />
            <div v-else class="avatar fallback">{{ post.authorName.slice(0, 1) }}</div>
            <div>
              <RouterLink :to="`/user/${post.authorId}`" class="author-name">{{ post.authorName }}</RouterLink>
              <span v-if="post.authorForumUid" class="uid-chip">#{{ post.authorForumUid }}</span>
              <div class="author-chips">
                <span v-if="post.authorBusinessCard" class="card-chip">{{ post.authorBusinessCard }}</span>
                <span class="level-chip">Lv{{ post.authorUserLevel || 1 }}用户</span>
              </div>
              <div v-if="post.authorSignature" class="author-signature">{{ post.authorSignature }}</div>
            </div>
          </div>
          <div class="author-extra">浏览 {{ post.viewCount }}</div>
        </div>
        <div class="tags">
          <TagChip v-for="tag in post.tags" :key="tag.id" :label="tag.name" />
        </div>
        <MarkdownPreview class="content" :content="post.contentMd" />
        <div class="actions">
          <el-button type="primary" @click="handleToggleLike">{{ post.liked ? '取消点赞' : '点赞' }} {{ post.likeCount }}</el-button>
          <el-button type="warning" plain @click="handleToggleFavorite">{{ post.favorited ? '取消收藏' : '收藏帖子' }} {{ post.favoriteCount || 0 }}</el-button>
          <el-button plain @click="handleToggleBlock">{{ post.blocked ? '取消屏蔽' : '屏蔽帖子' }}</el-button>
          <el-button plain @click="reportDialogVisible = true">举报帖子</el-button>
          <el-button v-if="isOwnPost" plain @click="router.push(`/post/${post.id}/edit`)">编辑帖子</el-button>
          <el-button v-if="isOwnPost" plain type="danger" @click="handleDeletePost">删除帖子</el-button>
        </div>
      </template>
    </article>

    <section class="comment-section">
      <div class="hc-card form-card minecraft-card">
        <div class="section-title">发表评论</div>
        <div class="hint">支持在评论中使用 @用户名，系统会自动给对方发送提醒。</div>
        <div v-if="replyTarget" class="reply-banner">
          <span>
            正在回复：{{ replyTarget.nickname }}
            <span v-if="replyTarget.username">（@{{ replyTarget.username }}）</span>
            <span v-if="replyTarget.forumUid">（#{{ replyTarget.forumUid }}）</span>
          </span>
          <el-button link @click="clearReply">取消回复</el-button>
        </div>
        <el-input v-model="commentText" type="textarea" :rows="4" placeholder="写下你的看法，或使用 @用户名 提醒对方…" />
        <div class="submit">
          <el-button type="primary" :disabled="!authStore.isLogin" :loading="commentSubmitting" @click="handleCreateComment">{{ replyTarget ? '提交回复' : '提交评论' }}</el-button>
        </div>
      </div>

      <div class="section-title comments-title">评论区</div>
      <CommentList
        :comments="commentTree"
        :show-delete="authStore.isLogin"
        :current-user-id="authStore.userInfo?.id"
        @delete="handleDeleteComment"
        @reply="handleReplyComment"
        @report="handleOpenReportComment"
      />
    </section>

    <el-dialog v-model="reportDialogVisible" :title="reportTargetType === 'POST' ? '举报帖子' : '举报评论'" width="480px">
      <el-form label-position="top">
        <el-form-item label="举报类型">
          <el-select v-model="reportForm.reasonType" style="width: 100%">
            <el-option label="违规内容" value="VIOLATION" />
            <el-option label="广告引流" value="SPAM" />
            <el-option label="人身攻击" value="ABUSE" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input v-model="reportForm.reasonDetail" type="textarea" :rows="4" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="reportSubmitting" @click="handleReport">提交举报</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import TagChip from '@/components/common/TagChip.vue'
import CommentList from '@/components/forum/CommentList.vue'
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue'
import { formatDateTime } from '@/utils/format'
import { resolveFileUrl } from '@/utils/file'
import { blockPostApi, cancelFavoritePostApi, cancelLikePostApi, deletePostApi, favoritePostApi, getPostDetailApi, likePostApi, unblockPostApi } from '@/api/post'
import { createCommentApi, deleteCommentApi, getCommentsApi } from '@/api/comment'
import { createReportApi } from '@/api/report'
import type { CommentItem, PostDetail } from '@/types/forum'
import { useAuthStore } from '@/store/auth'

interface TreeComment extends CommentItem {
  children: TreeComment[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const commentSubmitting = ref(false)
const reportSubmitting = ref(false)
const reportDialogVisible = ref(false)
const commentText = ref('')
const post = ref<PostDetail | null>(null)
const comments = ref<CommentItem[]>([])
const replyTarget = ref<CommentItem | null>(null)
const reportTargetType = ref<'POST' | 'COMMENT'>('POST')
const reportTargetId = ref('')
const reportForm = reactive({
  reasonType: 'VIOLATION',
  reasonDetail: ''
})

const postId = computed(() => String(route.params.id || ''))
const isOwnPost = computed(() => authStore.userInfo?.id === post.value?.authorId)
const commentTree = computed<TreeComment[]>(() => {
  const map = new Map<string, TreeComment>()
  const roots: TreeComment[] = []
  comments.value.forEach(item => map.set(item.id, { ...item, children: [] }))
  comments.value.forEach(item => {
    const node = map.get(item.id)!
    if (item.parentId && item.parentId !== '0' && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
})

const avatarOf = (value?: string | null) => resolveFileUrl(value)

const loadDetail = async () => {
  loading.value = true
  try {
    const [{ data: postData }, { data: commentData }] = await Promise.all([
      getPostDetailApi(postId.value),
      getCommentsApi(postId.value)
    ])
    post.value = postData
    comments.value = commentData
  } finally {
    loading.value = false
  }
}

const clearReply = () => {
  replyTarget.value = null
}

const handleReplyComment = (item: CommentItem) => {
  if (!authStore.isLogin) {
    ElMessage.warning('请先登录后再回复')
    return
  }
  replyTarget.value = item
  commentText.value = item.username ? `@${item.username} ` : ''
}

const handleOpenReportComment = (item: CommentItem) => {
  if (!authStore.isLogin) {
    ElMessage.warning('请先登录后再举报')
    return
  }
  reportTargetType.value = 'COMMENT'
  reportTargetId.value = item.id
  reportDialogVisible.value = true
}

const handleToggleLike = async () => {
  if (!authStore.isLogin || !post.value) {
    ElMessage.warning('请先登录后再进行操作')
    return
  }
  if (post.value.liked) {
    await cancelLikePostApi(postId.value)
  } else {
    await likePostApi(postId.value)
  }
  await loadDetail()
}

const handleToggleFavorite = async () => {
  if (!authStore.isLogin || !post.value) {
    ElMessage.warning('请先登录后再进行操作')
    return
  }
  if (post.value.favorited) {
    await cancelFavoritePostApi(postId.value)
    ElMessage.success('已取消收藏')
  } else {
    await favoritePostApi(postId.value)
    ElMessage.success('收藏成功')
  }
  await authStore.fetchMe().catch(() => undefined)
  await loadDetail()
}

const handleToggleBlock = async () => {
  if (!authStore.isLogin || !post.value) {
    ElMessage.warning('请先登录后再进行操作')
    return
  }
  if (post.value.blocked) {
    await unblockPostApi(postId.value)
  } else {
    await blockPostApi(postId.value)
  }
  await loadDetail()
}

const handleCreateComment = async () => {
  if (!authStore.isLogin) {
    ElMessage.warning('请先登录后再发表评论')
    return
  }
  if (!commentText.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }
  commentSubmitting.value = true
  const replying = Boolean(replyTarget.value)
  try {
    await createCommentApi(postId.value, {
      parentId: replyTarget.value?.id || '0',
      replyUserId: replyTarget.value?.userId,
      content: commentText.value.trim()
    })
    commentText.value = ''
    clearReply()
    ElMessage.success(replying ? '回复成功' : '评论成功')
    await loadDetail()
  } finally {
    commentSubmitting.value = false
  }
}

const handleDeleteComment = async (commentId: string) => {
  if (!authStore.isLogin) return
  await ElMessageBox.confirm('确定删除这条评论吗？', '删除确认', { type: 'warning' })
  await deleteCommentApi(commentId)
  ElMessage.success('评论已删除')
  await loadDetail()
}

const handleDeletePost = async () => {
  await ElMessageBox.confirm('确定删除这篇帖子吗？删除后不可恢复。', '删除确认', { type: 'warning' })
  await deletePostApi(postId.value)
  ElMessage.success('帖子已删除')
  router.push('/forum')
}

const handleReport = async () => {
  if (!authStore.isLogin) {
    ElMessage.warning('请先登录后再举报')
    return
  }
  reportSubmitting.value = true
  try {
    await createReportApi({
      targetType: reportTargetType.value,
      targetId: reportTargetType.value === 'POST' ? postId.value : reportTargetId.value,
      reasonType: reportForm.reasonType,
      reasonDetail: reportForm.reasonDetail
    })
    ElMessage.success('举报已提交')
    reportDialogVisible.value = false
    reportForm.reasonType = 'VIOLATION'
    reportForm.reasonDetail = ''
  } finally {
    reportSubmitting.value = false
  }
}

onMounted(loadDetail)
watch(postId, loadDetail)
</script>

<style scoped lang="scss">
.detail-page { padding-top: 108px; padding-bottom: 48px; display: flex; flex-direction: column; gap: 18px; }
.detail { padding: 28px; }
.meta-top { display: flex; justify-content: space-between; color: var(--hc-text-secondary); gap: 12px; }
.board { color: #166534; font-weight: 700; }
.title { margin: 12px 0 18px; font-size: 34px; }
.author-panel { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 16px 0; border-top: 1px solid rgba(229,231,235,.7); border-bottom: 1px solid rgba(229,231,235,.7); }
.author-box { display: flex; gap: 14px; align-items: center; }
.avatar { width: 54px; height: 54px; border-radius: 16px; object-fit: cover; }
.fallback { display: grid; place-items: center; color: white; font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #166534, #0ea5b7); }
.author-name { font-size: 18px; font-weight: 700; }
.uid-chip { margin-left: 8px; color: #166534; font-weight: 700; }
.author-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.card-chip, .level-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.card-chip { background: rgba(59,130,246,.10); color: #1d4ed8; }
.level-chip { background: rgba(168,85,247,.10); color: #7e22ce; }
.author-signature, .author-extra { color: var(--hc-text-secondary); }
.tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
.content { margin-top: 24px; line-height: 1.9; }
.actions { margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
.comment-section { display: flex; flex-direction: column; gap: 16px; }
.form-card { padding: 24px; }
.section-title { font-size: 22px; font-weight: 700; }
.comments-title { margin-top: 4px; }
.hint { margin-top: 8px; color: var(--hc-text-secondary); }
.reply-banner { margin: 16px 0 12px; display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 10px 14px; border-radius: 12px; background: rgba(34, 197, 94, 0.08); color: #166534; }
.submit { margin-top: 14px; display: flex; justify-content: flex-end; }
@media (max-width: 760px) { .title { font-size: 28px; } .author-panel { flex-direction: column; align-items: flex-start; } }
</style>

<template>
  <div class="hc-container user-home">
    <UserProfileCard
      v-if="profile"
      :display-name="profile.nickname || profile.username"
      :email="'-'"
      :register-time="formatDateTime(profile.registerTime)"
      :post-count="profile.postCount"
      :comment-count="profile.commentCount"
      :favorite-count="profile.favoriteCount || 0"
      :following-count="profile.followingCount || 0"
      :follower-count="profile.followerCount || 0"
      :bio="profile.bio || ''"
      :signature="profile.signature || ''"
      :forum-id="profile.forumUid"
      :avatar-url="profile.avatarUrl"
      :achievement-count="profile.achievementCount || 0"
      :business-card="profile.businessCard || ''"
      :user-level="profile.userLevel || 1"
      :experience-points="profile.experiencePoints || 0"
      :next-level-exp="profile.nextLevelExp || 0"
    >
      <div class="profile-actions">
        <RouterLink :to="`/me/messages?username=${profile.username}`"><el-button type="primary" plain>私信TA</el-button></RouterLink>
        <el-button v-if="showFollowButton" :type="profile.followedByCurrentUser ? 'default' : 'success'" @click="handleToggleFollow">
          {{ profile.followedByCurrentUser ? '取消关注' : '关注TA' }}
        </el-button>
      </div>
    </UserProfileCard>
    <div class="hc-card recent">
      <AchievementWall :items="achievements" />
    </div>
    <div class="hc-card recent">
      <div class="section-title">最近发帖</div>
      <div v-loading="loading" class="list">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
        <EmptyState v-if="!loading && posts.length === 0" title="该用户暂未发布帖子" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import UserProfileCard from '@/components/user/UserProfileCard.vue'
import AchievementWall from '@/components/user/AchievementWall.vue'
import PostCard from '@/components/forum/PostCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { followUserApi, getUserProfileApi, unfollowUserApi } from '@/api/user'
import { getPostListApi } from '@/api/post'
import { getUserAchievementsApi } from '@/api/achievement'
import type { AchievementItem, PostItem, PublicUserProfile } from '@/types/forum'
import { formatDateTime } from '@/utils/format'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const authStore = useAuthStore()
const profile = ref<PublicUserProfile | null>(null)
const posts = ref<PostItem[]>([])
const achievements = ref<AchievementItem[]>([])
const loading = ref(false)
const showFollowButton = computed(() => authStore.isLogin && authStore.userInfo?.id !== profile.value?.userId)

const loadData = async () => {
  const userId = String(route.params.id || '')
  loading.value = true
  try {
    const [{ data: profileData }, { data: postData }, { data: achievementData }] = await Promise.all([
      getUserProfileApi(userId),
      getPostListApi({ pageNo: 1, pageSize: 10, authorId: userId, sort: 'newest' }),
      getUserAchievementsApi(userId)
    ])
    profile.value = profileData
    posts.value = postData.list
    achievements.value = achievementData
  } finally {
    loading.value = false
  }
}

const handleToggleFollow = async () => {
  if (!authStore.isLogin || !profile.value) {
    ElMessage.warning('请先登录后再关注')
    return
  }
  if (profile.value.followedByCurrentUser) {
    await unfollowUserApi(profile.value.userId)
    ElMessage.success('已取消关注')
  } else {
    await followUserApi(profile.value.userId)
    ElMessage.success('关注成功')
  }
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.user-home {
  padding-top: 108px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.recent {
  padding: 24px;
}
.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.profile-actions { margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap; }
</style>

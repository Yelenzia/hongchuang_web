<template>
  <div class="relation-page">
    <div>
      <div class="section-title">{{ pageTitle }}</div>
      <div class="sub">{{ pageDesc }}</div>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="我的关注" name="follows" />
      <el-tab-pane label="我的粉丝" name="fans" />
    </el-tabs>

    <div v-loading="loading" class="relation-list">
      <article v-for="item in rows" :key="item.userId" class="hc-card relation-item minecraft-card">
        <div class="user-box">
          <img v-if="item.avatarUrl" :src="avatarOf(item.avatarUrl)" class="avatar" alt="avatar" />
          <div v-else class="avatar fallback">{{ (item.nickname || item.username).slice(0, 1) }}</div>
          <div class="info">
            <RouterLink class="name" :to="`/user/${item.userId}`">{{ item.nickname || item.username }}</RouterLink>
            <div class="meta">
              <span v-if="item.forumUid">#{{ item.forumUid }}</span>
              <span v-if="item.businessCard">{{ item.businessCard }}</span>
              <span>Lv{{ item.userLevel || 1 }}</span>
            </div>
            <div v-if="item.signature" class="signature">{{ item.signature }}</div>
            <div class="stats">发帖 {{ item.postCount || 0 }} · 评论 {{ item.commentCount || 0 }} · 关注 {{ item.followingCount || 0 }} · 粉丝 {{ item.followerCount || 0 }}</div>
          </div>
        </div>
        <div class="actions">
          <RouterLink :to="`/me/messages?username=${item.username}`"><el-button plain>私信</el-button></RouterLink>
          <el-button v-if="activeTab === 'fans' && item.followedByMe === false" type="success" plain @click="handleFollow(item.userId)">回关</el-button>
          <el-button v-else-if="activeTab === 'follows' || item.followedByMe" plain @click="handleUnfollow(item.userId)">取消关注</el-button>
        </div>
      </article>
      <EmptyState v-if="!loading && rows.length === 0" :title="activeTab === 'follows' ? '你还没有关注任何人' : '你暂时还没有粉丝'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import EmptyState from '@/components/common/EmptyState.vue'
import { followUserApi, getMyFansApi, getMyFollowingApi, unfollowUserApi } from '@/api/user'
import type { UserRelationItem } from '@/types/forum'
import { resolveFileUrl } from '@/utils/file'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rows = ref<UserRelationItem[]>([])
const activeTab = ref<'follows' | 'fans'>(route.name === 'me-fans' ? 'fans' : 'follows')

const pageTitle = computed(() => activeTab.value === 'follows' ? '我的关注' : '我的粉丝')
const pageDesc = computed(() => activeTab.value === 'follows' ? '你关注的用户会优先形成社区关系链和持续互动。' : '这里展示关注你的用户，你可以快速回关。')

const avatarOf = (value?: string | null) => resolveFileUrl(value)

const loadData = async () => {
  loading.value = true
  try {
    const { data } = activeTab.value === 'follows' ? await getMyFollowingApi() : await getMyFansApi()
    rows.value = data
  } finally {
    loading.value = false
  }
}

const handleTabChange = async (name: string | number) => {
  activeTab.value = String(name) === 'fans' ? 'fans' : 'follows'
  await router.replace(activeTab.value === 'fans' ? '/me/fans' : '/me/follows')
}

const handleFollow = async (userId: string) => {
  await followUserApi(userId)
  ElMessage.success('回关成功')
  await loadData()
}

const handleUnfollow = async (userId: string) => {
  await unfollowUserApi(userId)
  ElMessage.success('已取消关注')
  await loadData()
}

watch(() => route.name, async (name) => {
  activeTab.value = name === 'me-fans' ? 'fans' : 'follows'
  await loadData()
})

onMounted(loadData)
</script>

<style scoped lang="scss">
.relation-page { display: flex; flex-direction: column; gap: 14px; }
.section-title { font-size: 22px; font-weight: 700; }
.sub { color: var(--hc-text-secondary); margin-top: 6px; }
.relation-list { display: flex; flex-direction: column; gap: 12px; }
.relation-item { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 18px; }
.user-box { display: flex; gap: 14px; align-items: center; }
.avatar { width: 56px; height: 56px; border-radius: 18px; object-fit: cover; }
.fallback { display: grid; place-items: center; color: white; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #166534, #0ea5b7); }
.info { display: flex; flex-direction: column; gap: 4px; }
.name { font-size: 18px; font-weight: 700; }
.meta, .signature, .stats { color: var(--hc-text-secondary); }
.meta { display: flex; gap: 10px; flex-wrap: wrap; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
@media (max-width: 760px) { .relation-item { flex-direction: column; align-items: flex-start; } }
</style>

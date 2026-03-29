<template>
  <div class="profile-page" v-loading="loading">
    <UserProfileCard
      v-if="authStore.userInfo"
      :display-name="authStore.userInfo.nickname || authStore.userInfo.username"
      :email="authStore.userInfo.email || '-'"
      :register-time="authStore.userInfo.registerTime || '-'"
      :post-count="authStore.userInfo.postCount || 0"
      :comment-count="authStore.userInfo.commentCount || 0"
      :favorite-count="authStore.userInfo.favoriteCount || 0"
      :following-count="authStore.userInfo.followingCount || 0"
      :follower-count="authStore.userInfo.followerCount || 0"
      :bio="authStore.userInfo.bio || ''"
      :signature="authStore.userInfo.signature || ''"
      :forum-id="authStore.userInfo.forumUid"
      :avatar-url="authStore.userInfo.avatarUrl"
      :achievement-count="authStore.userInfo.achievementCount || 0"
      :business-card="authStore.userInfo.businessCard || ''"
      :user-level="authStore.userInfo.userLevel || 1"
      :experience-points="authStore.userInfo.experiencePoints || 0"
      :next-level-exp="authStore.userInfo.nextLevelExp || 0"
    />

    <div class="hc-card form-card minecraft-card">
      <div class="section-title">编辑个人资料</div>
      <el-alert v-if="loadError" type="warning" :closable="false" show-icon :title="loadError" class="mb-16" />
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" maxlength="32" show-word-limit />
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input v-model="form.signature" maxlength="120" show-word-limit placeholder="写一句展示在个人主页和评论区下方的签名" />
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input v-model="form.bio" type="textarea" :rows="3" maxlength="255" show-word-limit />
        </el-form-item>
      </el-form>
      <AvatarUploader v-model="form.avatarUrl" :display-name="form.nickname || authStore.userInfo?.username" />
      <div class="submit">
        <el-button type="primary" :loading="saving" @click="handleSave">保存修改</el-button>
      </div>
    </div>

    <div class="hc-card form-card">
      <AchievementWall :items="achievements" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import UserProfileCard from '@/components/user/UserProfileCard.vue'
import AvatarUploader from '@/components/user/AvatarUploader.vue'
import AchievementWall from '@/components/user/AchievementWall.vue'
import { useAuthStore } from '@/store/auth'
import { updateMyProfileApi } from '@/api/user'
import { getMyAchievementsApi } from '@/api/achievement'
import type { AchievementItem } from '@/types/forum'

const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)
const achievements = ref<AchievementItem[]>([])
const loadError = ref('')
const form = reactive({
  nickname: '',
  bio: '',
  signature: '',
  avatarUrl: ''
})

const rules: FormRules<typeof form> = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 32, message: '昵称长度需在 2~32 位之间', trigger: 'blur' }
  ],
  signature: [{ max: 120, message: '签名不能超过 120 字', trigger: 'blur' }],
  bio: [{ max: 255, message: '简介不能超过 255 字', trigger: 'blur' }]
}

const fillForm = () => {
  form.nickname = authStore.userInfo?.nickname || ''
  form.bio = authStore.userInfo?.bio || ''
  form.signature = authStore.userInfo?.signature || ''
  form.avatarUrl = authStore.userInfo?.avatarUrl || ''
}

const loadProfile = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const me = await authStore.fetchMe()
    fillForm()
    try {
      const { data } = await getMyAchievementsApi()
      achievements.value = Array.isArray(data) ? data : []
    } catch (error) {
      achievements.value = []
      loadError.value = '个人资料已打开，但成就数据暂时加载失败。'
      console.error(error)
    }
    return me
  } catch (error) {
    loadError.value = '个人资料加载失败，请稍后刷新重试。'
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    await updateMyProfileApi({
      nickname: form.nickname,
      bio: form.bio,
      signature: form.signature,
      avatarUrl: form.avatarUrl
    })
    await authStore.fetchMe()
    ElMessage.success('资料更新成功')
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadProfile()
})
</script>

<style scoped lang="scss">
.profile-page { display: flex; flex-direction: column; gap: 18px; }
.form-card { padding: 24px; }
.section-title { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
.submit { margin-top: 16px; display: flex; justify-content: flex-end; }
.mb-16 { margin-bottom: 16px; }
</style>

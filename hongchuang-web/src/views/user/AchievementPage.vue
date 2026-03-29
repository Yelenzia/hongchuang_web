<template>
  <div class="achievement-page" v-loading="loading">
    <el-alert v-if="errorText" type="warning" :closable="false" show-icon :title="errorText" class="mb-16" />
    <AchievementWall :items="achievements" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AchievementWall from '@/components/user/AchievementWall.vue'
import { getMyAchievementsApi } from '@/api/achievement'
import type { AchievementItem } from '@/types/forum'

const achievements = ref<AchievementItem[]>([])
const loading = ref(false)
const errorText = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getMyAchievementsApi()
    achievements.value = Array.isArray(data) ? data : []
  } catch (error) {
    achievements.value = []
    errorText.value = '成就数据暂时加载失败，请稍后重试。'
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.mb-16 { margin-bottom: 16px; }
</style>

<template>
  <div>
    <PageHeader title="仪表盘" desc="查看平台当前的关键运营数据、内容趋势与活跃设备情况。" />

    <div v-loading="loading" class="dashboard-page">
      <div class="metric-grid">
        <div class="metric-card" v-for="card in cards" :key="card.label">
          <div class="label">{{ card.label }}</div>
          <div class="value">{{ card.value }}</div>
          <div class="sub">{{ card.sub }}</div>
        </div>
      </div>

      <div class="main-grid">
        <el-card>
          <template #header>近 7 天增长趋势</template>
          <div class="trend-group">
            <div class="trend-block">
              <div class="trend-title">新增用户</div>
              <div class="trend-bars">
                <div v-for="item in overview?.userTrend || []" :key="`user-${item.date}`" class="bar-row">
                  <span>{{ item.date }}</span>
                  <div class="bar-track"><div class="bar-fill" :style="{ width: `${barWidth(item.value, userTrendMax)}%` }"></div></div>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </div>
            <div class="trend-block">
              <div class="trend-title">新增帖子</div>
              <div class="trend-bars">
                <div v-for="item in overview?.postTrend || []" :key="`post-${item.date}`" class="bar-row">
                  <span>{{ item.date }}</span>
                  <div class="bar-track"><div class="bar-fill alt" :style="{ width: `${barWidth(item.value, postTrendMax)}%` }"></div></div>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </div>
            <div class="trend-block">
              <div class="trend-title">新增资源</div>
              <div class="trend-bars">
                <div v-for="item in overview?.resourceTrend || []" :key="`res-${item.date}`" class="bar-row">
                  <span>{{ item.date }}</span>
                  <div class="bar-track"><div class="bar-fill third" :style="{ width: `${barWidth(item.value, resourceTrendMax)}%` }"></div></div>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>待处理事项</template>
          <ul class="todo-list">
            <li v-for="item in overview?.todoItems || []" :key="item">{{ item }}</li>
          </ul>
          <div class="mini-metrics">
            <div class="mini-card">
              <span>今日登录</span>
              <strong>{{ overview?.todayLoginCount ?? 0 }}</strong>
            </div>
            <div class="mini-card">
              <span>活跃设备</span>
              <strong>{{ overview?.activeSessionCount ?? 0 }}</strong>
            </div>
            <div class="mini-card">
              <span>私信总数</span>
              <strong>{{ overview?.privateMessageCount ?? 0 }}</strong>
            </div>
          </div>
        </el-card>
      </div>

      <div class="rank-grid">
        <el-card>
          <template #header>热门板块</template>
          <div class="rank-list">
            <div v-for="item in overview?.topBoards || []" :key="item.name" class="rank-item">
              <div>
                <div class="rank-name">{{ item.name }}</div>
                <div class="rank-extra">{{ item.extra || '板块' }}</div>
              </div>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>热门标签</template>
          <div class="rank-list">
            <div v-for="item in overview?.topTags || []" :key="item.name" class="rank-item">
              <div>
                <div class="rank-name">{{ item.name }}</div>
                <div class="rank-extra">{{ item.extra || '标签' }}</div>
              </div>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>资源热度</template>
          <div class="rank-list">
            <div v-for="item in overview?.hotResources || []" :key="item.name" class="rank-item">
              <div>
                <div class="rank-name">{{ item.name }}</div>
                <div class="rank-extra">{{ item.extra || '资源' }}</div>
              </div>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { getDashboardApi, type DashboardOverview } from '@/api/dashboard'

const loading = ref(false)
const overview = ref<DashboardOverview | null>(null)

const cards = computed(() => [
  { label: '用户总数', value: overview.value?.userCount ?? 0, sub: `今日新增 ${overview.value?.todayUserCount ?? 0}` },
  { label: '帖子总数', value: overview.value?.postCount ?? 0, sub: `今日新增 ${overview.value?.todayPostCount ?? 0}` },
  { label: '评论总数', value: overview.value?.commentCount ?? 0, sub: `今日新增 ${overview.value?.todayCommentCount ?? 0}` },
  { label: '资源总数', value: overview.value?.resourceCount ?? 0, sub: `今日新增 ${overview.value?.todayResourceCount ?? 0}` },
  { label: '待处理举报', value: overview.value?.pendingReportCount ?? 0, sub: `公告草稿 ${overview.value?.pendingAnnouncementCount ?? 0}` },
  { label: '登录设备', value: overview.value?.activeSessionCount ?? 0, sub: `今日登录 ${overview.value?.todayLoginCount ?? 0}` }
])

const maxOf = (list?: Array<{ value: number }>) => Math.max(...(list?.map(item => Number(item.value || 0)) || [0]), 1)
const userTrendMax = computed(() => maxOf(overview.value?.userTrend))
const postTrendMax = computed(() => maxOf(overview.value?.postTrend))
const resourceTrendMax = computed(() => maxOf(overview.value?.resourceTrend))

const barWidth = (value: number, max: number) => {
  if (!max) return 0
  return Math.max(8, Math.round((value / max) * 100))
}

const loadDashboard = async () => {
  loading.value = true
  try {
    const { data } = await getDashboardApi()
    overview.value = data
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<style scoped lang="scss">
.dashboard-page { display: grid; gap: 18px; }
.metric-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
.metric-card { background: white; border: 1px solid var(--admin-border); border-radius: var(--admin-radius); box-shadow: var(--admin-shadow); padding: 18px; }
.label { color: var(--admin-sub); }
.value { margin: 10px 0 8px; font-size: 30px; font-weight: 700; }
.sub { color: var(--admin-primary); font-weight: 600; }
.main-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
.trend-group { display: grid; gap: 18px; }
.trend-title { font-weight: 700; margin-bottom: 10px; }
.trend-bars { display: grid; gap: 10px; }
.bar-row { display: grid; grid-template-columns: 52px 1fr 42px; gap: 10px; align-items: center; }
.bar-track { height: 10px; border-radius: 999px; background: rgba(15, 23, 42, 0.08); overflow: hidden; }
.bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #14b8a6, #0ea5e9); }
.bar-fill.alt { background: linear-gradient(90deg, #22c55e, #84cc16); }
.bar-fill.third { background: linear-gradient(90deg, #8b5cf6, #ec4899); }
.todo-list { margin: 0; padding-left: 18px; color: var(--admin-sub); line-height: 1.9; }
.mini-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
.mini-card { padding: 14px; border-radius: 14px; background: rgba(15, 23, 42, 0.04); display: grid; gap: 6px; }
.mini-card span { color: var(--admin-sub); }
.mini-card strong { font-size: 24px; }
.rank-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.rank-list { display: grid; gap: 12px; }
.rank-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px; border-radius: 14px; background: rgba(15, 23, 42, 0.04); }
.rank-name { font-weight: 700; }
.rank-extra { color: var(--admin-sub); margin-top: 4px; }
@media (max-width: 1280px) { .metric-grid { grid-template-columns: repeat(3, 1fr); } .main-grid, .rank-grid { grid-template-columns: 1fr; } }
@media (max-width: 860px) { .metric-grid, .mini-metrics { grid-template-columns: 1fr; } }
</style>

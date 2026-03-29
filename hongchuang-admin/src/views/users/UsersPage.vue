<template>
  <div>
    <PageHeader title="用户管理" desc="管理注册用户、UID、签名、名片、等级、角色与账号状态。" />

    <el-card>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索用户名或邮箱" clearable style="width: 280px" @keyup.enter="handleSearch" />
        <el-select v-model="status" clearable placeholder="状态" style="width: 140px">
          <el-option label="正常" :value="1" />
          <el-option label="封禁" :value="2" />
        </el-select>
        <el-button @click="handleSearch">筛选</el-button>
      </div>

      <el-table v-loading="loading" :data="rows" style="width: 100%">
        <el-table-column prop="id" label="系统ID" min-width="120" />
        <el-table-column prop="forumUid" label="UID" min-width="120" />
        <el-table-column prop="username" label="用户名" min-width="140" />
        <el-table-column prop="email" label="邮箱" min-width="220" />
        <el-table-column prop="businessCard" label="名片" min-width="120" />
        <el-table-column label="等级" min-width="100">
          <template #default="{ row }">Lv{{ row.userLevel || 1 }}</template>
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="100" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '正常' : '封禁' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="achievementCount" label="成就数" min-width="100" />
        <el-table-column prop="postCount" label="发帖数" min-width="100" />
        <el-table-column prop="commentCount" label="评论数" min-width="100" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link @click="openDetail(row.id)">详情</el-button>
            <el-button link type="primary" @click="toggleBan(row)">{{ row.status === 1 ? '封禁' : '解封' }}</el-button>
            <el-button link type="warning" @click="openResetPassword(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="prev, pager, next, total" :current-page="pageNo" :page-size="pageSize" :total="total" @current-change="handlePageChange" />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" size="620px" title="用户详情">
      <div v-if="detail" class="detail-wrap">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="系统ID">{{ detail.id }}</el-descriptions-item>
          <el-descriptions-item label="UID">{{ detail.forumUid || '-' }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ detail.username }}</el-descriptions-item>
          <el-descriptions-item label="昵称">{{ detail.nickname || '-' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ detail.registerTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ detail.lastLoginAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发帖数">{{ detail.postCount }}</el-descriptions-item>
          <el-descriptions-item label="评论数">{{ detail.commentCount }}</el-descriptions-item>
          <el-descriptions-item label="签名">{{ detail.signature || '-' }}</el-descriptions-item>
          <el-descriptions-item label="个人简介">{{ detail.bio || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="role-box">
          <div class="label">角色设置</div>
          <el-select v-model="detail.role" style="width: 160px">
            <el-option label="USER" value="USER" />
            <el-option label="ADMIN" value="ADMIN" />
          </el-select>
          <el-button type="primary" @click="saveRole">保存角色</el-button>
        </div>

        <div class="role-box">
          <div class="label">名片 / 等级</div>
          <el-select v-model="identityForm.businessCard" clearable placeholder="选择名片" style="width: 180px">
            <el-option v-for="item in businessCards" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="identityForm.userLevel" placeholder="等级" style="width: 140px">
            <el-option v-for="n in 9" :key="n" :label="`Lv${n}用户`" :value="n" />
          </el-select>
          <el-button type="success" @click="saveIdentity">保存名片</el-button>
        </div>

        <div class="achievement-box">
          <div class="label">用户成就</div>
          <div class="achievement-list">
            <el-tag v-for="item in userAchievements.filter(i => i.obtained)" :key="item.id" :style="{ borderColor: item.color || '#22c55e', color: item.color || '#22c55e' }">{{ item.name }}</el-tag>
            <span v-if="userAchievements.filter(i => i.obtained).length === 0" class="empty">暂未获得成就</span>
          </div>
          <div class="grant-row">
            <el-select v-model="grantCode" placeholder="选择要发放的成就" style="width: 220px">
              <el-option v-for="item in userAchievements.filter(i => !i.obtained)" :key="item.id" :label="item.name" :value="item.code" />
            </el-select>
            <el-button type="success" :disabled="!grantCode" @click="grantAchievement">发放成就</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <el-dialog v-model="passwordDialogVisible" title="重置用户密码" width="420px">
      <el-form label-position="top">
        <el-form-item label="新密码">
          <el-input v-model="newPassword" type="password" show-password placeholder="至少 8 位" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitResetPassword">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { grantAchievementApi, getUserAchievementsApi, type UserAchievementItem } from '@/api/achievements'
import { banUserApi, getUserDetailApi, getUserListApi, resetUserPasswordApi, type AdminUserRow, unbanUserApi, updateUserIdentityApi, updateUserRoleApi } from '@/api/users'

const businessCards = ['管理员', '创作者', '开发者', '设计师', 'BOSS']
const loading = ref(false)
const submitting = ref(false)
const keyword = ref('')
const status = ref<number | undefined>()
const pageNo = ref(1)
const pageSize = 10
const total = ref(0)
const rows = ref<AdminUserRow[]>([])
const detailVisible = ref(false)
const passwordDialogVisible = ref(false)
const detail = ref<AdminUserRow | null>(null)
const passwordUserId = ref<string | null>(null)
const newPassword = ref('')
const userAchievements = ref<UserAchievementItem[]>([])
const grantCode = ref('')
const identityForm = reactive({ businessCard: '' as string | null, userLevel: 1 })

const loadData = async () => {
  loading.value = true
  try {
    const { data } = await getUserListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, status: status.value })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  pageNo.value = 1
  await loadData()
}

const handlePageChange = async (page: number) => {
  pageNo.value = page
  await loadData()
}

const toggleBan = async (row: AdminUserRow) => {
  await ElMessageBox.confirm(`确定${row.status === 1 ? '封禁' : '解封'}用户 ${row.username} 吗？`, '操作确认', { type: 'warning' })
  if (row.status === 1) {
    await banUserApi(row.id)
    ElMessage.success('用户已封禁')
  } else {
    await unbanUserApi(row.id)
    ElMessage.success('用户已解封')
  }
  await loadData()
  if (detail.value?.id === row.id) {
    await openDetail(row.id)
  }
}

const openDetail = async (userId: string) => {
  const [{ data }, { data: achievements }] = await Promise.all([
    getUserDetailApi(userId),
    getUserAchievementsApi(userId)
  ])
  detail.value = data
  identityForm.businessCard = data.businessCard || null
  identityForm.userLevel = data.userLevel || 1
  userAchievements.value = achievements
  grantCode.value = ''
  detailVisible.value = true
}

const saveRole = async () => {
  if (!detail.value) return
  await updateUserRoleApi(detail.value.id, detail.value.role as 'USER' | 'ADMIN')
  ElMessage.success('角色已更新')
  await loadData()
  await openDetail(detail.value.id)
}

const saveIdentity = async () => {
  if (!detail.value) return
  await updateUserIdentityApi(detail.value.id, identityForm.businessCard || null, identityForm.userLevel)
  ElMessage.success('名片与等级已更新')
  await loadData()
  await openDetail(detail.value.id)
}

const grantAchievement = async () => {
  if (!detail.value || !grantCode.value) return
  await grantAchievementApi(detail.value.id, grantCode.value)
  ElMessage.success('成就已发放')
  await openDetail(detail.value.id)
  await loadData()
}

const openResetPassword = (row: AdminUserRow) => {
  passwordUserId.value = row.id
  newPassword.value = ''
  passwordDialogVisible.value = true
}

const submitResetPassword = async () => {
  if (!passwordUserId.value) return
  if (newPassword.value.trim().length < 8) {
    ElMessage.warning('新密码至少 8 位')
    return
  }
  submitting.value = true
  try {
    await resetUserPasswordApi(passwordUserId.value, newPassword.value.trim())
    ElMessage.success('密码已重置')
    passwordDialogVisible.value = false
  } finally {
    submitting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pager { margin-top: 16px; display: flex; justify-content: flex-end; }
.detail-wrap { display: flex; flex-direction: column; gap: 16px; }
.role-box, .grant-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.role-box .label, .achievement-box .label { font-weight: 700; }
.achievement-box { display: flex; flex-direction: column; gap: 12px; }
.achievement-list { display: flex; gap: 8px; flex-wrap: wrap; }
.empty { color: var(--admin-sub); }
</style>

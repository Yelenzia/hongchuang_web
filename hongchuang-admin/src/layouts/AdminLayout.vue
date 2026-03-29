<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="mark">HC</div>
        <div>
          <div class="name">鸿创工作室</div>
          <div class="sub">管理后台</div>
        </div>
      </div>

      <RouterLink v-for="item in menuList" :key="item.path" class="menu-item" :to="item.path">
        <span>{{ item.label }}</span>
      </RouterLink>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="title">后台管理系统</div>
        <div class="actions">
          <span class="user">{{ authStore.userInfo?.nickname || '管理员' }}</span>
          <el-button plain @click="logout">退出</el-button>
        </div>
      </header>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAdminAuthStore()
const router = useRouter()

const menuList = [
  { label: '仪表盘', path: '/dashboard' },
  { label: '用户管理', path: '/users' },
  { label: '帖子管理', path: '/posts' },
  { label: '评论管理', path: '/comments' },
  { label: '通知治理', path: '/notifications' },
  { label: '资源管理', path: '/resources' },
  { label: '资源分类', path: '/resource-categories' },
  { label: '板块管理', path: '/boards' },
  { label: '标签管理', path: '/tags' },
  { label: '内容模板', path: '/content-templates' },
  { label: '官网配置', path: '/site-pages' },
  { label: '草稿治理', path: '/drafts' },
  { label: '举报处理', path: '/reports' },
  { label: '公告管理', path: '/announcements' },
  { label: '成就管理', path: '/achievements' }
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}
.sidebar {
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: rgba(255,255,255,.92);
  padding: 18px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 20px;
}
.mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #0ea5b7, #38bdf8);
  font-weight: 700;
}
.name {
  font-weight: 700;
}
.sub {
  font-size: 12px;
  opacity: .7;
}
.menu-item {
  display: flex;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  color: rgba(255,255,255,.72);
  transition: .2s ease;
}
.menu-item:hover,
.menu-item.router-link-active {
  background: rgba(255,255,255,.08);
  color: white;
}
.main {
  display: grid;
  grid-template-rows: 72px 1fr;
}
.topbar {
  background: rgba(255,255,255,.88);
  border-bottom: 1px solid var(--admin-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}
.title {
  font-size: 20px;
  font-weight: 700;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user {
  color: var(--admin-sub);
}
.content {
  padding: 24px;
}
@media (max-width: 980px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}
</style>

<template>
  <header class="header">
    <div class="hc-container header-inner">
      <RouterLink class="brand" to="/">
        <img :src="logoUrl" class="brand-logo" alt="鸿创工作室" />
        <div>
          <div class="brand-name">鸿创工作室</div>
          <div class="brand-sub">Minecraft 创作社区</div>
        </div>
      </RouterLink>

      <nav class="desktop-nav">
        <RouterLink v-for="item in navItems" :key="item.path" class="nav-link" :to="item.path">
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header-search">
        <el-input v-model="searchKeyword" placeholder="搜索帖子、资源、用户" clearable @keyup.enter="goSearch">
          <template #append>
            <el-button @click="goSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="actions">
        <template v-if="authStore.isLogin">
          <RouterLink class="notify-btn" to="/me/notifications">
            🔔<span v-if="appStore.unreadCount" class="notify-badge">{{ appStore.unreadCount > 99 ? '99+' : appStore.unreadCount }}</span>
          </RouterLink>
          <RouterLink class="user-link" to="/me/profile">
            {{ authStore.userInfo?.nickname || authStore.userInfo?.username }}
            <span v-if="authStore.userInfo?.forumUid" class="uid-chip">#{{ authStore.userInfo?.forumUid }}</span>
          </RouterLink>
          <RouterLink to="/post/create"><el-button type="primary" plain>发帖</el-button></RouterLink>
          <RouterLink to="/resources/create"><el-button plain>发资源</el-button></RouterLink>
          <el-button plain @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <RouterLink to="/login"><el-button plain>登录</el-button></RouterLink>
          <RouterLink to="/register"><el-button type="primary">注册</el-button></RouterLink>
        </template>
        <el-button class="mobile-toggle" circle @click="drawerVisible = true">≡</el-button>
      </div>
    </div>

    <el-drawer v-model="drawerVisible" direction="rtl" size="75%">
      <div class="mobile-nav">
        <RouterLink v-for="item in navItems" :key="item.path" class="mobile-link" :to="item.path" @click="drawerVisible = false">
          {{ item.label }}
        </RouterLink>
        <RouterLink v-if="authStore.isLogin" class="mobile-link" to="/me/notifications" @click="drawerVisible = false">消息中心</RouterLink>
        <RouterLink v-if="authStore.isLogin" class="mobile-link" to="/post/create" @click="drawerVisible = false">发帖</RouterLink>
        <RouterLink v-if="authStore.isLogin" class="mobile-link" to="/resources/create" @click="drawerVisible = false">发资源</RouterLink>
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/logo.png'

const authStore = useAuthStore()
const appStore = useAppStore()
const router = useRouter()
const drawerVisible = ref(false)
const searchKeyword = ref('')

const navItems = computed(() => [
  { label: '首页', path: '/' },
  { label: '论坛', path: '/forum' },
  { label: '资源', path: '/resources' },
  { label: '公告', path: '/announcements' },
  { label: '团队联系', path: '/contact' },
  ...(authStore.isLogin ? [{ label: '用户中心', path: '/me/profile' }] : [])
])

const goSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) return
  router.push({ name: 'search', query: { keyword } })
  drawerVisible.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  appStore.unreadCount = 0
  drawerVisible.value = false
  router.push('/')
}

watch(() => authStore.isLogin, async (val) => {
  if (val) {
    await appStore.refreshUnreadCount()
  }
})

onMounted(async () => {
  if (authStore.isLogin) {
    await appStore.refreshUnreadCount()
  }
})
</script>

<style scoped lang="scss">
.header { position: fixed; inset: 0 0 auto 0; z-index: 20; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(229, 231, 235, 0.75); }
.header-inner { height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.brand { display: flex; align-items: center; gap: 12px; min-width: 220px; }
.brand-logo { width: 46px; height: 46px; object-fit: cover; border-radius: 14px; box-shadow: 0 0 18px rgba(34, 211, 238, .25); }
.brand-name { font-weight: 700; }
.brand-sub { font-size: 12px; color: var(--hc-text-secondary); }
.desktop-nav { display: flex; gap: 10px; flex: 1; justify-content: center; }
.header-search { width: min(360px, 100%); }
.nav-link { padding: 10px 14px; border-radius: 12px; color: var(--hc-text-secondary); transition: .2s ease; }
.nav-link:hover, .nav-link.router-link-active { color: #166534; background: rgba(34, 197, 94, 0.08); }
.actions { display: flex; align-items: center; gap: 10px; }
.notify-btn { position: relative; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: rgba(15,23,42,.04); font-size: 18px; }
.notify-badge { position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; background: #ef4444; color: white; font-size: 12px; display: grid; place-items: center; }
.user-link { font-weight: 600; }
.uid-chip { margin-left: 8px; color: #166534; font-weight: 700; }
.mobile-toggle { display: none; }
.mobile-nav { display: flex; flex-direction: column; gap: 10px; }
.mobile-link { padding: 12px 14px; border-radius: 12px; background: #f8fafc; }
@media (max-width: 1100px) { .header-search { width: 240px; } }
@media (max-width: 900px) { .desktop-nav, .header-search { display: none; } .mobile-toggle { display: inline-flex; } }
</style>

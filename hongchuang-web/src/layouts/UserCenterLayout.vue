<template>
  <div>
    <AppHeader />
    <main class="user-center hc-container">
      <aside class="hc-card sidebar minecraft-card">
        <div class="sidebar-title">用户中心</div>
        <RouterLink class="sidebar-link" to="/me/profile">个人资料</RouterLink>
        <RouterLink class="sidebar-link" to="/me/favorites">我的收藏</RouterLink>
        <RouterLink class="sidebar-link" to="/me/follows">我的关注</RouterLink>
        <RouterLink class="sidebar-link" to="/me/fans">我的粉丝</RouterLink>
        <RouterLink class="sidebar-link" to="/me/achievements">我的成就</RouterLink>
        <RouterLink class="sidebar-link" to="/me/posts">我的帖子</RouterLink>
        <RouterLink class="sidebar-link" to="/me/drafts">草稿箱</RouterLink>
        <RouterLink class="sidebar-link" to="/me/notifications">消息中心</RouterLink>
        <RouterLink class="sidebar-link" to="/me/messages">私信</RouterLink>
        <RouterLink class="sidebar-link" to="/me/security">安全设置</RouterLink>
      </aside>
      <section class="content hc-card">
        <router-view :key="$route.fullPath" />
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped lang="scss">
.user-center {
  padding-top: 108px;
  padding-bottom: 48px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
}
.sidebar {
  padding: 20px;
  height: fit-content;
}
.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}
.sidebar-link {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--hc-text-secondary);
  margin-bottom: 8px;
  transition: all .2s ease;
}
.sidebar-link:hover,
.sidebar-link.router-link-active {
  background: rgba(34, 197, 94, 0.08);
  color: #166534;
}
.content {
  padding: 24px;
}
@media (max-width: 900px) {
  .user-center {
    grid-template-columns: 1fr;
  }
}
</style>

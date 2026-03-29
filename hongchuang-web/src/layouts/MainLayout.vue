<template>
  <div>
    <AppHeader />
    <main class="main-layout">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped lang="scss">
.main-layout {
  min-height: calc(100vh - 160px);
  padding-top: 84px;
}
</style>

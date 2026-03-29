<template>
  <div class="empty-state">
    <div class="title">{{ title }}</div>
    <div class="desc">{{ desc }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; desc?: string }>()
</script>

<style scoped lang="scss">
.empty-state {
  padding: 48px 20px;
  text-align: center;
  color: var(--hc-text-secondary);
}
.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--hc-text);
  margin-bottom: 8px;
}
.desc {
  line-height: 1.7;
}
</style>

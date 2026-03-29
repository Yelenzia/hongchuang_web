<template>
  <div class="page-header">
    <div>
      <h1>{{ title }}</h1>
      <p>{{ desc }}</p>
    </div>
    <div class="extra">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; desc: string }>()
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 18px;
}
h1 {
  margin: 0 0 10px;
  font-size: 28px;
}
p {
  margin: 0;
  color: var(--admin-sub);
}
@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

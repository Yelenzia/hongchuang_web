<template>
  <button class="tag-chip" :class="{ clickable }" type="button" @click="$emit('click')"># {{ label }}</button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  clickable?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
.tag-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  background: rgba(18, 181, 203, 0.08);
  color: var(--hc-primary-deep);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: none;
}
.tag-chip.clickable {
  cursor: pointer;
}
</style>

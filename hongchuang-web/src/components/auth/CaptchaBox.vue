<template>
  <div class="captcha-box">
    <el-input :model-value="modelValue" placeholder="请输入图形验证码" @update:model-value="$emit('update:modelValue', $event)" />
    <img v-if="imageBase64" :src="imageBase64" class="captcha-img" alt="captcha" @click="$emit('refresh')" />
    <el-button v-else plain @click="$emit('refresh')">获取验证码</el-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  imageBase64?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'refresh'): void
}>()
</script>

<style scoped lang="scss">
.captcha-box {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 132px;
  gap: 10px;
}
.captcha-img {
  width: 132px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  cursor: pointer;
  background: #f8fafc;
}
</style>

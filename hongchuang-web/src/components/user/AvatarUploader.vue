<template>
  <div class="uploader hc-card">
    <div class="preview-box">
      <img v-if="previewUrl" :src="previewUrl" alt="avatar" class="preview" />
      <div v-else class="fallback">{{ fallbackText }}</div>
    </div>
    <div class="content">
      <div class="title">头像设置</div>
      <div class="desc">支持 JPG / PNG / WEBP / GIF，大小不超过 2MB。推荐上传偏像素风、方块风或科技感头像。</div>
      <el-upload :show-file-list="false" :auto-upload="false" accept=".jpg,.jpeg,.png,.webp,.gif" :on-change="handleSelect">
        <el-button :loading="uploading" type="primary" plain>上传头像</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import { uploadAvatarApi } from '@/api/upload'
import { resolveFileUrl } from '@/utils/file'

const props = defineProps<{
  modelValue?: string | null
  displayName?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const previewUrl = ref(resolveFileUrl(props.modelValue || ''))
const uploading = ref(false)

watch(() => props.modelValue, (value) => {
  previewUrl.value = resolveFileUrl(value || '')
})

const fallbackText = computed(() => (props.displayName?.slice(0, 1) || 'HC').toUpperCase())

const handleSelect = async (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return
  uploading.value = true
  try {
    const { data } = await uploadAvatarApi(uploadFile.raw)
    previewUrl.value = resolveFileUrl(data.url)
    emit('update:modelValue', data.url)
    ElMessage.success('头像上传成功')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped lang="scss">
.uploader {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.preview-box {
  width: 84px;
  height: 84px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a, #22c55e);
  flex-shrink: 0;
}
.preview, .fallback {
  width: 100%;
  height: 100%;
}
.preview {
  object-fit: cover;
}
.fallback {
  display: grid;
  place-items: center;
  color: white;
  font-size: 28px;
  font-weight: 800;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.title {
  font-size: 18px;
  font-weight: 700;
}
.desc {
  color: var(--hc-text-secondary);
  line-height: 1.7;
}
@media (max-width: 700px) {
  .uploader {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="hc-container create-page">
    <div class="hc-card editor-card minecraft-card">
      <div class="head">
        <div>
          <div class="badge">社区发帖</div>
          <h1>{{ isEditMode ? '编辑帖子' : '发布新帖子' }}</h1>
          <p>现在支持 Markdown、代码块、图片上传、模板套用、手动保存草稿和自动保存。</p>
        </div>
        <div class="head-actions">
          <RouterLink to="/me/drafts"><el-button plain>打开草稿箱</el-button></RouterLink>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" v-loading="loading">
        <div class="grid-row">
          <el-form-item label="所属板块" prop="boardId">
            <el-select v-model="form.boardId" style="width: 100%" placeholder="请选择板块">
              <el-option v-for="board in forumStore.boards" :key="board.id" :label="board.name" :value="board.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板选择">
            <div class="template-row">
              <el-select v-model="selectedTemplateId" clearable style="width: 100%" placeholder="选择模板后可一键套用">
                <el-option v-for="item in templates" :key="item.id" :label="item.templateName" :value="item.id" />
              </el-select>
              <el-button plain :disabled="!selectedTemplateId" @click="applyTemplate">套用模板</el-button>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="标题" prop="title"><el-input v-model="form.title" maxlength="150" show-word-limit /></el-form-item>
        <el-form-item label="摘要" prop="summary"><el-input v-model="form.summary" maxlength="300" show-word-limit type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="标签">
          <el-select v-model="form.tagIds" multiple collapse-tags style="width: 100%" placeholder="最多选择 5 个标签">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="正文" prop="contentMd">
          <MarkdownEditor v-model="form.contentMd">
            <template #extra>
              <div class="editor-status">
                <span v-if="lastSavedAt">最近保存：{{ lastSavedAt }}</span>
                <span v-else>尚未保存草稿</span>
              </div>
            </template>
          </MarkdownEditor>
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-button @click="router.back()">取消</el-button>
        <el-button plain :loading="draftSubmitting" @click="saveDraft(false)">保存草稿</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">{{ isEditMode ? '保存修改' : '发布帖子' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useForumStore } from '@/store/forum'
import { getTagsApi } from '@/api/tag'
import { createPostApi, getPostDetailApi, updatePostApi } from '@/api/post'
import type { TagItem } from '@/types/forum'
import { useAuthStore } from '@/store/auth'
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue'
import { getContentTemplatesApi, getDraftDetailApi, saveDraftApi } from '@/api/content'
import type { ContentTemplateItem } from '@/types/content'

const formRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()
const forumStore = useForumStore()
const authStore = useAuthStore()
const tags = ref<TagItem[]>([])
const templates = ref<ContentTemplateItem[]>([])
const selectedTemplateId = ref('')
const submitting = ref(false)
const draftSubmitting = ref(false)
const loading = ref(false)
const draftId = ref('')
const lastSavedAt = ref('')
let draftTimer: number | undefined
let draftReady = false

const form = reactive({
  boardId: undefined as string | undefined,
  title: '',
  summary: '',
  tagIds: [] as string[],
  contentMd: ''
})

const postId = computed(() => String(route.params.id || ''))
const isEditMode = computed(() => route.name === 'post-edit' && !!postId.value)
const draftQueryId = computed(() => String(route.query.draftId || ''))

const rules: FormRules<typeof form> = {
  boardId: [{ required: true, message: '请选择板块', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 3, max: 150, message: '标题长度需在 3~150 位之间', trigger: 'blur' }],
  summary: [{ max: 300, message: '摘要不能超过 300 字', trigger: 'blur' }],
  contentMd: [{ required: true, message: '请输入正文', trigger: 'blur' }]
}

const selectedTemplate = computed(() => templates.value.find(item => item.id === selectedTemplateId.value))

const touchSavedAt = () => {
  lastSavedAt.value = new Date().toLocaleString('zh-CN', { hour12: false })
}

const applyTemplate = async () => {
  const template = selectedTemplate.value
  if (!template) return
  if (form.title || form.contentMd) {
    await ElMessageBox.confirm('套用模板会把示例内容填入编辑器，确定继续吗？', '套用模板', { type: 'warning' })
  }
  form.title = template.titleExample || ''
  form.summary = template.summaryExample || ''
  form.contentMd = template.contentMarkdown || ''
  if (template.extraData?.boardId) {
    form.boardId = String(template.extraData.boardId)
  }
}

const loadDetail = async () => {
  if (!isEditMode.value) return
  loading.value = true
  try {
    const { data } = await getPostDetailApi(postId.value)
    if (authStore.userInfo?.id !== data.authorId) {
      ElMessage.error('你无权编辑这篇帖子')
      router.replace(`/post/${postId.value}`)
      return
    }
    form.boardId = data.boardId
    form.title = data.title
    form.summary = data.summary || ''
    form.tagIds = data.tags.map(tag => tag.id)
    form.contentMd = data.contentMd
  } finally {
    loading.value = false
  }
}

const loadDraft = async () => {
  if (!draftQueryId.value || isEditMode.value) return
  loading.value = true
  try {
    const { data } = await getDraftDetailApi(draftQueryId.value)
    draftId.value = data.id
    form.title = data.title || ''
    form.summary = data.summary || ''
    form.contentMd = data.contentMarkdown || ''
    form.boardId = data.extraData?.boardId ? String(data.extraData.boardId) : undefined
    form.tagIds = Array.isArray(data.extraData?.tagIds) ? data.extraData.tagIds.map((item: unknown) => String(item)) : []
    touchSavedAt()
  } finally {
    loading.value = false
  }
}

const saveDraft = async (autoSaved: boolean) => {
  if (!authStore.isLogin) return
  const payload = {
    id: draftId.value || undefined,
    draftType: 'POST',
    sceneCode: selectedTemplate.value?.sceneCode || 'GENERAL',
    title: form.title,
    summary: form.summary,
    contentMarkdown: form.contentMd,
    extraData: {
      boardId: form.boardId,
      tagIds: form.tagIds,
      postId: isEditMode.value ? postId.value : undefined
    },
    autoSaved
  }
  if (!autoSaved) {
    draftSubmitting.value = true
  }
  try {
    const { data } = await saveDraftApi(payload)
    draftId.value = data.draftId
    touchSavedAt()
    if (!autoSaved) ElMessage.success('草稿已保存')
  } finally {
    if (!autoSaved) draftSubmitting.value = false
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (form.tagIds.length > 5) return ElMessage.warning('最多选择 5 个标签')
  submitting.value = true
  try {
    const payload = {
      boardId: form.boardId!,
      title: form.title,
      summary: form.summary,
      tagIds: form.tagIds,
      contentMd: form.contentMd
    }
    if (isEditMode.value) {
      await updatePostApi(postId.value, payload)
      ElMessage.success('帖子修改成功')
      router.push(`/post/${postId.value}`)
    } else {
      const { data } = await createPostApi(payload)
      ElMessage.success('发帖成功')
      router.push(`/post/${data.postId}`)
    }
  } finally {
    submitting.value = false
  }
}

watch(() => ({ ...form, tagIds: [...form.tagIds] }), () => {
  if (!draftReady || isEditMode.value) return
  window.clearTimeout(draftTimer)
  draftTimer = window.setTimeout(() => {
    if (!form.title && !form.summary && !form.contentMd) return
    saveDraft(true).catch(() => undefined)
  }, 1800)
}, { deep: true })

onMounted(async () => {
  await authStore.initialize()
  await forumStore.loadBoards()
  const [{ data: tagData }, { data: templateData }] = await Promise.all([
    getTagsApi(),
    getContentTemplatesApi({ templateType: 'POST' })
  ])
  tags.value = tagData
  templates.value = templateData
  await loadDetail()
  await loadDraft()
  draftReady = true
})

onBeforeUnmount(() => {
  window.clearTimeout(draftTimer)
})
</script>

<style scoped lang="scss">
.create-page { padding-top: 108px; padding-bottom: 48px; }
.editor-card { padding: 28px; }
.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(18, 181, 203, 0.08); color: var(--hc-primary-deep); font-weight: 700; }
.head { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.head h1 { margin: 16px 0 10px; }
.head p { margin: 0; color: var(--hc-text-secondary); line-height: 1.75; }
.grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.template-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.editor-status { color: var(--hc-text-secondary); font-size: 13px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
@media (max-width: 900px) {
  .grid-row { grid-template-columns: 1fr; }
  .head { flex-direction: column; }
  .template-row { grid-template-columns: 1fr; }
}
</style>

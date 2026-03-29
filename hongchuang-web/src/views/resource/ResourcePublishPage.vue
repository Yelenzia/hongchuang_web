<template>
  <div class="resource-publish-page hc-container">
    <section class="hc-card minecraft-card editor-card">
      <div class="head">
        <div>
          <div class="badge">资源发布</div>
          <h1>{{ isEditMode ? '更新资源内容与版本' : '发布新的 Minecraft 资源' }}</h1>
          <p>资源说明和更新日志都支持 Markdown、代码块、图片上传、模板套用与自动保存草稿。</p>
        </div>
        <div class="head-actions">
          <RouterLink to="/me/drafts"><el-button plain>打开草稿箱</el-button></RouterLink>
        </div>
      </div>

      <el-form :model="form" label-position="top" v-loading="loading">
        <div class="grid-2">
          <el-form-item label="资源分类">
            <el-select v-model="form.categoryId" style="width: 100%" placeholder="请选择资源分类">
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板选择">
            <div class="template-row">
              <el-select v-model="selectedTemplateId" clearable style="width: 100%" placeholder="选择模板后可快速生成结构">
                <el-option v-for="item in templates" :key="item.id" :label="item.templateName" :value="item.id" />
              </el-select>
              <el-button plain :disabled="!selectedTemplateId" @click="applyTemplate">套用模板</el-button>
            </div>
          </el-form-item>
        </div>

        <el-form-item label="资源标题">
          <el-input v-model="form.title" maxlength="120" show-word-limit />
        </el-form-item>

        <div class="grid-2">
          <el-form-item label="资源简介">
            <el-input v-model="form.summary" type="textarea" :rows="3" maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item label="封面上传">
            <div class="cover-uploader hc-card">
              <img v-if="form.coverUrl" :src="resolveFileUrl(form.coverUrl)" class="cover-preview" alt="cover" />
              <div v-else class="cover-placeholder">建议上传 16:9 封面图</div>
              <el-upload :show-file-list="false" :auto-upload="false" accept=".jpg,.jpeg,.png,.webp,.gif,.bmp" :on-change="handleCoverUpload">
                <el-button plain>上传封面</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </div>

        <div class="grid-3">
          <el-form-item label="版本号"><el-input v-model="form.initialVersion.versionNo" /></el-form-item>
          <el-form-item label="支持的 MC 版本"><el-input v-model="form.initialVersion.mcVersions" placeholder="例如 1.12.2, 1.20.x" /></el-form-item>
          <el-form-item label="下载方式">
            <el-select v-model="form.initialVersion.downloadType" style="width: 100%">
              <el-option label="下载链接" value="LINK" />
              <el-option label="站内文件" value="FILE" />
            </el-select>
          </el-form-item>
        </div>

        <div class="grid-2">
          <el-form-item label="下载链接">
            <el-input v-model="form.initialVersion.downloadUrl" :disabled="form.initialVersion.downloadType === 'FILE'" placeholder="下载链接 / 站内文件路径" />
          </el-form-item>
          <el-form-item label="资源标签">
            <el-select v-model="form.tagIds" multiple filterable clearable collapse-tags collapse-tags-tooltip style="width: 100%" placeholder="最多建议选择 5 个标签">
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="详细介绍">
          <MarkdownEditor v-model="form.content">
            <template #extra>
              <div class="editor-status">{{ lastSavedAt ? `最近保存：${lastSavedAt}` : '尚未保存草稿' }}</div>
            </template>
          </MarkdownEditor>
        </el-form-item>

        <el-form-item label="更新日志">
          <MarkdownEditor v-model="form.initialVersion.changelog" placeholder="建议在这里写每个版本的更新点、修复项和兼容说明" />
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-button @click="router.back()">取消</el-button>
        <el-button plain :loading="draftSubmitting" @click="saveDraft(false)">保存草稿</el-button>
        <el-button type="primary" :loading="submitting" @click="submit(false)">保存资源</el-button>
        <el-button type="success" :loading="submitting" @click="submit(true)">提交审核</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue'
import { resolveFileUrl } from '@/utils/file'
import { getContentTemplatesApi, getDraftDetailApi, saveDraftApi } from '@/api/content'
import type { ContentTemplateItem } from '@/types/content'
import { getResourceCategoriesApi, getResourceDetailApi, createResourceApi, updateResourceApi, submitResourceAuditApi } from '@/api/resource'
import { getTagsApi } from '@/api/tag'
import type { TagItem } from '@/types/forum'
import type { ResourceCategoryItem } from '@/types/resource'
import { uploadResourceCoverApi } from '@/api/upload'

const route = useRoute()
const router = useRouter()
const categories = ref<ResourceCategoryItem[]>([])
const templates = ref<ContentTemplateItem[]>([])
const tags = ref<TagItem[]>([])
const selectedTemplateId = ref('')
const loading = ref(false)
const submitting = ref(false)
const draftSubmitting = ref(false)
const draftId = ref('')
const lastSavedAt = ref('')
let draftTimer: number | undefined
let draftReady = false

const resourceId = computed(() => String(route.params.id || ''))
const isEditMode = computed(() => !!route.params.id)
const draftQueryId = computed(() => String(route.query.draftId || ''))
const form = reactive({
  categoryId: '',
  title: '',
  summary: '',
  content: '',
  coverUrl: '',
  tagIds: [] as string[],
  initialVersion: {
    versionNo: '',
    changelog: '',
    mcVersions: '',
    downloadType: 'LINK',
    downloadUrl: '',
    fileUrl: ''
  }
})

const selectedTemplate = computed(() => templates.value.find(item => item.id === selectedTemplateId.value))
const touchSavedAt = () => { lastSavedAt.value = new Date().toLocaleString('zh-CN', { hour12: false }) }

const applyTemplate = async () => {
  const template = selectedTemplate.value
  if (!template) return
  if (form.title || form.content) {
    await ElMessageBox.confirm('套用模板会覆盖当前填写的部分内容，确定继续吗？', '套用模板', { type: 'warning' })
  }
  form.title = template.titleExample || ''
  form.summary = template.summaryExample || ''
  form.content = template.contentMarkdown || ''
}

const handleCoverUpload = async (uploadFile: UploadFile) => {
  const raw = uploadFile.raw as File | undefined
  if (!raw) return
  const { data } = await uploadResourceCoverApi(raw)
  form.coverUrl = data.url
  ElMessage.success('封面上传成功')
}

const loadDetail = async () => {
  if (!isEditMode.value) return
  loading.value = true
  try {
    const { data } = await getResourceDetailApi(resourceId.value)
    form.categoryId = data.categoryId
    form.title = data.title
    form.summary = data.summary || ''
    form.content = data.content || ''
    form.coverUrl = data.coverUrl || ''
    form.tagIds = (data.tags || []).map(item => item.id)
    form.initialVersion.versionNo = data.currentVersion?.versionNo || data.currentVersionNo || ''
    form.initialVersion.changelog = data.currentVersion?.changelog || ''
    form.initialVersion.mcVersions = data.currentVersion?.mcVersions || data.mcVersions || ''
    form.initialVersion.downloadType = data.currentVersion?.downloadType || data.downloadType || 'LINK'
    form.initialVersion.downloadUrl = data.currentVersion?.downloadUrl || data.downloadUrl || ''
    form.initialVersion.fileUrl = data.currentVersion?.fileUrl || data.fileUrl || ''
  } finally {
    loading.value = false
  }
}

const loadDraft = async () => {
  if (!draftQueryId.value || isEditMode.value) return
  const { data } = await getDraftDetailApi(draftQueryId.value)
  draftId.value = data.id
  form.categoryId = data.extraData?.categoryId ? String(data.extraData.categoryId) : ''
  form.title = data.title || ''
  form.summary = data.summary || ''
  form.content = data.contentMarkdown || ''
  form.coverUrl = data.extraData?.coverUrl || ''
  form.tagIds = Array.isArray(data.extraData?.tagIds) ? data.extraData.tagIds.map((item: string | number) => String(item)) : []
  form.initialVersion.versionNo = data.extraData?.initialVersion?.versionNo || ''
  form.initialVersion.changelog = data.extraData?.initialVersion?.changelog || ''
  form.initialVersion.mcVersions = data.extraData?.initialVersion?.mcVersions || ''
  form.initialVersion.downloadType = data.extraData?.initialVersion?.downloadType || 'LINK'
  form.initialVersion.downloadUrl = data.extraData?.initialVersion?.downloadUrl || ''
  form.initialVersion.fileUrl = data.extraData?.initialVersion?.fileUrl || ''
  touchSavedAt()
}

const saveDraft = async (autoSaved: boolean) => {
  const payload = {
    id: draftId.value || undefined,
    draftType: 'RESOURCE',
    sceneCode: selectedTemplate.value?.sceneCode || 'RESOURCE_GENERAL',
    title: form.title,
    summary: form.summary,
    contentMarkdown: form.content,
    extraData: {
      categoryId: form.categoryId,
      coverUrl: form.coverUrl,
      tagIds: [...form.tagIds],
      initialVersion: { ...form.initialVersion },
      resourceId: isEditMode.value ? resourceId.value : undefined
    },
    autoSaved
  }
  if (!autoSaved) draftSubmitting.value = true
  try {
    const { data } = await saveDraftApi(payload)
    draftId.value = data.draftId
    touchSavedAt()
    if (!autoSaved) ElMessage.success('资源草稿已保存')
  } finally {
    if (!autoSaved) draftSubmitting.value = false
  }
}

const submit = async (auditAfterSave: boolean) => {
  if (!form.categoryId || !form.title || !form.content || !form.initialVersion.versionNo) {
    ElMessage.warning('请先补全资源分类、标题、详细介绍和版本号')
    return
  }
  if (form.tagIds.length > 5) {
    ElMessage.warning('最多选择 5 个标签')
    return
  }
  submitting.value = true
  try {
    const payload = {
      categoryId: form.categoryId,
      title: form.title,
      summary: form.summary,
      content: form.content,
      coverUrl: form.coverUrl,
      tagIds: form.tagIds,
      initialVersion: { ...form.initialVersion },
      saveAsDraft: false
    }
    if (isEditMode.value) {
      await updateResourceApi(resourceId.value, payload)
      if (auditAfterSave) await submitResourceAuditApi(resourceId.value)
    } else {
      const { data } = await createResourceApi(payload)
      if (auditAfterSave) await submitResourceAuditApi(data.resourceId)
    }
    ElMessage.success(auditAfterSave ? '资源已提交审核' : '资源已保存')
    router.push('/me/drafts')
  } finally {
    submitting.value = false
  }
}

watch(() => JSON.stringify(form), () => {
  if (!draftReady || isEditMode.value) return
  window.clearTimeout(draftTimer)
  draftTimer = window.setTimeout(() => {
    if (!form.title && !form.summary && !form.content) return
    saveDraft(true).catch(() => undefined)
  }, 1800)
})

onMounted(async () => {
  loading.value = true
  try {
    const [{ data: categoryData }, { data: templateData }, { data: tagData }] = await Promise.all([
      getResourceCategoriesApi(),
      getContentTemplatesApi({ templateType: 'RESOURCE' }),
      getTagsApi()
    ])
    categories.value = categoryData
    templates.value = templateData
    tags.value = tagData.filter(item => item.status !== 0)
    await loadDetail()
    await loadDraft()
  } finally {
    loading.value = false
    draftReady = true
  }
})

onBeforeUnmount(() => window.clearTimeout(draftTimer))
</script>

<style scoped lang="scss">
.resource-publish-page { padding-top: 108px; padding-bottom: 48px; }
.editor-card { padding: 28px; }
.badge { display: inline-flex; padding: 8px 14px; border-radius: 999px; background: rgba(34, 197, 94, 0.1); color: #166534; font-weight: 700; }
.head { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
.head h1 { margin: 16px 0 10px; }
.head p { margin: 0; color: var(--hc-text-secondary); line-height: 1.8; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.template-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.cover-uploader { padding: 14px; display: grid; gap: 10px; }
.cover-placeholder { min-height: 140px; display: grid; place-items: center; color: var(--hc-text-secondary); background: #f8fafc; border-radius: 14px; }
.cover-preview { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 14px; }
.editor-status { color: var(--hc-text-secondary); font-size: 13px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
@media (max-width: 900px) {
  .head { flex-direction: column; }
  .grid-2, .grid-3, .template-row { grid-template-columns: 1fr; }
}
</style>

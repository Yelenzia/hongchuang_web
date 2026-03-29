<template>
  <div :class="['markdown-editor', { fullscreen }]">
    <div class="toolbar">
      <div class="left-tools">
        <el-button-group>
          <el-button plain @click="insertAtCursor('# 标题')">标题</el-button>
          <el-button plain @click="insertAround('**', '**')">粗体</el-button>
          <el-button plain @click="insertAround('*', '*')">斜体</el-button>
          <el-button plain @click="insertAtCursor('> 引用内容')">引用</el-button>
          <el-button plain @click="insertAtCursor('- 列表项')">列表</el-button>
          <el-button plain @click="insertAtCursor('1. 有序列表')">有序</el-button>
          <el-button plain @click="insertAtCursor('---')">分割线</el-button>
          <el-button plain @click="insertAtCursor('[链接文本](https://example.com)')">链接</el-button>
          <el-button plain @click="insertAtCursor(tableSnippet)">表格</el-button>
          <el-button plain @click="insertAtCursor(codeSnippet)">代码块</el-button>
        </el-button-group>
      </div>
      <div class="right-tools">
        <el-upload :show-file-list="false" :auto-upload="false" accept=".jpg,.jpeg,.png,.webp,.gif,.bmp" :on-change="handleImageUpload">
          <el-button plain>插入图片</el-button>
        </el-upload>
        <el-upload :show-file-list="false" :auto-upload="false" :on-change="handleFileUpload">
          <el-button plain>插入附件</el-button>
        </el-upload>
        <el-button plain @click="fullscreen = !fullscreen">{{ fullscreen ? '退出全屏' : '全屏编辑' }}</el-button>
      </div>
    </div>

    <div class="mode-switch">
      <el-radio-group v-model="tab">
        <el-radio-button label="edit">编辑</el-radio-button>
        <el-radio-button label="preview">预览</el-radio-button>
      </el-radio-group>
      <slot name="extra" />
    </div>

    <div v-if="tab === 'edit'" class="editor-pane">
      <textarea ref="textareaRef" class="editor-textarea" :placeholder="placeholder" :value="modelValue" @input="handleInput"></textarea>
    </div>
    <div v-else class="preview-pane hc-card">
      <MarkdownPreview :content="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import MarkdownPreview from './MarkdownPreview.vue'
import { uploadEditorImageApi, uploadPostFileApi } from '@/api/upload'

const props = withDefaults(defineProps<{ modelValue: string; placeholder?: string }>(), {
  placeholder: '支持 Markdown、图片上传、代码块、表格与预览模式'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tab = ref<'edit' | 'preview'>('edit')
const fullscreen = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const tableSnippet = '| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |'
const codeSnippet = '```java\nSystem.out.println("Hello");\n```'

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

const updateValue = (value: string) => emit('update:modelValue', value)

const insertAtCursor = (snippet: string) => {
  const textarea = textareaRef.value
  const current = props.modelValue || ''
  if (!textarea) {
    updateValue(`${current}${current && !current.endsWith('\n') ? '\n' : ''}${snippet}`)
    return
  }
  const start = textarea.selectionStart || 0
  const end = textarea.selectionEnd || 0
  const next = `${current.slice(0, start)}${snippet}${current.slice(end)}`
  updateValue(next)
  requestAnimationFrame(() => {
    textarea.focus()
    const cursor = start + snippet.length
    textarea.setSelectionRange(cursor, cursor)
  })
}

const insertAround = (before: string, after: string) => {
  const textarea = textareaRef.value
  const current = props.modelValue || ''
  if (!textarea) {
    insertAtCursor(`${before}文本${after}`)
    return
  }
  const start = textarea.selectionStart || 0
  const end = textarea.selectionEnd || 0
  const selected = current.slice(start, end) || '文本'
  const snippet = `${before}${selected}${after}`
  const next = `${current.slice(0, start)}${snippet}${current.slice(end)}`
  updateValue(next)
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

const handleImageUpload = async (uploadFile: UploadFile) => {
  const raw = uploadFile.raw as File | undefined
  if (!raw) return
  const { data } = await uploadEditorImageApi(raw)
  insertAtCursor(`${props.modelValue && !props.modelValue.endsWith('\n') ? '\n' : ''}${data.markdown || `![](${data.url})`}\n`)
  ElMessage.success('图片上传成功')
}

const handleFileUpload = async (uploadFile: UploadFile) => {
  const raw = uploadFile.raw as File | undefined
  if (!raw) return
  const { data } = await uploadPostFileApi(raw)
  insertAtCursor(`${props.modelValue && !props.modelValue.endsWith('\n') ? '\n' : ''}${data.markdown || `[附件：${data.name}](${data.url})`}\n`)
  ElMessage.success('附件上传成功')
}
</script>

<style scoped lang="scss">
.markdown-editor {
  display: grid;
  gap: 12px;
}
.markdown-editor.fullscreen {
  position: fixed;
  inset: 16px;
  z-index: 3000;
  background: white;
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 30px 100px rgba(15, 23, 42, 0.18);
}
.toolbar, .mode-switch {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.left-tools, .right-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.editor-pane {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  overflow: hidden;
  background: white;
}
.editor-textarea {
  width: 100%;
  min-height: 420px;
  padding: 16px 18px;
  border: none;
  outline: none;
  resize: vertical;
  font: inherit;
  line-height: 1.8;
  color: var(--hc-text);
}
.preview-pane {
  min-height: 420px;
  padding: 18px;
}
</style>

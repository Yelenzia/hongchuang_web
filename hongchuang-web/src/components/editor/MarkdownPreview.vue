<template>
  <div class="markdown-preview" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{ content?: string }>()
const html = computed(() => renderMarkdown(props.content || ''))
</script>

<style scoped lang="scss">
.markdown-preview {
  min-height: 220px;
  line-height: 1.85;
  color: var(--hc-text);
  word-break: break-word;
}
.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  margin: 18px 0 12px;
  line-height: 1.4;
}
.markdown-preview :deep(h1) { font-size: 30px; }
.markdown-preview :deep(h2) { font-size: 24px; }
.markdown-preview :deep(h3) { font-size: 20px; }
.markdown-preview :deep(p) { margin: 12px 0; }
.markdown-preview :deep(blockquote) {
  margin: 14px 0;
  padding: 12px 16px;
  border-left: 4px solid var(--hc-primary);
  background: rgba(14, 165, 183, 0.06);
  border-radius: 10px;
}
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}
.markdown-preview :deep(li) { margin: 6px 0; }
.markdown-preview :deep(a) { color: #0f766e; text-decoration: underline; }
.markdown-preview :deep(img) {
  display: block;
  max-width: 100%;
  border-radius: 16px;
  margin: 14px 0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}
.markdown-preview :deep(code) {
  background: #eef2ff;
  color: #4338ca;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 13px;
}
.markdown-preview :deep(.code-block) {
  margin: 16px 0;
  overflow: auto;
  border-radius: 16px;
  background: #0f172a;
  color: #e2e8f0;
}
.markdown-preview :deep(.code-head) {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.markdown-preview :deep(pre code) {
  display: block;
  padding: 16px;
  background: transparent;
  color: inherit;
  white-space: pre;
  font-size: 13px;
  line-height: 1.75;
}
.markdown-preview :deep(.token.keyword) { color: #93c5fd; }
.markdown-preview :deep(.token.string) { color: #86efac; }
.markdown-preview :deep(.token.comment) { color: #94a3b8; }
.markdown-preview :deep(hr) {
  border: none;
  height: 1px;
  background: rgba(148, 163, 184, 0.4);
  margin: 20px 0;
}
.markdown-preview :deep(.table-wrap) { overflow: auto; margin: 16px 0; }
.markdown-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 14px;
  overflow: hidden;
}
.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 10px 12px;
  text-align: left;
}
.markdown-preview :deep(th) { background: #f8fafc; }
.markdown-preview :deep(.md-gap) { height: 6px; }
</style>

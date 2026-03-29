<template>
  <div class="hc-container contact-page" v-loading="loading">
    <div class="page-head">
      <div>
        <h1>{{ pageMeta.title }}</h1>
        <p>{{ pageMeta.subtitle }}</p>
      </div>
      <img :src="logoUrl" class="contact-logo" alt="鸿创工作室 Logo" />
    </div>

    <div class="contact-grid">
      <div class="hc-card contact-card minecraft-card">
        <div class="card-title">官方联系</div>
        <div class="contact-item"><span class="label">QQ交流群</span><span class="value">{{ content.qqGroup }}</span></div>
        <div class="contact-item"><span class="label">团队负责人邮箱</span><span class="value">{{ content.ownerEmail }}</span></div>
      </div>

      <div class="hc-card contact-card minecraft-card">
        <div class="card-title">技术部成员</div>
        <div class="member-grid">
          <div v-for="member in content.members" :key="member.name + member.contact" class="member-item">
            <div class="name">{{ member.name }}</div>
            <div class="desc">{{ member.contact }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="hc-card footer-card minecraft-card">
      <div class="brand">{{ content.brandText }}</div>
      <div class="copyright">{{ content.copyrightText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getSitePageApi } from '@/api/site'
import logoUrl from '@/assets/images/logo.png'

const loading = ref(false)
const pageMeta = reactive({
  title: '团队联系',
  subtitle: '有合作、咨询或交流需求时，可以通过下面的方式联系到我们。'
})
const content = reactive({
  qqGroup: '856418269',
  ownerEmail: '2930255795@qq.com',
  brandText: '鸿创工作室 · Minecraft 创作与交流社区',
  copyrightText: '© 2026 鸿创工作室. All Rights Reserved.',
  members: [
    { name: '叶子', contact: '邮箱：Yelenas@qq.com' },
    { name: '蓝技术', contact: '邮箱：1738964540@qq.com' },
    { name: 'flyer技术', contact: '微信：xin99666666666' },
    { name: 'Aufransi', contact: '邮箱：hsoooma@163.com' },
    { name: 'MC_NianGao', contact: '邮箱：1755722148@qq.com' },
    { name: '喵喵', contact: '邮箱：2128579278@qq.com' }
  ]
})

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await getSitePageApi('CONTACT')
    pageMeta.title = data.title || pageMeta.title
    pageMeta.subtitle = data.subtitle || pageMeta.subtitle
    const parsed = JSON.parse(data.contentJson || '{}')
    content.qqGroup = parsed.qqGroup || content.qqGroup
    content.ownerEmail = parsed.ownerEmail || content.ownerEmail
    content.brandText = parsed.brandText || content.brandText
    content.copyrightText = parsed.copyrightText || content.copyrightText
    if (Array.isArray(parsed.members) && parsed.members.length) {
      content.members.splice(0, content.members.length, ...parsed.members)
    }
  } catch {
    // 默认内容兜底
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.contact-page { padding: 32px 0 56px; }
.page-head { margin-bottom: 24px; display: flex; justify-content: space-between; gap: 20px; align-items: center; }
.page-head h1 { font-size: 32px; margin-bottom: 8px; }
.page-head p { color: #6b7280; max-width: 720px; }
.contact-logo { width: 84px; height: 84px; border-radius: 22px; object-fit: cover; box-shadow: 0 0 20px rgba(34,211,238,.2); }
.contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; }
.contact-card { padding: 24px; }
.card-title { font-size: 18px; font-weight: 700; margin-bottom: 18px; }
.contact-item, .member-item { padding: 14px 0; border-bottom: 1px solid #eef2f7; }
.contact-item:last-child, .member-item:last-child { border-bottom: none; }
.label { display: inline-block; width: 140px; color: #6b7280; }
.value, .name { font-weight: 600; color: #111827; }
.desc { margin-top: 6px; color: #4b5563; }
.member-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; }
.footer-card { margin-top: 24px; padding: 20px 24px; text-align: center; }
.brand { font-weight: 700; margin-bottom: 6px; }
.copyright { color: #6b7280; font-size: 14px; }
@media (max-width: 900px) { .contact-grid, .member-grid { grid-template-columns: 1fr; } .page-head { flex-direction: column; align-items: flex-start; } }
</style>

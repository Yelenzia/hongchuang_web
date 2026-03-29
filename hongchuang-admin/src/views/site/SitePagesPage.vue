<template>
  <div>
    <PageHeader title="官网配置" desc="通过后台维护首页与团队联系页，不再每次改文案都改前端代码。" />

    <el-alert type="info" :closable="false" class="tip" show-icon>
      页面内容会序列化保存为 JSON，前台首页和联系页会自动读取这里的配置；页面禁用后，前台会回退到默认文案。
    </el-alert>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="首页配置" name="HOME">
        <el-card>
          <div class="section-header">
            <div>
              <div class="section-title">首页 Hero 与模块配置</div>
              <div class="section-sub">控制首页主标题、按钮、发展方向与核心能力。</div>
            </div>
            <el-switch v-model="homeEnabled" inline-prompt active-text="启用" inactive-text="禁用" />
          </div>

          <el-form :model="homeForm" label-position="top">
            <div class="grid-2">
              <el-form-item label="页面名称"><el-input v-model="homeMeta.pageName" /></el-form-item>
              <el-form-item label="Badge 文案"><el-input v-model="homeForm.badgeText" /></el-form-item>
            </div>
            <el-form-item label="主标题"><el-input v-model="homeMeta.title" /></el-form-item>
            <el-form-item label="副标题"><el-input v-model="homeMeta.subtitle" type="textarea" :rows="4" /></el-form-item>

            <div class="sub-head">首页按钮</div>
            <div v-for="(button, index) in homeForm.heroButtons" :key="index" class="array-row grid-3">
              <el-input v-model="button.text" placeholder="按钮文案" />
              <el-input v-model="button.link" placeholder="链接，例如 /forum" />
              <el-select v-model="button.type" placeholder="按钮样式">
                <el-option label="主按钮" value="primary" />
                <el-option label="次按钮" value="plain" />
              </el-select>
            </div>

            <div class="sub-head">发展方向</div>
            <div v-for="(item, index) in homeForm.directions" :key="index" class="array-card">
              <div class="grid-3">
                <el-input v-model="item.name" placeholder="名称" />
                <el-input v-model="item.desc" placeholder="描述" />
                <el-select v-model="item.style">
                  <el-option label="草方块" value="grass" />
                  <el-option label="石块" value="stone" />
                  <el-option label="矿石" value="ore" />
                </el-select>
              </div>
            </div>

            <div class="sub-head">核心能力</div>
            <div v-for="(item, index) in homeForm.capabilities" :key="index" class="array-card">
              <div class="grid-2">
                <el-input v-model="item.title" placeholder="标题" />
                <el-input v-model="item.desc" placeholder="描述" />
              </div>
            </div>

            <div class="actions">
              <el-button type="primary" :loading="saving" @click="saveHome">保存首页配置</el-button>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="联系页配置" name="CONTACT">
        <el-card>
          <div class="section-header">
            <div>
              <div class="section-title">联系信息与成员列表</div>
              <div class="section-sub">控制 QQ 群、负责人邮箱、成员联系方式与页脚文案。</div>
            </div>
            <el-switch v-model="contactEnabled" inline-prompt active-text="启用" inactive-text="禁用" />
          </div>

          <el-form :model="contactForm" label-position="top">
            <div class="grid-2">
              <el-form-item label="页面名称"><el-input v-model="contactMeta.pageName" /></el-form-item>
              <el-form-item label="页面标题"><el-input v-model="contactMeta.title" /></el-form-item>
            </div>
            <el-form-item label="页面说明"><el-input v-model="contactMeta.subtitle" type="textarea" :rows="3" /></el-form-item>
            <div class="grid-2">
              <el-form-item label="QQ 群"><el-input v-model="contactForm.qqGroup" /></el-form-item>
              <el-form-item label="负责人邮箱"><el-input v-model="contactForm.ownerEmail" /></el-form-item>
            </div>
            <div class="grid-2">
              <el-form-item label="品牌文案"><el-input v-model="contactForm.brandText" /></el-form-item>
              <el-form-item label="版权文案"><el-input v-model="contactForm.copyrightText" /></el-form-item>
            </div>

            <div class="section-header inner">
              <div class="sub-head">成员列表</div>
              <el-button @click="addContactMember">新增成员</el-button>
            </div>
            <div v-for="(member, index) in contactForm.members" :key="index" class="array-card member-card">
              <div class="grid-member">
                <el-input v-model="member.name" placeholder="成员名称" />
                <el-input v-model="member.contact" placeholder="联系方式" />
                <el-button type="danger" plain @click="removeContactMember(index)">删除</el-button>
              </div>
            </div>

            <div class="actions">
              <el-button type="primary" :loading="saving" @click="saveContact">保存联系页配置</el-button>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import {
  createAdminSitePageApi,
  getAdminSitePageListApi,
  updateAdminSitePageApi,
  updateAdminSitePageStatusApi,
  type AdminSitePageItem
} from '@/api/site'

const activeTab = ref('HOME')
const saving = ref(false)
const homeId = ref('')
const contactId = ref('')
const homeEnabled = ref(true)
const contactEnabled = ref(true)

const homeMeta = reactive({ pageName: '官网首页', title: '为 AI 与 Minecraft 创作打造更完整的社区与创作平台', subtitle: '鸿创工作室是以 AI + MC 为主要发展方向的我的世界工作室，致力于探索 AI 模型、AI 贴图、AI 插件等方向的创新应用。' })
const contactMeta = reactive({ pageName: '团队联系', title: '团队联系', subtitle: '如果您有需要，可通过以下方式联系我们。技术部成员信息已重新整理排版。' })

const homeForm = reactive({
  badgeText: 'AI + Minecraft Studio',
  heroButtons: [
    { text: '进入论坛', link: '/forum', type: 'primary' },
    { text: '资源中心', link: '/resources', type: 'plain' },
    { text: '了解更多', link: '/contact', type: 'plain' }
  ],
  directions: [
    { name: 'AI模型', desc: '智能生成、推理与内容创作能力整合。', style: 'grass' },
    { name: 'AI贴图', desc: '服务贴图、模型与视觉资产创作场景。', style: 'stone' },
    { name: 'AI插件平台', desc: '为服主与开发者提供更高效的插件生态入口。', style: 'grass' },
    { name: '创作者社区', desc: '连接玩家、服主、开发者与内容创作者的交流协作空间。', style: 'ore' }
  ],
  capabilities: [
    { title: 'AI模型', desc: '面向内容创作、资源生成与创意辅助场景的模型能力预留。' },
    { title: 'AI贴图', desc: '适配 Minecraft 风格素材产出与视觉资产管理。' },
    { title: 'AI插件平台', desc: '面向开发者与服主的插件分发、展示与社区讨论入口。' },
    { title: '社区协作', desc: '支持论坛讨论、私信沟通、资源展示与内容协作。' }
  ]
})

const contactForm = reactive({
  qqGroup: '856418269',
  ownerEmail: '2930255795@qq.com',
  brandText: '鸿创工作室 · AI + MC 创作与社区平台',
  copyrightText: '© 2026 鸿创工作室. All Rights Reserved.',
  members: [
    { name: '叶子', contact: '邮箱：Yelenas@qq.com' },
    { name: '蓝技术', contact: '邮箱：1738964540@qq.com' }
  ]
})

const assignHome = (item: AdminSitePageItem) => {
  homeId.value = item.id
  homeEnabled.value = item.status === 1
  homeMeta.pageName = item.pageName || '官网首页'
  homeMeta.title = item.title || homeMeta.title
  homeMeta.subtitle = item.subtitle || homeMeta.subtitle
  const content = JSON.parse(item.contentJson || '{}')
  homeForm.badgeText = content.badgeText || homeForm.badgeText
  homeForm.heroButtons.splice(0, homeForm.heroButtons.length, ...(Array.isArray(content.heroButtons) && content.heroButtons.length ? content.heroButtons : homeForm.heroButtons))
  homeForm.directions.splice(0, homeForm.directions.length, ...(Array.isArray(content.directions) && content.directions.length ? content.directions : homeForm.directions))
  homeForm.capabilities.splice(0, homeForm.capabilities.length, ...(Array.isArray(content.capabilities) && content.capabilities.length ? content.capabilities : homeForm.capabilities))
}

const assignContact = (item: AdminSitePageItem) => {
  contactId.value = item.id
  contactEnabled.value = item.status === 1
  contactMeta.pageName = item.pageName || '团队联系'
  contactMeta.title = item.title || contactMeta.title
  contactMeta.subtitle = item.subtitle || contactMeta.subtitle
  const content = JSON.parse(item.contentJson || '{}')
  contactForm.qqGroup = content.qqGroup || contactForm.qqGroup
  contactForm.ownerEmail = content.ownerEmail || contactForm.ownerEmail
  contactForm.brandText = content.brandText || contactForm.brandText
  contactForm.copyrightText = content.copyrightText || contactForm.copyrightText
  contactForm.members.splice(0, contactForm.members.length, ...(Array.isArray(content.members) && content.members.length ? content.members : contactForm.members))
}

const loadData = async () => {
  const { data } = await getAdminSitePageListApi({ pageNo: 1, pageSize: 20 })
  const rows = data.records || []
  const home = rows.find((item) => item.pageCode === 'HOME')
  const contact = rows.find((item) => item.pageCode === 'CONTACT')
  if (home) assignHome(home)
  if (contact) assignContact(contact)
}

const savePage = async (payload: Record<string, unknown>, id: string, enabled: boolean) => {
  if (id) {
    await updateAdminSitePageApi(id, payload)
    await updateAdminSitePageStatusApi(id, enabled ? 1 : 0)
  } else {
    await createAdminSitePageApi(payload)
  }
}

const saveHome = async () => {
  saving.value = true
  try {
    await savePage({
      pageCode: 'HOME',
      pageName: homeMeta.pageName,
      title: homeMeta.title,
      subtitle: homeMeta.subtitle,
      contentJson: JSON.stringify(homeForm),
      status: homeEnabled.value ? 1 : 0,
      sortOrder: 10
    }, homeId.value, homeEnabled.value)
    ElMessage.success('首页配置已保存')
    await loadData()
  } finally {
    saving.value = false
  }
}

const saveContact = async () => {
  saving.value = true
  try {
    await savePage({
      pageCode: 'CONTACT',
      pageName: contactMeta.pageName,
      title: contactMeta.title,
      subtitle: contactMeta.subtitle,
      contentJson: JSON.stringify(contactForm),
      status: contactEnabled.value ? 1 : 0,
      sortOrder: 20
    }, contactId.value, contactEnabled.value)
    ElMessage.success('联系页配置已保存')
    await loadData()
  } finally {
    saving.value = false
  }
}

const addContactMember = () => {
  contactForm.members.push({ name: '', contact: '' })
}

const removeContactMember = (index: number) => {
  contactForm.members.splice(index, 1)
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.tip { margin-bottom: 18px; }
.section-header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
.section-header.inner { margin-top: 12px; }
.section-title { font-size: 18px; font-weight: 700; }
.section-sub { color: var(--admin-sub); margin-top: 6px; }
.sub-head { font-size: 15px; font-weight: 700; margin: 8px 0 12px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 160px; gap: 12px; }
.grid-member { display: grid; grid-template-columns: 180px 1fr 100px; gap: 12px; align-items: center; }
.array-row, .array-card { margin-bottom: 12px; }
.member-card { padding: 12px; border-radius: 12px; background: rgba(15, 23, 42, 0.04); }
.actions { display: flex; justify-content: flex-end; margin-top: 20px; }
@media (max-width: 980px) {
  .grid-2, .grid-3, .grid-member { grid-template-columns: 1fr; }
  .section-header { flex-direction: column; align-items: flex-start; }
}
</style>

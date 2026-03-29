<template>
  <div class="home-page">
    <section class="hero">
      <div class="hc-container hero-shell">
        <div class="hero-main hc-card minecraft-card">
          <div class="hero-topline">
            <img :src="logoUrl" class="hero-logo" alt="鸿创工作室 Logo" />
            <div>
              <div class="badge pixel-chip">{{ homeContent.badgeText }}</div>
              <div class="hero-kicker">HongChuang Studio</div>
            </div>
          </div>

          <h1 class="title">{{ pageMeta.title }}</h1>
          <p class="subtitle">{{ pageMeta.subtitle }}</p>

          <div class="actions">
            <RouterLink v-for="(button, index) in visibleHeroButtons" :key="index" :to="button.link || '/'">
              <el-button size="large" :type="button.type === 'primary' ? 'primary' : undefined" :plain="button.type !== 'primary'">{{ button.text }}</el-button>
            </RouterLink>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">资源中心</span>
              <span class="stat-label">插件、贴图、模型与教程集中浏览</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">论坛交流</span>
              <span class="stat-label">发帖、评论、互动讨论更方便</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">私信沟通</span>
              <span class="stat-label">直接联系作者、成员与合作对象</span>
            </div>
          </div>
        </div>

        <div class="hero-side">
          <div class="hc-card spotlight minecraft-card">
            <div class="panel-title">你可以在这里做什么</div>
            <div class="direction-list">
              <article v-for="(item, index) in visibleDirections" :key="index" class="direction-card" :class="styleClass(item.style)">
                <div class="direction-name">{{ item.name }}</div>
                <div class="direction-desc">{{ item.desc }}</div>
              </article>
            </div>
          </div>

          <div class="hc-card roadmap minecraft-card">
            <div class="panel-title">近期重点</div>
            <div class="roadmap-list">
              <div class="roadmap-item">
                <span class="dot"></span>
                <div>
                  <div class="roadmap-title">继续优化资源区</div>
                  <div class="roadmap-desc">让资源浏览、筛选和查看详情更顺手。</div>
                </div>
              </div>
              <div class="roadmap-item">
                <span class="dot"></span>
                <div>
                  <div class="roadmap-title">继续完善私信体验</div>
                  <div class="roadmap-desc">让聊天、通知和联系流程更接近日常使用习惯。</div>
                </div>
              </div>
              <div class="roadmap-item">
                <span class="dot"></span>
                <div>
                  <div class="roadmap-title">持续整理社区内容</div>
                  <div class="roadmap-desc">把常用板块、公告和帮助信息展示得更清晰。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hc-container section capability-section">
      <div class="section-head">
        <div>
          <h2 class="hc-section-title">平台特色</h2>
          <p class="hc-section-desc">把资源分享、社区交流和团队联系整合到同一个站点里，使用起来更直接。</p>
        </div>
      </div>
      <div class="cap-grid">
        <article class="hc-card cap-item minecraft-card" v-for="item in visibleCapabilities" :key="item.title">
          <div class="cap-title">{{ item.title }}</div>
          <div class="cap-desc">{{ item.desc }}</div>
        </article>
      </div>
    </section>

    <section class="hc-container section dual-section">
      <div class="hc-card latest minecraft-card" v-loading="announcementLoading || siteLoading">
        <div class="inner-title">最新公告</div>
        <template v-if="latestAnnouncements.length > 0">
          <div class="announce-list">
            <article v-for="item in latestAnnouncements.slice(0, 3)" :key="item.id" class="announce-item">
              <div class="announce-title">{{ item.title }}</div>
              <p class="announce-desc">{{ item.summary || item.content }}</p>
              <div class="announce-time">发布时间：{{ item.publishedAt || item.createdAt || '-' }}</div>
            </article>
          </div>
        </template>
        <template v-else>
          <div class="announce-title">社区功能正在持续优化中</div>
          <p class="announce-desc">论坛、资源区、私信、通知和后台管理已经可以使用，后续还会继续完善体验。</p>
        </template>
        <div class="announce-actions">
          <RouterLink to="/announcements"><el-button type="primary" plain>查看全部公告</el-button></RouterLink>
          <RouterLink to="/forum"><el-button plain>进入社区</el-button></RouterLink>
        </div>
      </div>

      <div class="hc-card latest minecraft-card">
        <div class="inner-title">热门板块</div>
        <BoardNav />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import BoardNav from '@/components/forum/BoardNav.vue'
import { getLatestAnnouncementApi } from '@/api/announcement'
import { getSitePageApi } from '@/api/site'
import { useForumStore } from '@/store/forum'
import logoUrl from '@/assets/images/logo.png'

const forumStore = useForumStore()
const announcementLoading = ref(false)
const siteLoading = ref(false)
const latestAnnouncements = ref<Array<{ id: string; title: string; summary?: string; content: string; publishedAt?: string; createdAt?: string }>>([])

const pageMeta = reactive({
  title: '玩家、服主和创作者都能用得上的 Minecraft 社区',
  subtitle: '在这里你可以浏览资源、参与论坛讨论、查看公告、联系团队，也可以通过私信与其他成员交流合作。我们希望把常用功能做得更顺手，让创作、交流和分享都更轻松。'
})

const homeContent = reactive({
  badgeText: 'Minecraft 创作社区',
  heroButtons: [
    { text: '进入论坛', link: '/forum', type: 'primary' },
    { text: '资源中心', link: '/resources', type: 'plain' },
    { text: '团队联系', link: '/contact', type: 'plain' }
  ],
  directions: [
    { name: '发布和查找资源', desc: '集中浏览插件、贴图、模型和教程，查找需要的内容更方便。', style: 'grass' },
    { name: '加入社区讨论', desc: '发帖、评论、私信一步到位，交流想法会更直接。', style: 'stone' },
    { name: '认识更多同好', desc: '无论你是玩家、服主、开发者还是美术，都能在这里找到交流和合作机会。', style: 'ore' }
  ],
  capabilities: [
    { title: '资源发布', desc: '支持发布、整理和展示插件、贴图、模型等内容。' },
    { title: '论坛讨论', desc: '围绕服务器、玩法、开发和创作话题自由交流。' },
    { title: '私信沟通', desc: '支持点对点联系，方便继续交流、答疑和合作。' },
    { title: '团队联系', desc: '官方联系方式和成员信息清晰可见，沟通更省心。' }
  ]
})

const isWalletLikeItem = (text?: string, link?: string) => {
  const content = `${text || ''} ${link || ''}`
  return /签到|货币|商店|wallet/i.test(content)
}

const visibleHeroButtons = computed(() => homeContent.heroButtons.filter(item => !isWalletLikeItem(item.text, item.link)))
const visibleDirections = computed(() => homeContent.directions.filter(item => !isWalletLikeItem(item.name, item.desc)))
const visibleCapabilities = computed(() => homeContent.capabilities.filter(item => !isWalletLikeItem(item.title, item.desc)))

const styleClass = (style: string) => ({ grass: 'grass-card', stone: 'stone-card', ore: 'ore-card' }[style] || 'grass-card')

const loadSitePage = async () => {
  siteLoading.value = true
  try {
    const { data } = await getSitePageApi('HOME')
    pageMeta.title = data.title || pageMeta.title
    pageMeta.subtitle = data.subtitle || pageMeta.subtitle
    const content = JSON.parse(data.contentJson || '{}')
    homeContent.badgeText = content.badgeText || homeContent.badgeText
    if (Array.isArray(content.heroButtons) && content.heroButtons.length) {
      homeContent.heroButtons.splice(0, homeContent.heroButtons.length, ...content.heroButtons)
    }
    if (Array.isArray(content.directions) && content.directions.length) {
      homeContent.directions.splice(0, homeContent.directions.length, ...content.directions)
    }
    if (Array.isArray(content.capabilities) && content.capabilities.length) {
      homeContent.capabilities.splice(0, homeContent.capabilities.length, ...content.capabilities)
    }
  } catch {
    // 使用默认配置兜底
  } finally {
    siteLoading.value = false
  }
}

onMounted(async () => {
  announcementLoading.value = true
  try {
    await Promise.all([forumStore.loadBoards(), loadSitePage()])
    const { data } = await getLatestAnnouncementApi()
    latestAnnouncements.value = Array.isArray(data) ? data : []
  } finally {
    announcementLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.home-page { display: flex; flex-direction: column; gap: 8px; }
.hero { padding: 38px 0 26px; }
.hero-shell { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr); gap: 22px; align-items: stretch; }
.hero-main, .spotlight, .roadmap { padding: 26px; }
.hero-main {
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, .18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(34, 197, 94, .12), transparent 26%),
    rgba(255,255,255,.94);
}
.hero-topline { display: flex; gap: 16px; align-items: center; margin-bottom: 22px; }
.hero-logo { width: 92px; height: 92px; border-radius: 24px; object-fit: cover; box-shadow: 0 16px 40px rgba(34, 211, 238, .18); }
.hero-kicker { margin-top: 8px; color: var(--hc-text-secondary); font-size: 13px; letter-spacing: .12em; text-transform: uppercase; }
.badge { display: inline-flex; padding: 8px 14px; color: #0f766e; background: rgba(45,212,191,.12); font-weight: 700; }
.title { font-size: clamp(36px, 5vw, 56px); line-height: 1.08; margin: 0 0 18px; max-width: 880px; }
.subtitle { margin: 0; color: var(--hc-text-secondary); line-height: 1.9; font-size: 16px; max-width: 760px; }
.actions { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
.hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 28px; }
.stat-item { padding: 16px; border-radius: 18px; background: rgba(248,250,252,.78); border: 1px solid rgba(15, 23, 42, 0.06); display: grid; gap: 6px; }
.stat-value { font-size: 18px; font-weight: 700; }
.stat-label { color: var(--hc-text-secondary); line-height: 1.7; font-size: 13px; }
.hero-side { display: grid; gap: 18px; }
.panel-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.direction-list, .roadmap-list { display: grid; gap: 12px; }
.direction-card { border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 18px; padding: 18px; background: rgba(255,255,255,.92); }
.direction-name { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
.direction-desc { color: var(--hc-text-secondary); line-height: 1.75; }
.grass-card { border-left: 5px solid #22c55e; }
.stone-card { border-left: 5px solid #64748b; }
.ore-card { border-left: 5px solid #0ea5e9; }
.roadmap-item { display: grid; grid-template-columns: 20px 1fr; gap: 12px; align-items: start; }
.dot { width: 10px; height: 10px; border-radius: 999px; background: linear-gradient(135deg, #22c55e, #06b6d4); margin-top: 8px; }
.roadmap-title { font-weight: 700; margin-bottom: 6px; }
.roadmap-desc { color: var(--hc-text-secondary); line-height: 1.75; }
.section { padding: 24px 0; }
.capability-section { padding-top: 8px; }
.cap-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.cap-item { padding: 22px; }
.cap-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.cap-desc { color: var(--hc-text-secondary); line-height: 1.8; }
.dual-section { display: grid; grid-template-columns: .95fr 1.05fr; gap: 18px; padding-bottom: 48px; }
.latest { padding: 24px; }
.inner-title { font-size: 14px; color: #166534; font-weight: 700; margin-bottom: 12px; }
.announce-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
.announce-item { padding-bottom: 14px; border-bottom: 1px solid rgba(15, 23, 42, 0.08); }
.announce-item:last-child { border-bottom: none; }
.announce-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.announce-desc { color: var(--hc-text-secondary); line-height: 1.8; margin-bottom: 8px; }
.announce-time { font-size: 13px; color: var(--hc-text-secondary); }
.announce-actions { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 1180px) {
  .hero-shell, .dual-section, .cap-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .hero { padding-top: 24px; }
  .hero-stats { grid-template-columns: 1fr; }
  .title { font-size: 34px; }
}
</style>

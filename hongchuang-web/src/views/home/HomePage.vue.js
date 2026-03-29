import { computed, onMounted, reactive, ref } from 'vue';
import BoardNav from '@/components/forum/BoardNav.vue';
import { getLatestAnnouncementApi } from '@/api/announcement';
import { getSitePageApi } from '@/api/site';
import { useForumStore } from '@/store/forum';
import logoUrl from '@/assets/images/logo.png';
const forumStore = useForumStore();
const announcementLoading = ref(false);
const siteLoading = ref(false);
const latestAnnouncements = ref([]);
const pageMeta = reactive({
    title: '玩家、服主和创作者都能用得上的 Minecraft 社区',
    subtitle: '在这里你可以浏览资源、参与论坛讨论、查看公告、联系团队，也可以通过私信与其他成员交流合作。我们希望把常用功能做得更顺手，让创作、交流和分享都更轻松。'
});
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
});
const isWalletLikeItem = (text, link) => {
    const content = `${text || ''} ${link || ''}`;
    return /签到|货币|商店|wallet/i.test(content);
};
const visibleHeroButtons = computed(() => homeContent.heroButtons.filter(item => !isWalletLikeItem(item.text, item.link)));
const visibleDirections = computed(() => homeContent.directions.filter(item => !isWalletLikeItem(item.name, item.desc)));
const visibleCapabilities = computed(() => homeContent.capabilities.filter(item => !isWalletLikeItem(item.title, item.desc)));
const styleClass = (style) => ({ grass: 'grass-card', stone: 'stone-card', ore: 'ore-card' }[style] || 'grass-card');
const loadSitePage = async () => {
    siteLoading.value = true;
    try {
        const { data } = await getSitePageApi('HOME');
        pageMeta.title = data.title || pageMeta.title;
        pageMeta.subtitle = data.subtitle || pageMeta.subtitle;
        const content = JSON.parse(data.contentJson || '{}');
        homeContent.badgeText = content.badgeText || homeContent.badgeText;
        if (Array.isArray(content.heroButtons) && content.heroButtons.length) {
            homeContent.heroButtons.splice(0, homeContent.heroButtons.length, ...content.heroButtons);
        }
        if (Array.isArray(content.directions) && content.directions.length) {
            homeContent.directions.splice(0, homeContent.directions.length, ...content.directions);
        }
        if (Array.isArray(content.capabilities) && content.capabilities.length) {
            homeContent.capabilities.splice(0, homeContent.capabilities.length, ...content.capabilities);
        }
    }
    catch {
        // 使用默认配置兜底
    }
    finally {
        siteLoading.value = false;
    }
};
onMounted(async () => {
    announcementLoading.value = true;
    try {
        await Promise.all([forumStore.loadBoards(), loadSitePage()]);
        const { data } = await getLatestAnnouncementApi();
        latestAnnouncements.value = Array.isArray(data) ? data : [];
    }
    finally {
        announcementLoading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hero-main']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-item']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['dual-section']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "home-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hero" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container hero-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-main hc-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-topline" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.logoUrl),
    ...{ class: "hero-logo" },
    alt: "鸿创工作室 Logo",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge pixel-chip" },
});
(__VLS_ctx.homeContent.badgeText);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-kicker" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "title" },
});
(__VLS_ctx.pageMeta.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
(__VLS_ctx.pageMeta.subtitle);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.visibleHeroButtons))) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        key: (index),
        to: (button.link || '/'),
    }));
    const __VLS_2 = __VLS_1({
        key: (index),
        to: (button.link || '/'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        size: "large",
        type: (button.type === 'primary' ? 'primary' : undefined),
        plain: (button.type !== 'primary'),
    }));
    const __VLS_6 = __VLS_5({
        size: "large",
        type: (button.type === 'primary' ? 'primary' : undefined),
        plain: (button.type !== 'primary'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    (button.text);
    var __VLS_7;
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hero-side" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card spotlight minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "direction-list" },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.visibleDirections))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        key: (index),
        ...{ class: "direction-card" },
        ...{ class: (__VLS_ctx.styleClass(item.style)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "direction-name" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "direction-desc" },
    });
    (item.desc);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card roadmap minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "roadmap-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-container section capability-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "hc-section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "hc-section-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cap-grid" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.visibleCapabilities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "hc-card cap-item minecraft-card" },
        key: (item.title),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-title" },
    });
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-desc" },
    });
    (item.desc);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-container section dual-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card latest minecraft-card" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.announcementLoading || __VLS_ctx.siteLoading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "inner-title" },
});
if (__VLS_ctx.latestAnnouncements.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "announce-list" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.latestAnnouncements.slice(0, 3)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            key: (item.id),
            ...{ class: "announce-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "announce-title" },
        });
        (item.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "announce-desc" },
        });
        (item.summary || item.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "announce-time" },
        });
        (item.publishedAt || item.createdAt || '-');
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "announce-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "announce-desc" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "announce-actions" },
});
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/announcements",
}));
const __VLS_10 = __VLS_9({
    to: "/announcements",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    type: "primary",
    plain: true,
}));
const __VLS_14 = __VLS_13({
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
var __VLS_11;
const __VLS_16 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    to: "/forum",
}));
const __VLS_18 = __VLS_17({
    to: "/forum",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    plain: true,
}));
const __VLS_22 = __VLS_21({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
var __VLS_23;
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card latest minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "inner-title" },
});
/** @type {[typeof BoardNav, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(BoardNav, new BoardNav({}));
const __VLS_25 = __VLS_24({}, ...__VLS_functionalComponentArgsRest(__VLS_24));
/** @type {__VLS_StyleScopedClasses['home-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-main']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-topline']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['pixel-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-kicker']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-side']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['spotlight']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['direction-list']} */ ;
/** @type {__VLS_StyleScopedClasses['direction-card']} */ ;
/** @type {__VLS_StyleScopedClasses['direction-name']} */ ;
/** @type {__VLS_StyleScopedClasses['direction-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-list']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-title']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-title']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-title']} */ ;
/** @type {__VLS_StyleScopedClasses['roadmap-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['capability-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-head']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-section-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-item']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['dual-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['latest']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['inner-title']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-list']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-item']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-title']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-time']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-title']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['announce-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['latest']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['inner-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BoardNav: BoardNav,
            logoUrl: logoUrl,
            announcementLoading: announcementLoading,
            siteLoading: siteLoading,
            latestAnnouncements: latestAnnouncements,
            pageMeta: pageMeta,
            homeContent: homeContent,
            visibleHeroButtons: visibleHeroButtons,
            visibleDirections: visibleDirections,
            visibleCapabilities: visibleCapabilities,
            styleClass: styleClass,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HomePage.vue.js.map
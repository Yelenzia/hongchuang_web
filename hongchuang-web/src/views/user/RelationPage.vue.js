import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/common/EmptyState.vue';
import { followUserApi, getMyFansApi, getMyFollowingApi, unfollowUserApi } from '@/api/user';
import { resolveFileUrl } from '@/utils/file';
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const rows = ref([]);
const activeTab = ref(route.name === 'me-fans' ? 'fans' : 'follows');
const pageTitle = computed(() => activeTab.value === 'follows' ? '我的关注' : '我的粉丝');
const pageDesc = computed(() => activeTab.value === 'follows' ? '你关注的用户会优先形成社区关系链和持续互动。' : '这里展示关注你的用户，你可以快速回关。');
const avatarOf = (value) => resolveFileUrl(value);
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = activeTab.value === 'follows' ? await getMyFollowingApi() : await getMyFansApi();
        rows.value = data;
    }
    finally {
        loading.value = false;
    }
};
const handleTabChange = async (name) => {
    activeTab.value = String(name) === 'fans' ? 'fans' : 'follows';
    await router.replace(activeTab.value === 'fans' ? '/me/fans' : '/me/follows');
};
const handleFollow = async (userId) => {
    await followUserApi(userId);
    ElMessage.success('回关成功');
    await loadData();
};
const handleUnfollow = async (userId) => {
    await unfollowUserApi(userId);
    ElMessage.success('已取消关注');
    await loadData();
};
watch(() => route.name, async (name) => {
    activeTab.value = name === 'me-fans' ? 'fans' : 'follows';
    await loadData();
});
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['relation-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relation-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
(__VLS_ctx.pageTitle);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
(__VLS_ctx.pageDesc);
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onTabChange: (__VLS_ctx.handleTabChange)
};
__VLS_3.slots.default;
const __VLS_8 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "我的关注",
    name: "follows",
}));
const __VLS_10 = __VLS_9({
    label: "我的关注",
    name: "follows",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "我的粉丝",
    name: "fans",
}));
const __VLS_14 = __VLS_13({
    label: "我的粉丝",
    name: "fans",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relation-list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.rows))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        key: (item.userId),
        ...{ class: "hc-card relation-item minecraft-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-box" },
    });
    if (item.avatarUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.avatarOf(item.avatarUrl)),
            ...{ class: "avatar" },
            alt: "avatar",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "avatar fallback" },
        });
        ((item.nickname || item.username).slice(0, 1));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    const __VLS_16 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ class: "name" },
        to: (`/user/${item.userId}`),
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "name" },
        to: (`/user/${item.userId}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    (item.nickname || item.username);
    var __VLS_19;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta" },
    });
    if (item.forumUid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.forumUid);
    }
    if (item.businessCard) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.businessCard);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.userLevel || 1);
    if (item.signature) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "signature" },
        });
        (item.signature);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stats" },
    });
    (item.postCount || 0);
    (item.commentCount || 0);
    (item.followingCount || 0);
    (item.followerCount || 0);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_20 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        to: (`/me/messages?to=${item.userId}`),
    }));
    const __VLS_22 = __VLS_21({
        to: (`/me/messages?to=${item.userId}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        plain: true,
    }));
    const __VLS_26 = __VLS_25({
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    var __VLS_23;
    if (__VLS_ctx.activeTab === 'fans' && item.followedByMe === false) {
        const __VLS_28 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            ...{ 'onClick': {} },
            type: "success",
            plain: true,
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onClick': {} },
            type: "success",
            plain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_32;
        let __VLS_33;
        let __VLS_34;
        const __VLS_35 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.activeTab === 'fans' && item.followedByMe === false))
                    return;
                __VLS_ctx.handleFollow(item.userId);
            }
        };
        __VLS_31.slots.default;
        var __VLS_31;
    }
    else if (__VLS_ctx.activeTab === 'follows' || item.followedByMe) {
        const __VLS_36 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            plain: true,
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            plain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_40;
        let __VLS_41;
        let __VLS_42;
        const __VLS_43 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab === 'fans' && item.followedByMe === false))
                    return;
                if (!(__VLS_ctx.activeTab === 'follows' || item.followedByMe))
                    return;
                __VLS_ctx.handleUnfollow(item.userId);
            }
        };
        __VLS_39.slots.default;
        var __VLS_39;
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.rows.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: (__VLS_ctx.activeTab === 'follows' ? '你还没有关注任何人' : '你暂时还没有粉丝'),
    }));
    const __VLS_45 = __VLS_44({
        title: (__VLS_ctx.activeTab === 'follows' ? '你还没有关注任何人' : '你暂时还没有粉丝'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
}
/** @type {__VLS_StyleScopedClasses['relation-page']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['relation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['relation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['user-box']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['signature']} */ ;
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            EmptyState: EmptyState,
            loading: loading,
            rows: rows,
            activeTab: activeTab,
            pageTitle: pageTitle,
            pageDesc: pageDesc,
            avatarOf: avatarOf,
            handleTabChange: handleTabChange,
            handleFollow: handleFollow,
            handleUnfollow: handleUnfollow,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RelationPage.vue.js.map
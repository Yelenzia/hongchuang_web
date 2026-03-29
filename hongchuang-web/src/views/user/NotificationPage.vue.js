import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getNotificationListApi, markAllNotificationReadApi, markNotificationReadApi } from '@/api/notification';
import { useAppStore } from '@/store/app';
const appStore = useAppStore();
const loading = ref(false);
const items = ref([]);
const typeLabelMap = {
    POST_FAVORITE: '帖子收藏',
    POST_COMMENT: '帖子评论',
    COMMENT_REPLY: '评论回复',
    COMMENT_MENTION: '@提醒',
    USER_FOLLOW: '用户关注',
    PRIVATE_MESSAGE: '私信',
    SYSTEM_DELETE_POST: '删帖通知',
    SYSTEM_POST_STATUS: '帖子状态',
    SYSTEM_WARNING: '系统警告',
    SYSTEM_BAN: '账号封禁',
    SYSTEM_UNBAN: '账号解封'
};
const getTypeLabel = (type) => typeLabelMap[type] || type;
const resolveNotificationLink = (item) => {
    if (!item.relatedId)
        return '';
    if (item.relatedType === 'POST')
        return `/post/${item.relatedId}`;
    if (item.relatedType === 'USER')
        return `/user/${item.relatedId}`;
    return '';
};
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getNotificationListApi();
        items.value = data;
        await appStore.refreshUnreadCount();
    }
    finally {
        loading.value = false;
    }
};
const readOne = async (id) => {
    await markNotificationReadApi(id);
    ElMessage.success('已标记为已读');
    await loadData();
};
const readAll = async () => {
    await markAllNotificationReadApi();
    await loadData();
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['notice-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notification-page" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "top-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.readAll)
};
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.id),
        ...{ class: "hc-card notice-item minecraft-card" },
        ...{ class: ({ unread: item.isRead === 0 }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "notice-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "type" },
    });
    (__VLS_ctx.getTypeLabel(item.type));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.createdAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content" },
    });
    (item.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    if (item.isRead === 0) {
        const __VLS_8 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_12;
        let __VLS_13;
        let __VLS_14;
        const __VLS_15 = {
            onClick: (...[$event]) => {
                if (!(item.isRead === 0))
                    return;
                __VLS_ctx.readOne(item.id);
            }
        };
        __VLS_11.slots.default;
        var __VLS_11;
    }
    if (__VLS_ctx.resolveNotificationLink(item)) {
        const __VLS_16 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            to: (__VLS_ctx.resolveNotificationLink(item)),
        }));
        const __VLS_18 = __VLS_17({
            to: (__VLS_ctx.resolveNotificationLink(item)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        var __VLS_19;
    }
}
if (!__VLS_ctx.loading && __VLS_ctx.items.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hc-card empty-card" },
    });
}
/** @type {__VLS_StyleScopedClasses['notification-page']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-item']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-head']} */ ;
/** @type {__VLS_StyleScopedClasses['type']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            items: items,
            getTypeLabel: getTypeLabel,
            resolveNotificationLink: resolveNotificationLink,
            readOne: readOne,
            readAll: readAll,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=NotificationPage.vue.js.map
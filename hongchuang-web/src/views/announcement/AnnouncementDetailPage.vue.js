import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getAnnouncementDetailApi } from '@/api/announcement';
const route = useRoute();
const loading = ref(false);
const announcement = ref(null);
onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await getAnnouncementDetailApi(String(route.params.id || ''));
        announcement.value = data;
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container ann-detail-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "hc-card ann-detail" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.announcement) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta" },
    });
    const __VLS_0 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: "small",
        type: (__VLS_ctx.announcement.isPinned === 1 ? 'primary' : 'info'),
    }));
    const __VLS_2 = __VLS_1({
        size: "small",
        type: (__VLS_ctx.announcement.isPinned === 1 ? 'primary' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (__VLS_ctx.announcement.isPinned === 1 ? '置顶公告' : '公告');
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.announcement.publishedAt || __VLS_ctx.announcement.createdAt);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    (__VLS_ctx.announcement.title);
    if (__VLS_ctx.announcement.summary) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "summary" },
        });
        (__VLS_ctx.announcement.summary);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.announcement.content) }, null, null);
}
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['ann-detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ann-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['summary']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            announcement: announcement,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AnnouncementDetailPage.vue.js.map
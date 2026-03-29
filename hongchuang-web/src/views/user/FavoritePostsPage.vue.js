import { onMounted, ref } from 'vue';
import PostCard from '@/components/forum/PostCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { getMyFavoritePostsApi } from '@/api/post';
const loading = ref(false);
const posts = ref([]);
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getMyFavoritePostsApi({ pageNo: pageNo.value, pageSize });
        posts.value = data.list;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadData();
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "favorites-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
    /** @type {[typeof PostCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PostCard, new PostCard({
        key: (post.id),
        post: (post),
    }));
    const __VLS_1 = __VLS_0({
        key: (post.id),
        post: (post),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
if (!__VLS_ctx.loading && __VLS_ctx.posts.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "你还没有收藏任何帖子",
        description: "看到喜欢的内容时，可以在帖子详情页点击收藏。",
    }));
    const __VLS_4 = __VLS_3({
        title: "你还没有收藏任何帖子",
        description: "看到喜欢的内容时，可以在帖子详情页点击收藏。",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
if (__VLS_ctx.total > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pager" },
    });
    const __VLS_6 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next, total",
        currentPage: (__VLS_ctx.pageNo),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next, total",
        currentPage: (__VLS_ctx.pageNo),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_10;
    let __VLS_11;
    let __VLS_12;
    const __VLS_13 = {
        onCurrentChange: (__VLS_ctx.handlePageChange)
    };
    var __VLS_9;
}
/** @type {__VLS_StyleScopedClasses['favorites-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PostCard: PostCard,
            EmptyState: EmptyState,
            loading: loading,
            posts: posts,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            handlePageChange: handlePageChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=FavoritePostsPage.vue.js.map
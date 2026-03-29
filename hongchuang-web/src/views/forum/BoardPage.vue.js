import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useForumStore } from '@/store/forum';
import PostCard from '@/components/forum/PostCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { getPostListApi } from '@/api/post';
const route = useRoute();
const forumStore = useForumStore();
const currentBoard = computed(() => forumStore.boards.find((item) => item.slug === route.params.slug));
const posts = ref([]);
const loading = ref(false);
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const loadPosts = async () => {
    if (!currentBoard.value)
        return;
    loading.value = true;
    try {
        const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, boardId: currentBoard.value.id, sort: 'newest' });
        posts.value = data.list;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadPosts();
};
watch(currentBoard, async () => {
    pageNo.value = 1;
    await loadPosts();
});
onMounted(async () => {
    await forumStore.loadBoards();
    await loadPosts();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container board-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card hero" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
(__VLS_ctx.currentBoard?.name || '板块详情');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.currentBoard?.description || '板块说明加载中…');
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
        title: "该板块暂无帖子",
    }));
    const __VLS_4 = __VLS_3({
        title: "该板块暂无帖子",
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager hc-card" },
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
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['board-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PostCard: PostCard,
            EmptyState: EmptyState,
            currentBoard: currentBoard,
            posts: posts,
            loading: loading,
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
//# sourceMappingURL=BoardPage.vue.js.map
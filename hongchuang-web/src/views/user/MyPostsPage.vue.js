import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import PostCard from '@/components/forum/PostCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useAuthStore } from '@/store/auth';
import { deletePostApi, getPostListApi } from '@/api/post';
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const posts = ref([]);
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const loadPosts = async () => {
    if (!authStore.userInfo?.id)
        return;
    loading.value = true;
    try {
        const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, authorId: authStore.userInfo.id, sort: 'newest' });
        posts.value = data.list;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const handleDelete = async (postId, title) => {
    await ElMessageBox.confirm(`确定删除帖子《${title}》吗？`, '删除确认', { type: 'warning' });
    await deletePostApi(postId);
    ElMessage.success('帖子已删除');
    await loadPosts();
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadPosts();
};
onMounted(async () => {
    await authStore.initialize();
    await loadPosts();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/post/create",
}));
const __VLS_2 = __VLS_1({
    to: "/post/create",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    type: "primary",
}));
const __VLS_6 = __VLS_5({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (post.id),
        ...{ class: "post-item-wrap" },
    });
    /** @type {[typeof PostCard, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(PostCard, new PostCard({
        post: (post),
    }));
    const __VLS_9 = __VLS_8({
        post: (post),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item-actions" },
    });
    const __VLS_11 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    let __VLS_17;
    const __VLS_18 = {
        onClick: (...[$event]) => {
            __VLS_ctx.router.push(`/post/${post.id}/edit`);
        }
    };
    __VLS_14.slots.default;
    var __VLS_14;
    const __VLS_19 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(post.id, post.title);
        }
    };
    __VLS_22.slots.default;
    var __VLS_22;
}
if (!__VLS_ctx.loading && __VLS_ctx.posts.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "你还没有发布过帖子",
    }));
    const __VLS_28 = __VLS_27({
        title: "你还没有发布过帖子",
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
}
if (__VLS_ctx.total > __VLS_ctx.pageSize) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pager" },
    });
    const __VLS_30 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next, total",
        currentPage: (__VLS_ctx.pageNo),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onCurrentChange': {} },
        background: true,
        layout: "prev, pager, next, total",
        currentPage: (__VLS_ctx.pageNo),
        pageSize: (__VLS_ctx.pageSize),
        total: (__VLS_ctx.total),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_34;
    let __VLS_35;
    let __VLS_36;
    const __VLS_37 = {
        onCurrentChange: (__VLS_ctx.handlePageChange)
    };
    var __VLS_33;
}
/** @type {__VLS_StyleScopedClasses['page-head']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['post-item-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PostCard: PostCard,
            EmptyState: EmptyState,
            router: router,
            loading: loading,
            posts: posts,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            handleDelete: handleDelete,
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
//# sourceMappingURL=MyPostsPage.vue.js.map
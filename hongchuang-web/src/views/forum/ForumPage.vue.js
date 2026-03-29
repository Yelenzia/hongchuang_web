import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '@/components/common/BaseCard.vue';
import TagChip from '@/components/common/TagChip.vue';
import BoardNav from '@/components/forum/BoardNav.vue';
import PostCard from '@/components/forum/PostCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useForumStore } from '@/store/forum';
import { useAppStore } from '@/store/app';
import { getPostListApi } from '@/api/post';
const route = useRoute();
const router = useRouter();
const keyword = ref(String(route.query.keyword || ''));
const sortType = ref(route.query.sort || 'newest');
const selectedTagId = ref(route.query.tagId ? String(route.query.tagId) : undefined);
const pageNo = ref(Number(route.query.pageNo || 1));
const pageSize = 10;
const total = ref(0);
const loading = ref(false);
const posts = ref([]);
const forumStore = useForumStore();
const appStore = useAppStore();
const boards = computed(() => forumStore.boards);
const hotTags = computed(() => appStore.hotTags);
const selectedTagName = computed(() => hotTags.value.find(item => item.id === selectedTagId.value)?.name || '');
const loadPosts = async () => {
    loading.value = true;
    try {
        const { data } = await getPostListApi({
            pageNo: pageNo.value,
            pageSize,
            keyword: keyword.value || undefined,
            tagId: selectedTagId.value,
            sort: sortType.value
        });
        posts.value = data.list;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const syncQuery = () => {
    router.replace({
        path: '/forum',
        query: {
            ...(keyword.value ? { keyword: keyword.value } : {}),
            ...(selectedTagId.value ? { tagId: String(selectedTagId.value) } : {}),
            sort: sortType.value,
            pageNo: String(pageNo.value)
        }
    });
};
const handleSelectTag = async (tagId) => {
    selectedTagId.value = tagId;
    pageNo.value = 1;
    syncQuery();
    await loadPosts();
};
const clearTagFilter = async () => {
    selectedTagId.value = undefined;
    pageNo.value = 1;
    syncQuery();
    await loadPosts();
};
const handleSearch = async () => {
    pageNo.value = 1;
    syncQuery();
    await loadPosts();
};
const handleRefresh = async () => {
    pageNo.value = 1;
    syncQuery();
    await loadPosts();
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    syncQuery();
    await loadPosts();
};
onMounted(async () => {
    await Promise.allSettled([
        forumStore.loadBoards(),
        appStore.loadHotTags(),
        loadPosts()
    ]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['side-link']} */ ;
/** @type {__VLS_StyleScopedClasses['title-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['forum-page']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container forum-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "left" },
});
/** @type {[typeof BaseCard, typeof BaseCard, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseCard, new BaseCard({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.appStore.loadingHotTags) }, null, null);
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.hotTags))) {
    /** @type {[typeof TagChip, ]} */ ;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent(TagChip, new TagChip({
        ...{ 'onClick': {} },
        key: (tag.id),
        label: (tag.name),
        clickable: true,
    }));
    const __VLS_4 = __VLS_3({
        ...{ 'onClick': {} },
        key: (tag.id),
        label: (tag.name),
        clickable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    let __VLS_6;
    let __VLS_7;
    let __VLS_8;
    const __VLS_9 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSelectTag(tag.id);
        }
    };
    var __VLS_5;
}
if (!__VLS_ctx.appStore.loadingHotTags && __VLS_ctx.hotTags.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "暂无热门标签",
    }));
    const __VLS_11 = __VLS_10({
        title: "暂无热门标签",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
var __VLS_2;
/** @type {[typeof BaseCard, typeof BaseCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(BaseCard, new BaseCard({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.forumStore.loadingBoards) }, null, null);
for (const [board] of __VLS_getVForSourceType((__VLS_ctx.boards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "side-link" },
        key: (board.id),
    });
    const __VLS_16 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        to: (`/forum/board/${board.slug}`),
    }));
    const __VLS_18 = __VLS_17({
        to: (`/forum/board/${board.slug}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    (board.name);
    var __VLS_19;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (board.postCount);
}
if (!__VLS_ctx.forumStore.loadingBoards && __VLS_ctx.boards.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "暂无板块数据",
    }));
    const __VLS_21 = __VLS_20({
        title: "暂无板块数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
}
var __VLS_15;
/** @type {[typeof BaseCard, typeof BaseCard, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(BaseCard, new BaseCard({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
const __VLS_26 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.sortType),
    ...{ class: "radio-group" },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.sortType),
    ...{ class: "radio-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_30;
let __VLS_31;
let __VLS_32;
const __VLS_33 = {
    onChange: (__VLS_ctx.handleRefresh)
};
__VLS_29.slots.default;
const __VLS_34 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    label: "newest",
}));
const __VLS_36 = __VLS_35({
    label: "newest",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
var __VLS_37;
const __VLS_38 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    label: "hot",
}));
const __VLS_40 = __VLS_39({
    label: "hot",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
var __VLS_41;
var __VLS_29;
if (__VLS_ctx.selectedTagName) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tag-filter-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.selectedTagName);
    const __VLS_42 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_46;
    let __VLS_47;
    let __VLS_48;
    const __VLS_49 = {
        onClick: (__VLS_ctx.clearTagFilter)
    };
    __VLS_45.slots.default;
    var __VLS_45;
}
var __VLS_25;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "top-bar hc-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_50 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索帖子 / 关键词",
    clearable: true,
}));
const __VLS_52 = __VLS_51({
    ...{ 'onKeyup': {} },
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索帖子 / 关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_54;
let __VLS_55;
let __VLS_56;
const __VLS_57 = {
    onKeyup: (__VLS_ctx.handleSearch)
};
const __VLS_58 = {
    onClear: (__VLS_ctx.handleSearch)
};
var __VLS_53;
const __VLS_59 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_63;
let __VLS_64;
let __VLS_65;
const __VLS_66 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_62.slots.default;
var __VLS_62;
const __VLS_67 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    to: "/post/create",
}));
const __VLS_69 = __VLS_68({
    to: "/post/create",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    type: "primary",
}));
const __VLS_73 = __VLS_72({
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
var __VLS_74;
var __VLS_70;
/** @type {[typeof BoardNav, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(BoardNav, new BoardNav({}));
const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "post-list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
    /** @type {[typeof PostCard, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(PostCard, new PostCard({
        key: (post.id),
        post: (post),
    }));
    const __VLS_79 = __VLS_78({
        key: (post.id),
        post: (post),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
}
if (!__VLS_ctx.loading && __VLS_ctx.posts.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "暂无帖子",
        desc: "可以试试切换排序方式或更换关键词。",
    }));
    const __VLS_82 = __VLS_81({
        title: "暂无帖子",
        desc: "可以试试切换排序方式或更换关键词。",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager hc-card" },
});
const __VLS_84 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}));
const __VLS_86 = __VLS_85({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
    onCurrentChange: (__VLS_ctx.handlePageChange)
};
var __VLS_87;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['forum-page']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-list']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['side-link']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-filter-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['post-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseCard: BaseCard,
            TagChip: TagChip,
            BoardNav: BoardNav,
            PostCard: PostCard,
            EmptyState: EmptyState,
            keyword: keyword,
            sortType: sortType,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            loading: loading,
            posts: posts,
            forumStore: forumStore,
            appStore: appStore,
            boards: boards,
            hotTags: hotTags,
            selectedTagName: selectedTagName,
            handleSelectTag: handleSelectTag,
            clearTagFilter: clearTagFilter,
            handleSearch: handleSearch,
            handleRefresh: handleRefresh,
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
//# sourceMappingURL=ForumPage.vue.js.map
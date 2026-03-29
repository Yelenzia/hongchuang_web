import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/common/EmptyState.vue';
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue';
import { resolveFileUrl } from '@/utils/file';
import { cancelFavoriteResourceApi, cancelLikeResourceApi, downloadResourceApi, favoriteResourceApi, getResourceDetailApi, likeResourceApi } from '@/api/resource';
import { useAuthStore } from '@/store/auth';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const detail = ref(null);
const resourceId = computed(() => String(route.params.id || ''));
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getResourceDetailApi(resourceId.value);
        detail.value = data;
    }
    finally {
        loading.value = false;
    }
};
const ensureLogin = () => {
    if (authStore.isLogin)
        return true;
    router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`);
    return false;
};
const toggleFavorite = async () => {
    if (!detail.value || !ensureLogin())
        return;
    if (detail.value.isFavorited) {
        await cancelFavoriteResourceApi(detail.value.id);
        detail.value.isFavorited = false;
        detail.value.favoriteCount = Math.max((detail.value.favoriteCount || 1) - 1, 0);
    }
    else {
        await favoriteResourceApi(detail.value.id);
        detail.value.isFavorited = true;
        detail.value.favoriteCount = (detail.value.favoriteCount || 0) + 1;
    }
};
const toggleLike = async () => {
    if (!detail.value || !ensureLogin())
        return;
    if (detail.value.isLiked) {
        await cancelLikeResourceApi(detail.value.id);
        detail.value.isLiked = false;
        detail.value.likeCount = Math.max((detail.value.likeCount || 1) - 1, 0);
    }
    else {
        await likeResourceApi(detail.value.id);
        detail.value.isLiked = true;
        detail.value.likeCount = (detail.value.likeCount || 0) + 1;
    }
};
const handleDownload = async () => {
    if (!detail.value)
        return;
    const { data } = await downloadResourceApi(detail.value.id);
    const target = data.url || detail.value.downloadUrl || detail.value.fileUrl || detail.value.currentVersion?.downloadUrl || detail.value.currentVersion?.fileUrl;
    if (target)
        window.open(resolveFileUrl(target), '_blank');
    ElMessage.success('已开始下载');
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['detail']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "resource-detail-page hc-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (!__VLS_ctx.detail) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "资源不存在或暂未发布",
        desc: "该资源可能还在审核中，或者已经下架。",
    }));
    const __VLS_1 = __VLS_0({
        title: "资源不存在或暂未发布",
        desc: "该资源可能还在审核中，或者已经下架。",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        ...{ class: "hc-card detail minecraft-card" },
    });
    if (__VLS_ctx.detail.coverUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.resolveFileUrl(__VLS_ctx.detail.coverUrl)),
            ...{ class: "cover" },
            alt: "cover",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "top-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detail.categoryName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detail.authorName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detail.downloadCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detail.likeCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    (__VLS_ctx.detail.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "summary" },
    });
    (__VLS_ctx.detail.summary);
    if (__VLS_ctx.detail.tags?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "tags" },
        });
        for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.detail.tags))) {
            const __VLS_3 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
                key: (tag.id),
                to: ({ path: '/resources', query: { tagId: tag.id } }),
                ...{ class: "tag-link" },
            }));
            const __VLS_5 = __VLS_4({
                key: (tag.id),
                to: ({ path: '/resources', query: { tagId: tag.id } }),
                ...{ class: "tag-link" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_4));
            __VLS_6.slots.default;
            (tag.name);
            var __VLS_6;
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_7 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_9 = __VLS_8({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    let __VLS_11;
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = {
        onClick: (__VLS_ctx.handleDownload)
    };
    __VLS_10.slots.default;
    var __VLS_10;
    const __VLS_15 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        ...{ 'onClick': {} },
        type: "warning",
        plain: true,
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onClick': {} },
        type: "warning",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_19;
    let __VLS_20;
    let __VLS_21;
    const __VLS_22 = {
        onClick: (__VLS_ctx.toggleFavorite)
    };
    __VLS_18.slots.default;
    (__VLS_ctx.detail.isFavorited ? '取消收藏' : '收藏资源');
    var __VLS_18;
    const __VLS_23 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        plain: true,
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_27;
    let __VLS_28;
    let __VLS_29;
    const __VLS_30 = {
        onClick: (__VLS_ctx.toggleLike)
    };
    __VLS_26.slots.default;
    (__VLS_ctx.detail.isLiked ? '取消点赞' : '点赞支持');
    var __VLS_26;
    /** @type {[typeof MarkdownPreview, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(MarkdownPreview, new MarkdownPreview({
        content: (__VLS_ctx.detail.content),
    }));
    const __VLS_32 = __VLS_31({
        content: (__VLS_ctx.detail.content),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "hc-card minecraft-card sub-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "version-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.detail.currentVersion?.versionNo || __VLS_ctx.detail.currentVersionNo || '未设置');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.detail.currentVersion?.mcVersions || __VLS_ctx.detail.mcVersions || '未填写');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (__VLS_ctx.detail.currentVersion?.downloadType || __VLS_ctx.detail.downloadType || 'LINK');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    /** @type {[typeof MarkdownPreview, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(MarkdownPreview, new MarkdownPreview({
        content: (__VLS_ctx.detail.currentVersion?.changelog || ''),
    }));
    const __VLS_35 = __VLS_34({
        content: (__VLS_ctx.detail.currentVersion?.changelog || ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    if (__VLS_ctx.detail.relatedResources?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "hc-card minecraft-card sub-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
        const __VLS_37 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            to: "/resources",
        }));
        const __VLS_39 = __VLS_38({
            to: "/resources",
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        __VLS_40.slots.default;
        var __VLS_40;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "related-grid" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.detail.relatedResources))) {
            const __VLS_41 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                key: (item.id),
                to: (`/resources/${item.id}`),
                ...{ class: "related-item" },
            }));
            const __VLS_43 = __VLS_42({
                key: (item.id),
                to: (`/resources/${item.id}`),
                ...{ class: "related-item" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
            __VLS_44.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "related-title" },
            });
            (item.title);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "related-meta" },
            });
            (item.categoryName);
            (item.downloadCount);
            var __VLS_44;
        }
    }
}
/** @type {__VLS_StyleScopedClasses['resource-detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cover']} */ ;
/** @type {__VLS_StyleScopedClasses['body']} */ ;
/** @type {__VLS_StyleScopedClasses['top-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['summary']} */ ;
/** @type {__VLS_StyleScopedClasses['tags']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-link']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-card']} */ ;
/** @type {__VLS_StyleScopedClasses['version-box']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['related-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['related-item']} */ ;
/** @type {__VLS_StyleScopedClasses['related-title']} */ ;
/** @type {__VLS_StyleScopedClasses['related-meta']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            EmptyState: EmptyState,
            MarkdownPreview: MarkdownPreview,
            resolveFileUrl: resolveFileUrl,
            loading: loading,
            detail: detail,
            toggleFavorite: toggleFavorite,
            toggleLike: toggleLike,
            handleDownload: handleDownload,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ResourceDetailPage.vue.js.map
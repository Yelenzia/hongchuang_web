import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import TagChip from '@/components/common/TagChip.vue';
import CommentList from '@/components/forum/CommentList.vue';
import MarkdownPreview from '@/components/editor/MarkdownPreview.vue';
import { formatDateTime } from '@/utils/format';
import { resolveFileUrl } from '@/utils/file';
import { blockPostApi, cancelFavoritePostApi, cancelLikePostApi, deletePostApi, favoritePostApi, getPostDetailApi, likePostApi, unblockPostApi } from '@/api/post';
import { createCommentApi, deleteCommentApi, getCommentsApi } from '@/api/comment';
import { createReportApi } from '@/api/report';
import { useAuthStore } from '@/store/auth';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const commentSubmitting = ref(false);
const reportSubmitting = ref(false);
const reportDialogVisible = ref(false);
const commentText = ref('');
const post = ref(null);
const comments = ref([]);
const replyTarget = ref(null);
const reportTargetType = ref('POST');
const reportTargetId = ref('');
const reportForm = reactive({
    reasonType: 'VIOLATION',
    reasonDetail: ''
});
const postId = computed(() => String(route.params.id || ''));
const isOwnPost = computed(() => authStore.userInfo?.id === post.value?.authorId);
const commentTree = computed(() => {
    const map = new Map();
    const roots = [];
    comments.value.forEach(item => map.set(item.id, { ...item, children: [] }));
    comments.value.forEach(item => {
        const node = map.get(item.id);
        if (item.parentId && item.parentId !== '0' && map.has(item.parentId)) {
            map.get(item.parentId).children.push(node);
        }
        else {
            roots.push(node);
        }
    });
    return roots;
});
const avatarOf = (value) => resolveFileUrl(value);
const loadDetail = async () => {
    loading.value = true;
    try {
        const [{ data: postData }, { data: commentData }] = await Promise.all([
            getPostDetailApi(postId.value),
            getCommentsApi(postId.value)
        ]);
        post.value = postData;
        comments.value = commentData;
    }
    finally {
        loading.value = false;
    }
};
const clearReply = () => {
    replyTarget.value = null;
};
const handleReplyComment = (item) => {
    if (!authStore.isLogin) {
        ElMessage.warning('请先登录后再回复');
        return;
    }
    replyTarget.value = item;
    commentText.value = item.username ? `@${item.username} ` : '';
};
const handleOpenReportComment = (item) => {
    if (!authStore.isLogin) {
        ElMessage.warning('请先登录后再举报');
        return;
    }
    reportTargetType.value = 'COMMENT';
    reportTargetId.value = item.id;
    reportDialogVisible.value = true;
};
const handleToggleLike = async () => {
    if (!authStore.isLogin || !post.value) {
        ElMessage.warning('请先登录后再进行操作');
        return;
    }
    if (post.value.liked) {
        await cancelLikePostApi(postId.value);
    }
    else {
        await likePostApi(postId.value);
    }
    await loadDetail();
};
const handleToggleFavorite = async () => {
    if (!authStore.isLogin || !post.value) {
        ElMessage.warning('请先登录后再进行操作');
        return;
    }
    if (post.value.favorited) {
        await cancelFavoritePostApi(postId.value);
        ElMessage.success('已取消收藏');
    }
    else {
        await favoritePostApi(postId.value);
        ElMessage.success('收藏成功');
    }
    await authStore.fetchMe().catch(() => undefined);
    await loadDetail();
};
const handleToggleBlock = async () => {
    if (!authStore.isLogin || !post.value) {
        ElMessage.warning('请先登录后再进行操作');
        return;
    }
    if (post.value.blocked) {
        await unblockPostApi(postId.value);
    }
    else {
        await blockPostApi(postId.value);
    }
    await loadDetail();
};
const handleCreateComment = async () => {
    if (!authStore.isLogin) {
        ElMessage.warning('请先登录后再发表评论');
        return;
    }
    if (!commentText.value.trim()) {
        ElMessage.warning('评论内容不能为空');
        return;
    }
    commentSubmitting.value = true;
    const replying = Boolean(replyTarget.value);
    try {
        await createCommentApi(postId.value, {
            parentId: replyTarget.value?.id || '0',
            replyUserId: replyTarget.value?.userId,
            content: commentText.value.trim()
        });
        commentText.value = '';
        clearReply();
        ElMessage.success(replying ? '回复成功' : '评论成功');
        await loadDetail();
    }
    finally {
        commentSubmitting.value = false;
    }
};
const handleDeleteComment = async (commentId) => {
    if (!authStore.isLogin)
        return;
    await ElMessageBox.confirm('确定删除这条评论吗？', '删除确认', { type: 'warning' });
    await deleteCommentApi(commentId);
    ElMessage.success('评论已删除');
    await loadDetail();
};
const handleDeletePost = async () => {
    await ElMessageBox.confirm('确定删除这篇帖子吗？删除后不可恢复。', '删除确认', { type: 'warning' });
    await deletePostApi(postId.value);
    ElMessage.success('帖子已删除');
    router.push('/forum');
};
const handleReport = async () => {
    if (!authStore.isLogin) {
        ElMessage.warning('请先登录后再举报');
        return;
    }
    reportSubmitting.value = true;
    try {
        await createReportApi({
            targetType: reportTargetType.value,
            targetId: reportTargetType.value === 'POST' ? postId.value : reportTargetId.value,
            reasonType: reportForm.reasonType,
            reasonDetail: reportForm.reasonDetail
        });
        ElMessage.success('举报已提交');
        reportDialogVisible.value = false;
        reportForm.reasonType = 'VIOLATION';
        reportForm.reasonDetail = '';
    }
    finally {
        reportSubmitting.value = false;
    }
};
onMounted(loadDetail);
watch(postId, loadDetail);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['level-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['author-panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container detail-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
    ...{ class: "hc-card detail minecraft-card" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.post) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "board" },
    });
    (__VLS_ctx.post.boardName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "time" },
    });
    (__VLS_ctx.formatDateTime(__VLS_ctx.post.createdAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "title" },
    });
    (__VLS_ctx.post.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "author-panel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "author-box" },
    });
    if (__VLS_ctx.post.authorAvatarUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.avatarOf(__VLS_ctx.post.authorAvatarUrl)),
            ...{ class: "avatar" },
            alt: "avatar",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "avatar fallback" },
        });
        (__VLS_ctx.post.authorName.slice(0, 1));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: (`/user/${__VLS_ctx.post.authorId}`),
        ...{ class: "author-name" },
    }));
    const __VLS_2 = __VLS_1({
        to: (`/user/${__VLS_ctx.post.authorId}`),
        ...{ class: "author-name" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (__VLS_ctx.post.authorName);
    var __VLS_3;
    if (__VLS_ctx.post.authorForumUid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "uid-chip" },
        });
        (__VLS_ctx.post.authorForumUid);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "author-chips" },
    });
    if (__VLS_ctx.post.authorBusinessCard) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "card-chip" },
        });
        (__VLS_ctx.post.authorBusinessCard);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-chip" },
    });
    (__VLS_ctx.post.authorUserLevel || 1);
    if (__VLS_ctx.post.authorSignature) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "author-signature" },
        });
        (__VLS_ctx.post.authorSignature);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "author-extra" },
    });
    (__VLS_ctx.post.viewCount);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tags" },
    });
    for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.post.tags))) {
        /** @type {[typeof TagChip, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(TagChip, new TagChip({
            key: (tag.id),
            label: (tag.name),
        }));
        const __VLS_5 = __VLS_4({
            key: (tag.id),
            label: (tag.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    }
    /** @type {[typeof MarkdownPreview, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(MarkdownPreview, new MarkdownPreview({
        ...{ class: "content" },
        content: (__VLS_ctx.post.contentMd),
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: "content" },
        content: (__VLS_ctx.post.contentMd),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_10 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        onClick: (__VLS_ctx.handleToggleLike)
    };
    __VLS_13.slots.default;
    (__VLS_ctx.post.liked ? '取消点赞' : '点赞');
    (__VLS_ctx.post.likeCount);
    var __VLS_13;
    const __VLS_18 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        type: "warning",
        plain: true,
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        type: "warning",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_22;
    let __VLS_23;
    let __VLS_24;
    const __VLS_25 = {
        onClick: (__VLS_ctx.handleToggleFavorite)
    };
    __VLS_21.slots.default;
    (__VLS_ctx.post.favorited ? '取消收藏' : '收藏帖子');
    (__VLS_ctx.post.favoriteCount || 0);
    var __VLS_21;
    const __VLS_26 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        plain: true,
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_30;
    let __VLS_31;
    let __VLS_32;
    const __VLS_33 = {
        onClick: (__VLS_ctx.handleToggleBlock)
    };
    __VLS_29.slots.default;
    (__VLS_ctx.post.blocked ? '取消屏蔽' : '屏蔽帖子');
    var __VLS_29;
    const __VLS_34 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        plain: true,
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_38;
    let __VLS_39;
    let __VLS_40;
    const __VLS_41 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.post))
                return;
            __VLS_ctx.reportDialogVisible = true;
        }
    };
    __VLS_37.slots.default;
    var __VLS_37;
    if (__VLS_ctx.isOwnPost) {
        const __VLS_42 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
            ...{ 'onClick': {} },
            plain: true,
        }));
        const __VLS_44 = __VLS_43({
            ...{ 'onClick': {} },
            plain: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_43));
        let __VLS_46;
        let __VLS_47;
        let __VLS_48;
        const __VLS_49 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.post))
                    return;
                if (!(__VLS_ctx.isOwnPost))
                    return;
                __VLS_ctx.router.push(`/post/${__VLS_ctx.post.id}/edit`);
            }
        };
        __VLS_45.slots.default;
        var __VLS_45;
    }
    if (__VLS_ctx.isOwnPost) {
        const __VLS_50 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
            ...{ 'onClick': {} },
            plain: true,
            type: "danger",
        }));
        const __VLS_52 = __VLS_51({
            ...{ 'onClick': {} },
            plain: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_51));
        let __VLS_54;
        let __VLS_55;
        let __VLS_56;
        const __VLS_57 = {
            onClick: (__VLS_ctx.handleDeletePost)
        };
        __VLS_53.slots.default;
        var __VLS_53;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "comment-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card form-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hint" },
});
if (__VLS_ctx.replyTarget) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "reply-banner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.replyTarget.nickname);
    if (__VLS_ctx.replyTarget.username) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.replyTarget.username);
    }
    if (__VLS_ctx.replyTarget.forumUid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.replyTarget.forumUid);
    }
    const __VLS_58 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_60 = __VLS_59({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    let __VLS_62;
    let __VLS_63;
    let __VLS_64;
    const __VLS_65 = {
        onClick: (__VLS_ctx.clearReply)
    };
    __VLS_61.slots.default;
    var __VLS_61;
}
const __VLS_66 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.commentText),
    type: "textarea",
    rows: (4),
    placeholder: "写下你的看法，或使用 @用户名 提醒对方…",
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.commentText),
    type: "textarea",
    rows: (4),
    placeholder: "写下你的看法，或使用 @用户名 提醒对方…",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "submit" },
});
const __VLS_70 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.authStore.isLogin),
    loading: (__VLS_ctx.commentSubmitting),
}));
const __VLS_72 = __VLS_71({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.authStore.isLogin),
    loading: (__VLS_ctx.commentSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_74;
let __VLS_75;
let __VLS_76;
const __VLS_77 = {
    onClick: (__VLS_ctx.handleCreateComment)
};
__VLS_73.slots.default;
(__VLS_ctx.replyTarget ? '提交回复' : '提交评论');
var __VLS_73;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title comments-title" },
});
/** @type {[typeof CommentList, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(CommentList, new CommentList({
    ...{ 'onDelete': {} },
    ...{ 'onReply': {} },
    ...{ 'onReport': {} },
    comments: (__VLS_ctx.commentTree),
    showDelete: (__VLS_ctx.authStore.isLogin),
    currentUserId: (__VLS_ctx.authStore.userInfo?.id),
}));
const __VLS_79 = __VLS_78({
    ...{ 'onDelete': {} },
    ...{ 'onReply': {} },
    ...{ 'onReport': {} },
    comments: (__VLS_ctx.commentTree),
    showDelete: (__VLS_ctx.authStore.isLogin),
    currentUserId: (__VLS_ctx.authStore.userInfo?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_81;
let __VLS_82;
let __VLS_83;
const __VLS_84 = {
    onDelete: (__VLS_ctx.handleDeleteComment)
};
const __VLS_85 = {
    onReply: (__VLS_ctx.handleReplyComment)
};
const __VLS_86 = {
    onReport: (__VLS_ctx.handleOpenReportComment)
};
var __VLS_80;
const __VLS_87 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.reportDialogVisible),
    title: (__VLS_ctx.reportTargetType === 'POST' ? '举报帖子' : '举报评论'),
    width: "480px",
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.reportDialogVisible),
    title: (__VLS_ctx.reportTargetType === 'POST' ? '举报帖子' : '举报评论'),
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
const __VLS_91 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    labelPosition: "top",
}));
const __VLS_93 = __VLS_92({
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
const __VLS_95 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "举报类型",
}));
const __VLS_97 = __VLS_96({
    label: "举报类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
const __VLS_99 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    modelValue: (__VLS_ctx.reportForm.reasonType),
    ...{ style: {} },
}));
const __VLS_101 = __VLS_100({
    modelValue: (__VLS_ctx.reportForm.reasonType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "违规内容",
    value: "VIOLATION",
}));
const __VLS_105 = __VLS_104({
    label: "违规内容",
    value: "VIOLATION",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const __VLS_107 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "广告引流",
    value: "SPAM",
}));
const __VLS_109 = __VLS_108({
    label: "广告引流",
    value: "SPAM",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const __VLS_111 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "人身攻击",
    value: "ABUSE",
}));
const __VLS_113 = __VLS_112({
    label: "人身攻击",
    value: "ABUSE",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
const __VLS_115 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    label: "其他",
    value: "OTHER",
}));
const __VLS_117 = __VLS_116({
    label: "其他",
    value: "OTHER",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_102;
var __VLS_98;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "详细说明",
}));
const __VLS_121 = __VLS_120({
    label: "详细说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.reportForm.reasonDetail),
    type: "textarea",
    rows: (4),
    maxlength: "200",
    showWordLimit: true,
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.reportForm.reasonDetail),
    type: "textarea",
    rows: (4),
    maxlength: "200",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
var __VLS_122;
var __VLS_94;
{
    const { footer: __VLS_thisSlot } = __VLS_90.slots;
    const __VLS_127 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ 'onClick': {} },
    }));
    const __VLS_129 = __VLS_128({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    let __VLS_131;
    let __VLS_132;
    let __VLS_133;
    const __VLS_134 = {
        onClick: (...[$event]) => {
            __VLS_ctx.reportDialogVisible = false;
        }
    };
    __VLS_130.slots.default;
    var __VLS_130;
    const __VLS_135 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.reportSubmitting),
    }));
    const __VLS_137 = __VLS_136({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.reportSubmitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    let __VLS_139;
    let __VLS_140;
    let __VLS_141;
    const __VLS_142 = {
        onClick: (__VLS_ctx.handleReport)
    };
    __VLS_138.slots.default;
    var __VLS_138;
}
var __VLS_90;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-top']} */ ;
/** @type {__VLS_StyleScopedClasses['board']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['author-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['author-box']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['author-name']} */ ;
/** @type {__VLS_StyleScopedClasses['uid-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['author-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['card-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['level-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['author-signature']} */ ;
/** @type {__VLS_StyleScopedClasses['author-extra']} */ ;
/** @type {__VLS_StyleScopedClasses['tags']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-banner']} */ ;
/** @type {__VLS_StyleScopedClasses['submit']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TagChip: TagChip,
            CommentList: CommentList,
            MarkdownPreview: MarkdownPreview,
            formatDateTime: formatDateTime,
            router: router,
            authStore: authStore,
            loading: loading,
            commentSubmitting: commentSubmitting,
            reportSubmitting: reportSubmitting,
            reportDialogVisible: reportDialogVisible,
            commentText: commentText,
            post: post,
            replyTarget: replyTarget,
            reportTargetType: reportTargetType,
            reportForm: reportForm,
            isOwnPost: isOwnPost,
            commentTree: commentTree,
            avatarOf: avatarOf,
            clearReply: clearReply,
            handleReplyComment: handleReplyComment,
            handleOpenReportComment: handleOpenReportComment,
            handleToggleLike: handleToggleLike,
            handleToggleFavorite: handleToggleFavorite,
            handleToggleBlock: handleToggleBlock,
            handleCreateComment: handleCreateComment,
            handleDeleteComment: handleDeleteComment,
            handleDeletePost: handleDeletePost,
            handleReport: handleReport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PostDetailPage.vue.js.map
import { formatDateTime } from '@/utils/format';
import { resolveFileUrl } from '@/utils/file';
defineOptions({ name: 'CommentList' });
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
const avatarOf = (value) => resolveFileUrl(value);
const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const renderCommentContent = (value) => escapeHtml(value || '')
    .replace(/(@[A-Za-z0-9_\-\u4e00-\u9fa5]{2,32})/g, '<span class="mention">$1</span>')
    .replace(/\n/g, '<br>');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['signature']} */ ;
/** @type {__VLS_StyleScopedClasses['card-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['level-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['children-wrap']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "comment-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.comments))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
        key: (item.id),
        ...{ class: "hc-card comment-item minecraft-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-head" },
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
        (item.nickname.slice(0, 1));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "name" },
        to: (`/user/${item.userId}`),
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "name" },
        to: (`/user/${item.userId}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (item.nickname);
    var __VLS_3;
    if (item.forumUid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "forum-id" },
        });
        (item.forumUid);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chips" },
    });
    if (item.businessCard) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "card-chip" },
        });
        (item.businessCard);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-chip" },
    });
    (item.userLevel || 1);
    if (item.signature) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "signature" },
        });
        (item.signature);
    }
    if (item.replyUserId) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "reply-mark" },
        });
        const __VLS_4 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ class: "reply-user" },
            to: (`/user/${item.replyUserId}`),
        }));
        const __VLS_6 = __VLS_5({
            ...{ class: "reply-user" },
            to: (`/user/${item.replyUserId}`),
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_7.slots.default;
        (item.replyNickname || `用户 ${item.replyUserId}`);
        var __VLS_7;
        if (item.replyForumUid) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (item.replyForumUid);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time" },
    });
    (__VLS_ctx.formatDateTime(item.createdAt));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.renderCommentContent(item.content)) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "comment-actions" },
    });
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
            __VLS_ctx.$emit('reply', item);
        }
    };
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_16 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (...[$event]) => {
            __VLS_ctx.$emit('report', item);
        }
    };
    __VLS_19.slots.default;
    var __VLS_19;
    if (__VLS_ctx.showDelete && (!__VLS_ctx.currentUserId || __VLS_ctx.currentUserId === item.userId)) {
        const __VLS_24 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showDelete && (!__VLS_ctx.currentUserId || __VLS_ctx.currentUserId === item.userId)))
                    return;
                __VLS_ctx.$emit('delete', item.id);
            }
        };
        __VLS_27.slots.default;
        var __VLS_27;
    }
    if (item.children?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "children-wrap" },
        });
        const __VLS_32 = {}.CommentList;
        /** @type {[typeof __VLS_components.CommentList, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            ...{ 'onDelete': {} },
            ...{ 'onReply': {} },
            ...{ 'onReport': {} },
            comments: (item.children),
            showDelete: (__VLS_ctx.showDelete),
            currentUserId: (__VLS_ctx.currentUserId),
        }));
        const __VLS_34 = __VLS_33({
            ...{ 'onDelete': {} },
            ...{ 'onReply': {} },
            ...{ 'onReport': {} },
            comments: (item.children),
            showDelete: (__VLS_ctx.showDelete),
            currentUserId: (__VLS_ctx.currentUserId),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        let __VLS_36;
        let __VLS_37;
        let __VLS_38;
        const __VLS_39 = {
            onDelete: (...[$event]) => {
                if (!(item.children?.length))
                    return;
                __VLS_ctx.$emit('delete', $event);
            }
        };
        const __VLS_40 = {
            onReply: (...[$event]) => {
                if (!(item.children?.length))
                    return;
                __VLS_ctx.$emit('reply', $event);
            }
        };
        const __VLS_41 = {
            onReport: (...[$event]) => {
                if (!(item.children?.length))
                    return;
                __VLS_ctx.$emit('report', $event);
            }
        };
        var __VLS_35;
    }
}
/** @type {__VLS_StyleScopedClasses['comment-list']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-head']} */ ;
/** @type {__VLS_StyleScopedClasses['user-box']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['forum-id']} */ ;
/** @type {__VLS_StyleScopedClasses['chips']} */ ;
/** @type {__VLS_StyleScopedClasses['card-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['level-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['signature']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['reply-user']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['children-wrap']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            formatDateTime: formatDateTime,
            avatarOf: avatarOf,
            renderCommentContent: renderCommentContent,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CommentList.vue.js.map
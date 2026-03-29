import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { getConversationApi, getPrivateMessageSessionsApi, sendPrivateMessageApi } from '@/api/notification';
import { getUserProfileApi, searchUsersApi } from '@/api/user';
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';
const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();
const targetUserId = ref('');
const searchUserId = ref('');
const content = ref('');
const loadingConversation = ref(false);
const sessionsLoading = ref(false);
const searchingUsers = ref(false);
const sessionKeyword = ref('');
const messages = ref([]);
const sessions = ref([]);
const searchResults = ref([]);
const messageContainerRef = ref(null);
let refreshTimer;
const normalizeId = (value) => value == null ? '' : String(value);
const normalizeSession = (item) => ({
    ...item,
    targetUserId: normalizeId(item.targetUserId),
    lastMessageId: item.lastMessageId == null ? null : String(item.lastMessageId),
    unreadCount: Number(item.unreadCount || 0)
});
const normalizeMessage = (item) => ({
    ...item,
    id: normalizeId(item.id),
    fromUserId: normalizeId(item.fromUserId),
    toUserId: normalizeId(item.toUserId)
});
const activeSession = computed(() => sessions.value.find(item => item.targetUserId === targetUserId.value) || null);
const unreadSessionCount = computed(() => sessions.value.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0));
const formatTime = (value) => {
    if (!value)
        return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { hour12: false });
};
const scrollToBottom = async () => {
    await nextTick();
    if (messageContainerRef.value) {
        messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight;
    }
};
const ensureSessionPlaceholder = async (userId) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId || sessions.value.some(item => item.targetUserId === normalizedUserId)) {
        return;
    }
    try {
        const { data } = await getUserProfileApi(normalizedUserId);
        sessions.value = [
            {
                targetUserId: normalizeId(data.userId),
                username: data.username,
                nickname: data.nickname,
                avatarUrl: data.avatarUrl,
                signature: data.signature,
                userLevel: data.userLevel,
                lastMessageContent: '',
                lastMessageTime: null,
                lastMessageId: null,
                unreadCount: 0
            },
            ...sessions.value
        ];
    }
    catch {
        // 忽略占位会话加载失败
    }
};
const loadSessions = async () => {
    sessionsLoading.value = true;
    try {
        const { data } = await getPrivateMessageSessionsApi({ keyword: sessionKeyword.value || undefined });
        sessions.value = (Array.isArray(data) ? data : []).map(normalizeSession);
        if (targetUserId.value) {
            await ensureSessionPlaceholder(targetUserId.value);
        }
    }
    finally {
        sessionsLoading.value = false;
    }
};
const loadConversation = async () => {
    if (!targetUserId.value)
        return;
    loadingConversation.value = true;
    try {
        await ensureSessionPlaceholder(targetUserId.value);
        const { data } = await getConversationApi(targetUserId.value);
        messages.value = (Array.isArray(data) ? data : []).map(normalizeMessage);
        await Promise.all([loadSessions(), appStore.refreshUnreadCount()]);
        await scrollToBottom();
    }
    finally {
        loadingConversation.value = false;
    }
};
const selectSession = async (userId) => {
    targetUserId.value = normalizeId(userId);
    await loadConversation();
};
const remoteSearchUsers = async (keyword) => {
    if (!keyword.trim()) {
        searchResults.value = [];
        return;
    }
    searchingUsers.value = true;
    try {
        const { data } = await searchUsersApi({ keyword, limit: 12 });
        searchResults.value = (Array.isArray(data) ? data : []).map(item => ({ ...item, userId: normalizeId(item.userId) })).filter(item => item.userId !== normalizeId(authStore.userInfo?.id));
    }
    finally {
        searchingUsers.value = false;
    }
};
const handleSelectUser = async (userId) => {
    const normalizedUserId = normalizeId(userId);
    if (!normalizedUserId)
        return;
    targetUserId.value = normalizedUserId;
    const selected = searchResults.value.find(item => item.userId === normalizedUserId);
    if (selected && !sessions.value.some(item => item.targetUserId === normalizedUserId)) {
        sessions.value = [
            {
                targetUserId: selected.userId,
                username: selected.username,
                nickname: selected.nickname,
                avatarUrl: selected.avatarUrl,
                signature: selected.signature,
                userLevel: selected.userLevel,
                lastMessageContent: '',
                lastMessageTime: null,
                lastMessageId: null,
                unreadCount: 0
            },
            ...sessions.value
        ];
    }
    await loadConversation();
};
const sendMessage = async () => {
    if (!targetUserId.value || !content.value.trim()) {
        ElMessage.warning('请填写私信内容');
        return;
    }
    await sendPrivateMessageApi({ toUserId: targetUserId.value, content: content.value.trim() });
    content.value = '';
    ElMessage.success('私信已发送');
    await loadConversation();
};
watch(() => route.query.to, async (value) => {
    const normalizedUserId = normalizeId(value);
    if (!normalizedUserId)
        return;
    targetUserId.value = normalizedUserId;
    await loadConversation();
});
onMounted(async () => {
    await loadSessions();
    if (route.query.to) {
        targetUserId.value = normalizeId(route.query.to);
        await loadConversation();
    }
    else if (sessions.value[0]?.targetUserId) {
        targetUserId.value = normalizeId(sessions.value[0].targetUserId);
        await loadConversation();
    }
    refreshTimer = window.setInterval(async () => {
        await loadSessions();
        if (targetUserId.value) {
            const { data } = await getConversationApi(targetUserId.value);
            messages.value = (Array.isArray(data) ? data : []).map(normalizeMessage);
            await scrollToBottom();
        }
    }, 15000);
});
onBeforeUnmount(() => {
    window.clearInterval(refreshTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['message-layout']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "message-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "message-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "session-panel hc-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "session-summary" },
});
(__VLS_ctx.sessions.length);
(__VLS_ctx.unreadSessionCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-row" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.sessionKeyword),
    clearable: true,
    placeholder: "搜索会话中的用户",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.sessionKeyword),
    clearable: true,
    placeholder: "搜索会话中的用户",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onInput: (__VLS_ctx.loadSessions)
};
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-row" },
});
const __VLS_8 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchUserId),
    filterable: true,
    remote: true,
    clearable: true,
    reserveKeyword: true,
    placeholder: "搜索用户名 / 昵称后发起聊天",
    remoteMethod: (__VLS_ctx.remoteSearchUsers),
    loading: (__VLS_ctx.searchingUsers),
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchUserId),
    filterable: true,
    remote: true,
    clearable: true,
    reserveKeyword: true,
    placeholder: "搜索用户名 / 昵称后发起聊天",
    remoteMethod: (__VLS_ctx.remoteSearchUsers),
    loading: (__VLS_ctx.searchingUsers),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onChange: (__VLS_ctx.handleSelectUser)
};
__VLS_11.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.searchResults))) {
    const __VLS_16 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        key: (item.userId),
        label: (`${item.nickname} (@${item.username})`),
        value: (item.userId),
    }));
    const __VLS_18 = __VLS_17({
        key: (item.userId),
        label: (`${item.nickname} (@${item.username})`),
        value: (item.userId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-option" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.nickname);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "user-option-sub" },
    });
    (item.username);
    var __VLS_19;
}
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "session-list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.sessionsLoading) }, null, null);
if (!__VLS_ctx.sessions.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-text" },
    });
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.sessions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectSession(item.targetUserId);
            } },
        key: (item.targetUserId),
        ...{ class: "session-item" },
        ...{ class: ({ active: item.targetUserId === __VLS_ctx.targetUserId }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "session-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "session-name" },
    });
    (item.nickname || item.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "session-time" },
    });
    (item.lastMessageTime ? __VLS_ctx.formatTime(item.lastMessageTime) : '');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "session-preview" },
    });
    (item.lastMessageContent || '暂无消息内容');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "session-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.username);
    if (item.unreadCount > 0) {
        const __VLS_20 = {}.ElBadge;
        /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            value: (item.unreadCount),
        }));
        const __VLS_22 = __VLS_21({
            value: (item.unreadCount),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "chat-panel hc-card minecraft-card" },
});
if (__VLS_ctx.activeSession) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-name" },
    });
    (__VLS_ctx.activeSession.nickname || __VLS_ctx.activeSession.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-sub" },
    });
    (__VLS_ctx.activeSession.username);
    (__VLS_ctx.activeSession.signature ? ` · ${__VLS_ctx.activeSession.signature}` : '');
    const __VLS_24 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        to: (`/user/${__VLS_ctx.activeSession.targetUserId}`),
    }));
    const __VLS_26 = __VLS_25({
        to: (`/user/${__VLS_ctx.activeSession.targetUserId}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        plain: true,
    }));
    const __VLS_30 = __VLS_29({
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
    var __VLS_27;
}
if (__VLS_ctx.targetUserId) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chat-body" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loadingConversation) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "messages" },
        ref: "messageContainerRef",
    });
    /** @type {typeof __VLS_ctx.messageContainerRef} */ ;
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.messages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (item.id),
            ...{ class: "bubble" },
            ...{ class: ({ mine: item.fromUserId === String(__VLS_ctx.authStore.userInfo?.id || '') }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "content" },
        });
        (item.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "time" },
        });
        (__VLS_ctx.formatTime(item.createdAt));
    }
    if (!__VLS_ctx.messages.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty-text" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "send-row" },
    });
    const __VLS_32 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.content),
        type: "textarea",
        rows: (4),
        maxlength: "1000",
        showWordLimit: true,
        placeholder: "输入私信内容，Enter 可换行，点按钮发送",
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.content),
        type: "textarea",
        rows: (4),
        maxlength: "1000",
        showWordLimit: true,
        placeholder: "输入私信内容，Enter 可换行，点按钮发送",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "send-actions" },
    });
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.targetUserId),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.targetUserId),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.sendMessage)
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-chat" },
    });
    const __VLS_44 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        description: "请选择一个会话，或先搜索用户开始聊天",
    }));
    const __VLS_46 = __VLS_45({
        description: "请选择一个会话，或先搜索用户开始聊天",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
/** @type {__VLS_StyleScopedClasses['message-page']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['message-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['session-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['session-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['search-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-row']} */ ;
/** @type {__VLS_StyleScopedClasses['user-option']} */ ;
/** @type {__VLS_StyleScopedClasses['user-option-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['session-list']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['session-item']} */ ;
/** @type {__VLS_StyleScopedClasses['session-head']} */ ;
/** @type {__VLS_StyleScopedClasses['session-name']} */ ;
/** @type {__VLS_StyleScopedClasses['session-time']} */ ;
/** @type {__VLS_StyleScopedClasses['session-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['session-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-head']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-name']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['chat-body']} */ ;
/** @type {__VLS_StyleScopedClasses['messages']} */ ;
/** @type {__VLS_StyleScopedClasses['bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
/** @type {__VLS_StyleScopedClasses['send-row']} */ ;
/** @type {__VLS_StyleScopedClasses['send-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-chat']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            authStore: authStore,
            targetUserId: targetUserId,
            searchUserId: searchUserId,
            content: content,
            loadingConversation: loadingConversation,
            sessionsLoading: sessionsLoading,
            searchingUsers: searchingUsers,
            sessionKeyword: sessionKeyword,
            messages: messages,
            sessions: sessions,
            searchResults: searchResults,
            messageContainerRef: messageContainerRef,
            activeSession: activeSession,
            unreadSessionCount: unreadSessionCount,
            formatTime: formatTime,
            loadSessions: loadSessions,
            selectSession: selectSession,
            remoteSearchUsers: remoteSearchUsers,
            handleSelectUser: handleSelectUser,
            sendMessage: sendMessage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MessagePage.vue.js.map
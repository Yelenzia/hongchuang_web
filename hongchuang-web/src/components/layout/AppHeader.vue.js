import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store/app';
import { useRouter } from 'vue-router';
import logoUrl from '@/assets/images/logo.png';
const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();
const drawerVisible = ref(false);
const searchKeyword = ref('');
const navItems = computed(() => [
    { label: '首页', path: '/' },
    { label: '论坛', path: '/forum' },
    { label: '资源', path: '/resources' },
    { label: '公告', path: '/announcements' },
    { label: '团队联系', path: '/contact' },
    ...(authStore.isLogin ? [{ label: '用户中心', path: '/me/profile' }] : [])
]);
const goSearch = () => {
    const keyword = searchKeyword.value.trim();
    if (!keyword)
        return;
    router.push({ name: 'search', query: { keyword } });
    drawerVisible.value = false;
};
const handleLogout = async () => {
    await authStore.logout();
    appStore.unreadCount = 0;
    drawerVisible.value = false;
    router.push('/');
};
watch(() => authStore.isLogin, async (val) => {
    if (val) {
        await appStore.refreshUnreadCount();
    }
});
onMounted(async () => {
    if (authStore.isLogin) {
        await appStore.refreshUnreadCount();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['header-search']} */ ;
/** @type {__VLS_StyleScopedClasses['desktop-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['header-search']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-toggle']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container header-inner" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "brand" },
    to: "/",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "brand" },
    to: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.logoUrl),
    ...{ class: "brand-logo" },
    alt: "鸿创工作室",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand-sub" },
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "desktop-nav" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (item.path),
        ...{ class: "nav-link" },
        to: (item.path),
    }));
    const __VLS_6 = __VLS_5({
        key: (item.path),
        ...{ class: "nav-link" },
        to: (item.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    (item.label);
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-search" },
});
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜索帖子、资源、用户",
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchKeyword),
    placeholder: "搜索帖子、资源、用户",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onKeyup: (__VLS_ctx.goSearch)
};
__VLS_11.slots.default;
{
    const { append: __VLS_thisSlot } = __VLS_11.slots;
    const __VLS_16 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.goSearch)
    };
    __VLS_19.slots.default;
    var __VLS_19;
}
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
if (__VLS_ctx.authStore.isLogin) {
    const __VLS_24 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: "notify-btn" },
        to: "/me/notifications",
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "notify-btn" },
        to: "/me/notifications",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    if (__VLS_ctx.appStore.unreadCount) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "notify-badge" },
        });
        (__VLS_ctx.appStore.unreadCount > 99 ? '99+' : __VLS_ctx.appStore.unreadCount);
    }
    var __VLS_27;
    const __VLS_28 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ class: "user-link" },
        to: "/me/profile",
    }));
    const __VLS_30 = __VLS_29({
        ...{ class: "user-link" },
        to: "/me/profile",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (__VLS_ctx.authStore.userInfo?.nickname || __VLS_ctx.authStore.userInfo?.username);
    if (__VLS_ctx.authStore.userInfo?.forumUid) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "uid-chip" },
        });
        (__VLS_ctx.authStore.userInfo?.forumUid);
    }
    var __VLS_31;
    const __VLS_32 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        to: "/post/create",
    }));
    const __VLS_34 = __VLS_33({
        to: "/post/create",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        type: "primary",
        plain: true,
    }));
    const __VLS_38 = __VLS_37({
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    var __VLS_35;
    const __VLS_40 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        to: "/resources/create",
    }));
    const __VLS_42 = __VLS_41({
        to: "/resources/create",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        plain: true,
    }));
    const __VLS_46 = __VLS_45({
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    var __VLS_47;
    var __VLS_43;
    const __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        plain: true,
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (__VLS_ctx.handleLogout)
    };
    __VLS_51.slots.default;
    var __VLS_51;
}
else {
    const __VLS_56 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        to: "/login",
    }));
    const __VLS_58 = __VLS_57({
        to: "/login",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        plain: true,
    }));
    const __VLS_62 = __VLS_61({
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    var __VLS_63;
    var __VLS_59;
    const __VLS_64 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        to: "/register",
    }));
    const __VLS_66 = __VLS_65({
        to: "/register",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        type: "primary",
    }));
    const __VLS_70 = __VLS_69({
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    var __VLS_71;
    var __VLS_67;
}
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    ...{ class: "mobile-toggle" },
    circle: true,
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    ...{ class: "mobile-toggle" },
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (...[$event]) => {
        __VLS_ctx.drawerVisible = true;
    }
};
__VLS_75.slots.default;
var __VLS_75;
const __VLS_80 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.drawerVisible),
    direction: "rtl",
    size: "75%",
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.drawerVisible),
    direction: "rtl",
    size: "75%",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mobile-nav" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navItems))) {
    const __VLS_84 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        key: (item.path),
        ...{ class: "mobile-link" },
        to: (item.path),
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        key: (item.path),
        ...{ class: "mobile-link" },
        to: (item.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (...[$event]) => {
            __VLS_ctx.drawerVisible = false;
        }
    };
    __VLS_87.slots.default;
    (item.label);
    var __VLS_87;
}
if (__VLS_ctx.authStore.isLogin) {
    const __VLS_92 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/me/notifications",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/me/notifications",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.authStore.isLogin))
                return;
            __VLS_ctx.drawerVisible = false;
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
}
if (__VLS_ctx.authStore.isLogin) {
    const __VLS_100 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/post/create",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/post/create",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.authStore.isLogin))
                return;
            __VLS_ctx.drawerVisible = false;
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
if (__VLS_ctx.authStore.isLogin) {
    const __VLS_108 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/resources/create",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        ...{ class: "mobile-link" },
        to: "/resources/create",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.authStore.isLogin))
                return;
            __VLS_ctx.drawerVisible = false;
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
}
var __VLS_83;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['header-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-name']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['desktop-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['header-search']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['notify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['notify-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['user-link']} */ ;
/** @type {__VLS_StyleScopedClasses['uid-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            logoUrl: logoUrl,
            authStore: authStore,
            appStore: appStore,
            drawerVisible: drawerVisible,
            searchKeyword: searchKeyword,
            navItems: navItems,
            goSearch: goSearch,
            handleLogout: handleLogout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AppHeader.vue.js.map
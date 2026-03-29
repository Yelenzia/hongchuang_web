import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import UserProfileCard from '@/components/user/UserProfileCard.vue';
import AvatarUploader from '@/components/user/AvatarUploader.vue';
import AchievementWall from '@/components/user/AchievementWall.vue';
import { useAuthStore } from '@/store/auth';
import { updateMyProfileApi } from '@/api/user';
import { getMyAchievementsApi } from '@/api/achievement';
const authStore = useAuthStore();
const formRef = ref();
const loading = ref(false);
const saving = ref(false);
const achievements = ref([]);
const loadError = ref('');
const form = reactive({
    nickname: '',
    bio: '',
    signature: '',
    avatarUrl: ''
});
const rules = {
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 32, message: '昵称长度需在 2~32 位之间', trigger: 'blur' }
    ],
    signature: [{ max: 120, message: '签名不能超过 120 字', trigger: 'blur' }],
    bio: [{ max: 255, message: '简介不能超过 255 字', trigger: 'blur' }]
};
const fillForm = () => {
    form.nickname = authStore.userInfo?.nickname || '';
    form.bio = authStore.userInfo?.bio || '';
    form.signature = authStore.userInfo?.signature || '';
    form.avatarUrl = authStore.userInfo?.avatarUrl || '';
};
const loadProfile = async () => {
    loading.value = true;
    loadError.value = '';
    try {
        const me = await authStore.fetchMe();
        fillForm();
        try {
            const { data } = await getMyAchievementsApi();
            achievements.value = Array.isArray(data) ? data : [];
        }
        catch (error) {
            achievements.value = [];
            loadError.value = '个人资料已打开，但成就数据暂时加载失败。';
            console.error(error);
        }
        return me;
    }
    catch (error) {
        loadError.value = '个人资料加载失败，请稍后刷新重试。';
        console.error(error);
    }
    finally {
        loading.value = false;
    }
};
const handleSave = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    saving.value = true;
    try {
        await updateMyProfileApi({
            nickname: form.nickname,
            bio: form.bio,
            signature: form.signature,
            avatarUrl: form.avatarUrl
        });
        await authStore.fetchMe();
        ElMessage.success('资料更新成功');
    }
    catch (error) {
        console.error(error);
    }
    finally {
        saving.value = false;
    }
};
onMounted(async () => {
    await loadProfile();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "profile-page" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.authStore.userInfo) {
    /** @type {[typeof UserProfileCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UserProfileCard, new UserProfileCard({
        displayName: (__VLS_ctx.authStore.userInfo.nickname || __VLS_ctx.authStore.userInfo.username),
        email: (__VLS_ctx.authStore.userInfo.email || '-'),
        registerTime: (__VLS_ctx.authStore.userInfo.registerTime || '-'),
        postCount: (__VLS_ctx.authStore.userInfo.postCount || 0),
        commentCount: (__VLS_ctx.authStore.userInfo.commentCount || 0),
        favoriteCount: (__VLS_ctx.authStore.userInfo.favoriteCount || 0),
        followingCount: (__VLS_ctx.authStore.userInfo.followingCount || 0),
        followerCount: (__VLS_ctx.authStore.userInfo.followerCount || 0),
        bio: (__VLS_ctx.authStore.userInfo.bio || ''),
        signature: (__VLS_ctx.authStore.userInfo.signature || ''),
        forumId: (__VLS_ctx.authStore.userInfo.forumUid),
        avatarUrl: (__VLS_ctx.authStore.userInfo.avatarUrl),
        achievementCount: (__VLS_ctx.authStore.userInfo.achievementCount || 0),
        businessCard: (__VLS_ctx.authStore.userInfo.businessCard || ''),
        userLevel: (__VLS_ctx.authStore.userInfo.userLevel || 1),
        experiencePoints: (__VLS_ctx.authStore.userInfo.experiencePoints || 0),
        nextLevelExp: (__VLS_ctx.authStore.userInfo.nextLevelExp || 0),
    }));
    const __VLS_1 = __VLS_0({
        displayName: (__VLS_ctx.authStore.userInfo.nickname || __VLS_ctx.authStore.userInfo.username),
        email: (__VLS_ctx.authStore.userInfo.email || '-'),
        registerTime: (__VLS_ctx.authStore.userInfo.registerTime || '-'),
        postCount: (__VLS_ctx.authStore.userInfo.postCount || 0),
        commentCount: (__VLS_ctx.authStore.userInfo.commentCount || 0),
        favoriteCount: (__VLS_ctx.authStore.userInfo.favoriteCount || 0),
        followingCount: (__VLS_ctx.authStore.userInfo.followingCount || 0),
        followerCount: (__VLS_ctx.authStore.userInfo.followerCount || 0),
        bio: (__VLS_ctx.authStore.userInfo.bio || ''),
        signature: (__VLS_ctx.authStore.userInfo.signature || ''),
        forumId: (__VLS_ctx.authStore.userInfo.forumUid),
        avatarUrl: (__VLS_ctx.authStore.userInfo.avatarUrl),
        achievementCount: (__VLS_ctx.authStore.userInfo.achievementCount || 0),
        businessCard: (__VLS_ctx.authStore.userInfo.businessCard || ''),
        userLevel: (__VLS_ctx.authStore.userInfo.userLevel || 1),
        experiencePoints: (__VLS_ctx.authStore.userInfo.experiencePoints || 0),
        nextLevelExp: (__VLS_ctx.authStore.userInfo.nextLevelExp || 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card form-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.loadError) {
    const __VLS_3 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (__VLS_ctx.loadError),
        ...{ class: "mb-16" },
    }));
    const __VLS_5 = __VLS_4({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (__VLS_ctx.loadError),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
}
const __VLS_7 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_9 = __VLS_8({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_11 = {};
__VLS_10.slots.default;
const __VLS_13 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "昵称",
    prop: "nickname",
}));
const __VLS_15 = __VLS_14({
    label: "昵称",
    prop: "nickname",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    modelValue: (__VLS_ctx.form.nickname),
    maxlength: "32",
    showWordLimit: true,
}));
const __VLS_19 = __VLS_18({
    modelValue: (__VLS_ctx.form.nickname),
    maxlength: "32",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_16;
const __VLS_21 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    label: "个性签名",
    prop: "signature",
}));
const __VLS_23 = __VLS_22({
    label: "个性签名",
    prop: "signature",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.form.signature),
    maxlength: "120",
    showWordLimit: true,
    placeholder: "写一句展示在个人主页和评论区下方的签名",
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.form.signature),
    maxlength: "120",
    showWordLimit: true,
    placeholder: "写一句展示在个人主页和评论区下方的签名",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
var __VLS_24;
const __VLS_29 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    label: "个人简介",
    prop: "bio",
}));
const __VLS_31 = __VLS_30({
    label: "个人简介",
    prop: "bio",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.form.bio),
    type: "textarea",
    rows: (3),
    maxlength: "255",
    showWordLimit: true,
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.form.bio),
    type: "textarea",
    rows: (3),
    maxlength: "255",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_32;
var __VLS_10;
/** @type {[typeof AvatarUploader, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(AvatarUploader, new AvatarUploader({
    modelValue: (__VLS_ctx.form.avatarUrl),
    displayName: (__VLS_ctx.form.nickname || __VLS_ctx.authStore.userInfo?.username),
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.form.avatarUrl),
    displayName: (__VLS_ctx.form.nickname || __VLS_ctx.authStore.userInfo?.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "submit" },
});
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.handleSave)
};
__VLS_43.slots.default;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card form-card" },
});
/** @type {[typeof AchievementWall, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(AchievementWall, new AchievementWall({
    items: (__VLS_ctx.achievements),
}));
const __VLS_49 = __VLS_48({
    items: (__VLS_ctx.achievements),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
/** @type {__VLS_StyleScopedClasses['profile-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['submit']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
// @ts-ignore
var __VLS_12 = __VLS_11;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserProfileCard: UserProfileCard,
            AvatarUploader: AvatarUploader,
            AchievementWall: AchievementWall,
            authStore: authStore,
            formRef: formRef,
            loading: loading,
            saving: saving,
            achievements: achievements,
            loadError: loadError,
            form: form,
            rules: rules,
            handleSave: handleSave,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ProfilePage.vue.js.map
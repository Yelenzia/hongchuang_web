import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/auth';
import { useRouter, useRoute } from 'vue-router';
import CaptchaBox from '@/components/auth/CaptchaBox.vue';
import { getCaptchaApi, sendEmailCodeApi } from '@/api/auth';
const formRef = ref();
const submitting = ref(false);
const sending = ref(false);
const debugCode = ref('');
const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true';
const cooldown = ref(0);
let timer;
const captcha = reactive({ captchaId: '', imageBase64: '' });
const form = reactive({ account: '', password: '', emailCode: '', captchaId: '', captchaCode: '' });
const rules = { account: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }], password: [{ required: true, message: '请输入密码', trigger: 'blur' }], captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }], emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }] };
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const startCooldown = (seconds = 60) => { cooldown.value = seconds; window.clearInterval(timer); timer = window.setInterval(() => { cooldown.value -= 1; if (cooldown.value <= 0)
    window.clearInterval(timer); }, 1000); };
const loadCaptcha = async () => { const { data } = await getCaptchaApi(); captcha.captchaId = data.captchaId; captcha.imageBase64 = data.imageBase64; form.captchaId = data.captchaId; form.captchaCode = ''; };
const handleSendCode = async () => { if (!form.account.trim())
    return ElMessage.warning('请先输入用户名或邮箱'); if (!form.captchaCode.trim() || !form.captchaId)
    return ElMessage.warning('请先输入图形验证码'); sending.value = true; try {
    const { data } = await sendEmailCodeApi({ bizType: 'LOGIN', account: form.account.trim(), captchaId: form.captchaId, captchaCode: form.captchaCode.trim() });
    debugCode.value = data.debugCode || '';
    startCooldown(data.cooldownSeconds || 60);
    ElMessage.success(data.message || '验证码已发送');
    await loadCaptcha();
}
finally {
    sending.value = false;
} };
const handleLogin = async () => { const valid = await formRef.value?.validate().catch(() => false); if (!valid)
    return; submitting.value = true; try {
    const loginData = await authStore.login({ ...form });
    ElMessage.success(`登录成功，欢迎回来：${loginData.userInfo.nickname || loginData.userInfo.username}`);
    router.push(route.query.redirect || '/');
}
finally {
    submitting.value = false;
} };
onMounted(loadCaptcha);
onBeforeUnmount(() => window.clearInterval(timer));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-page hc-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card auth-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onSubmit: () => { }
};
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_10 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    label: "用户名 / 邮箱",
    prop: "account",
}));
const __VLS_12 = __VLS_11({
    label: "用户名 / 邮箱",
    prop: "account",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.form.account),
    placeholder: "请输入用户名或邮箱",
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.form.account),
    placeholder: "请输入用户名或邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_13;
const __VLS_18 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    label: "密码",
    prop: "password",
}));
const __VLS_20 = __VLS_19({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
const __VLS_22 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
    placeholder: "请输入密码",
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
    placeholder: "请输入密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
var __VLS_21;
const __VLS_26 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    label: "图形验证码",
    prop: "captchaCode",
}));
const __VLS_28 = __VLS_27({
    label: "图形验证码",
    prop: "captchaCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
/** @type {[typeof CaptchaBox, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(CaptchaBox, new CaptchaBox({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}));
const __VLS_31 = __VLS_30({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_33;
let __VLS_34;
let __VLS_35;
const __VLS_36 = {
    onRefresh: (__VLS_ctx.loadCaptcha)
};
var __VLS_32;
var __VLS_29;
const __VLS_37 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    label: "邮箱验证码",
    prop: "emailCode",
}));
const __VLS_39 = __VLS_38({
    label: "邮箱验证码",
    prop: "emailCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "code-row" },
});
const __VLS_41 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    modelValue: (__VLS_ctx.form.emailCode),
    placeholder: "请输入邮箱验证码",
}));
const __VLS_43 = __VLS_42({
    modelValue: (__VLS_ctx.form.emailCode),
    placeholder: "请输入邮箱验证码",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const __VLS_45 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (__VLS_ctx.cooldown > 0),
    loading: (__VLS_ctx.sending),
}));
const __VLS_47 = __VLS_46({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (__VLS_ctx.cooldown > 0),
    loading: (__VLS_ctx.sending),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_49;
let __VLS_50;
let __VLS_51;
const __VLS_52 = {
    onClick: (__VLS_ctx.handleSendCode)
};
__VLS_48.slots.default;
(__VLS_ctx.cooldown > 0 ? `${__VLS_ctx.cooldown}s后重试` : '发送验证码');
var __VLS_48;
if (__VLS_ctx.showDebugCode && __VLS_ctx.debugCode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "debug-tip" },
    });
    (__VLS_ctx.debugCode);
}
var __VLS_40;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "foot-links" },
});
const __VLS_53 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    to: "/forgot-password",
}));
const __VLS_55 = __VLS_54({
    to: "/forgot-password",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
var __VLS_56;
const __VLS_57 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    to: "/register",
}));
const __VLS_59 = __VLS_58({
    to: "/register",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
var __VLS_60;
const __VLS_61 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    ...{ 'onClick': {} },
    ...{ class: "submit-btn" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_63 = __VLS_62({
    ...{ 'onClick': {} },
    ...{ class: "submit-btn" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_65;
let __VLS_66;
let __VLS_67;
const __VLS_68 = {
    onClick: (__VLS_ctx.handleLogin)
};
__VLS_64.slots.default;
var __VLS_64;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['auth-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['code-row']} */ ;
/** @type {__VLS_StyleScopedClasses['debug-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['foot-links']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
// @ts-ignore
var __VLS_9 = __VLS_8;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CaptchaBox: CaptchaBox,
            formRef: formRef,
            submitting: submitting,
            sending: sending,
            debugCode: debugCode,
            showDebugCode: showDebugCode,
            cooldown: cooldown,
            captcha: captcha,
            form: form,
            rules: rules,
            loadCaptcha: loadCaptcha,
            handleSendCode: handleSendCode,
            handleLogin: handleLogin,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=LoginPage.vue.js.map
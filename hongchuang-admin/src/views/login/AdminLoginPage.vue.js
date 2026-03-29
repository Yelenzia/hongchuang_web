import { onMounted, reactive, ref } from 'vue';
import { useAdminAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCaptchaApi, sendEmailCodeApi } from '@/api/auth';
import CaptchaBox from '@/components/forms/CaptchaBox.vue';
const form = reactive({ account: '', password: '', emailCode: '', captchaId: '', captchaCode: '' });
const rules = {
    account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
};
const formRef = ref();
const submitting = ref(false);
const sending = ref(false);
const debugCode = ref('');
const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true';
const captcha = reactive({ captchaId: '', imageBase64: '' });
const authStore = useAdminAuthStore();
const router = useRouter();
const loadCaptcha = async () => {
    const { data } = await getCaptchaApi();
    captcha.captchaId = data.captchaId;
    captcha.imageBase64 = data.imageBase64;
    form.captchaId = data.captchaId;
    form.captchaCode = '';
};
const handleSendCode = async () => {
    if (!form.account.trim()) {
        ElMessage.warning('请先输入管理员账号');
        return;
    }
    if (!form.captchaCode.trim()) {
        ElMessage.warning('请先输入图形验证码');
        return;
    }
    sending.value = true;
    try {
        const { data } = await sendEmailCodeApi({ bizType: 'LOGIN', account: form.account, captchaId: form.captchaId, captchaCode: form.captchaCode });
        debugCode.value = data.debugCode || '';
        ElMessage.success(data.message || '验证码已发送');
        await loadCaptcha();
    }
    finally {
        sending.value = false;
    }
};
const handleLogin = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    submitting.value = true;
    try {
        await authStore.login({ ...form });
        ElMessage.success('管理员登录成功');
        router.push('/dashboard');
    }
    catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '登录失败');
    }
    finally {
        submitting.value = false;
    }
};
onMounted(loadCaptcha);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "login-card" },
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
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_2 = __VLS_1({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_6 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    label: "管理员账号",
    prop: "account",
}));
const __VLS_8 = __VLS_7({
    label: "管理员账号",
    prop: "account",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
const __VLS_10 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.form.account),
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.form.account),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
var __VLS_9;
const __VLS_14 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    label: "密码",
    prop: "password",
}));
const __VLS_16 = __VLS_15({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
const __VLS_18 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_17;
const __VLS_22 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    label: "图形验证码",
    prop: "captchaCode",
}));
const __VLS_24 = __VLS_23({
    label: "图形验证码",
    prop: "captchaCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
/** @type {[typeof CaptchaBox, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(CaptchaBox, new CaptchaBox({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}));
const __VLS_27 = __VLS_26({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_29;
let __VLS_30;
let __VLS_31;
const __VLS_32 = {
    onRefresh: (__VLS_ctx.loadCaptcha)
};
var __VLS_28;
var __VLS_25;
const __VLS_33 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "邮箱验证码",
    prop: "emailCode",
}));
const __VLS_35 = __VLS_34({
    label: "邮箱验证码",
    prop: "emailCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "code-row" },
});
const __VLS_37 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.form.emailCode),
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.form.emailCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.sending),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.sending),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onClick: (__VLS_ctx.handleSendCode)
};
__VLS_44.slots.default;
var __VLS_44;
if (__VLS_ctx.showDebugCode && __VLS_ctx.debugCode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "debug-tip" },
    });
    (__VLS_ctx.debugCode);
}
var __VLS_36;
const __VLS_49 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    ...{ class: "submit" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    ...{ class: "submit" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_53;
let __VLS_54;
let __VLS_55;
const __VLS_56 = {
    onClick: (__VLS_ctx.handleLogin)
};
__VLS_52.slots.default;
var __VLS_52;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['code-row']} */ ;
/** @type {__VLS_StyleScopedClasses['debug-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['submit']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CaptchaBox: CaptchaBox,
            form: form,
            rules: rules,
            formRef: formRef,
            submitting: submitting,
            sending: sending,
            debugCode: debugCode,
            showDebugCode: showDebugCode,
            captcha: captcha,
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
//# sourceMappingURL=AdminLoginPage.vue.js.map
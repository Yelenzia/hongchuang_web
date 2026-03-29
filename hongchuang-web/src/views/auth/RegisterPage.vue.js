import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { isEmail, passwordRule } from '@/utils/validate';
import { useRouter } from 'vue-router';
import { getCaptchaApi, registerApi, sendEmailCodeApi } from '@/api/auth';
import CaptchaBox from '@/components/auth/CaptchaBox.vue';
const router = useRouter();
const formRef = ref();
const submitting = ref(false);
const sending = ref(false);
const agree = ref(false);
const debugCode = ref('');
const showDebugCode = import.meta.env.VITE_SHOW_DEBUG_CODE === 'true';
const cooldown = ref(0);
let timer;
const captcha = reactive({ captchaId: '', imageBase64: '' });
const form = reactive({ username: '', email: '', password: '', confirmPassword: '', emailCode: '', captchaId: '', captchaCode: '' });
const startCooldown = (seconds = 60) => {
    cooldown.value = seconds;
    window.clearInterval(timer);
    timer = window.setInterval(() => {
        cooldown.value -= 1;
        if (cooldown.value <= 0) {
            window.clearInterval(timer);
        }
    }, 1000);
};
const validateConfirmPassword = (_rule, value, callback) => {
    if (value !== form.password)
        return callback(new Error('两次输入的密码不一致'));
    callback();
};
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 4, max: 32, message: '用户名长度需在 4~32 位之间', trigger: 'blur' }, { pattern: /^[A-Za-z0-9_\-一-龥]+$/, message: '用户名仅支持中英文、数字、下划线和短横线', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: (_rule, value, callback) => callback(isEmail(value) ? undefined : new Error('邮箱格式不正确')), trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { validator: (_rule, value, callback) => callback(passwordRule.test(value) ? undefined : new Error('密码需 8~20 位，且至少包含字母和数字')), trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }, { validator: validateConfirmPassword, trigger: 'blur' }]
};
const loadCaptcha = async () => { const { data } = await getCaptchaApi(); captcha.captchaId = data.captchaId; captcha.imageBase64 = data.imageBase64; form.captchaId = data.captchaId; form.captchaCode = ''; };
const handleSendCode = async () => {
    if (!form.email || !isEmail(form.email))
        return ElMessage.warning('请先输入正确邮箱');
    if (!form.captchaCode || !form.captchaId)
        return ElMessage.warning('请先输入图形验证码');
    sending.value = true;
    try {
        const { data } = await sendEmailCodeApi({ bizType: 'REGISTER', email: form.email, captchaId: form.captchaId, captchaCode: form.captchaCode });
        debugCode.value = data.debugCode || '';
        startCooldown(data.cooldownSeconds || 60);
        ElMessage.success(data.message || '验证码已发送');
        await loadCaptcha();
    }
    finally {
        sending.value = false;
    }
};
const handleRegister = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    if (!agree.value)
        return ElMessage.warning('请先勾选协议');
    submitting.value = true;
    try {
        await registerApi({ ...form });
        ElMessage.success('注册成功，请登录');
        router.push({ name: 'login', query: { account: form.username } });
    }
    finally {
        submitting.value = false;
    }
};
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
    label: "用户名",
    prop: "username",
}));
const __VLS_12 = __VLS_11({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "4~32 位用户名",
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.form.username),
    placeholder: "4~32 位用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_13;
const __VLS_18 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    label: "邮箱",
    prop: "email",
}));
const __VLS_20 = __VLS_19({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
const __VLS_22 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入邮箱",
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入邮箱",
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
const __VLS_53 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    label: "密码",
    prop: "password",
}));
const __VLS_55 = __VLS_54({
    label: "密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
    placeholder: "8~20 位，需包含字母和数字",
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.form.password),
    type: "password",
    showPassword: true,
    placeholder: "8~20 位，需包含字母和数字",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
const __VLS_61 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    label: "确认密码",
    prop: "confirmPassword",
}));
const __VLS_63 = __VLS_62({
    label: "确认密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "再次输入密码",
}));
const __VLS_67 = __VLS_66({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "再次输入密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
var __VLS_64;
const __VLS_69 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    modelValue: (__VLS_ctx.agree),
}));
const __VLS_71 = __VLS_70({
    modelValue: (__VLS_ctx.agree),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
var __VLS_72;
const __VLS_73 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    ...{ 'onClick': {} },
    ...{ class: "submit-btn" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_75 = __VLS_74({
    ...{ 'onClick': {} },
    ...{ class: "submit-btn" },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_77;
let __VLS_78;
let __VLS_79;
const __VLS_80 = {
    onClick: (__VLS_ctx.handleRegister)
};
__VLS_76.slots.default;
var __VLS_76;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['auth-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['code-row']} */ ;
/** @type {__VLS_StyleScopedClasses['debug-tip']} */ ;
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
            agree: agree,
            debugCode: debugCode,
            showDebugCode: showDebugCode,
            cooldown: cooldown,
            captcha: captcha,
            form: form,
            rules: rules,
            loadCaptcha: loadCaptcha,
            handleSendCode: handleSendCode,
            handleRegister: handleRegister,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=RegisterPage.vue.js.map
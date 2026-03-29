import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import CaptchaBox from '@/components/auth/CaptchaBox.vue';
import { forgotPasswordApi, getCaptchaApi, resetPasswordApi } from '@/api/auth';
const formRef = ref();
const submitting = ref(false);
const cooldown = ref(0);
let timer;
const captcha = reactive({ captchaId: '', imageBase64: '' });
const form = reactive({
    email: '',
    captchaCode: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
});
const rules = {
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码至少 8 位', trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
};
const loadCaptcha = async () => {
    const { data } = await getCaptchaApi();
    captcha.captchaId = data.captchaId;
    captcha.imageBase64 = data.imageBase64;
    form.captchaCode = '';
};
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
const handleSendCode = async () => {
    if (!form.email.trim() || !form.captchaCode.trim() || !captcha.captchaId) {
        ElMessage.warning('请先填写邮箱和图形验证码');
        return;
    }
    const { data } = await forgotPasswordApi({ email: form.email.trim(), captchaId: captcha.captchaId, captchaCode: form.captchaCode.trim() });
    ElMessage.success(data.message || '邮箱验证码已发送');
    startCooldown(data.cooldownSeconds || 60);
    await loadCaptcha();
};
const handleSubmit = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    submitting.value = true;
    try {
        await resetPasswordApi({
            email: form.email.trim(),
            code: form.code.trim(),
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
            captchaId: captcha.captchaId,
            captchaCode: form.captchaCode.trim()
        });
        ElMessage.success('密码重置成功，请返回登录');
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
    ...{ class: "auth-page hc-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-card hc-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
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
    label: "邮箱",
    prop: "email",
}));
const __VLS_8 = __VLS_7({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
const __VLS_10 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入注册邮箱",
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入注册邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
var __VLS_9;
const __VLS_14 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    label: "图形验证码",
    prop: "captchaCode",
}));
const __VLS_16 = __VLS_15({
    label: "图形验证码",
    prop: "captchaCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
/** @type {[typeof CaptchaBox, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(CaptchaBox, new CaptchaBox({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onRefresh: (__VLS_ctx.loadCaptcha)
};
var __VLS_20;
var __VLS_17;
const __VLS_25 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    label: "邮箱验证码",
    prop: "code",
}));
const __VLS_27 = __VLS_26({
    label: "邮箱验证码",
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "email-row" },
});
const __VLS_29 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "请输入邮箱验证码",
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "请输入邮箱验证码",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const __VLS_33 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cooldown > 0),
}));
const __VLS_35 = __VLS_34({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cooldown > 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onClick: (__VLS_ctx.handleSendCode)
};
__VLS_36.slots.default;
(__VLS_ctx.cooldown > 0 ? `${__VLS_ctx.cooldown}s 后重试` : '发送验证码');
var __VLS_36;
var __VLS_28;
const __VLS_41 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_43 = __VLS_42({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
const __VLS_45 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
var __VLS_44;
const __VLS_49 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    label: "确认新密码",
    prop: "confirmPassword",
}));
const __VLS_51 = __VLS_50({
    label: "确认新密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_52.slots.default;
const __VLS_53 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
var __VLS_52;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_57 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    to: "/login",
}));
const __VLS_59 = __VLS_58({
    to: "/login",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
const __VLS_61 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    plain: true,
}));
const __VLS_63 = __VLS_62({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
var __VLS_64;
var __VLS_60;
const __VLS_65 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_67 = __VLS_66({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onClick: (__VLS_ctx.handleSubmit)
};
__VLS_68.slots.default;
var __VLS_68;
/** @type {__VLS_StyleScopedClasses['auth-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['email-row']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CaptchaBox: CaptchaBox,
            formRef: formRef,
            submitting: submitting,
            cooldown: cooldown,
            captcha: captcha,
            form: form,
            rules: rules,
            loadCaptcha: loadCaptcha,
            handleSendCode: handleSendCode,
            handleSubmit: handleSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ForgotPasswordPage.vue.js.map
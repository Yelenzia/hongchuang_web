import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import CaptchaBox from '@/components/auth/CaptchaBox.vue';
import { getCaptchaApi } from '@/api/auth';
import { cancelMyAccountApi, changePasswordApi, getMyLoginDevicesApi, revokeMyLoginDeviceApi, revokeOtherLoginDevicesApi, sendCancelAccountCodeApi, sendChangePasswordCodeApi } from '@/api/user';
import { useAuthStore } from '@/store/auth';
const router = useRouter();
const authStore = useAuthStore();
const formRef = ref();
const cancelFormRef = ref();
const submitting = ref(false);
const cancelSubmitting = ref(false);
const cooldown = ref(0);
const cancelCooldown = ref(0);
const devicesLoading = ref(false);
const devices = ref([]);
let timer;
let cancelTimer;
const captcha = reactive({ captchaId: '', imageBase64: '' });
const cancelCaptcha = reactive({ captchaId: '', imageBase64: '' });
const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    captchaCode: '',
    emailCode: ''
});
const cancelForm = reactive({
    password: '',
    reason: '',
    captchaCode: '',
    emailCode: ''
});
const rules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码至少 8 位', trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
};
const cancelRules = {
    password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    captchaCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
};
const formatTime = (value) => {
    if (!value)
        return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN', { hour12: false });
};
const loadDevices = async () => {
    devicesLoading.value = true;
    try {
        const { data } = await getMyLoginDevicesApi();
        devices.value = Array.isArray(data) ? data : [];
    }
    finally {
        devicesLoading.value = false;
    }
};
const handleRevokeDevice = async (item) => {
    await ElMessageBox.confirm(`确定下线设备「${item.deviceName}」吗？`, '下线设备', { type: 'warning' });
    await revokeMyLoginDeviceApi(item.sessionId);
    ElMessage.success('设备已下线');
    await loadDevices();
};
const handleRevokeOthers = async () => {
    await ElMessageBox.confirm('确定下线其他所有设备吗？当前设备会保留登录。', '下线其他设备', { type: 'warning' });
    await revokeOtherLoginDevicesApi();
    ElMessage.success('其他设备已全部下线');
    await loadDevices();
};
const loadCaptcha = async () => {
    const { data } = await getCaptchaApi();
    captcha.captchaId = data.captchaId;
    captcha.imageBase64 = data.imageBase64;
    form.captchaCode = '';
};
const loadCancelCaptcha = async () => {
    const { data } = await getCaptchaApi();
    cancelCaptcha.captchaId = data.captchaId;
    cancelCaptcha.imageBase64 = data.imageBase64;
    cancelForm.captchaCode = '';
};
const startCooldown = (target, key, seconds = 60) => {
    target.value = seconds;
    if (key === 'password') {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
            target.value -= 1;
            if (target.value <= 0)
                window.clearInterval(timer);
        }, 1000);
        return;
    }
    window.clearInterval(cancelTimer);
    cancelTimer = window.setInterval(() => {
        target.value -= 1;
        if (target.value <= 0)
            window.clearInterval(cancelTimer);
    }, 1000);
};
const handleSendPasswordCode = async () => {
    if (!form.captchaCode.trim() || !captcha.captchaId) {
        ElMessage.warning('请先输入图形验证码');
        return;
    }
    const { data } = await sendChangePasswordCodeApi({ bizType: 'CHANGE_PASSWORD', captchaId: captcha.captchaId, captchaCode: form.captchaCode.trim() });
    ElMessage.success(data.message || '邮箱验证码已发送');
    startCooldown(cooldown, 'password', data.cooldownSeconds || 60);
    await loadCaptcha();
};
const handleSendCancelCode = async () => {
    if (!cancelForm.captchaCode.trim() || !cancelCaptcha.captchaId) {
        ElMessage.warning('请先输入图形验证码');
        return;
    }
    const { data } = await sendCancelAccountCodeApi({ bizType: 'CANCEL_ACCOUNT', captchaId: cancelCaptcha.captchaId, captchaCode: cancelForm.captchaCode.trim() });
    ElMessage.success(data.message || '注销验证码已发送');
    startCooldown(cancelCooldown, 'cancel', data.cooldownSeconds || 60);
    await loadCancelCaptcha();
};
const handleSubmit = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    submitting.value = true;
    try {
        await changePasswordApi({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
            emailCode: form.emailCode,
            captchaId: captcha.captchaId,
            captchaCode: form.captchaCode
        });
        ElMessage.success('密码修改成功');
        form.oldPassword = '';
        form.newPassword = '';
        form.confirmPassword = '';
        form.emailCode = '';
        await loadCaptcha();
    }
    finally {
        submitting.value = false;
    }
};
const handleCancelAccount = async () => {
    const valid = await cancelFormRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    await ElMessageBox.confirm('注销账号后无法恢复，且会立即退出登录。确定继续吗？', '确认注销账号', {
        type: 'warning',
        confirmButtonText: '确认注销',
        cancelButtonText: '我再想想'
    });
    cancelSubmitting.value = true;
    try {
        await cancelMyAccountApi({
            password: cancelForm.password,
            reason: cancelForm.reason,
            emailCode: cancelForm.emailCode,
            captchaId: cancelCaptcha.captchaId,
            captchaCode: cancelForm.captchaCode
        });
        ElMessage.success('账号已注销');
        authStore.clearAuth();
        router.replace('/login');
    }
    finally {
        cancelSubmitting.value = false;
    }
};
onMounted(async () => {
    await Promise.all([loadCaptcha(), loadCancelCaptcha(), loadDevices()]);
});
onBeforeUnmount(() => {
    window.clearInterval(timer);
    window.clearInterval(cancelTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['danger-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "security-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-card form-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-title" },
});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    ...{ class: "security-form" },
}));
const __VLS_2 = __VLS_1({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    ...{ class: "security-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_6 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    label: "旧密码",
    prop: "oldPassword",
}));
const __VLS_8 = __VLS_7({
    label: "旧密码",
    prop: "oldPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
const __VLS_10 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    modelValue: (__VLS_ctx.form.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}));
const __VLS_12 = __VLS_11({
    modelValue: (__VLS_ctx.form.oldPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
var __VLS_9;
const __VLS_14 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_16 = __VLS_15({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
const __VLS_18 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_17;
const __VLS_22 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    label: "确认新密码",
    prop: "confirmPassword",
}));
const __VLS_24 = __VLS_23({
    label: "确认新密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}));
const __VLS_28 = __VLS_27({
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
var __VLS_25;
const __VLS_30 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    label: "图形验证码",
    prop: "captchaCode",
}));
const __VLS_32 = __VLS_31({
    label: "图形验证码",
    prop: "captchaCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
/** @type {[typeof CaptchaBox, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(CaptchaBox, new CaptchaBox({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}));
const __VLS_35 = __VLS_34({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.form.captchaCode),
    imageBase64: (__VLS_ctx.captcha.imageBase64),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onRefresh: (__VLS_ctx.loadCaptcha)
};
var __VLS_36;
var __VLS_33;
const __VLS_41 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "邮箱验证码",
    prop: "emailCode",
}));
const __VLS_43 = __VLS_42({
    label: "邮箱验证码",
    prop: "emailCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "email-row" },
});
const __VLS_45 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.form.emailCode),
    placeholder: "请输入邮箱验证码",
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.form.emailCode),
    placeholder: "请输入邮箱验证码",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const __VLS_49 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cooldown > 0),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cooldown > 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_53;
let __VLS_54;
let __VLS_55;
const __VLS_56 = {
    onClick: (__VLS_ctx.handleSendPasswordCode)
};
__VLS_52.slots.default;
(__VLS_ctx.cooldown > 0 ? `${__VLS_ctx.cooldown}s 后重试` : '发送验证码');
var __VLS_52;
var __VLS_44;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_57 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_61;
let __VLS_62;
let __VLS_63;
const __VLS_64 = {
    onClick: (__VLS_ctx.handleSubmit)
};
__VLS_60.slots.default;
var __VLS_60;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-card device-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "danger-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "device-actions" },
});
const __VLS_65 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_67 = __VLS_66({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_69;
let __VLS_70;
let __VLS_71;
const __VLS_72 = {
    onClick: (__VLS_ctx.loadDevices)
};
__VLS_68.slots.default;
var __VLS_68;
const __VLS_73 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    ...{ 'onClick': {} },
    type: "warning",
    plain: true,
}));
const __VLS_75 = __VLS_74({
    ...{ 'onClick': {} },
    type: "warning",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_77;
let __VLS_78;
let __VLS_79;
const __VLS_80 = {
    onClick: (__VLS_ctx.handleRevokeOthers)
};
__VLS_76.slots.default;
var __VLS_76;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "device-list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.devicesLoading) }, null, null);
if (!__VLS_ctx.devices.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "device-empty" },
    });
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.devices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.sessionId),
        ...{ class: "device-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "device-name-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "device-name" },
    });
    (item.deviceName);
    const __VLS_81 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        type: (item.current ? 'success' : item.status === 1 ? 'info' : 'danger'),
    }));
    const __VLS_83 = __VLS_82({
        type: (item.current ? 'success' : item.status === 1 ? 'info' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    (item.current ? '当前设备' : item.status === 1 ? '在线' : '已失效');
    var __VLS_84;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "device-meta" },
    });
    (item.browser);
    (item.os);
    (item.loginIp || '-');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "device-meta" },
    });
    (__VLS_ctx.formatTime(item.loginTime));
    (__VLS_ctx.formatTime(item.lastActiveAt));
    const __VLS_85 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        ...{ 'onClick': {} },
        plain: true,
        type: "danger",
        disabled: (item.current || item.status !== 1),
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onClick': {} },
        plain: true,
        type: "danger",
        disabled: (item.current || item.status !== 1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_89;
    let __VLS_90;
    let __VLS_91;
    const __VLS_92 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleRevokeDevice(item);
        }
    };
    __VLS_88.slots.default;
    var __VLS_88;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-card danger-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-title danger" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "danger-desc" },
});
const __VLS_93 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    ref: "cancelFormRef",
    model: (__VLS_ctx.cancelForm),
    rules: (__VLS_ctx.cancelRules),
    labelPosition: "top",
    ...{ class: "security-form" },
}));
const __VLS_95 = __VLS_94({
    ref: "cancelFormRef",
    model: (__VLS_ctx.cancelForm),
    rules: (__VLS_ctx.cancelRules),
    labelPosition: "top",
    ...{ class: "security-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
/** @type {typeof __VLS_ctx.cancelFormRef} */ ;
var __VLS_97 = {};
__VLS_96.slots.default;
const __VLS_99 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "当前密码",
    prop: "password",
}));
const __VLS_101 = __VLS_100({
    label: "当前密码",
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.cancelForm.password),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码以确认操作",
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.cancelForm.password),
    type: "password",
    showPassword: true,
    placeholder: "请输入当前密码以确认操作",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
var __VLS_102;
const __VLS_107 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "注销原因",
}));
const __VLS_109 = __VLS_108({
    label: "注销原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
const __VLS_111 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.cancelForm.reason),
    type: "textarea",
    rows: (3),
    maxlength: "200",
    showWordLimit: true,
    placeholder: "选填，帮助我们改进产品体验",
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.cancelForm.reason),
    type: "textarea",
    rows: (3),
    maxlength: "200",
    showWordLimit: true,
    placeholder: "选填，帮助我们改进产品体验",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
var __VLS_110;
const __VLS_115 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    label: "图形验证码",
    prop: "captchaCode",
}));
const __VLS_117 = __VLS_116({
    label: "图形验证码",
    prop: "captchaCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
/** @type {[typeof CaptchaBox, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(CaptchaBox, new CaptchaBox({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.cancelForm.captchaCode),
    imageBase64: (__VLS_ctx.cancelCaptcha.imageBase64),
}));
const __VLS_120 = __VLS_119({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.cancelForm.captchaCode),
    imageBase64: (__VLS_ctx.cancelCaptcha.imageBase64),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_122;
let __VLS_123;
let __VLS_124;
const __VLS_125 = {
    onRefresh: (__VLS_ctx.loadCancelCaptcha)
};
var __VLS_121;
var __VLS_118;
const __VLS_126 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "邮箱验证码",
    prop: "emailCode",
}));
const __VLS_128 = __VLS_127({
    label: "邮箱验证码",
    prop: "emailCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_129.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "email-row" },
});
const __VLS_130 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    modelValue: (__VLS_ctx.cancelForm.emailCode),
    placeholder: "请输入邮箱验证码",
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.cancelForm.emailCode),
    placeholder: "请输入邮箱验证码",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
const __VLS_134 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cancelCooldown > 0),
}));
const __VLS_136 = __VLS_135({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.cancelCooldown > 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
let __VLS_138;
let __VLS_139;
let __VLS_140;
const __VLS_141 = {
    onClick: (__VLS_ctx.handleSendCancelCode)
};
__VLS_137.slots.default;
(__VLS_ctx.cancelCooldown > 0 ? `${__VLS_ctx.cancelCooldown}s 后重试` : '发送注销验证码');
var __VLS_137;
var __VLS_129;
var __VLS_96;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_142 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    ...{ 'onClick': {} },
    type: "danger",
    loading: (__VLS_ctx.cancelSubmitting),
}));
const __VLS_144 = __VLS_143({
    ...{ 'onClick': {} },
    type: "danger",
    loading: (__VLS_ctx.cancelSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
let __VLS_146;
let __VLS_147;
let __VLS_148;
const __VLS_149 = {
    onClick: (__VLS_ctx.handleCancelAccount)
};
__VLS_145.slots.default;
var __VLS_145;
/** @type {__VLS_StyleScopedClasses['security-page']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['security-form']} */ ;
/** @type {__VLS_StyleScopedClasses['email-row']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['device-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['danger-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['device-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['device-list']} */ ;
/** @type {__VLS_StyleScopedClasses['device-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['device-item']} */ ;
/** @type {__VLS_StyleScopedClasses['device-name-row']} */ ;
/** @type {__VLS_StyleScopedClasses['device-name']} */ ;
/** @type {__VLS_StyleScopedClasses['device-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['device-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['danger-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['danger-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['security-form']} */ ;
/** @type {__VLS_StyleScopedClasses['email-row']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4, __VLS_98 = __VLS_97;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CaptchaBox: CaptchaBox,
            formRef: formRef,
            cancelFormRef: cancelFormRef,
            submitting: submitting,
            cancelSubmitting: cancelSubmitting,
            cooldown: cooldown,
            cancelCooldown: cancelCooldown,
            devicesLoading: devicesLoading,
            devices: devices,
            captcha: captcha,
            cancelCaptcha: cancelCaptcha,
            form: form,
            cancelForm: cancelForm,
            rules: rules,
            cancelRules: cancelRules,
            formatTime: formatTime,
            loadDevices: loadDevices,
            handleRevokeDevice: handleRevokeDevice,
            handleRevokeOthers: handleRevokeOthers,
            loadCaptcha: loadCaptcha,
            loadCancelCaptcha: loadCancelCaptcha,
            handleSendPasswordCode: handleSendPasswordCode,
            handleSendCancelCode: handleSendCancelCode,
            handleSubmit: handleSubmit,
            handleCancelAccount: handleCancelAccount,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SecurityPage.vue.js.map
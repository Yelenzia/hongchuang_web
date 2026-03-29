import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadAvatarApi } from '@/api/upload';
import { resolveFileUrl } from '@/utils/file';
const props = defineProps();
const emit = defineEmits();
const previewUrl = ref(resolveFileUrl(props.modelValue || ''));
const uploading = ref(false);
watch(() => props.modelValue, (value) => {
    previewUrl.value = resolveFileUrl(value || '');
});
const fallbackText = computed(() => (props.displayName?.slice(0, 1) || 'HC').toUpperCase());
const handleSelect = async (uploadFile) => {
    if (!uploadFile.raw)
        return;
    uploading.value = true;
    try {
        const { data } = await uploadAvatarApi(uploadFile.raw);
        previewUrl.value = resolveFileUrl(data.url);
        emit('update:modelValue', data.url);
        ElMessage.success('头像上传成功');
    }
    finally {
        uploading.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['preview']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['uploader']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "uploader hc-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-box" },
});
if (__VLS_ctx.previewUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.previewUrl),
        alt: "avatar",
        ...{ class: "preview" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fallback" },
    });
    (__VLS_ctx.fallbackText);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "desc" },
});
const __VLS_0 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif",
    onChange: (__VLS_ctx.handleSelect),
}));
const __VLS_2 = __VLS_1({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif",
    onChange: (__VLS_ctx.handleSelect),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    loading: (__VLS_ctx.uploading),
    type: "primary",
    plain: true,
}));
const __VLS_6 = __VLS_5({
    loading: (__VLS_ctx.uploading),
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-box']} */ ;
/** @type {__VLS_StyleScopedClasses['preview']} */ ;
/** @type {__VLS_StyleScopedClasses['fallback']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['desc']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            previewUrl: previewUrl,
            uploading: uploading,
            fallbackText: fallbackText,
            handleSelect: handleSelect,
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
//# sourceMappingURL=AvatarUploader.vue.js.map
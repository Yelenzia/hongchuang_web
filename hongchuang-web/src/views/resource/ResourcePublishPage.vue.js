import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue';
import { resolveFileUrl } from '@/utils/file';
import { getContentTemplatesApi, getDraftDetailApi, saveDraftApi } from '@/api/content';
import { getResourceCategoriesApi, getResourceDetailApi, createResourceApi, updateResourceApi, submitResourceAuditApi } from '@/api/resource';
import { getTagsApi } from '@/api/tag';
import { uploadResourceCoverApi } from '@/api/upload';
const route = useRoute();
const router = useRouter();
const categories = ref([]);
const templates = ref([]);
const tags = ref([]);
const selectedTemplateId = ref('');
const loading = ref(false);
const submitting = ref(false);
const draftSubmitting = ref(false);
const draftId = ref('');
const lastSavedAt = ref('');
let draftTimer;
let draftReady = false;
const resourceId = computed(() => String(route.params.id || ''));
const isEditMode = computed(() => !!route.params.id);
const draftQueryId = computed(() => String(route.query.draftId || ''));
const form = reactive({
    categoryId: '',
    title: '',
    summary: '',
    content: '',
    coverUrl: '',
    tagIds: [],
    initialVersion: {
        versionNo: '',
        changelog: '',
        mcVersions: '',
        downloadType: 'LINK',
        downloadUrl: '',
        fileUrl: ''
    }
});
const selectedTemplate = computed(() => templates.value.find(item => item.id === selectedTemplateId.value));
const touchSavedAt = () => { lastSavedAt.value = new Date().toLocaleString('zh-CN', { hour12: false }); };
const applyTemplate = async () => {
    const template = selectedTemplate.value;
    if (!template)
        return;
    if (form.title || form.content) {
        await ElMessageBox.confirm('套用模板会覆盖当前填写的部分内容，确定继续吗？', '套用模板', { type: 'warning' });
    }
    form.title = template.titleExample || '';
    form.summary = template.summaryExample || '';
    form.content = template.contentMarkdown || '';
};
const handleCoverUpload = async (uploadFile) => {
    const raw = uploadFile.raw;
    if (!raw)
        return;
    const { data } = await uploadResourceCoverApi(raw);
    form.coverUrl = data.url;
    ElMessage.success('封面上传成功');
};
const loadDetail = async () => {
    if (!isEditMode.value)
        return;
    loading.value = true;
    try {
        const { data } = await getResourceDetailApi(resourceId.value);
        form.categoryId = data.categoryId;
        form.title = data.title;
        form.summary = data.summary || '';
        form.content = data.content || '';
        form.coverUrl = data.coverUrl || '';
        form.tagIds = (data.tags || []).map(item => item.id);
        form.initialVersion.versionNo = data.currentVersion?.versionNo || data.currentVersionNo || '';
        form.initialVersion.changelog = data.currentVersion?.changelog || '';
        form.initialVersion.mcVersions = data.currentVersion?.mcVersions || data.mcVersions || '';
        form.initialVersion.downloadType = data.currentVersion?.downloadType || data.downloadType || 'LINK';
        form.initialVersion.downloadUrl = data.currentVersion?.downloadUrl || data.downloadUrl || '';
        form.initialVersion.fileUrl = data.currentVersion?.fileUrl || data.fileUrl || '';
    }
    finally {
        loading.value = false;
    }
};
const loadDraft = async () => {
    if (!draftQueryId.value || isEditMode.value)
        return;
    const { data } = await getDraftDetailApi(draftQueryId.value);
    draftId.value = data.id;
    form.categoryId = data.extraData?.categoryId ? String(data.extraData.categoryId) : '';
    form.title = data.title || '';
    form.summary = data.summary || '';
    form.content = data.contentMarkdown || '';
    form.coverUrl = data.extraData?.coverUrl || '';
    form.tagIds = Array.isArray(data.extraData?.tagIds) ? data.extraData.tagIds.map((item) => String(item)) : [];
    form.initialVersion.versionNo = data.extraData?.initialVersion?.versionNo || '';
    form.initialVersion.changelog = data.extraData?.initialVersion?.changelog || '';
    form.initialVersion.mcVersions = data.extraData?.initialVersion?.mcVersions || '';
    form.initialVersion.downloadType = data.extraData?.initialVersion?.downloadType || 'LINK';
    form.initialVersion.downloadUrl = data.extraData?.initialVersion?.downloadUrl || '';
    form.initialVersion.fileUrl = data.extraData?.initialVersion?.fileUrl || '';
    touchSavedAt();
};
const saveDraft = async (autoSaved) => {
    const payload = {
        id: draftId.value || undefined,
        draftType: 'RESOURCE',
        sceneCode: selectedTemplate.value?.sceneCode || 'RESOURCE_GENERAL',
        title: form.title,
        summary: form.summary,
        contentMarkdown: form.content,
        extraData: {
            categoryId: form.categoryId,
            coverUrl: form.coverUrl,
            tagIds: [...form.tagIds],
            initialVersion: { ...form.initialVersion },
            resourceId: isEditMode.value ? resourceId.value : undefined
        },
        autoSaved
    };
    if (!autoSaved)
        draftSubmitting.value = true;
    try {
        const { data } = await saveDraftApi(payload);
        draftId.value = data.draftId;
        touchSavedAt();
        if (!autoSaved)
            ElMessage.success('资源草稿已保存');
    }
    finally {
        if (!autoSaved)
            draftSubmitting.value = false;
    }
};
const submit = async (auditAfterSave) => {
    if (!form.categoryId || !form.title || !form.content || !form.initialVersion.versionNo) {
        ElMessage.warning('请先补全资源分类、标题、详细介绍和版本号');
        return;
    }
    if (form.tagIds.length > 5) {
        ElMessage.warning('最多选择 5 个标签');
        return;
    }
    submitting.value = true;
    try {
        const payload = {
            categoryId: form.categoryId,
            title: form.title,
            summary: form.summary,
            content: form.content,
            coverUrl: form.coverUrl,
            tagIds: form.tagIds,
            initialVersion: { ...form.initialVersion },
            saveAsDraft: false
        };
        if (isEditMode.value) {
            await updateResourceApi(resourceId.value, payload);
            if (auditAfterSave)
                await submitResourceAuditApi(resourceId.value);
        }
        else {
            const { data } = await createResourceApi(payload);
            if (auditAfterSave)
                await submitResourceAuditApi(data.resourceId);
        }
        ElMessage.success(auditAfterSave ? '资源已提交审核' : '资源已保存');
        router.push('/me/drafts');
    }
    finally {
        submitting.value = false;
    }
};
watch(() => JSON.stringify(form), () => {
    if (!draftReady || isEditMode.value)
        return;
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(() => {
        if (!form.title && !form.summary && !form.content)
            return;
        saveDraft(true).catch(() => undefined);
    }, 1800);
});
onMounted(async () => {
    loading.value = true;
    try {
        const [{ data: categoryData }, { data: templateData }, { data: tagData }] = await Promise.all([
            getResourceCategoriesApi(),
            getContentTemplatesApi({ templateType: 'RESOURCE' }),
            getTagsApi()
        ]);
        categories.value = categoryData;
        templates.value = templateData;
        tags.value = tagData.filter(item => item.status !== 0);
        await loadDetail();
        await loadDraft();
    }
    finally {
        loading.value = false;
        draftReady = true;
    }
});
onBeforeUnmount(() => window.clearTimeout(draftTimer));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['template-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "resource-publish-page hc-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "hc-card minecraft-card editor-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
(__VLS_ctx.isEditMode ? '更新资源内容与版本' : '发布新的 Minecraft 资源');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "head-actions" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/me/drafts",
}));
const __VLS_2 = __VLS_1({
    to: "/me/drafts",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    plain: true,
}));
const __VLS_6 = __VLS_5({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
var __VLS_3;
const __VLS_8 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}));
const __VLS_10 = __VLS_9({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_12 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "资源分类",
}));
const __VLS_14 = __VLS_13({
    label: "资源分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.form.categoryId),
    ...{ style: {} },
    placeholder: "请选择资源分类",
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.form.categoryId),
    ...{ style: {} },
    placeholder: "请选择资源分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
var __VLS_15;
const __VLS_24 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "模板选择",
}));
const __VLS_26 = __VLS_25({
    label: "模板选择",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "template-row" },
});
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.selectedTemplateId),
    clearable: true,
    ...{ style: {} },
    placeholder: "选择模板后可快速生成结构",
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.selectedTemplateId),
    clearable: true,
    ...{ style: {} },
    placeholder: "选择模板后可快速生成结构",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    const __VLS_32 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        key: (item.id),
        label: (item.templateName),
        value: (item.id),
    }));
    const __VLS_34 = __VLS_33({
        key: (item.id),
        label: (item.templateName),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (!__VLS_ctx.selectedTemplateId),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (!__VLS_ctx.selectedTemplateId),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.applyTemplate)
};
__VLS_39.slots.default;
var __VLS_39;
var __VLS_27;
const __VLS_44 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "资源标题",
}));
const __VLS_46 = __VLS_45({
    label: "资源标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "120",
    showWordLimit: true,
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "120",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "资源简介",
}));
const __VLS_54 = __VLS_53({
    label: "资源简介",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.form.summary),
    type: "textarea",
    rows: (3),
    maxlength: "500",
    showWordLimit: true,
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.form.summary),
    type: "textarea",
    rows: (3),
    maxlength: "500",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_55;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "封面上传",
}));
const __VLS_62 = __VLS_61({
    label: "封面上传",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cover-uploader hc-card" },
});
if (__VLS_ctx.form.coverUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.resolveFileUrl(__VLS_ctx.form.coverUrl)),
        ...{ class: "cover-preview" },
        alt: "cover",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cover-placeholder" },
    });
}
const __VLS_64 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif,.bmp",
    onChange: (__VLS_ctx.handleCoverUpload),
}));
const __VLS_66 = __VLS_65({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif,.bmp",
    onChange: (__VLS_ctx.handleCoverUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    plain: true,
}));
const __VLS_70 = __VLS_69({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
var __VLS_67;
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-3" },
});
const __VLS_72 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "版本号",
}));
const __VLS_74 = __VLS_73({
    label: "版本号",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    modelValue: (__VLS_ctx.form.initialVersion.versionNo),
}));
const __VLS_78 = __VLS_77({
    modelValue: (__VLS_ctx.form.initialVersion.versionNo),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_75;
const __VLS_80 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "支持的 MC 版本",
}));
const __VLS_82 = __VLS_81({
    label: "支持的 MC 版本",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    modelValue: (__VLS_ctx.form.initialVersion.mcVersions),
    placeholder: "例如 1.12.2, 1.20.x",
}));
const __VLS_86 = __VLS_85({
    modelValue: (__VLS_ctx.form.initialVersion.mcVersions),
    placeholder: "例如 1.12.2, 1.20.x",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
var __VLS_83;
const __VLS_88 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "下载方式",
}));
const __VLS_90 = __VLS_89({
    label: "下载方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.form.initialVersion.downloadType),
    ...{ style: {} },
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.form.initialVersion.downloadType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "下载链接",
    value: "LINK",
}));
const __VLS_98 = __VLS_97({
    label: "下载链接",
    value: "LINK",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "站内文件",
    value: "FILE",
}));
const __VLS_102 = __VLS_101({
    label: "站内文件",
    value: "FILE",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_95;
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_104 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "下载链接",
}));
const __VLS_106 = __VLS_105({
    label: "下载链接",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.form.initialVersion.downloadUrl),
    disabled: (__VLS_ctx.form.initialVersion.downloadType === 'FILE'),
    placeholder: "下载链接 / 站内文件路径",
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.form.initialVersion.downloadUrl),
    disabled: (__VLS_ctx.form.initialVersion.downloadType === 'FILE'),
    placeholder: "下载链接 / 站内文件路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_107;
const __VLS_112 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "资源标签",
}));
const __VLS_114 = __VLS_113({
    label: "资源标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    filterable: true,
    clearable: true,
    collapseTags: true,
    collapseTagsTooltip: true,
    ...{ style: {} },
    placeholder: "最多建议选择 5 个标签",
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    filterable: true,
    clearable: true,
    collapseTags: true,
    collapseTagsTooltip: true,
    ...{ style: {} },
    placeholder: "最多建议选择 5 个标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
    const __VLS_120 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_122 = __VLS_121({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
}
var __VLS_119;
var __VLS_115;
const __VLS_124 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "详细介绍",
}));
const __VLS_126 = __VLS_125({
    label: "详细介绍",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
/** @type {[typeof MarkdownEditor, typeof MarkdownEditor, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(MarkdownEditor, new MarkdownEditor({
    modelValue: (__VLS_ctx.form.content),
}));
const __VLS_129 = __VLS_128({
    modelValue: (__VLS_ctx.form.content),
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
{
    const { extra: __VLS_thisSlot } = __VLS_130.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "editor-status" },
    });
    (__VLS_ctx.lastSavedAt ? `最近保存：${__VLS_ctx.lastSavedAt}` : '尚未保存草稿');
}
var __VLS_130;
var __VLS_127;
const __VLS_131 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    label: "更新日志",
}));
const __VLS_133 = __VLS_132({
    label: "更新日志",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
/** @type {[typeof MarkdownEditor, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(MarkdownEditor, new MarkdownEditor({
    modelValue: (__VLS_ctx.form.initialVersion.changelog),
    placeholder: "建议在这里写每个版本的更新点、修复项和兼容说明",
}));
const __VLS_136 = __VLS_135({
    modelValue: (__VLS_ctx.form.initialVersion.changelog),
    placeholder: "建议在这里写每个版本的更新点、修复项和兼容说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
var __VLS_134;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_138 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    ...{ 'onClick': {} },
}));
const __VLS_140 = __VLS_139({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
let __VLS_142;
let __VLS_143;
let __VLS_144;
const __VLS_145 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.back();
    }
};
__VLS_141.slots.default;
var __VLS_141;
const __VLS_146 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.draftSubmitting),
}));
const __VLS_148 = __VLS_147({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.draftSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_150;
let __VLS_151;
let __VLS_152;
const __VLS_153 = {
    onClick: (...[$event]) => {
        __VLS_ctx.saveDraft(false);
    }
};
__VLS_149.slots.default;
var __VLS_149;
const __VLS_154 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_156 = __VLS_155({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_158;
let __VLS_159;
let __VLS_160;
const __VLS_161 = {
    onClick: (...[$event]) => {
        __VLS_ctx.submit(false);
    }
};
__VLS_157.slots.default;
var __VLS_157;
const __VLS_162 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
    ...{ 'onClick': {} },
    type: "success",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_164 = __VLS_163({
    ...{ 'onClick': {} },
    type: "success",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_163));
let __VLS_166;
let __VLS_167;
let __VLS_168;
const __VLS_169 = {
    onClick: (...[$event]) => {
        __VLS_ctx.submit(true);
    }
};
__VLS_165.slots.default;
var __VLS_165;
/** @type {__VLS_StyleScopedClasses['resource-publish-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-card']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['head-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['template-row']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-uploader']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-status']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MarkdownEditor: MarkdownEditor,
            resolveFileUrl: resolveFileUrl,
            router: router,
            categories: categories,
            templates: templates,
            tags: tags,
            selectedTemplateId: selectedTemplateId,
            loading: loading,
            submitting: submitting,
            draftSubmitting: draftSubmitting,
            lastSavedAt: lastSavedAt,
            isEditMode: isEditMode,
            form: form,
            applyTemplate: applyTemplate,
            handleCoverUpload: handleCoverUpload,
            saveDraft: saveDraft,
            submit: submit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ResourcePublishPage.vue.js.map
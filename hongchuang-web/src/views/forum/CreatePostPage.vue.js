import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useForumStore } from '@/store/forum';
import { getTagsApi } from '@/api/tag';
import { createPostApi, getPostDetailApi, updatePostApi } from '@/api/post';
import { useAuthStore } from '@/store/auth';
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue';
import { getContentTemplatesApi, getDraftDetailApi, saveDraftApi } from '@/api/content';
const formRef = ref();
const route = useRoute();
const router = useRouter();
const forumStore = useForumStore();
const authStore = useAuthStore();
const tags = ref([]);
const templates = ref([]);
const selectedTemplateId = ref('');
const submitting = ref(false);
const draftSubmitting = ref(false);
const loading = ref(false);
const draftId = ref('');
const lastSavedAt = ref('');
let draftTimer;
let draftReady = false;
const form = reactive({
    boardId: undefined,
    title: '',
    summary: '',
    tagIds: [],
    contentMd: ''
});
const postId = computed(() => String(route.params.id || ''));
const isEditMode = computed(() => route.name === 'post-edit' && !!postId.value);
const draftQueryId = computed(() => String(route.query.draftId || ''));
const rules = {
    boardId: [{ required: true, message: '请选择板块', trigger: 'change' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 3, max: 150, message: '标题长度需在 3~150 位之间', trigger: 'blur' }],
    summary: [{ max: 300, message: '摘要不能超过 300 字', trigger: 'blur' }],
    contentMd: [{ required: true, message: '请输入正文', trigger: 'blur' }]
};
const selectedTemplate = computed(() => templates.value.find(item => item.id === selectedTemplateId.value));
const touchSavedAt = () => {
    lastSavedAt.value = new Date().toLocaleString('zh-CN', { hour12: false });
};
const applyTemplate = async () => {
    const template = selectedTemplate.value;
    if (!template)
        return;
    if (form.title || form.contentMd) {
        await ElMessageBox.confirm('套用模板会把示例内容填入编辑器，确定继续吗？', '套用模板', { type: 'warning' });
    }
    form.title = template.titleExample || '';
    form.summary = template.summaryExample || '';
    form.contentMd = template.contentMarkdown || '';
    if (template.extraData?.boardId) {
        form.boardId = String(template.extraData.boardId);
    }
};
const loadDetail = async () => {
    if (!isEditMode.value)
        return;
    loading.value = true;
    try {
        const { data } = await getPostDetailApi(postId.value);
        if (authStore.userInfo?.id !== data.authorId) {
            ElMessage.error('你无权编辑这篇帖子');
            router.replace(`/post/${postId.value}`);
            return;
        }
        form.boardId = data.boardId;
        form.title = data.title;
        form.summary = data.summary || '';
        form.tagIds = data.tags.map(tag => tag.id);
        form.contentMd = data.contentMd;
    }
    finally {
        loading.value = false;
    }
};
const loadDraft = async () => {
    if (!draftQueryId.value || isEditMode.value)
        return;
    loading.value = true;
    try {
        const { data } = await getDraftDetailApi(draftQueryId.value);
        draftId.value = data.id;
        form.title = data.title || '';
        form.summary = data.summary || '';
        form.contentMd = data.contentMarkdown || '';
        form.boardId = data.extraData?.boardId ? String(data.extraData.boardId) : undefined;
        form.tagIds = Array.isArray(data.extraData?.tagIds) ? data.extraData.tagIds.map((item) => String(item)) : [];
        touchSavedAt();
    }
    finally {
        loading.value = false;
    }
};
const saveDraft = async (autoSaved) => {
    if (!authStore.isLogin)
        return;
    const payload = {
        id: draftId.value || undefined,
        draftType: 'POST',
        sceneCode: selectedTemplate.value?.sceneCode || 'GENERAL',
        title: form.title,
        summary: form.summary,
        contentMarkdown: form.contentMd,
        extraData: {
            boardId: form.boardId,
            tagIds: form.tagIds,
            postId: isEditMode.value ? postId.value : undefined
        },
        autoSaved
    };
    if (!autoSaved) {
        draftSubmitting.value = true;
    }
    try {
        const { data } = await saveDraftApi(payload);
        draftId.value = data.draftId;
        touchSavedAt();
        if (!autoSaved)
            ElMessage.success('草稿已保存');
    }
    finally {
        if (!autoSaved)
            draftSubmitting.value = false;
    }
};
const handleSubmit = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    if (form.tagIds.length > 5)
        return ElMessage.warning('最多选择 5 个标签');
    submitting.value = true;
    try {
        const payload = {
            boardId: form.boardId,
            title: form.title,
            summary: form.summary,
            tagIds: form.tagIds,
            contentMd: form.contentMd
        };
        if (isEditMode.value) {
            await updatePostApi(postId.value, payload);
            ElMessage.success('帖子修改成功');
            router.push(`/post/${postId.value}`);
        }
        else {
            const { data } = await createPostApi(payload);
            ElMessage.success('发帖成功');
            router.push(`/post/${data.postId}`);
        }
    }
    finally {
        submitting.value = false;
    }
};
watch(() => ({ ...form, tagIds: [...form.tagIds] }), () => {
    if (!draftReady || isEditMode.value)
        return;
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(() => {
        if (!form.title && !form.summary && !form.contentMd)
            return;
        saveDraft(true).catch(() => undefined);
    }, 1800);
}, { deep: true });
onMounted(async () => {
    await authStore.initialize();
    await forumStore.loadBoards();
    const [{ data: tagData }, { data: templateData }] = await Promise.all([
        getTagsApi(),
        getContentTemplatesApi({ templateType: 'POST' })
    ]);
    tags.value = tagData;
    templates.value = templateData;
    await loadDetail();
    await loadDraft();
    draftReady = true;
});
onBeforeUnmount(() => {
    window.clearTimeout(draftTimer);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['template-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container create-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card editor-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
(__VLS_ctx.isEditMode ? '编辑帖子' : '发布新帖子');
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
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}));
const __VLS_10 = __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_12 = {};
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-row" },
});
const __VLS_14 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    label: "所属板块",
    prop: "boardId",
}));
const __VLS_16 = __VLS_15({
    label: "所属板块",
    prop: "boardId",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
const __VLS_18 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.form.boardId),
    ...{ style: {} },
    placeholder: "请选择板块",
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.form.boardId),
    ...{ style: {} },
    placeholder: "请选择板块",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
for (const [board] of __VLS_getVForSourceType((__VLS_ctx.forumStore.boards))) {
    const __VLS_22 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        key: (board.id),
        label: (board.name),
        value: (board.id),
    }));
    const __VLS_24 = __VLS_23({
        key: (board.id),
        label: (board.name),
        value: (board.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
}
var __VLS_21;
var __VLS_17;
const __VLS_26 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    label: "模板选择",
}));
const __VLS_28 = __VLS_27({
    label: "模板选择",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "template-row" },
});
const __VLS_30 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    modelValue: (__VLS_ctx.selectedTemplateId),
    clearable: true,
    ...{ style: {} },
    placeholder: "选择模板后可一键套用",
}));
const __VLS_32 = __VLS_31({
    modelValue: (__VLS_ctx.selectedTemplateId),
    clearable: true,
    ...{ style: {} },
    placeholder: "选择模板后可一键套用",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    const __VLS_34 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        key: (item.id),
        label: (item.templateName),
        value: (item.id),
    }));
    const __VLS_36 = __VLS_35({
        key: (item.id),
        label: (item.templateName),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
}
var __VLS_33;
const __VLS_38 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (!__VLS_ctx.selectedTemplateId),
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    plain: true,
    disabled: (!__VLS_ctx.selectedTemplateId),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_42;
let __VLS_43;
let __VLS_44;
const __VLS_45 = {
    onClick: (__VLS_ctx.applyTemplate)
};
__VLS_41.slots.default;
var __VLS_41;
var __VLS_29;
const __VLS_46 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    label: "标题",
    prop: "title",
}));
const __VLS_48 = __VLS_47({
    label: "标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
const __VLS_50 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "150",
    showWordLimit: true,
}));
const __VLS_52 = __VLS_51({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "150",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
var __VLS_49;
const __VLS_54 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    label: "摘要",
    prop: "summary",
}));
const __VLS_56 = __VLS_55({
    label: "摘要",
    prop: "summary",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.form.summary),
    maxlength: "300",
    showWordLimit: true,
    type: "textarea",
    rows: (3),
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.form.summary),
    maxlength: "300",
    showWordLimit: true,
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
var __VLS_57;
const __VLS_62 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    label: "标签",
}));
const __VLS_64 = __VLS_63({
    label: "标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    collapseTags: true,
    ...{ style: {} },
    placeholder: "最多选择 5 个标签",
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    collapseTags: true,
    ...{ style: {} },
    placeholder: "最多选择 5 个标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
    const __VLS_70 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
        key: (tag.id),
        label: (tag.name),
        value: (tag.id),
    }));
    const __VLS_72 = __VLS_71({
        key: (tag.id),
        label: (tag.name),
        value: (tag.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
}
var __VLS_69;
var __VLS_65;
const __VLS_74 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "正文",
    prop: "contentMd",
}));
const __VLS_76 = __VLS_75({
    label: "正文",
    prop: "contentMd",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
/** @type {[typeof MarkdownEditor, typeof MarkdownEditor, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(MarkdownEditor, new MarkdownEditor({
    modelValue: (__VLS_ctx.form.contentMd),
}));
const __VLS_79 = __VLS_78({
    modelValue: (__VLS_ctx.form.contentMd),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
{
    const { extra: __VLS_thisSlot } = __VLS_80.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "editor-status" },
    });
    if (__VLS_ctx.lastSavedAt) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.lastSavedAt);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
var __VLS_80;
var __VLS_77;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_81 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    ...{ 'onClick': {} },
}));
const __VLS_83 = __VLS_82({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_85;
let __VLS_86;
let __VLS_87;
const __VLS_88 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.back();
    }
};
__VLS_84.slots.default;
var __VLS_84;
const __VLS_89 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.draftSubmitting),
}));
const __VLS_91 = __VLS_90({
    ...{ 'onClick': {} },
    plain: true,
    loading: (__VLS_ctx.draftSubmitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_93;
let __VLS_94;
let __VLS_95;
const __VLS_96 = {
    onClick: (...[$event]) => {
        __VLS_ctx.saveDraft(false);
    }
};
__VLS_92.slots.default;
var __VLS_92;
const __VLS_97 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}));
const __VLS_99 = __VLS_98({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_101;
let __VLS_102;
let __VLS_103;
const __VLS_104 = {
    onClick: (__VLS_ctx.handleSubmit)
};
__VLS_100.slots.default;
(__VLS_ctx.isEditMode ? '保存修改' : '发布帖子');
var __VLS_100;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['create-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['head-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['template-row']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-status']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
// @ts-ignore
var __VLS_13 = __VLS_12;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MarkdownEditor: MarkdownEditor,
            formRef: formRef,
            router: router,
            forumStore: forumStore,
            tags: tags,
            templates: templates,
            selectedTemplateId: selectedTemplateId,
            submitting: submitting,
            draftSubmitting: draftSubmitting,
            loading: loading,
            lastSavedAt: lastSavedAt,
            form: form,
            isEditMode: isEditMode,
            rules: rules,
            applyTemplate: applyTemplate,
            saveDraft: saveDraft,
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
//# sourceMappingURL=CreatePostPage.vue.js.map
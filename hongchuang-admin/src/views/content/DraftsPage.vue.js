import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { deleteAdminDraftApi, getAdminDraftListApi, getAdminUploadLogsApi } from '@/api/content';
const activeTab = ref('drafts');
const loadingDrafts = ref(false);
const loadingUploads = ref(false);
const draftRows = ref([]);
const uploadRows = ref([]);
const draftType = ref('');
const keyword = ref('');
const bizType = ref('');
const loadDrafts = async () => {
    loadingDrafts.value = true;
    try {
        const { data } = await getAdminDraftListApi({ pageNo: 1, pageSize: 50, draftType: draftType.value || undefined, keyword: keyword.value || undefined });
        draftRows.value = data.records;
    }
    finally {
        loadingDrafts.value = false;
    }
};
const loadUploads = async () => {
    loadingUploads.value = true;
    try {
        const { data } = await getAdminUploadLogsApi({ pageNo: 1, pageSize: 50, bizType: bizType.value || undefined });
        uploadRows.value = data.records;
    }
    finally {
        loadingUploads.value = false;
    }
};
const removeDraft = async (id) => {
    await ElMessageBox.confirm('确定删除这份草稿吗？', '删除草稿', { type: 'warning' });
    await deleteAdminDraftApi(id);
    ElMessage.success('草稿已删除');
    await loadDrafts();
};
onMounted(async () => {
    await loadDrafts();
    await loadUploads();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "草稿治理",
    desc: "查看当前平台草稿与上传记录，便于清理异常内容与预留后续治理能力。",
}));
const __VLS_1 = __VLS_0({
    title: "草稿治理",
    desc: "查看当前平台草稿与上传记录，便于清理异常内容与预留后续治理能力。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_5 = __VLS_4({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    label: "草稿列表",
    name: "drafts",
}));
const __VLS_9 = __VLS_8({
    label: "草稿列表",
    name: "drafts",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
const __VLS_11 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_15 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.draftType),
    clearable: true,
    placeholder: "草稿类型",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.draftType),
    clearable: true,
    placeholder: "草稿类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "论坛帖子草稿",
    value: "POST",
}));
const __VLS_21 = __VLS_20({
    label: "论坛帖子草稿",
    value: "POST",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "资源草稿",
    value: "RESOURCE",
}));
const __VLS_25 = __VLS_24({
    label: "资源草稿",
    value: "RESOURCE",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_18;
const __VLS_27 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索标题/摘要/正文",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索标题/摘要/正文",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    ...{ 'onClick': {} },
}));
const __VLS_33 = __VLS_32({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_35;
let __VLS_36;
let __VLS_37;
const __VLS_38 = {
    onClick: (__VLS_ctx.loadDrafts)
};
__VLS_34.slots.default;
var __VLS_34;
const __VLS_39 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    data: (__VLS_ctx.draftRows),
}));
const __VLS_41 = __VLS_40({
    data: (__VLS_ctx.draftRows),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loadingDrafts) }, null, null);
__VLS_42.slots.default;
const __VLS_43 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    prop: "title",
    label: "标题",
    minWidth: "220",
}));
const __VLS_45 = __VLS_44({
    prop: "title",
    label: "标题",
    minWidth: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const __VLS_47 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    prop: "draftType",
    label: "类型",
    minWidth: "100",
}));
const __VLS_49 = __VLS_48({
    prop: "draftType",
    label: "类型",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const __VLS_51 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "作者",
    minWidth: "160",
}));
const __VLS_53 = __VLS_52({
    label: "作者",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_54.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.nickname || row.username || row.ownerUserId);
}
var __VLS_54;
const __VLS_55 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "保存方式",
    minWidth: "100",
}));
const __VLS_57 = __VLS_56({
    label: "保存方式",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_58.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.autoSaved === 1 ? '自动保存' : '手动保存');
}
var __VLS_58;
const __VLS_59 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    prop: "updatedAt",
    label: "更新时间",
    minWidth: "180",
}));
const __VLS_61 = __VLS_60({
    prop: "updatedAt",
    label: "更新时间",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const __VLS_63 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "操作",
    minWidth: "120",
}));
const __VLS_65 = __VLS_64({
    label: "操作",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_66.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_67 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_71;
    let __VLS_72;
    let __VLS_73;
    const __VLS_74 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeDraft(row.id);
        }
    };
    __VLS_70.slots.default;
    var __VLS_70;
}
var __VLS_66;
var __VLS_42;
var __VLS_14;
var __VLS_10;
const __VLS_75 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "上传记录",
    name: "uploads",
}));
const __VLS_77 = __VLS_76({
    label: "上传记录",
    name: "uploads",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({}));
const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_83 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    modelValue: (__VLS_ctx.bizType),
    clearable: true,
    placeholder: "业务类型",
    ...{ style: {} },
}));
const __VLS_85 = __VLS_84({
    modelValue: (__VLS_ctx.bizType),
    clearable: true,
    placeholder: "业务类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "编辑器图片",
    value: "EDITOR_IMAGE",
}));
const __VLS_89 = __VLS_88({
    label: "编辑器图片",
    value: "EDITOR_IMAGE",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const __VLS_91 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "资源封面",
    value: "RESOURCE_COVER",
}));
const __VLS_93 = __VLS_92({
    label: "资源封面",
    value: "RESOURCE_COVER",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const __VLS_95 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "帖子图片",
    value: "POST_IMAGE",
}));
const __VLS_97 = __VLS_96({
    label: "帖子图片",
    value: "POST_IMAGE",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const __VLS_99 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "附件",
    value: "POST_FILE",
}));
const __VLS_101 = __VLS_100({
    label: "附件",
    value: "POST_FILE",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_86;
const __VLS_103 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    ...{ 'onClick': {} },
}));
const __VLS_105 = __VLS_104({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_107;
let __VLS_108;
let __VLS_109;
const __VLS_110 = {
    onClick: (__VLS_ctx.loadUploads)
};
__VLS_106.slots.default;
var __VLS_106;
const __VLS_111 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    data: (__VLS_ctx.uploadRows),
}));
const __VLS_113 = __VLS_112({
    data: (__VLS_ctx.uploadRows),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loadingUploads) }, null, null);
__VLS_114.slots.default;
const __VLS_115 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    prop: "fileName",
    label: "文件名",
    minWidth: "220",
}));
const __VLS_117 = __VLS_116({
    prop: "fileName",
    label: "文件名",
    minWidth: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
const __VLS_119 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    prop: "bizType",
    label: "业务类型",
    minWidth: "120",
}));
const __VLS_121 = __VLS_120({
    prop: "bizType",
    label: "业务类型",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
const __VLS_123 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    label: "上传用户",
    minWidth: "160",
}));
const __VLS_125 = __VLS_124({
    label: "上传用户",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_126.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.nickname || row.username || row.userId || '匿名');
}
var __VLS_126;
const __VLS_127 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    prop: "fileSize",
    label: "大小",
    minWidth: "100",
}));
const __VLS_129 = __VLS_128({
    prop: "fileSize",
    label: "大小",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const __VLS_131 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    prop: "createdAt",
    label: "上传时间",
    minWidth: "180",
}));
const __VLS_133 = __VLS_132({
    prop: "createdAt",
    label: "上传时间",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const __VLS_135 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "文件地址",
    minWidth: "240",
}));
const __VLS_137 = __VLS_136({
    label: "文件地址",
    minWidth: "240",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_138.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
        href: (row.fileUrl),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    (row.fileUrl);
}
var __VLS_138;
var __VLS_114;
var __VLS_82;
var __VLS_78;
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            activeTab: activeTab,
            loadingDrafts: loadingDrafts,
            loadingUploads: loadingUploads,
            draftRows: draftRows,
            uploadRows: uploadRows,
            draftType: draftType,
            keyword: keyword,
            bizType: bizType,
            loadDrafts: loadDrafts,
            loadUploads: loadUploads,
            removeDraft: removeDraft,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DraftsPage.vue.js.map
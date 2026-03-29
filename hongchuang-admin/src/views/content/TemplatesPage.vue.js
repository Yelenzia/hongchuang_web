import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { createAdminTemplateApi, deleteAdminTemplateApi, getAdminTemplateDetailApi, getAdminTemplateListApi, toggleAdminTemplateApi, updateAdminTemplateApi } from '@/api/content';
const loading = ref(false);
const submitting = ref(false);
const rows = ref([]);
const keyword = ref('');
const templateType = ref('');
const enabled = ref();
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref('');
const form = reactive({
    templateName: '',
    templateType: 'POST',
    sceneCode: '',
    titleExample: '',
    summaryExample: '',
    contentMarkdown: '',
    enabled: 1,
    sortOrder: 0
});
const resetForm = () => {
    form.templateName = '';
    form.templateType = 'POST';
    form.sceneCode = '';
    form.titleExample = '';
    form.summaryExample = '';
    form.contentMarkdown = '';
    form.enabled = 1;
    form.sortOrder = 0;
};
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getAdminTemplateListApi({ pageNo: 1, pageSize: 50, templateType: templateType.value || undefined, keyword: keyword.value || undefined, enabled: enabled.value });
        rows.value = data.records;
    }
    finally {
        loading.value = false;
    }
};
const openCreate = () => {
    isEdit.value = false;
    currentId.value = '';
    resetForm();
    dialogVisible.value = true;
};
const openEdit = async (id) => {
    const { data } = await getAdminTemplateDetailApi(id);
    isEdit.value = true;
    currentId.value = id;
    form.templateName = data.templateName;
    form.templateType = data.templateType;
    form.sceneCode = data.sceneCode;
    form.titleExample = data.titleExample || '';
    form.summaryExample = data.summaryExample || '';
    form.contentMarkdown = data.contentMarkdown || '';
    form.enabled = data.enabled || 1;
    form.sortOrder = data.sortOrder || 0;
    dialogVisible.value = true;
};
const submit = async () => {
    submitting.value = true;
    try {
        const payload = { ...form };
        if (isEdit.value) {
            await updateAdminTemplateApi(currentId.value, payload);
        }
        else {
            await createAdminTemplateApi(payload);
        }
        ElMessage.success('模板已保存');
        dialogVisible.value = false;
        await loadData();
    }
    finally {
        submitting.value = false;
    }
};
const toggleEnabled = async (row) => {
    await toggleAdminTemplateApi(row.id, row.enabled === 1 ? 0 : 1);
    ElMessage.success('模板状态已更新');
    await loadData();
};
const remove = async (id) => {
    await ElMessageBox.confirm('确定删除这个模板吗？', '删除模板', { type: 'warning' });
    await deleteAdminTemplateApi(id);
    ElMessage.success('模板已删除');
    await loadData();
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof PageHeader, typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "内容模板管理",
    desc: "管理论坛发帖模板和资源发布模板，控制启用状态与排序。",
}));
const __VLS_1 = __VLS_0({
    title: "内容模板管理",
    desc: "管理论坛发帖模板和资源发布模板，控制启用状态与排序。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
const __VLS_3 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_5 = __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
let __VLS_7;
let __VLS_8;
let __VLS_9;
const __VLS_10 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_6.slots.default;
var __VLS_6;
var __VLS_2;
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
    modelValue: (__VLS_ctx.templateType),
    clearable: true,
    placeholder: "模板类型",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.templateType),
    clearable: true,
    placeholder: "模板类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "论坛模板",
    value: "POST",
}));
const __VLS_21 = __VLS_20({
    label: "论坛模板",
    value: "POST",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "资源模板",
    value: "RESOURCE",
}));
const __VLS_25 = __VLS_24({
    label: "资源模板",
    value: "RESOURCE",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_18;
const __VLS_27 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.enabled),
    clearable: true,
    placeholder: "启用状态",
    ...{ style: {} },
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.enabled),
    clearable: true,
    placeholder: "启用状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "启用",
    value: (1),
}));
const __VLS_33 = __VLS_32({
    label: "启用",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_35 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "禁用",
    value: (0),
}));
const __VLS_37 = __VLS_36({
    label: "禁用",
    value: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_30;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索模板名/场景编码",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索模板名/场景编码",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const __VLS_43 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    ...{ 'onClick': {} },
}));
const __VLS_45 = __VLS_44({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_47;
let __VLS_48;
let __VLS_49;
const __VLS_50 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_46.slots.default;
var __VLS_46;
const __VLS_51 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    data: (__VLS_ctx.rows),
}));
const __VLS_53 = __VLS_52({
    data: (__VLS_ctx.rows),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_54.slots.default;
const __VLS_55 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    prop: "templateName",
    label: "模板名称",
    minWidth: "180",
}));
const __VLS_57 = __VLS_56({
    prop: "templateName",
    label: "模板名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
const __VLS_59 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    prop: "templateType",
    label: "类型",
    minWidth: "100",
}));
const __VLS_61 = __VLS_60({
    prop: "templateType",
    label: "类型",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const __VLS_63 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    prop: "sceneCode",
    label: "场景编码",
    minWidth: "140",
}));
const __VLS_65 = __VLS_64({
    prop: "sceneCode",
    label: "场景编码",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const __VLS_67 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    prop: "sortOrder",
    label: "排序",
    minWidth: "80",
}));
const __VLS_69 = __VLS_68({
    prop: "sortOrder",
    label: "排序",
    minWidth: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const __VLS_71 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "状态",
    minWidth: "100",
}));
const __VLS_73 = __VLS_72({
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_74.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_75 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        type: (row.enabled === 1 ? 'success' : 'info'),
    }));
    const __VLS_77 = __VLS_76({
        type: (row.enabled === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    __VLS_78.slots.default;
    (row.enabled === 1 ? '启用' : '禁用');
    var __VLS_78;
}
var __VLS_74;
const __VLS_79 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    prop: "updatedAt",
    label: "更新时间",
    minWidth: "180",
}));
const __VLS_81 = __VLS_80({
    prop: "updatedAt",
    label: "更新时间",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const __VLS_83 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "操作",
    minWidth: "240",
}));
const __VLS_85 = __VLS_84({
    label: "操作",
    minWidth: "240",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_86.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_87 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_91;
    let __VLS_92;
    let __VLS_93;
    const __VLS_94 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row.id);
        }
    };
    __VLS_90.slots.default;
    var __VLS_90;
    const __VLS_95 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_99;
    let __VLS_100;
    let __VLS_101;
    const __VLS_102 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleEnabled(row);
        }
    };
    __VLS_98.slots.default;
    (row.enabled === 1 ? '禁用' : '启用');
    var __VLS_98;
    const __VLS_103 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_105 = __VLS_104({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    let __VLS_107;
    let __VLS_108;
    let __VLS_109;
    const __VLS_110 = {
        onClick: (...[$event]) => {
            __VLS_ctx.remove(row.id);
        }
    };
    __VLS_106.slots.default;
    var __VLS_106;
}
var __VLS_86;
var __VLS_54;
var __VLS_14;
const __VLS_111 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑模板' : '新增模板'),
    width: "760px",
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑模板' : '新增模板'),
    width: "760px",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}));
const __VLS_117 = __VLS_116({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "模板名称",
}));
const __VLS_121 = __VLS_120({
    label: "模板名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.form.templateName),
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.form.templateName),
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
var __VLS_122;
const __VLS_127 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    label: "模板类型",
}));
const __VLS_129 = __VLS_128({
    label: "模板类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
const __VLS_131 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.form.templateType),
    ...{ style: {} },
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.form.templateType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
const __VLS_135 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "论坛模板",
    value: "POST",
}));
const __VLS_137 = __VLS_136({
    label: "论坛模板",
    value: "POST",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
const __VLS_139 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    label: "资源模板",
    value: "RESOURCE",
}));
const __VLS_141 = __VLS_140({
    label: "资源模板",
    value: "RESOURCE",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
var __VLS_134;
var __VLS_130;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_143 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    label: "场景编码",
}));
const __VLS_145 = __VLS_144({
    label: "场景编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
const __VLS_147 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    modelValue: (__VLS_ctx.form.sceneCode),
}));
const __VLS_149 = __VLS_148({
    modelValue: (__VLS_ctx.form.sceneCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
var __VLS_146;
const __VLS_151 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    label: "排序",
}));
const __VLS_153 = __VLS_152({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.form.sortOrder),
    min: (0),
    ...{ style: {} },
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.form.sortOrder),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
var __VLS_154;
const __VLS_159 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    label: "示例标题",
}));
const __VLS_161 = __VLS_160({
    label: "示例标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    modelValue: (__VLS_ctx.form.titleExample),
}));
const __VLS_165 = __VLS_164({
    modelValue: (__VLS_ctx.form.titleExample),
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
var __VLS_162;
const __VLS_167 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "示例摘要",
}));
const __VLS_169 = __VLS_168({
    label: "示例摘要",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
__VLS_170.slots.default;
const __VLS_171 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    modelValue: (__VLS_ctx.form.summaryExample),
    type: "textarea",
    rows: (3),
}));
const __VLS_173 = __VLS_172({
    modelValue: (__VLS_ctx.form.summaryExample),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
var __VLS_170;
const __VLS_175 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    label: "模板正文",
}));
const __VLS_177 = __VLS_176({
    label: "模板正文",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
const __VLS_179 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    modelValue: (__VLS_ctx.form.contentMarkdown),
    type: "textarea",
    rows: (14),
}));
const __VLS_181 = __VLS_180({
    modelValue: (__VLS_ctx.form.contentMarkdown),
    type: "textarea",
    rows: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
var __VLS_178;
var __VLS_118;
{
    const { footer: __VLS_thisSlot } = __VLS_114.slots;
    const __VLS_183 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        ...{ 'onClick': {} },
    }));
    const __VLS_185 = __VLS_184({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    let __VLS_187;
    let __VLS_188;
    let __VLS_189;
    const __VLS_190 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_186.slots.default;
    var __VLS_186;
    const __VLS_191 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_193 = __VLS_192({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    let __VLS_195;
    let __VLS_196;
    let __VLS_197;
    const __VLS_198 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_194.slots.default;
    var __VLS_194;
}
var __VLS_114;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            submitting: submitting,
            rows: rows,
            keyword: keyword,
            templateType: templateType,
            enabled: enabled,
            dialogVisible: dialogVisible,
            isEdit: isEdit,
            form: form,
            loadData: loadData,
            openCreate: openCreate,
            openEdit: openEdit,
            submit: submit,
            toggleEnabled: toggleEnabled,
            remove: remove,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TemplatesPage.vue.js.map
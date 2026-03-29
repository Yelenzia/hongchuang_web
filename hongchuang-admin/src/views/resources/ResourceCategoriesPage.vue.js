import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { createResourceCategoryApi, deleteResourceCategoryApi, getAdminResourceCategoriesApi, updateResourceCategoryApi, updateResourceCategoryStatusApi } from '@/api/resources';
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const editingId = ref(null);
const rows = ref([]);
const form = reactive({ name: '', slug: '', description: '', icon: '', sortOrder: 0, status: 1 });
const resetForm = () => {
    form.name = '';
    form.slug = '';
    form.description = '';
    form.icon = '';
    form.sortOrder = 0;
    form.status = 1;
};
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getAdminResourceCategoriesApi();
        rows.value = data;
    }
    finally {
        loading.value = false;
    }
};
const openCreate = () => {
    editingId.value = null;
    resetForm();
    dialogVisible.value = true;
};
const openEdit = (row) => {
    editingId.value = row.id;
    form.name = row.name;
    form.slug = row.slug;
    form.description = row.description || '';
    form.icon = row.icon || '';
    form.sortOrder = row.sortOrder || 0;
    form.status = row.status ?? 1;
    dialogVisible.value = true;
};
const submit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
        ElMessage.warning('请填写分类名称和分类标识');
        return;
    }
    submitting.value = true;
    try {
        const payload = { ...form };
        if (editingId.value) {
            await updateResourceCategoryApi(editingId.value, payload);
            ElMessage.success('分类已更新');
        }
        else {
            await createResourceCategoryApi(payload);
            ElMessage.success('分类已创建');
        }
        dialogVisible.value = false;
        await loadData();
    }
    finally {
        submitting.value = false;
    }
};
const toggleStatus = async (row) => {
    await updateResourceCategoryStatusApi(row.id, row.status === 1 ? 0 : 1);
    ElMessage.success('分类状态已更新');
    await loadData();
};
const removeRow = async (row) => {
    await ElMessageBox.confirm(`确定删除分类「${row.name}」吗？`, '删除确认', { type: 'warning' });
    await deleteResourceCategoryApi(row.id);
    ElMessage.success('分类已删除');
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
    title: "资源分类",
    desc: "维护资源分类、排序、启用状态和说明文案。",
}));
const __VLS_1 = __VLS_0({
    title: "资源分类",
    desc: "维护资源分类、排序、启用状态和说明文案。",
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
const __VLS_15 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    data: (__VLS_ctx.rows),
    border: true,
}));
const __VLS_17 = __VLS_16({
    data: (__VLS_ctx.rows),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_18.slots.default;
const __VLS_19 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    prop: "name",
    label: "分类名称",
    minWidth: "160",
}));
const __VLS_21 = __VLS_20({
    prop: "name",
    label: "分类名称",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    prop: "slug",
    label: "分类标识",
    minWidth: "160",
}));
const __VLS_25 = __VLS_24({
    prop: "slug",
    label: "分类标识",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const __VLS_27 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    prop: "description",
    label: "分类说明",
    minWidth: "280",
    showOverflowTooltip: true,
}));
const __VLS_29 = __VLS_28({
    prop: "description",
    label: "分类说明",
    minWidth: "280",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    prop: "sortOrder",
    label: "排序",
    width: "90",
}));
const __VLS_33 = __VLS_32({
    prop: "sortOrder",
    label: "排序",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_35 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    prop: "resourceCount",
    label: "资源数",
    width: "100",
}));
const __VLS_37 = __VLS_36({
    prop: "resourceCount",
    label: "资源数",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const __VLS_39 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "状态",
    width: "100",
}));
const __VLS_41 = __VLS_40({
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_42.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_43 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        type: (row.status === 1 ? 'success' : 'info'),
    }));
    const __VLS_45 = __VLS_44({
        type: (row.status === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_46.slots.default;
    (row.status === 1 ? '启用' : '停用');
    var __VLS_46;
}
var __VLS_42;
const __VLS_47 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "操作",
    minWidth: "220",
    fixed: "right",
}));
const __VLS_49 = __VLS_48({
    label: "操作",
    minWidth: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_50.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_51 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_55;
    let __VLS_56;
    let __VLS_57;
    const __VLS_58 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_54.slots.default;
    var __VLS_54;
    const __VLS_59 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_63;
    let __VLS_64;
    let __VLS_65;
    const __VLS_66 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleStatus(row);
        }
    };
    __VLS_62.slots.default;
    (row.status === 1 ? '停用' : '启用');
    var __VLS_62;
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
            __VLS_ctx.removeRow(row);
        }
    };
    __VLS_70.slots.default;
    var __VLS_70;
}
var __VLS_50;
var __VLS_18;
var __VLS_14;
const __VLS_75 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editingId ? '编辑资源分类' : '新建资源分类'),
    width: "520px",
}));
const __VLS_77 = __VLS_76({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editingId ? '编辑资源分类' : '新建资源分类'),
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}));
const __VLS_81 = __VLS_80({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
const __VLS_83 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "分类名称",
}));
const __VLS_85 = __VLS_84({
    label: "分类名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.form.name),
    maxlength: "30",
    showWordLimit: true,
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.form.name),
    maxlength: "30",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
var __VLS_86;
const __VLS_91 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "分类标识",
}));
const __VLS_93 = __VLS_92({
    label: "分类标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
const __VLS_95 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.form.slug),
    maxlength: "40",
    showWordLimit: true,
    placeholder: "例如 plugin-resource",
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.form.slug),
    maxlength: "40",
    showWordLimit: true,
    placeholder: "例如 plugin-resource",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
var __VLS_94;
const __VLS_99 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "分类说明",
}));
const __VLS_101 = __VLS_100({
    label: "分类说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (4),
    maxlength: "200",
    showWordLimit: true,
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (4),
    maxlength: "200",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
var __VLS_102;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_107 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "图标",
}));
const __VLS_109 = __VLS_108({
    label: "图标",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
const __VLS_111 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.form.icon),
    placeholder: "可选：emoji 或图标名",
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.form.icon),
    placeholder: "可选：emoji 或图标名",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
var __VLS_110;
const __VLS_115 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    label: "排序",
}));
const __VLS_117 = __VLS_116({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
const __VLS_119 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    modelValue: (__VLS_ctx.form.sortOrder),
    min: (0),
    max: (9999),
    ...{ style: {} },
}));
const __VLS_121 = __VLS_120({
    modelValue: (__VLS_ctx.form.sortOrder),
    min: (0),
    max: (9999),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
var __VLS_118;
const __VLS_123 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    label: "状态",
}));
const __VLS_125 = __VLS_124({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    modelValue: (__VLS_ctx.form.status),
}));
const __VLS_129 = __VLS_128({
    modelValue: (__VLS_ctx.form.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
const __VLS_131 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    label: (1),
}));
const __VLS_133 = __VLS_132({
    label: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
var __VLS_134;
const __VLS_135 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: (0),
}));
const __VLS_137 = __VLS_136({
    label: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
var __VLS_138;
var __VLS_130;
var __VLS_126;
var __VLS_82;
{
    const { footer: __VLS_thisSlot } = __VLS_78.slots;
    const __VLS_139 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        ...{ 'onClick': {} },
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_143;
    let __VLS_144;
    let __VLS_145;
    const __VLS_146 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_142.slots.default;
    var __VLS_142;
    const __VLS_147 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_151;
    let __VLS_152;
    let __VLS_153;
    const __VLS_154 = {
        onClick: (__VLS_ctx.submit)
    };
    __VLS_150.slots.default;
    var __VLS_150;
}
var __VLS_78;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            dialogVisible: dialogVisible,
            submitting: submitting,
            editingId: editingId,
            rows: rows,
            form: form,
            openCreate: openCreate,
            openEdit: openEdit,
            submit: submit,
            toggleStatus: toggleStatus,
            removeRow: removeRow,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ResourceCategoriesPage.vue.js.map
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { getReportListApi, handleReportApi } from '@/api/reports';
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const currentId = ref(null);
const rows = ref([]);
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const form = reactive({ status: 2, handleNote: '' });
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getReportListApi({ pageNo: pageNo.value, pageSize });
        rows.value = data.records;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadData();
};
const openHandle = (row) => {
    currentId.value = row.id;
    form.status = row.status === 1 ? 2 : row.status;
    form.handleNote = row.handleNote || '';
    dialogVisible.value = true;
};
const submitHandle = async () => {
    if (!currentId.value)
        return;
    submitting.value = true;
    try {
        await handleReportApi(currentId.value, form);
        ElMessage.success('举报处理完成');
        dialogVisible.value = false;
        await loadData();
    }
    finally {
        submitting.value = false;
    }
};
onMounted(loadData);
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
    title: "举报处理",
    desc: "查看用户举报并完成审核处理。",
}));
const __VLS_1 = __VLS_0({
    title: "举报处理",
    desc: "查看用户举报并完成审核处理。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
const __VLS_7 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_10.slots.default;
const __VLS_11 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    prop: "id",
    label: "ID",
    minWidth: "120",
}));
const __VLS_13 = __VLS_12({
    prop: "id",
    label: "ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const __VLS_15 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    prop: "targetType",
    label: "目标类型",
    minWidth: "100",
}));
const __VLS_17 = __VLS_16({
    prop: "targetType",
    label: "目标类型",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const __VLS_19 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    prop: "targetId",
    label: "目标ID",
    minWidth: "120",
}));
const __VLS_21 = __VLS_20({
    prop: "targetId",
    label: "目标ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    prop: "reasonType",
    label: "举报类型",
    minWidth: "120",
}));
const __VLS_25 = __VLS_24({
    prop: "reasonType",
    label: "举报类型",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const __VLS_27 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    prop: "reasonDetail",
    label: "说明",
    minWidth: "220",
    showOverflowTooltip: true,
}));
const __VLS_29 = __VLS_28({
    prop: "reasonDetail",
    label: "说明",
    minWidth: "220",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "处理状态",
    minWidth: "100",
}));
const __VLS_33 = __VLS_32({
    label: "处理状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_34.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_35 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        type: (row.status === 1 ? 'warning' : row.status === 2 ? 'success' : 'info'),
    }));
    const __VLS_37 = __VLS_36({
        type: (row.status === 1 ? 'warning' : row.status === 2 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_38.slots.default;
    (row.status === 1 ? '待处理' : row.status === 2 ? '已处理' : '已驳回');
    var __VLS_38;
}
var __VLS_34;
const __VLS_39 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_41 = __VLS_40({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_42.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_43 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_47;
    let __VLS_48;
    let __VLS_49;
    const __VLS_50 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openHandle(row);
        }
    };
    __VLS_46.slots.default;
    var __VLS_46;
}
var __VLS_42;
var __VLS_10;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_51 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
let __VLS_57;
const __VLS_58 = {
    onCurrentChange: (__VLS_ctx.handlePageChange)
};
var __VLS_54;
var __VLS_6;
const __VLS_59 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "处理举报",
    width: "480px",
}));
const __VLS_61 = __VLS_60({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "处理举报",
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}));
const __VLS_65 = __VLS_64({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "处理结果",
}));
const __VLS_69 = __VLS_68({
    label: "处理结果",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.form.status),
    ...{ style: {} },
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.form.status),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
const __VLS_75 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "处理完成",
    value: (2),
}));
const __VLS_77 = __VLS_76({
    label: "处理完成",
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "驳回举报",
    value: (3),
}));
const __VLS_81 = __VLS_80({
    label: "驳回举报",
    value: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
var __VLS_74;
var __VLS_70;
const __VLS_83 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "处理备注",
}));
const __VLS_85 = __VLS_84({
    label: "处理备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
const __VLS_87 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.form.handleNote),
    type: "textarea",
    rows: (4),
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.form.handleNote),
    type: "textarea",
    rows: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
var __VLS_86;
var __VLS_66;
{
    const { footer: __VLS_thisSlot } = __VLS_62.slots;
    const __VLS_91 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_95;
    let __VLS_96;
    let __VLS_97;
    const __VLS_98 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_94.slots.default;
    var __VLS_94;
    const __VLS_99 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_103;
    let __VLS_104;
    let __VLS_105;
    const __VLS_106 = {
        onClick: (__VLS_ctx.submitHandle)
    };
    __VLS_102.slots.default;
    var __VLS_102;
}
var __VLS_62;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            dialogVisible: dialogVisible,
            submitting: submitting,
            rows: rows,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            form: form,
            handlePageChange: handlePageChange,
            openHandle: openHandle,
            submitHandle: submitHandle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ReportsPage.vue.js.map
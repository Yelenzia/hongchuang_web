import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { auditResourceApi, getAdminResourceCategoriesApi, getResourceDetailApi, getResourceListApi, getResourceStatsApi, updateResourceRecommendApi, updateResourceStatusApi } from '@/api/resources';
const statusOptions = [
    { label: '草稿', value: 0 },
    { label: '待审核', value: 1 },
    { label: '已发布', value: 2 },
    { label: '已下架', value: 3 },
    { label: '已删除', value: 4 }
];
const loading = ref(false);
const detailLoading = ref(false);
const detailVisible = ref(false);
const keyword = ref('');
const categoryId = ref();
const status = ref();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const rows = ref([]);
const categories = ref([]);
const detail = ref(null);
const stats = reactive({ totalResources: 0, publishedResources: 0, pendingResources: 0, totalDownloads: 0, totalViews: 0 });
const statusText = (value) => statusOptions.find(item => item.value === value)?.label || '未知';
const statusTagType = (value) => ({ 0: 'info', 1: 'warning', 2: 'success', 3: '', 4: 'danger' }[value ?? -1] || 'info');
const loadMeta = async () => {
    const { data } = await getAdminResourceCategoriesApi();
    categories.value = data;
};
const loadStats = async () => {
    const { data } = await getResourceStatsApi();
    Object.assign(stats, data);
};
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getResourceListApi({
            pageNo: pageNo.value,
            pageSize,
            keyword: keyword.value || undefined,
            categoryId: categoryId.value,
            status: status.value
        });
        rows.value = data.records;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const handleSearch = async () => {
    pageNo.value = 1;
    await loadData();
};
const resetSearch = async () => {
    keyword.value = '';
    categoryId.value = undefined;
    status.value = undefined;
    pageNo.value = 1;
    await loadData();
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadData();
};
const openDetail = async (resourceId) => {
    detailVisible.value = true;
    detailLoading.value = true;
    try {
        const { data } = await getResourceDetailApi(resourceId);
        detail.value = data;
    }
    finally {
        detailLoading.value = false;
    }
};
const approve = async (row) => {
    await auditResourceApi(row.id, { pass: true, remark: '后台审核通过' });
    ElMessage.success('资源已审核通过');
    await Promise.all([loadData(), loadStats()]);
};
const reject = async (row) => {
    const { value } = await ElMessageBox.prompt(`请填写驳回《${row.title}》的原因`, '驳回资源', {
        confirmButtonText: '提交驳回',
        cancelButtonText: '取消',
        inputPlaceholder: '例如：封面缺失、下载地址无效、说明过少'
    });
    await auditResourceApi(row.id, { pass: false, remark: value || '请完善后重新提交' });
    ElMessage.success('资源已驳回');
    await Promise.all([loadData(), loadStats()]);
};
const changeStatus = async (row, nextStatus) => {
    const actionText = statusText(nextStatus);
    await ElMessageBox.confirm(`确定将资源《${row.title}》改为${actionText}吗？`, '状态确认', { type: 'warning' });
    await updateResourceStatusApi(row.id, nextStatus);
    ElMessage.success('资源状态已更新');
    await Promise.all([loadData(), loadStats()]);
};
const toggleRecommend = async (row) => {
    await updateResourceRecommendApi(row.id, row.isRecommended !== 1);
    ElMessage.success('推荐状态已更新');
    await loadData();
};
onMounted(async () => {
    await Promise.all([loadMeta(), loadStats(), loadData()]);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "资源管理",
    desc: "处理资源审核、推荐位、上下架和内容巡检。",
}));
const __VLS_1 = __VLS_0({
    title: "资源管理",
    desc: "处理资源审核、推荐位、上下架和内容巡检。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stats-grid" },
});
const __VLS_3 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    ...{ class: "stat-card" },
}));
const __VLS_5 = __VLS_4({
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.stats.totalResources);
var __VLS_6;
const __VLS_7 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ class: "stat-card" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.stats.publishedResources);
var __VLS_10;
const __VLS_11 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    ...{ class: "stat-card" },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value warning" },
});
(__VLS_ctx.stats.pendingResources);
var __VLS_14;
const __VLS_15 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    ...{ class: "stat-card" },
}));
const __VLS_17 = __VLS_16({
    ...{ class: "stat-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-value" },
});
(__VLS_ctx.stats.totalDownloads);
var __VLS_18;
const __VLS_19 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_23 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索标题 / 作者",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_25 = __VLS_24({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索标题 / 作者",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onKeyup: (__VLS_ctx.handleSearch)
};
var __VLS_26;
const __VLS_31 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.categoryId),
    clearable: true,
    placeholder: "资源分类",
    ...{ style: {} },
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.categoryId),
    clearable: true,
    placeholder: "资源分类",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_35 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_37 = __VLS_36({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
}
var __VLS_34;
const __VLS_39 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.status),
    clearable: true,
    placeholder: "资源状态",
    ...{ style: {} },
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.status),
    clearable: true,
    placeholder: "资源状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.statusOptions))) {
    const __VLS_43 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_45 = __VLS_44({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
}
var __VLS_42;
const __VLS_47 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_50.slots.default;
var __VLS_50;
const __VLS_55 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
let __VLS_61;
const __VLS_62 = {
    onClick: (__VLS_ctx.resetSearch)
};
__VLS_58.slots.default;
var __VLS_58;
const __VLS_63 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    data: (__VLS_ctx.rows),
    border: true,
}));
const __VLS_65 = __VLS_64({
    data: (__VLS_ctx.rows),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_66.slots.default;
const __VLS_67 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    prop: "title",
    label: "资源标题",
    minWidth: "260",
}));
const __VLS_69 = __VLS_68({
    prop: "title",
    label: "资源标题",
    minWidth: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_70.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-text" },
    });
    (row.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-text" },
    });
    (row.authorName);
    (row.categoryName);
}
var __VLS_70;
const __VLS_71 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    prop: "currentVersionNo",
    label: "版本号",
    minWidth: "110",
}));
const __VLS_73 = __VLS_72({
    prop: "currentVersionNo",
    label: "版本号",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const __VLS_75 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    prop: "mcVersions",
    label: "支持版本",
    minWidth: "140",
}));
const __VLS_77 = __VLS_76({
    prop: "mcVersions",
    label: "支持版本",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "状态",
    width: "110",
}));
const __VLS_81 = __VLS_80({
    label: "状态",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_82.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_83 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        type: (__VLS_ctx.statusTagType(row.status)),
    }));
    const __VLS_85 = __VLS_84({
        type: (__VLS_ctx.statusTagType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    __VLS_86.slots.default;
    (__VLS_ctx.statusText(row.status));
    var __VLS_86;
}
var __VLS_82;
const __VLS_87 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "推荐",
    width: "90",
}));
const __VLS_89 = __VLS_88({
    label: "推荐",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_90.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_91 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        type: (row.isRecommended === 1 ? 'success' : 'info'),
    }));
    const __VLS_93 = __VLS_92({
        type: (row.isRecommended === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    __VLS_94.slots.default;
    (row.isRecommended === 1 ? '已推荐' : '普通');
    var __VLS_94;
}
var __VLS_90;
const __VLS_95 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    prop: "downloadCount",
    label: "下载",
    width: "90",
}));
const __VLS_97 = __VLS_96({
    prop: "downloadCount",
    label: "下载",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const __VLS_99 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    prop: "commentCount",
    label: "评论",
    width: "90",
}));
const __VLS_101 = __VLS_100({
    prop: "commentCount",
    label: "评论",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const __VLS_103 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "170",
}));
const __VLS_105 = __VLS_104({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const __VLS_107 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "操作",
    minWidth: "360",
    fixed: "right",
}));
const __VLS_109 = __VLS_108({
    label: "操作",
    minWidth: "360",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_110.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_111 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_113 = __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    let __VLS_115;
    let __VLS_116;
    let __VLS_117;
    const __VLS_118 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row.id);
        }
    };
    __VLS_114.slots.default;
    var __VLS_114;
    const __VLS_119 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_121 = __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_120));
    let __VLS_123;
    let __VLS_124;
    let __VLS_125;
    const __VLS_126 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleRecommend(row);
        }
    };
    __VLS_122.slots.default;
    (row.isRecommended === 1 ? '取消推荐' : '设为推荐');
    var __VLS_122;
    if (row.status === 1) {
        const __VLS_127 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_129 = __VLS_128({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        let __VLS_131;
        let __VLS_132;
        let __VLS_133;
        const __VLS_134 = {
            onClick: (...[$event]) => {
                if (!(row.status === 1))
                    return;
                __VLS_ctx.approve(row);
            }
        };
        __VLS_130.slots.default;
        var __VLS_130;
    }
    if (row.status === 1) {
        const __VLS_135 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }));
        const __VLS_137 = __VLS_136({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        let __VLS_139;
        let __VLS_140;
        let __VLS_141;
        const __VLS_142 = {
            onClick: (...[$event]) => {
                if (!(row.status === 1))
                    return;
                __VLS_ctx.reject(row);
            }
        };
        __VLS_138.slots.default;
        var __VLS_138;
    }
    if (row.status === 2) {
        const __VLS_143 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_145 = __VLS_144({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_144));
        let __VLS_147;
        let __VLS_148;
        let __VLS_149;
        const __VLS_150 = {
            onClick: (...[$event]) => {
                if (!(row.status === 2))
                    return;
                __VLS_ctx.changeStatus(row, 3);
            }
        };
        __VLS_146.slots.default;
        var __VLS_146;
    }
    if (row.status === 3) {
        const __VLS_151 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_153 = __VLS_152({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        let __VLS_155;
        let __VLS_156;
        let __VLS_157;
        const __VLS_158 = {
            onClick: (...[$event]) => {
                if (!(row.status === 3))
                    return;
                __VLS_ctx.changeStatus(row, 2);
            }
        };
        __VLS_154.slots.default;
        var __VLS_154;
    }
    if (row.status !== 4) {
        const __VLS_159 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_161 = __VLS_160({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_160));
        let __VLS_163;
        let __VLS_164;
        let __VLS_165;
        const __VLS_166 = {
            onClick: (...[$event]) => {
                if (!(row.status !== 4))
                    return;
                __VLS_ctx.changeStatus(row, 4);
            }
        };
        __VLS_162.slots.default;
        var __VLS_162;
    }
}
var __VLS_110;
var __VLS_66;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_167 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}));
const __VLS_169 = __VLS_168({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
let __VLS_171;
let __VLS_172;
let __VLS_173;
const __VLS_174 = {
    onCurrentChange: (__VLS_ctx.handlePageChange)
};
var __VLS_170;
var __VLS_22;
const __VLS_175 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    modelValue: (__VLS_ctx.detailVisible),
    title: "资源详情",
    size: "720px",
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.detailVisible),
    title: "资源详情",
    size: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
if (__VLS_ctx.detail) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-wrap" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.detailLoading) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-title" },
    });
    (__VLS_ctx.detail.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-sub" },
    });
    (__VLS_ctx.detail.authorName);
    (__VLS_ctx.detail.categoryName);
    (__VLS_ctx.statusText(__VLS_ctx.detail.status));
    const __VLS_179 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
        type: (__VLS_ctx.detail.isRecommended === 1 ? 'success' : 'info'),
    }));
    const __VLS_181 = __VLS_180({
        type: (__VLS_ctx.detail.isRecommended === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    __VLS_182.slots.default;
    (__VLS_ctx.detail.isRecommended === 1 ? '推荐中' : '普通');
    var __VLS_182;
    const __VLS_183 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        column: (2),
        border: true,
    }));
    const __VLS_185 = __VLS_184({
        column: (2),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    __VLS_186.slots.default;
    const __VLS_187 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
        label: "版本号",
    }));
    const __VLS_189 = __VLS_188({
        label: "版本号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
    __VLS_190.slots.default;
    (__VLS_ctx.detail.currentVersion?.versionNo || __VLS_ctx.detail.currentVersionNo || '-');
    var __VLS_190;
    const __VLS_191 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
        label: "支持版本",
    }));
    const __VLS_193 = __VLS_192({
        label: "支持版本",
    }, ...__VLS_functionalComponentArgsRest(__VLS_192));
    __VLS_194.slots.default;
    (__VLS_ctx.detail.currentVersion?.mcVersions || __VLS_ctx.detail.mcVersions || '-');
    var __VLS_194;
    const __VLS_195 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
        label: "下载方式",
    }));
    const __VLS_197 = __VLS_196({
        label: "下载方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    __VLS_198.slots.default;
    (__VLS_ctx.detail.currentVersion?.downloadType || __VLS_ctx.detail.downloadType || '-');
    var __VLS_198;
    const __VLS_199 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
        label: "下载量 / 浏览量",
    }));
    const __VLS_201 = __VLS_200({
        label: "下载量 / 浏览量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    __VLS_202.slots.default;
    (__VLS_ctx.detail.downloadCount);
    (__VLS_ctx.detail.viewCount || 0);
    var __VLS_202;
    const __VLS_203 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
        label: "审核备注",
        span: (2),
    }));
    const __VLS_205 = __VLS_204({
        label: "审核备注",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    __VLS_206.slots.default;
    (__VLS_ctx.detail.auditRemark || '-');
    var __VLS_206;
    const __VLS_207 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        label: "标签",
        span: (2),
    }));
    const __VLS_209 = __VLS_208({
        label: "标签",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    __VLS_210.slots.default;
    (__VLS_ctx.detail.tags?.length ? __VLS_ctx.detail.tags.map(item => item.name).join('、') : '暂无');
    var __VLS_210;
    const __VLS_211 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        label: "资源简介",
        span: (2),
    }));
    const __VLS_213 = __VLS_212({
        label: "资源简介",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    __VLS_214.slots.default;
    (__VLS_ctx.detail.summary || '-');
    var __VLS_214;
    var __VLS_186;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content-block" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "content-text" },
    });
    (__VLS_ctx.detail.content || '暂无内容');
    if (__VLS_ctx.detail.versions?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "content-block" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "content-title" },
        });
        const __VLS_215 = {}.ElTimeline;
        /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
        // @ts-ignore
        const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({}));
        const __VLS_217 = __VLS_216({}, ...__VLS_functionalComponentArgsRest(__VLS_216));
        __VLS_218.slots.default;
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.detail.versions))) {
            const __VLS_219 = {}.ElTimelineItem;
            /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
            // @ts-ignore
            const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
                key: (item.id || item.versionNo),
                timestamp: (item.createdAt || '-'),
            }));
            const __VLS_221 = __VLS_220({
                key: (item.id || item.versionNo),
                timestamp: (item.createdAt || '-'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_220));
            __VLS_222.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "version-title" },
            });
            (item.versionNo || '-');
            (item.mcVersions || '未填写支持版本');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "version-text" },
            });
            (item.changelog || '暂无更新日志');
            var __VLS_222;
        }
        var __VLS_218;
    }
}
var __VLS_178;
/** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['title-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-head']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-title']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['content-block']} */ ;
/** @type {__VLS_StyleScopedClasses['content-title']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['content-block']} */ ;
/** @type {__VLS_StyleScopedClasses['content-title']} */ ;
/** @type {__VLS_StyleScopedClasses['version-title']} */ ;
/** @type {__VLS_StyleScopedClasses['version-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            statusOptions: statusOptions,
            loading: loading,
            detailLoading: detailLoading,
            detailVisible: detailVisible,
            keyword: keyword,
            categoryId: categoryId,
            status: status,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            rows: rows,
            categories: categories,
            detail: detail,
            stats: stats,
            statusText: statusText,
            statusTagType: statusTagType,
            handleSearch: handleSearch,
            resetSearch: resetSearch,
            handlePageChange: handlePageChange,
            openDetail: openDetail,
            approve: approve,
            reject: reject,
            changeStatus: changeStatus,
            toggleRecommend: toggleRecommend,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ResourcesPage.vue.js.map
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { deleteCommentApi, getCommentListApi } from '@/api/comments';
const loading = ref(false);
const keyword = ref('');
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const rows = ref([]);
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getCommentListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined });
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
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadData();
};
const removeComment = async (row) => {
    await ElMessageBox.confirm('确定删除这条评论吗？', '删除确认', { type: 'warning' });
    await deleteCommentApi(row.id);
    ElMessage.success('评论已删除');
    await loadData();
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
    title: "评论管理",
    desc: "处理评论区违规内容与社区互动质量。",
}));
const __VLS_1 = __VLS_0({
    title: "评论管理",
    desc: "处理评论区违规内容与社区互动质量。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_7 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索评论内容",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索评论内容",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onKeyup: (__VLS_ctx.handleSearch)
};
var __VLS_10;
const __VLS_15 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    ...{ 'onClick': {} },
}));
const __VLS_17 = __VLS_16({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_19;
let __VLS_20;
let __VLS_21;
const __VLS_22 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_18.slots.default;
var __VLS_18;
const __VLS_23 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}));
const __VLS_25 = __VLS_24({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_26.slots.default;
const __VLS_27 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    prop: "id",
    label: "ID",
    minWidth: "120",
}));
const __VLS_29 = __VLS_28({
    prop: "id",
    label: "ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    prop: "postTitle",
    label: "所属帖子",
    minWidth: "220",
    showOverflowTooltip: true,
}));
const __VLS_33 = __VLS_32({
    prop: "postTitle",
    label: "所属帖子",
    minWidth: "220",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_35 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    prop: "author",
    label: "作者",
    minWidth: "120",
}));
const __VLS_37 = __VLS_36({
    prop: "author",
    label: "作者",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const __VLS_39 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    prop: "content",
    label: "评论内容",
    minWidth: "260",
    showOverflowTooltip: true,
}));
const __VLS_41 = __VLS_40({
    prop: "content",
    label: "评论内容",
    minWidth: "260",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const __VLS_43 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "状态",
    minWidth: "100",
}));
const __VLS_45 = __VLS_44({
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_46.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_47 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        type: (row.status === 1 ? 'success' : 'warning'),
    }));
    const __VLS_49 = __VLS_48({
        type: (row.status === 1 ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    __VLS_50.slots.default;
    (row.status === 1 ? '正常' : '隐藏');
    var __VLS_50;
}
var __VLS_46;
const __VLS_51 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "操作",
    width: "140",
    fixed: "right",
}));
const __VLS_53 = __VLS_52({
    label: "操作",
    width: "140",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_54.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_55 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_59;
    let __VLS_60;
    let __VLS_61;
    const __VLS_62 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeComment(row);
        }
    };
    __VLS_58.slots.default;
    var __VLS_58;
}
var __VLS_54;
var __VLS_26;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_63 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}));
const __VLS_65 = __VLS_64({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_67;
let __VLS_68;
let __VLS_69;
const __VLS_70 = {
    onCurrentChange: (__VLS_ctx.handlePageChange)
};
var __VLS_66;
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            keyword: keyword,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            rows: rows,
            handleSearch: handleSearch,
            handlePageChange: handlePageChange,
            removeComment: removeComment,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CommentsPage.vue.js.map
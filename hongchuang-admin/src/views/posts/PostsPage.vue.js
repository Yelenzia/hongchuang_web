import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { deletePostApi, getPostDetailApi, getPostListApi, recommendPostApi, updatePostApi, updatePostStatusApi } from '@/api/posts';
import { getBoardListApi } from '@/api/boards';
import { getTagListApi } from '@/api/tags';
const loading = ref(false);
const detailLoading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const currentPostId = ref(null);
const keyword = ref('');
const status = ref();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const rows = ref([]);
const boards = ref([]);
const tags = ref([]);
const form = reactive({ boardId: undefined, title: '', summary: '', contentMd: '', tagIds: [] });
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getPostListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, status: status.value });
        rows.value = data.records;
        total.value = data.total;
    }
    finally {
        loading.value = false;
    }
};
const loadMeta = async () => {
    const [{ data: boardData }, { data: tagData }] = await Promise.all([getBoardListApi(), getTagListApi()]);
    boards.value = boardData;
    tags.value = tagData;
};
const handleSearch = async () => {
    pageNo.value = 1;
    await loadData();
};
const handlePageChange = async (page) => {
    pageNo.value = page;
    await loadData();
};
const openEdit = async (postId) => {
    currentPostId.value = postId;
    dialogVisible.value = true;
    detailLoading.value = true;
    try {
        await loadMeta();
        const { data } = await getPostDetailApi(postId);
        form.boardId = data.boardId;
        form.title = data.title;
        form.summary = data.summary || '';
        form.contentMd = data.contentMd;
        form.tagIds = data.tags.map(tag => tag.id);
    }
    finally {
        detailLoading.value = false;
    }
};
const submitEdit = async () => {
    if (!currentPostId.value || !form.boardId || !form.title.trim() || !form.contentMd.trim()) {
        ElMessage.warning('请补全帖子标题、板块和正文');
        return;
    }
    submitting.value = true;
    try {
        await updatePostApi(currentPostId.value, {
            boardId: form.boardId,
            title: form.title,
            summary: form.summary,
            contentMd: form.contentMd,
            tagIds: form.tagIds
        });
        ElMessage.success('帖子已更新');
        dialogVisible.value = false;
        await loadData();
    }
    finally {
        submitting.value = false;
    }
};
const toggleRecommend = async (row) => {
    await recommendPostApi(row.id, row.isRecommended !== 1);
    ElMessage.success('推荐状态已更新');
    await loadData();
};
const toggleStatus = async (row) => {
    await updatePostStatusApi(row.id, row.status === 1 ? 3 : 1);
    ElMessage.success('帖子状态已更新');
    await loadData();
};
const removePost = async (row) => {
    await ElMessageBox.confirm(`确定删除帖子《${row.title}》吗？`, '删除确认', { type: 'warning' });
    await deletePostApi(row.id);
    ElMessage.success('帖子已删除');
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
    title: "帖子管理",
    desc: "管理帖子内容、推荐状态与违规处理。",
}));
const __VLS_1 = __VLS_0({
    title: "帖子管理",
    desc: "管理帖子内容、推荐状态与违规处理。",
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
    placeholder: "搜索标题或摘要",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索标题或摘要",
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
const __VLS_15 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.status),
    clearable: true,
    placeholder: "状态",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.status),
    clearable: true,
    placeholder: "状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "已发布",
    value: (1),
}));
const __VLS_21 = __VLS_20({
    label: "已发布",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "已下架",
    value: (3),
}));
const __VLS_25 = __VLS_24({
    label: "已下架",
    value: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
var __VLS_18;
const __VLS_27 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    ...{ 'onClick': {} },
}));
const __VLS_29 = __VLS_28({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_31;
let __VLS_32;
let __VLS_33;
const __VLS_34 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_30.slots.default;
var __VLS_30;
const __VLS_35 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}));
const __VLS_37 = __VLS_36({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_38.slots.default;
const __VLS_39 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    prop: "id",
    label: "ID",
    minWidth: "120",
}));
const __VLS_41 = __VLS_40({
    prop: "id",
    label: "ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const __VLS_43 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    prop: "title",
    label: "标题",
    minWidth: "240",
    showOverflowTooltip: true,
}));
const __VLS_45 = __VLS_44({
    prop: "title",
    label: "标题",
    minWidth: "240",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const __VLS_47 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    prop: "author",
    label: "作者",
    minWidth: "120",
}));
const __VLS_49 = __VLS_48({
    prop: "author",
    label: "作者",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const __VLS_51 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    prop: "board",
    label: "板块",
    minWidth: "120",
}));
const __VLS_53 = __VLS_52({
    prop: "board",
    label: "板块",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const __VLS_55 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "状态",
    minWidth: "100",
}));
const __VLS_57 = __VLS_56({
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_58.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_59 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        type: (row.status === 1 ? 'success' : 'warning'),
    }));
    const __VLS_61 = __VLS_60({
        type: (row.status === 1 ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    __VLS_62.slots.default;
    (row.status === 1 ? '已发布' : '已下架');
    var __VLS_62;
}
var __VLS_58;
const __VLS_63 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "推荐",
    minWidth: "100",
}));
const __VLS_65 = __VLS_64({
    label: "推荐",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_66.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_67 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        type: (row.isRecommended === 1 ? 'success' : 'info'),
    }));
    const __VLS_69 = __VLS_68({
        type: (row.isRecommended === 1 ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_70.slots.default;
    (row.isRecommended === 1 ? '已推荐' : '普通');
    var __VLS_70;
}
var __VLS_66;
const __VLS_71 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    prop: "likeCount",
    label: "点赞",
    minWidth: "80",
}));
const __VLS_73 = __VLS_72({
    prop: "likeCount",
    label: "点赞",
    minWidth: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const __VLS_75 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    prop: "commentCount",
    label: "评论",
    minWidth: "80",
}));
const __VLS_77 = __VLS_76({
    prop: "commentCount",
    label: "评论",
    minWidth: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "操作",
    width: "300",
    fixed: "right",
}));
const __VLS_81 = __VLS_80({
    label: "操作",
    width: "300",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_82.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_83 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_87;
    let __VLS_88;
    let __VLS_89;
    const __VLS_90 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row.id);
        }
    };
    __VLS_86.slots.default;
    var __VLS_86;
    const __VLS_91 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_95;
    let __VLS_96;
    let __VLS_97;
    const __VLS_98 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleRecommend(row);
        }
    };
    __VLS_94.slots.default;
    (row.isRecommended === 1 ? '取消推荐' : '推荐');
    var __VLS_94;
    const __VLS_99 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_103;
    let __VLS_104;
    let __VLS_105;
    const __VLS_106 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleStatus(row);
        }
    };
    __VLS_102.slots.default;
    (row.status === 1 ? '下架' : '恢复');
    var __VLS_102;
    const __VLS_107 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_109 = __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    let __VLS_111;
    let __VLS_112;
    let __VLS_113;
    const __VLS_114 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removePost(row);
        }
    };
    __VLS_110.slots.default;
    var __VLS_110;
}
var __VLS_82;
var __VLS_38;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_115 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}));
const __VLS_117 = __VLS_116({
    ...{ 'onCurrentChange': {} },
    background: true,
    layout: "prev, pager, next, total",
    currentPage: (__VLS_ctx.pageNo),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_119;
let __VLS_120;
let __VLS_121;
const __VLS_122 = {
    onCurrentChange: (__VLS_ctx.handlePageChange)
};
var __VLS_118;
var __VLS_6;
const __VLS_123 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "编辑帖子",
    width: "700px",
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.dialogVisible),
    title: "编辑帖子",
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}));
const __VLS_129 = __VLS_128({
    model: (__VLS_ctx.form),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.detailLoading) }, null, null);
__VLS_130.slots.default;
const __VLS_131 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    label: "所属板块",
}));
const __VLS_133 = __VLS_132({
    label: "所属板块",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
const __VLS_135 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.form.boardId),
    ...{ style: {} },
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.form.boardId),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
for (const [board] of __VLS_getVForSourceType((__VLS_ctx.boards))) {
    const __VLS_139 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        key: (board.id),
        label: (board.name),
        value: (board.id),
    }));
    const __VLS_141 = __VLS_140({
        key: (board.id),
        label: (board.name),
        value: (board.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
}
var __VLS_138;
var __VLS_134;
const __VLS_143 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    label: "标题",
}));
const __VLS_145 = __VLS_144({
    label: "标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
const __VLS_147 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "150",
    showWordLimit: true,
}));
const __VLS_149 = __VLS_148({
    modelValue: (__VLS_ctx.form.title),
    maxlength: "150",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
var __VLS_146;
const __VLS_151 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    label: "摘要",
}));
const __VLS_153 = __VLS_152({
    label: "摘要",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.form.summary),
    maxlength: "300",
    showWordLimit: true,
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.form.summary),
    maxlength: "300",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
var __VLS_154;
const __VLS_159 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    label: "标签",
}));
const __VLS_161 = __VLS_160({
    label: "标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    collapseTags: true,
    ...{ style: {} },
}));
const __VLS_165 = __VLS_164({
    modelValue: (__VLS_ctx.form.tagIds),
    multiple: true,
    collapseTags: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_166.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
    const __VLS_167 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        key: (tag.id),
        label: (tag.name),
        value: (tag.id),
    }));
    const __VLS_169 = __VLS_168({
        key: (tag.id),
        label: (tag.name),
        value: (tag.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
}
var __VLS_166;
var __VLS_162;
const __VLS_171 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    label: "正文",
}));
const __VLS_173 = __VLS_172({
    label: "正文",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
__VLS_174.slots.default;
const __VLS_175 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    modelValue: (__VLS_ctx.form.contentMd),
    type: "textarea",
    rows: (10),
}));
const __VLS_177 = __VLS_176({
    modelValue: (__VLS_ctx.form.contentMd),
    type: "textarea",
    rows: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
var __VLS_174;
var __VLS_130;
{
    const { footer: __VLS_thisSlot } = __VLS_126.slots;
    const __VLS_179 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
        ...{ 'onClick': {} },
    }));
    const __VLS_181 = __VLS_180({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    let __VLS_183;
    let __VLS_184;
    let __VLS_185;
    const __VLS_186 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_182.slots.default;
    var __VLS_182;
    const __VLS_187 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_189 = __VLS_188({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
    let __VLS_191;
    let __VLS_192;
    let __VLS_193;
    const __VLS_194 = {
        onClick: (__VLS_ctx.submitEdit)
    };
    __VLS_190.slots.default;
    var __VLS_190;
}
var __VLS_126;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            detailLoading: detailLoading,
            dialogVisible: dialogVisible,
            submitting: submitting,
            keyword: keyword,
            status: status,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            rows: rows,
            boards: boards,
            tags: tags,
            form: form,
            handleSearch: handleSearch,
            handlePageChange: handlePageChange,
            openEdit: openEdit,
            submitEdit: submitEdit,
            toggleRecommend: toggleRecommend,
            toggleStatus: toggleStatus,
            removePost: removePost,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PostsPage.vue.js.map
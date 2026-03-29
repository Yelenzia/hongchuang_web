import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { deleteNotificationApi, getNotificationListApi } from '@/api/notifications';
const loading = ref(false);
const keyword = ref('');
const type = ref();
const isRead = ref();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const rows = ref([]);
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getNotificationListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, type: type.value, isRead: isRead.value });
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
const handleDelete = async (notificationId) => {
    await ElMessageBox.confirm('确定清理这条通知吗？', '清理确认', { type: 'warning' });
    await deleteNotificationApi(notificationId);
    ElMessage.success('通知已清理');
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
    title: "通知治理",
    desc: "查看收藏、评论、@提醒、关注等通知数据，并清理异常通知。",
}));
const __VLS_1 = __VLS_0({
    title: "通知治理",
    desc: "查看收藏、评论、@提醒、关注等通知数据，并清理异常通知。",
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
    placeholder: "搜索通知标题或内容",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索通知标题或内容",
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
    modelValue: (__VLS_ctx.type),
    clearable: true,
    placeholder: "通知类型",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.type),
    clearable: true,
    placeholder: "通知类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    label: "帖子收藏",
    value: "POST_FAVORITE",
}));
const __VLS_21 = __VLS_20({
    label: "帖子收藏",
    value: "POST_FAVORITE",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "帖子评论",
    value: "POST_COMMENT",
}));
const __VLS_25 = __VLS_24({
    label: "帖子评论",
    value: "POST_COMMENT",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const __VLS_27 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "评论回复",
    value: "COMMENT_REPLY",
}));
const __VLS_29 = __VLS_28({
    label: "评论回复",
    value: "COMMENT_REPLY",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const __VLS_31 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "@提醒",
    value: "COMMENT_MENTION",
}));
const __VLS_33 = __VLS_32({
    label: "@提醒",
    value: "COMMENT_MENTION",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const __VLS_35 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "用户关注",
    value: "USER_FOLLOW",
}));
const __VLS_37 = __VLS_36({
    label: "用户关注",
    value: "USER_FOLLOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const __VLS_39 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "私信",
    value: "PRIVATE_MESSAGE",
}));
const __VLS_41 = __VLS_40({
    label: "私信",
    value: "PRIVATE_MESSAGE",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const __VLS_43 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "系统消息",
    value: "SYSTEM_WARNING",
}));
const __VLS_45 = __VLS_44({
    label: "系统消息",
    value: "SYSTEM_WARNING",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_18;
const __VLS_47 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.isRead),
    clearable: true,
    placeholder: "读取状态",
    ...{ style: {} },
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.isRead),
    clearable: true,
    placeholder: "读取状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
const __VLS_51 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "未读",
    value: (0),
}));
const __VLS_53 = __VLS_52({
    label: "未读",
    value: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const __VLS_55 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "已读",
    value: (1),
}));
const __VLS_57 = __VLS_56({
    label: "已读",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
var __VLS_50;
const __VLS_59 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_63;
let __VLS_64;
let __VLS_65;
const __VLS_66 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_62.slots.default;
var __VLS_62;
const __VLS_67 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}));
const __VLS_69 = __VLS_68({
    data: (__VLS_ctx.rows),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_70.slots.default;
const __VLS_71 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    prop: "id",
    label: "ID",
    minWidth: "150",
}));
const __VLS_73 = __VLS_72({
    prop: "id",
    label: "ID",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const __VLS_75 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "接收用户",
    minWidth: "180",
}));
const __VLS_77 = __VLS_76({
    label: "接收用户",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_78.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.nickname || row.username || '-');
    if (row.username) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "sub" },
        });
        (row.username);
    }
}
var __VLS_78;
const __VLS_79 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    prop: "type",
    label: "类型",
    minWidth: "150",
}));
const __VLS_81 = __VLS_80({
    prop: "type",
    label: "类型",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const __VLS_83 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_85 = __VLS_84({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const __VLS_87 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    prop: "content",
    label: "内容",
    minWidth: "260",
    showOverflowTooltip: true,
}));
const __VLS_89 = __VLS_88({
    prop: "content",
    label: "内容",
    minWidth: "260",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const __VLS_91 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "状态",
    minWidth: "100",
}));
const __VLS_93 = __VLS_92({
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_94.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_95 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        type: (row.isRead === 1 ? 'success' : 'warning'),
    }));
    const __VLS_97 = __VLS_96({
        type: (row.isRead === 1 ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    __VLS_98.slots.default;
    (row.isRead === 1 ? '已读' : '未读');
    var __VLS_98;
}
var __VLS_94;
const __VLS_99 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "180",
}));
const __VLS_101 = __VLS_100({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const __VLS_103 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "操作",
    width: "140",
    fixed: "right",
}));
const __VLS_105 = __VLS_104({
    label: "操作",
    width: "140",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_106.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
            __VLS_ctx.handleDelete(row.id);
        }
    };
    __VLS_110.slots.default;
    var __VLS_110;
}
var __VLS_106;
var __VLS_70;
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
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            loading: loading,
            keyword: keyword,
            type: type,
            isRead: isRead,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            rows: rows,
            handleSearch: handleSearch,
            handlePageChange: handlePageChange,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=NotificationsPage.vue.js.map
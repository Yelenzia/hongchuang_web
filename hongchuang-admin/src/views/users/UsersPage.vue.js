import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { grantAchievementApi, getUserAchievementsApi } from '@/api/achievements';
import { banUserApi, getUserDetailApi, getUserListApi, resetUserPasswordApi, unbanUserApi, updateUserIdentityApi, updateUserRoleApi } from '@/api/users';
const businessCards = ['管理员', '创作者', '开发者', '设计师', 'BOSS'];
const loading = ref(false);
const submitting = ref(false);
const keyword = ref('');
const status = ref();
const pageNo = ref(1);
const pageSize = 10;
const total = ref(0);
const rows = ref([]);
const detailVisible = ref(false);
const passwordDialogVisible = ref(false);
const detail = ref(null);
const passwordUserId = ref(null);
const newPassword = ref('');
const userAchievements = ref([]);
const grantCode = ref('');
const identityForm = reactive({ businessCard: '', userLevel: 1 });
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await getUserListApi({ pageNo: pageNo.value, pageSize, keyword: keyword.value || undefined, status: status.value });
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
const toggleBan = async (row) => {
    await ElMessageBox.confirm(`确定${row.status === 1 ? '封禁' : '解封'}用户 ${row.username} 吗？`, '操作确认', { type: 'warning' });
    if (row.status === 1) {
        await banUserApi(row.id);
        ElMessage.success('用户已封禁');
    }
    else {
        await unbanUserApi(row.id);
        ElMessage.success('用户已解封');
    }
    await loadData();
    if (detail.value?.id === row.id) {
        await openDetail(row.id);
    }
};
const openDetail = async (userId) => {
    const [{ data }, { data: achievements }] = await Promise.all([
        getUserDetailApi(userId),
        getUserAchievementsApi(userId)
    ]);
    detail.value = data;
    identityForm.businessCard = data.businessCard || null;
    identityForm.userLevel = data.userLevel || 1;
    userAchievements.value = achievements;
    grantCode.value = '';
    detailVisible.value = true;
};
const saveRole = async () => {
    if (!detail.value)
        return;
    await updateUserRoleApi(detail.value.id, detail.value.role);
    ElMessage.success('角色已更新');
    await loadData();
    await openDetail(detail.value.id);
};
const saveIdentity = async () => {
    if (!detail.value)
        return;
    await updateUserIdentityApi(detail.value.id, identityForm.businessCard || null, identityForm.userLevel);
    ElMessage.success('名片与等级已更新');
    await loadData();
    await openDetail(detail.value.id);
};
const grantAchievement = async () => {
    if (!detail.value || !grantCode.value)
        return;
    await grantAchievementApi(detail.value.id, grantCode.value);
    ElMessage.success('成就已发放');
    await openDetail(detail.value.id);
    await loadData();
};
const openResetPassword = (row) => {
    passwordUserId.value = row.id;
    newPassword.value = '';
    passwordDialogVisible.value = true;
};
const submitResetPassword = async () => {
    if (!passwordUserId.value)
        return;
    if (newPassword.value.trim().length < 8) {
        ElMessage.warning('新密码至少 8 位');
        return;
    }
    submitting.value = true;
    try {
        await resetUserPasswordApi(passwordUserId.value, newPassword.value.trim());
        ElMessage.success('密码已重置');
        passwordDialogVisible.value = false;
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
/** @type {__VLS_StyleScopedClasses['role-box']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['achievement-box']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "用户管理",
    desc: "管理注册用户、UID、签名、名片、等级、角色与账号状态。",
}));
const __VLS_1 = __VLS_0({
    title: "用户管理",
    desc: "管理注册用户、UID、签名、名片、等级、角色与账号状态。",
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
    placeholder: "搜索用户名或邮箱",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索用户名或邮箱",
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
    label: "正常",
    value: (1),
}));
const __VLS_21 = __VLS_20({
    label: "正常",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "封禁",
    value: (2),
}));
const __VLS_25 = __VLS_24({
    label: "封禁",
    value: (2),
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
    label: "系统ID",
    minWidth: "120",
}));
const __VLS_41 = __VLS_40({
    prop: "id",
    label: "系统ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const __VLS_43 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    prop: "forumUid",
    label: "UID",
    minWidth: "120",
}));
const __VLS_45 = __VLS_44({
    prop: "forumUid",
    label: "UID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const __VLS_47 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    prop: "username",
    label: "用户名",
    minWidth: "140",
}));
const __VLS_49 = __VLS_48({
    prop: "username",
    label: "用户名",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const __VLS_51 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    prop: "email",
    label: "邮箱",
    minWidth: "220",
}));
const __VLS_53 = __VLS_52({
    prop: "email",
    label: "邮箱",
    minWidth: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const __VLS_55 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    prop: "businessCard",
    label: "名片",
    minWidth: "120",
}));
const __VLS_57 = __VLS_56({
    prop: "businessCard",
    label: "名片",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
const __VLS_59 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    label: "等级",
    minWidth: "100",
}));
const __VLS_61 = __VLS_60({
    label: "等级",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_62.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.userLevel || 1);
}
var __VLS_62;
const __VLS_63 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    prop: "role",
    label: "角色",
    minWidth: "100",
}));
const __VLS_65 = __VLS_64({
    prop: "role",
    label: "角色",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const __VLS_67 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "状态",
    minWidth: "100",
}));
const __VLS_69 = __VLS_68({
    label: "状态",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_70.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_71 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        type: (row.status === 1 ? 'success' : 'danger'),
    }));
    const __VLS_73 = __VLS_72({
        type: (row.status === 1 ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    __VLS_74.slots.default;
    (row.status === 1 ? '正常' : '封禁');
    var __VLS_74;
}
var __VLS_70;
const __VLS_75 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    prop: "achievementCount",
    label: "成就数",
    minWidth: "100",
}));
const __VLS_77 = __VLS_76({
    prop: "achievementCount",
    label: "成就数",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
const __VLS_79 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    prop: "postCount",
    label: "发帖数",
    minWidth: "100",
}));
const __VLS_81 = __VLS_80({
    prop: "postCount",
    label: "发帖数",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const __VLS_83 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    prop: "commentCount",
    label: "评论数",
    minWidth: "100",
}));
const __VLS_85 = __VLS_84({
    prop: "commentCount",
    label: "评论数",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const __VLS_87 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "操作",
    width: "260",
    fixed: "right",
}));
const __VLS_89 = __VLS_88({
    label: "操作",
    width: "260",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_90.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_91 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_95;
    let __VLS_96;
    let __VLS_97;
    const __VLS_98 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row.id);
        }
    };
    __VLS_94.slots.default;
    var __VLS_94;
    const __VLS_99 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_103;
    let __VLS_104;
    let __VLS_105;
    const __VLS_106 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleBan(row);
        }
    };
    __VLS_102.slots.default;
    (row.status === 1 ? '封禁' : '解封');
    var __VLS_102;
    const __VLS_107 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_109 = __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    let __VLS_111;
    let __VLS_112;
    let __VLS_113;
    const __VLS_114 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openResetPassword(row);
        }
    };
    __VLS_110.slots.default;
    var __VLS_110;
}
var __VLS_90;
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
const __VLS_123 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    modelValue: (__VLS_ctx.detailVisible),
    size: "620px",
    title: "用户详情",
}));
const __VLS_125 = __VLS_124({
    modelValue: (__VLS_ctx.detailVisible),
    size: "620px",
    title: "用户详情",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
if (__VLS_ctx.detail) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-wrap" },
    });
    const __VLS_127 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        column: (1),
        border: true,
    }));
    const __VLS_129 = __VLS_128({
        column: (1),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    const __VLS_131 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        label: "系统ID",
    }));
    const __VLS_133 = __VLS_132({
        label: "系统ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    __VLS_134.slots.default;
    (__VLS_ctx.detail.id);
    var __VLS_134;
    const __VLS_135 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
        label: "UID",
    }));
    const __VLS_137 = __VLS_136({
        label: "UID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_138.slots.default;
    (__VLS_ctx.detail.forumUid || '-');
    var __VLS_138;
    const __VLS_139 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        label: "用户名",
    }));
    const __VLS_141 = __VLS_140({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    __VLS_142.slots.default;
    (__VLS_ctx.detail.username);
    var __VLS_142;
    const __VLS_143 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        label: "昵称",
    }));
    const __VLS_145 = __VLS_144({
        label: "昵称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    __VLS_146.slots.default;
    (__VLS_ctx.detail.nickname || '-');
    var __VLS_146;
    const __VLS_147 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        label: "邮箱",
    }));
    const __VLS_149 = __VLS_148({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    __VLS_150.slots.default;
    (__VLS_ctx.detail.email);
    var __VLS_150;
    const __VLS_151 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        label: "注册时间",
    }));
    const __VLS_153 = __VLS_152({
        label: "注册时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    __VLS_154.slots.default;
    (__VLS_ctx.detail.registerTime);
    var __VLS_154;
    const __VLS_155 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        label: "最后登录",
    }));
    const __VLS_157 = __VLS_156({
        label: "最后登录",
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    __VLS_158.slots.default;
    (__VLS_ctx.detail.lastLoginAt || '-');
    var __VLS_158;
    const __VLS_159 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
        label: "发帖数",
    }));
    const __VLS_161 = __VLS_160({
        label: "发帖数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    __VLS_162.slots.default;
    (__VLS_ctx.detail.postCount);
    var __VLS_162;
    const __VLS_163 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
        label: "评论数",
    }));
    const __VLS_165 = __VLS_164({
        label: "评论数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    __VLS_166.slots.default;
    (__VLS_ctx.detail.commentCount);
    var __VLS_166;
    const __VLS_167 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        label: "签名",
    }));
    const __VLS_169 = __VLS_168({
        label: "签名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    __VLS_170.slots.default;
    (__VLS_ctx.detail.signature || '-');
    var __VLS_170;
    const __VLS_171 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
        label: "个人简介",
    }));
    const __VLS_173 = __VLS_172({
        label: "个人简介",
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    __VLS_174.slots.default;
    (__VLS_ctx.detail.bio || '-');
    var __VLS_174;
    var __VLS_130;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label" },
    });
    const __VLS_175 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        modelValue: (__VLS_ctx.detail.role),
        ...{ style: {} },
    }));
    const __VLS_177 = __VLS_176({
        modelValue: (__VLS_ctx.detail.role),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    __VLS_178.slots.default;
    const __VLS_179 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
        label: "USER",
        value: "USER",
    }));
    const __VLS_181 = __VLS_180({
        label: "USER",
        value: "USER",
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    const __VLS_183 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        label: "ADMIN",
        value: "ADMIN",
    }));
    const __VLS_185 = __VLS_184({
        label: "ADMIN",
        value: "ADMIN",
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    var __VLS_178;
    const __VLS_187 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_189 = __VLS_188({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
    let __VLS_191;
    let __VLS_192;
    let __VLS_193;
    const __VLS_194 = {
        onClick: (__VLS_ctx.saveRole)
    };
    __VLS_190.slots.default;
    var __VLS_190;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label" },
    });
    const __VLS_195 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
        modelValue: (__VLS_ctx.identityForm.businessCard),
        clearable: true,
        placeholder: "选择名片",
        ...{ style: {} },
    }));
    const __VLS_197 = __VLS_196({
        modelValue: (__VLS_ctx.identityForm.businessCard),
        clearable: true,
        placeholder: "选择名片",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    __VLS_198.slots.default;
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.businessCards))) {
        const __VLS_199 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
            key: (item),
            label: (item),
            value: (item),
        }));
        const __VLS_201 = __VLS_200({
            key: (item),
            label: (item),
            value: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    }
    var __VLS_198;
    const __VLS_203 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
        modelValue: (__VLS_ctx.identityForm.userLevel),
        placeholder: "等级",
        ...{ style: {} },
    }));
    const __VLS_205 = __VLS_204({
        modelValue: (__VLS_ctx.identityForm.userLevel),
        placeholder: "等级",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    __VLS_206.slots.default;
    for (const [n] of __VLS_getVForSourceType((9))) {
        const __VLS_207 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
            key: (n),
            label: (`Lv${n}用户`),
            value: (n),
        }));
        const __VLS_209 = __VLS_208({
            key: (n),
            label: (`Lv${n}用户`),
            value: (n),
        }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    }
    var __VLS_206;
    const __VLS_211 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
        ...{ 'onClick': {} },
        type: "success",
    }));
    const __VLS_213 = __VLS_212({
        ...{ 'onClick': {} },
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    let __VLS_215;
    let __VLS_216;
    let __VLS_217;
    const __VLS_218 = {
        onClick: (__VLS_ctx.saveIdentity)
    };
    __VLS_214.slots.default;
    var __VLS_214;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "achievement-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "achievement-list" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.userAchievements.filter(i => i.obtained)))) {
        const __VLS_219 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
            key: (item.id),
            ...{ style: ({ borderColor: item.color || '#22c55e', color: item.color || '#22c55e' }) },
        }));
        const __VLS_221 = __VLS_220({
            key: (item.id),
            ...{ style: ({ borderColor: item.color || '#22c55e', color: item.color || '#22c55e' }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_220));
        __VLS_222.slots.default;
        (item.name);
        var __VLS_222;
    }
    if (__VLS_ctx.userAchievements.filter(i => i.obtained).length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "empty" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grant-row" },
    });
    const __VLS_223 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
        modelValue: (__VLS_ctx.grantCode),
        placeholder: "选择要发放的成就",
        ...{ style: {} },
    }));
    const __VLS_225 = __VLS_224({
        modelValue: (__VLS_ctx.grantCode),
        placeholder: "选择要发放的成就",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
    __VLS_226.slots.default;
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.userAchievements.filter(i => !i.obtained)))) {
        const __VLS_227 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
            key: (item.id),
            label: (item.name),
            value: (item.code),
        }));
        const __VLS_229 = __VLS_228({
            key: (item.id),
            label: (item.name),
            value: (item.code),
        }, ...__VLS_functionalComponentArgsRest(__VLS_228));
    }
    var __VLS_226;
    const __VLS_231 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
        ...{ 'onClick': {} },
        type: "success",
        disabled: (!__VLS_ctx.grantCode),
    }));
    const __VLS_233 = __VLS_232({
        ...{ 'onClick': {} },
        type: "success",
        disabled: (!__VLS_ctx.grantCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    let __VLS_235;
    let __VLS_236;
    let __VLS_237;
    const __VLS_238 = {
        onClick: (__VLS_ctx.grantAchievement)
    };
    __VLS_234.slots.default;
    var __VLS_234;
}
var __VLS_126;
const __VLS_239 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
    modelValue: (__VLS_ctx.passwordDialogVisible),
    title: "重置用户密码",
    width: "420px",
}));
const __VLS_241 = __VLS_240({
    modelValue: (__VLS_ctx.passwordDialogVisible),
    title: "重置用户密码",
    width: "420px",
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
__VLS_242.slots.default;
const __VLS_243 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
    labelPosition: "top",
}));
const __VLS_245 = __VLS_244({
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
__VLS_246.slots.default;
const __VLS_247 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    label: "新密码",
}));
const __VLS_249 = __VLS_248({
    label: "新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
__VLS_250.slots.default;
const __VLS_251 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
    modelValue: (__VLS_ctx.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "至少 8 位",
}));
const __VLS_253 = __VLS_252({
    modelValue: (__VLS_ctx.newPassword),
    type: "password",
    showPassword: true,
    placeholder: "至少 8 位",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
var __VLS_250;
var __VLS_246;
{
    const { footer: __VLS_thisSlot } = __VLS_242.slots;
    const __VLS_255 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
        ...{ 'onClick': {} },
    }));
    const __VLS_257 = __VLS_256({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_256));
    let __VLS_259;
    let __VLS_260;
    let __VLS_261;
    const __VLS_262 = {
        onClick: (...[$event]) => {
            __VLS_ctx.passwordDialogVisible = false;
        }
    };
    __VLS_258.slots.default;
    var __VLS_258;
    const __VLS_263 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_265 = __VLS_264({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_264));
    let __VLS_267;
    let __VLS_268;
    let __VLS_269;
    const __VLS_270 = {
        onClick: (__VLS_ctx.submitResetPassword)
    };
    __VLS_266.slots.default;
    var __VLS_266;
}
var __VLS_242;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['role-box']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['role-box']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['achievement-box']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['achievement-list']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['grant-row']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            businessCards: businessCards,
            loading: loading,
            submitting: submitting,
            keyword: keyword,
            status: status,
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            rows: rows,
            detailVisible: detailVisible,
            passwordDialogVisible: passwordDialogVisible,
            detail: detail,
            newPassword: newPassword,
            userAchievements: userAchievements,
            grantCode: grantCode,
            identityForm: identityForm,
            handleSearch: handleSearch,
            handlePageChange: handlePageChange,
            toggleBan: toggleBan,
            openDetail: openDetail,
            saveRole: saveRole,
            saveIdentity: saveIdentity,
            grantAchievement: grantAchievement,
            openResetPassword: openResetPassword,
            submitResetPassword: submitResetPassword,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=UsersPage.vue.js.map
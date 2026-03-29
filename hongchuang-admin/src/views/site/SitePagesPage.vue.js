import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import PageHeader from '@/components/layout/PageHeader.vue';
import { createAdminSitePageApi, getAdminSitePageListApi, updateAdminSitePageApi, updateAdminSitePageStatusApi } from '@/api/site';
const activeTab = ref('HOME');
const saving = ref(false);
const homeId = ref('');
const contactId = ref('');
const homeEnabled = ref(true);
const contactEnabled = ref(true);
const homeMeta = reactive({ pageName: '官网首页', title: '为 AI 与 Minecraft 创作打造更完整的社区与创作平台', subtitle: '鸿创工作室是以 AI + MC 为主要发展方向的我的世界工作室，致力于探索 AI 模型、AI 贴图、AI 插件等方向的创新应用。' });
const contactMeta = reactive({ pageName: '团队联系', title: '团队联系', subtitle: '如果您有需要，可通过以下方式联系我们。技术部成员信息已重新整理排版。' });
const homeForm = reactive({
    badgeText: 'AI + Minecraft Studio',
    heroButtons: [
        { text: '进入论坛', link: '/forum', type: 'primary' },
        { text: '资源中心', link: '/resources', type: 'plain' },
        { text: '了解更多', link: '/contact', type: 'plain' }
    ],
    directions: [
        { name: 'AI模型', desc: '智能生成、推理与内容创作能力整合。', style: 'grass' },
        { name: 'AI贴图', desc: '服务贴图、模型与视觉资产创作场景。', style: 'stone' },
        { name: 'AI插件平台', desc: '为服主与开发者提供更高效的插件生态入口。', style: 'grass' },
        { name: '创作者社区', desc: '连接玩家、服主、开发者与内容创作者的交流协作空间。', style: 'ore' }
    ],
    capabilities: [
        { title: 'AI模型', desc: '面向内容创作、资源生成与创意辅助场景的模型能力预留。' },
        { title: 'AI贴图', desc: '适配 Minecraft 风格素材产出与视觉资产管理。' },
        { title: 'AI插件平台', desc: '面向开发者与服主的插件分发、展示与社区讨论入口。' },
        { title: '社区协作', desc: '支持论坛讨论、私信沟通、资源展示与内容协作。' }
    ]
});
const contactForm = reactive({
    qqGroup: '856418269',
    ownerEmail: '2930255795@qq.com',
    brandText: '鸿创工作室 · AI + MC 创作与社区平台',
    copyrightText: '© 2026 鸿创工作室. All Rights Reserved.',
    members: [
        { name: '叶子', contact: '邮箱：Yelenas@qq.com' },
        { name: '蓝技术', contact: '邮箱：1738964540@qq.com' }
    ]
});
const assignHome = (item) => {
    homeId.value = item.id;
    homeEnabled.value = item.status === 1;
    homeMeta.pageName = item.pageName || '官网首页';
    homeMeta.title = item.title || homeMeta.title;
    homeMeta.subtitle = item.subtitle || homeMeta.subtitle;
    const content = JSON.parse(item.contentJson || '{}');
    homeForm.badgeText = content.badgeText || homeForm.badgeText;
    homeForm.heroButtons.splice(0, homeForm.heroButtons.length, ...(Array.isArray(content.heroButtons) && content.heroButtons.length ? content.heroButtons : homeForm.heroButtons));
    homeForm.directions.splice(0, homeForm.directions.length, ...(Array.isArray(content.directions) && content.directions.length ? content.directions : homeForm.directions));
    homeForm.capabilities.splice(0, homeForm.capabilities.length, ...(Array.isArray(content.capabilities) && content.capabilities.length ? content.capabilities : homeForm.capabilities));
};
const assignContact = (item) => {
    contactId.value = item.id;
    contactEnabled.value = item.status === 1;
    contactMeta.pageName = item.pageName || '团队联系';
    contactMeta.title = item.title || contactMeta.title;
    contactMeta.subtitle = item.subtitle || contactMeta.subtitle;
    const content = JSON.parse(item.contentJson || '{}');
    contactForm.qqGroup = content.qqGroup || contactForm.qqGroup;
    contactForm.ownerEmail = content.ownerEmail || contactForm.ownerEmail;
    contactForm.brandText = content.brandText || contactForm.brandText;
    contactForm.copyrightText = content.copyrightText || contactForm.copyrightText;
    contactForm.members.splice(0, contactForm.members.length, ...(Array.isArray(content.members) && content.members.length ? content.members : contactForm.members));
};
const loadData = async () => {
    const { data } = await getAdminSitePageListApi({ pageNo: 1, pageSize: 20 });
    const rows = data.records || [];
    const home = rows.find((item) => item.pageCode === 'HOME');
    const contact = rows.find((item) => item.pageCode === 'CONTACT');
    if (home)
        assignHome(home);
    if (contact)
        assignContact(contact);
};
const savePage = async (payload, id, enabled) => {
    if (id) {
        await updateAdminSitePageApi(id, payload);
        await updateAdminSitePageStatusApi(id, enabled ? 1 : 0);
    }
    else {
        await createAdminSitePageApi(payload);
    }
};
const saveHome = async () => {
    saving.value = true;
    try {
        await savePage({
            pageCode: 'HOME',
            pageName: homeMeta.pageName,
            title: homeMeta.title,
            subtitle: homeMeta.subtitle,
            contentJson: JSON.stringify(homeForm),
            status: homeEnabled.value ? 1 : 0,
            sortOrder: 10
        }, homeId.value, homeEnabled.value);
        ElMessage.success('首页配置已保存');
        await loadData();
    }
    finally {
        saving.value = false;
    }
};
const saveContact = async () => {
    saving.value = true;
    try {
        await savePage({
            pageCode: 'CONTACT',
            pageName: contactMeta.pageName,
            title: contactMeta.title,
            subtitle: contactMeta.subtitle,
            contentJson: JSON.stringify(contactForm),
            status: contactEnabled.value ? 1 : 0,
            sortOrder: 20
        }, contactId.value, contactEnabled.value);
        ElMessage.success('联系页配置已保存');
        await loadData();
    }
    finally {
        saving.value = false;
    }
};
const addContactMember = () => {
    contactForm.members.push({ name: '', contact: '' });
};
const removeContactMember = (index) => {
    contactForm.members.splice(index, 1);
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-member']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof PageHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(PageHeader, new PageHeader({
    title: "官网配置",
    desc: "通过后台维护首页与团队联系页，不再每次改文案都改前端代码。",
}));
const __VLS_1 = __VLS_0({
    title: "官网配置",
    desc: "通过后台维护首页与团队联系页，不再每次改文案都改前端代码。",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
const __VLS_3 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    type: "info",
    closable: (false),
    ...{ class: "tip" },
    showIcon: true,
}));
const __VLS_5 = __VLS_4({
    type: "info",
    closable: (false),
    ...{ class: "tip" },
    showIcon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
var __VLS_6;
const __VLS_7 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_9 = __VLS_8({
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
const __VLS_11 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
    label: "首页配置",
    name: "HOME",
}));
const __VLS_13 = __VLS_12({
    label: "首页配置",
    name: "HOME",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-sub" },
});
const __VLS_19 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.homeEnabled),
    inlinePrompt: true,
    activeText: "启用",
    inactiveText: "禁用",
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.homeEnabled),
    inlinePrompt: true,
    activeText: "启用",
    inactiveText: "禁用",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const __VLS_23 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    model: (__VLS_ctx.homeForm),
    labelPosition: "top",
}));
const __VLS_25 = __VLS_24({
    model: (__VLS_ctx.homeForm),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_27 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    label: "页面名称",
}));
const __VLS_29 = __VLS_28({
    label: "页面名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.homeMeta.pageName),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.homeMeta.pageName),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
var __VLS_30;
const __VLS_35 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "Badge 文案",
}));
const __VLS_37 = __VLS_36({
    label: "Badge 文案",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
const __VLS_39 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    modelValue: (__VLS_ctx.homeForm.badgeText),
}));
const __VLS_41 = __VLS_40({
    modelValue: (__VLS_ctx.homeForm.badgeText),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
var __VLS_38;
const __VLS_43 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "主标题",
}));
const __VLS_45 = __VLS_44({
    label: "主标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.homeMeta.title),
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.homeMeta.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
var __VLS_46;
const __VLS_51 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "副标题",
}));
const __VLS_53 = __VLS_52({
    label: "副标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    modelValue: (__VLS_ctx.homeMeta.subtitle),
    type: "textarea",
    rows: (4),
}));
const __VLS_57 = __VLS_56({
    modelValue: (__VLS_ctx.homeMeta.subtitle),
    type: "textarea",
    rows: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
var __VLS_54;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-head" },
});
for (const [button, index] of __VLS_getVForSourceType((__VLS_ctx.homeForm.heroButtons))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "array-row grid-3" },
    });
    const __VLS_59 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        modelValue: (button.text),
        placeholder: "按钮文案",
    }));
    const __VLS_61 = __VLS_60({
        modelValue: (button.text),
        placeholder: "按钮文案",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    const __VLS_63 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        modelValue: (button.link),
        placeholder: "链接，例如 /forum",
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (button.link),
        placeholder: "链接，例如 /forum",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const __VLS_67 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
        modelValue: (button.type),
        placeholder: "按钮样式",
    }));
    const __VLS_69 = __VLS_68({
        modelValue: (button.type),
        placeholder: "按钮样式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_70.slots.default;
    const __VLS_71 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        label: "主按钮",
        value: "primary",
    }));
    const __VLS_73 = __VLS_72({
        label: "主按钮",
        value: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    const __VLS_75 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        label: "次按钮",
        value: "plain",
    }));
    const __VLS_77 = __VLS_76({
        label: "次按钮",
        value: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    var __VLS_70;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-head" },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.homeForm.directions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "array-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-3" },
    });
    const __VLS_79 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        modelValue: (item.name),
        placeholder: "名称",
    }));
    const __VLS_81 = __VLS_80({
        modelValue: (item.name),
        placeholder: "名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    const __VLS_83 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        modelValue: (item.desc),
        placeholder: "描述",
    }));
    const __VLS_85 = __VLS_84({
        modelValue: (item.desc),
        placeholder: "描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    const __VLS_87 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        modelValue: (item.style),
    }));
    const __VLS_89 = __VLS_88({
        modelValue: (item.style),
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    __VLS_90.slots.default;
    const __VLS_91 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
        label: "草方块",
        value: "grass",
    }));
    const __VLS_93 = __VLS_92({
        label: "草方块",
        value: "grass",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    const __VLS_95 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        label: "石块",
        value: "stone",
    }));
    const __VLS_97 = __VLS_96({
        label: "石块",
        value: "stone",
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const __VLS_99 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
        label: "矿石",
        value: "ore",
    }));
    const __VLS_101 = __VLS_100({
        label: "矿石",
        value: "ore",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    var __VLS_90;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-head" },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.homeForm.capabilities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "array-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-2" },
    });
    const __VLS_103 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        modelValue: (item.title),
        placeholder: "标题",
    }));
    const __VLS_105 = __VLS_104({
        modelValue: (item.title),
        placeholder: "标题",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    const __VLS_107 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
        modelValue: (item.desc),
        placeholder: "描述",
    }));
    const __VLS_109 = __VLS_108({
        modelValue: (item.desc),
        placeholder: "描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_111 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_113 = __VLS_112({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_115;
let __VLS_116;
let __VLS_117;
const __VLS_118 = {
    onClick: (__VLS_ctx.saveHome)
};
__VLS_114.slots.default;
var __VLS_114;
var __VLS_26;
var __VLS_18;
var __VLS_14;
const __VLS_119 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    label: "联系页配置",
    name: "CONTACT",
}));
const __VLS_121 = __VLS_120({
    label: "联系页配置",
    name: "CONTACT",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
const __VLS_123 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({}));
const __VLS_125 = __VLS_124({}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-sub" },
});
const __VLS_127 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    modelValue: (__VLS_ctx.contactEnabled),
    inlinePrompt: true,
    activeText: "启用",
    inactiveText: "禁用",
}));
const __VLS_129 = __VLS_128({
    modelValue: (__VLS_ctx.contactEnabled),
    inlinePrompt: true,
    activeText: "启用",
    inactiveText: "禁用",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const __VLS_131 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    model: (__VLS_ctx.contactForm),
    labelPosition: "top",
}));
const __VLS_133 = __VLS_132({
    model: (__VLS_ctx.contactForm),
    labelPosition: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_135 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "页面名称",
}));
const __VLS_137 = __VLS_136({
    label: "页面名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
const __VLS_139 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    modelValue: (__VLS_ctx.contactMeta.pageName),
}));
const __VLS_141 = __VLS_140({
    modelValue: (__VLS_ctx.contactMeta.pageName),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
var __VLS_138;
const __VLS_143 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    label: "页面标题",
}));
const __VLS_145 = __VLS_144({
    label: "页面标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
const __VLS_147 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
    modelValue: (__VLS_ctx.contactMeta.title),
}));
const __VLS_149 = __VLS_148({
    modelValue: (__VLS_ctx.contactMeta.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
var __VLS_146;
const __VLS_151 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    label: "页面说明",
}));
const __VLS_153 = __VLS_152({
    label: "页面说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.contactMeta.subtitle),
    type: "textarea",
    rows: (3),
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.contactMeta.subtitle),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
var __VLS_154;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_159 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    label: "QQ 群",
}));
const __VLS_161 = __VLS_160({
    label: "QQ 群",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
const __VLS_163 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    modelValue: (__VLS_ctx.contactForm.qqGroup),
}));
const __VLS_165 = __VLS_164({
    modelValue: (__VLS_ctx.contactForm.qqGroup),
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
var __VLS_162;
const __VLS_167 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "负责人邮箱",
}));
const __VLS_169 = __VLS_168({
    label: "负责人邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
__VLS_170.slots.default;
const __VLS_171 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    modelValue: (__VLS_ctx.contactForm.ownerEmail),
}));
const __VLS_173 = __VLS_172({
    modelValue: (__VLS_ctx.contactForm.ownerEmail),
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
var __VLS_170;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-2" },
});
const __VLS_175 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    label: "品牌文案",
}));
const __VLS_177 = __VLS_176({
    label: "品牌文案",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
const __VLS_179 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    modelValue: (__VLS_ctx.contactForm.brandText),
}));
const __VLS_181 = __VLS_180({
    modelValue: (__VLS_ctx.contactForm.brandText),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
var __VLS_178;
const __VLS_183 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    label: "版权文案",
}));
const __VLS_185 = __VLS_184({
    label: "版权文案",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
__VLS_186.slots.default;
const __VLS_187 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    modelValue: (__VLS_ctx.contactForm.copyrightText),
}));
const __VLS_189 = __VLS_188({
    modelValue: (__VLS_ctx.contactForm.copyrightText),
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
var __VLS_186;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-header inner" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-head" },
});
const __VLS_191 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
    ...{ 'onClick': {} },
}));
const __VLS_193 = __VLS_192({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
let __VLS_195;
let __VLS_196;
let __VLS_197;
const __VLS_198 = {
    onClick: (__VLS_ctx.addContactMember)
};
__VLS_194.slots.default;
var __VLS_194;
for (const [member, index] of __VLS_getVForSourceType((__VLS_ctx.contactForm.members))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "array-card member-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-member" },
    });
    const __VLS_199 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
        modelValue: (member.name),
        placeholder: "成员名称",
    }));
    const __VLS_201 = __VLS_200({
        modelValue: (member.name),
        placeholder: "成员名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_200));
    const __VLS_203 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
        modelValue: (member.contact),
        placeholder: "联系方式",
    }));
    const __VLS_205 = __VLS_204({
        modelValue: (member.contact),
        placeholder: "联系方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    const __VLS_207 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
    }));
    const __VLS_209 = __VLS_208({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    let __VLS_211;
    let __VLS_212;
    let __VLS_213;
    const __VLS_214 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeContactMember(index);
        }
    };
    __VLS_210.slots.default;
    var __VLS_210;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_215 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}));
const __VLS_217 = __VLS_216({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
let __VLS_219;
let __VLS_220;
let __VLS_221;
const __VLS_222 = {
    onClick: (__VLS_ctx.saveContact)
};
__VLS_218.slots.default;
var __VLS_218;
var __VLS_134;
var __VLS_126;
var __VLS_122;
var __VLS_10;
/** @type {__VLS_StyleScopedClasses['tip']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-head']} */ ;
/** @type {__VLS_StyleScopedClasses['array-row']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-head']} */ ;
/** @type {__VLS_StyleScopedClasses['array-card']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-head']} */ ;
/** @type {__VLS_StyleScopedClasses['array-card']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['inner']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-head']} */ ;
/** @type {__VLS_StyleScopedClasses['array-card']} */ ;
/** @type {__VLS_StyleScopedClasses['member-card']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-member']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PageHeader: PageHeader,
            activeTab: activeTab,
            saving: saving,
            homeEnabled: homeEnabled,
            contactEnabled: contactEnabled,
            homeMeta: homeMeta,
            contactMeta: contactMeta,
            homeForm: homeForm,
            contactForm: contactForm,
            saveHome: saveHome,
            saveContact: saveContact,
            addContactMember: addContactMember,
            removeContactMember: removeContactMember,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SitePagesPage.vue.js.map
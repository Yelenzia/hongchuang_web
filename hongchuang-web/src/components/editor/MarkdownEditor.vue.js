import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import MarkdownPreview from './MarkdownPreview.vue';
import { uploadEditorImageApi, uploadPostFileApi } from '@/api/upload';
const props = withDefaults(defineProps(), {
    placeholder: '支持 Markdown、图片上传、代码块、表格与预览模式'
});
const emit = defineEmits();
const tab = ref('edit');
const fullscreen = ref(false);
const textareaRef = ref();
const tableSnippet = '| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |';
const codeSnippet = '```java\nSystem.out.println("Hello");\n```';
const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
};
const updateValue = (value) => emit('update:modelValue', value);
const insertAtCursor = (snippet) => {
    const textarea = textareaRef.value;
    const current = props.modelValue || '';
    if (!textarea) {
        updateValue(`${current}${current && !current.endsWith('\n') ? '\n' : ''}${snippet}`);
        return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const next = `${current.slice(0, start)}${snippet}${current.slice(end)}`;
    updateValue(next);
    requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + snippet.length;
        textarea.setSelectionRange(cursor, cursor);
    });
};
const insertAround = (before, after) => {
    const textarea = textareaRef.value;
    const current = props.modelValue || '';
    if (!textarea) {
        insertAtCursor(`${before}文本${after}`);
        return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = current.slice(start, end) || '文本';
    const snippet = `${before}${selected}${after}`;
    const next = `${current.slice(0, start)}${snippet}${current.slice(end)}`;
    updateValue(next);
    requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
};
const handleImageUpload = async (uploadFile) => {
    const raw = uploadFile.raw;
    if (!raw)
        return;
    const { data } = await uploadEditorImageApi(raw);
    insertAtCursor(`${props.modelValue && !props.modelValue.endsWith('\n') ? '\n' : ''}${data.markdown || `![](${data.url})`}\n`);
    ElMessage.success('图片上传成功');
};
const handleFileUpload = async (uploadFile) => {
    const raw = uploadFile.raw;
    if (!raw)
        return;
    const { data } = await uploadPostFileApi(raw);
    insertAtCursor(`${props.modelValue && !props.modelValue.endsWith('\n') ? '\n' : ''}${data.markdown || `[附件：${data.name}](${data.url})`}\n`);
    ElMessage.success('附件上传成功');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    placeholder: '支持 Markdown、图片上传、代码块、表格与预览模式'
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['markdown-editor']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: (['markdown-editor', { fullscreen: __VLS_ctx.fullscreen }]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-tools" },
});
const __VLS_0 = {}.ElButtonGroup;
/** @type {[typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('# 标题');
    }
};
__VLS_7.slots.default;
var __VLS_7;
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAround('**', '**');
    }
};
__VLS_15.slots.default;
var __VLS_15;
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAround('*', '*');
    }
};
__VLS_23.slots.default;
var __VLS_23;
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('> 引用内容');
    }
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('- 列表项');
    }
};
__VLS_39.slots.default;
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('1. 有序列表');
    }
};
__VLS_47.slots.default;
var __VLS_47;
const __VLS_52 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_54 = __VLS_53({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_56;
let __VLS_57;
let __VLS_58;
const __VLS_59 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('---');
    }
};
__VLS_55.slots.default;
var __VLS_55;
const __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor('[链接文本](https://example.com)');
    }
};
__VLS_63.slots.default;
var __VLS_63;
const __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor(__VLS_ctx.tableSnippet);
    }
};
__VLS_71.slots.default;
var __VLS_71;
const __VLS_76 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_78 = __VLS_77({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onClick: (...[$event]) => {
        __VLS_ctx.insertAtCursor(__VLS_ctx.codeSnippet);
    }
};
__VLS_79.slots.default;
var __VLS_79;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right-tools" },
});
const __VLS_84 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif,.bmp",
    onChange: (__VLS_ctx.handleImageUpload),
}));
const __VLS_86 = __VLS_85({
    showFileList: (false),
    autoUpload: (false),
    accept: ".jpg,.jpeg,.png,.webp,.gif,.bmp",
    onChange: (__VLS_ctx.handleImageUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    plain: true,
}));
const __VLS_90 = __VLS_89({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
var __VLS_91;
var __VLS_87;
const __VLS_92 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleFileUpload),
}));
const __VLS_94 = __VLS_93({
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleFileUpload),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    plain: true,
}));
const __VLS_98 = __VLS_97({
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
var __VLS_99;
var __VLS_95;
const __VLS_100 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ 'onClick': {} },
    plain: true,
}));
const __VLS_102 = __VLS_101({
    ...{ 'onClick': {} },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_104;
let __VLS_105;
let __VLS_106;
const __VLS_107 = {
    onClick: (...[$event]) => {
        __VLS_ctx.fullscreen = !__VLS_ctx.fullscreen;
    }
};
__VLS_103.slots.default;
(__VLS_ctx.fullscreen ? '退出全屏' : '全屏编辑');
var __VLS_103;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mode-switch" },
});
const __VLS_108 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.tab),
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.tab),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "edit",
}));
const __VLS_114 = __VLS_113({
    label: "edit",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
var __VLS_115;
const __VLS_116 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "preview",
}));
const __VLS_118 = __VLS_117({
    label: "preview",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
var __VLS_119;
var __VLS_111;
var __VLS_120 = {};
if (__VLS_ctx.tab === 'edit') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "editor-pane" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        ...{ onInput: (__VLS_ctx.handleInput) },
        ref: "textareaRef",
        ...{ class: "editor-textarea" },
        placeholder: (__VLS_ctx.placeholder),
        value: (__VLS_ctx.modelValue),
    });
    /** @type {typeof __VLS_ctx.textareaRef} */ ;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-pane hc-card" },
    });
    /** @type {[typeof MarkdownPreview, ]} */ ;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent(MarkdownPreview, new MarkdownPreview({
        content: (__VLS_ctx.modelValue),
    }));
    const __VLS_123 = __VLS_122({
        content: (__VLS_ctx.modelValue),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
}
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left-tools']} */ ;
/** @type {__VLS_StyleScopedClasses['right-tools']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-switch']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['editor-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
// @ts-ignore
var __VLS_121 = __VLS_120;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MarkdownPreview: MarkdownPreview,
            tab: tab,
            fullscreen: fullscreen,
            textareaRef: textareaRef,
            tableSnippet: tableSnippet,
            codeSnippet: codeSnippet,
            handleInput: handleInput,
            insertAtCursor: insertAtCursor,
            insertAround: insertAround,
            handleImageUpload: handleImageUpload,
            handleFileUpload: handleFileUpload,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=MarkdownEditor.vue.js.map
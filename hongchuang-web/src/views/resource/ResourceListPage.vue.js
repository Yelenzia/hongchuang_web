import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EmptyState from '@/components/common/EmptyState.vue';
import { resolveFileUrl } from '@/utils/file';
import { getResourceCategoriesApi, getResourceListApi } from '@/api/resource';
import { getTagsApi } from '@/api/tag';
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const categories = ref([]);
const tags = ref([]);
const rows = ref([]);
const keyword = ref(String(route.query.keyword || ''));
const categoryId = ref(String(route.query.categoryId || ''));
const tagId = ref(String(route.query.tagId || ''));
const sort = ref(route.query.sort || 'latest');
const syncQuery = () => {
    router.replace({
        query: {
            keyword: keyword.value || undefined,
            categoryId: categoryId.value || undefined,
            tagId: tagId.value || undefined,
            sort: sort.value !== 'latest' ? sort.value : undefined
        }
    });
};
const loadData = async () => {
    loading.value = true;
    try {
        const [{ data: categoryData }, { data: tagData }, { data }] = await Promise.all([
            getResourceCategoriesApi(),
            getTagsApi(),
            getResourceListApi({
                pageNo: 1,
                pageSize: 24,
                keyword: keyword.value || undefined,
                categoryId: categoryId.value || undefined,
                tagId: tagId.value || undefined,
                sort: sort.value
            })
        ]);
        categories.value = categoryData;
        tags.value = tagData.filter(item => item.status !== 0);
        rows.value = data.list;
        syncQuery();
    }
    finally {
        loading.value = false;
    }
};
const setTag = (value) => {
    tagId.value = value;
    loadData();
};
watch(() => route.query, () => {
    keyword.value = String(route.query.keyword || '');
    categoryId.value = String(route.query.categoryId || '');
    tagId.value = String(route.query.tagId || '');
    sort.value = route.query.sort || 'latest';
});
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['banner']} */ ;
/** @type {__VLS_StyleScopedClasses['filter']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "resource-list-page hc-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "banner hc-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/resources/create",
}));
const __VLS_2 = __VLS_1({
    to: "/resources/create",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    type: "primary",
    size: "large",
}));
const __VLS_6 = __VLS_5({
    type: "primary",
    size: "large",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
var __VLS_7;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "filter hc-card minecraft-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-row" },
});
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索资源标题 / 简介",
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "搜索资源标题 / 简介",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onKeyup: (__VLS_ctx.loadData)
};
var __VLS_11;
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.categoryId),
    clearable: true,
    placeholder: "全部分类",
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.categoryId),
    clearable: true,
    placeholder: "全部分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_22 = __VLS_21({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.tagId),
    clearable: true,
    filterable: true,
    placeholder: "全部标签",
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.tagId),
    clearable: true,
    filterable: true,
    placeholder: "全部标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.tags))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }));
    const __VLS_30 = __VLS_29({
        key: (item.id),
        label: (item.name),
        value: (item.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.sort),
    placeholder: "排序方式",
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.sort),
    placeholder: "排序方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "最新发布",
    value: "latest",
}));
const __VLS_38 = __VLS_37({
    label: "最新发布",
    value: "latest",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "热门优先",
    value: "hot",
}));
const __VLS_42 = __VLS_41({
    label: "热门优先",
    value: "hot",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "下载最多",
    value: "downloads",
}));
const __VLS_46 = __VLS_45({
    label: "下载最多",
    value: "downloads",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_35;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_51.slots.default;
var __VLS_51;
if (__VLS_ctx.tags.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tag-cloud" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.tags.length))
                    return;
                __VLS_ctx.setTag('');
            } },
        ...{ class: "tag-chip" },
        ...{ class: ({ active: !__VLS_ctx.tagId }) },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.tags.slice(0, 12)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.tags.length))
                        return;
                    __VLS_ctx.setTag(item.id);
                } },
            key: (item.id),
            ...{ class: "tag-chip" },
            ...{ class: ({ active: __VLS_ctx.tagId === item.id }) },
        });
        (item.name);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "grid" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (!__VLS_ctx.rows.length) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "还没有资源",
        desc: "可以先发布你的第一个资源，或者稍后再来看看。",
    }));
    const __VLS_57 = __VLS_56({
        title: "还没有资源",
        desc: "可以先发布你的第一个资源，或者稍后再来看看。",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.rows))) {
    const __VLS_59 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
        key: (item.id),
        to: (`/resources/${item.id}`),
        ...{ class: "hc-card resource-card minecraft-card" },
    }));
    const __VLS_61 = __VLS_60({
        key: (item.id),
        to: (`/resources/${item.id}`),
        ...{ class: "hc-card resource-card minecraft-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    __VLS_62.slots.default;
    if (item.coverUrl) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.resolveFileUrl(item.coverUrl)),
            ...{ class: "cover" },
            alt: "cover",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.categoryName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.currentVersionNo || '未设置版本');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    (item.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "summary" },
    });
    (item.summary);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "resource-tags" },
    });
    for (const [tag] of __VLS_getVForSourceType((item.tags))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.setTag(tag.id);
                } },
            key: (tag.id),
            ...{ class: "resource-tag" },
        });
        (tag.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.authorName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.downloadCount);
    var __VLS_62;
}
/** @type {__VLS_StyleScopedClasses['resource-list-page']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['banner']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['filter']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-cloud']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['resource-card']} */ ;
/** @type {__VLS_StyleScopedClasses['minecraft-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cover']} */ ;
/** @type {__VLS_StyleScopedClasses['body']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-row']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['summary']} */ ;
/** @type {__VLS_StyleScopedClasses['resource-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['resource-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-row']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            EmptyState: EmptyState,
            resolveFileUrl: resolveFileUrl,
            loading: loading,
            categories: categories,
            tags: tags,
            rows: rows,
            keyword: keyword,
            categoryId: categoryId,
            tagId: tagId,
            sort: sort,
            loadData: loadData,
            setTag: setTag,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=ResourceListPage.vue.js.map
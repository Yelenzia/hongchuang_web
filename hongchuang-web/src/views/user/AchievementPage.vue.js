import { onMounted, ref } from 'vue';
import AchievementWall from '@/components/user/AchievementWall.vue';
import { getMyAchievementsApi } from '@/api/achievement';
const achievements = ref([]);
const loading = ref(false);
const errorText = ref('');
onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await getMyAchievementsApi();
        achievements.value = Array.isArray(data) ? data : [];
    }
    catch (error) {
        achievements.value = [];
        errorText.value = '成就数据暂时加载失败，请稍后重试。';
        console.error(error);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "achievement-page" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
if (__VLS_ctx.errorText) {
    const __VLS_0 = {}.ElAlert;
    /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (__VLS_ctx.errorText),
        ...{ class: "mb-16" },
    }));
    const __VLS_2 = __VLS_1({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (__VLS_ctx.errorText),
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
/** @type {[typeof AchievementWall, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(AchievementWall, new AchievementWall({
    items: (__VLS_ctx.achievements),
}));
const __VLS_5 = __VLS_4({
    items: (__VLS_ctx.achievements),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {__VLS_StyleScopedClasses['achievement-page']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AchievementWall: AchievementWall,
            achievements: achievements,
            loading: loading,
            errorText: errorText,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AchievementPage.vue.js.map
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import UserProfileCard from '@/components/user/UserProfileCard.vue';
import AchievementWall from '@/components/user/AchievementWall.vue';
import PostCard from '@/components/forum/PostCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { followUserApi, getUserProfileApi, unfollowUserApi } from '@/api/user';
import { getPostListApi } from '@/api/post';
import { getUserAchievementsApi } from '@/api/achievement';
import { formatDateTime } from '@/utils/format';
import { useAuthStore } from '@/store/auth';
const route = useRoute();
const authStore = useAuthStore();
const profile = ref(null);
const posts = ref([]);
const achievements = ref([]);
const loading = ref(false);
const showFollowButton = computed(() => authStore.isLogin && authStore.userInfo?.id !== profile.value?.userId);
const loadData = async () => {
    const userId = String(route.params.id || '');
    loading.value = true;
    try {
        const [{ data: profileData }, { data: postData }, { data: achievementData }] = await Promise.all([
            getUserProfileApi(userId),
            getPostListApi({ pageNo: 1, pageSize: 10, authorId: userId, sort: 'newest' }),
            getUserAchievementsApi(userId)
        ]);
        profile.value = profileData;
        posts.value = postData.list;
        achievements.value = achievementData;
    }
    finally {
        loading.value = false;
    }
};
const handleToggleFollow = async () => {
    if (!authStore.isLogin || !profile.value) {
        ElMessage.warning('请先登录后再关注');
        return;
    }
    if (profile.value.followedByCurrentUser) {
        await unfollowUserApi(profile.value.userId);
        ElMessage.success('已取消关注');
    }
    else {
        await followUserApi(profile.value.userId);
        ElMessage.success('关注成功');
    }
    await loadData();
};
onMounted(loadData);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-container user-home" },
});
if (__VLS_ctx.profile) {
    /** @type {[typeof UserProfileCard, typeof UserProfileCard, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(UserProfileCard, new UserProfileCard({
        displayName: (__VLS_ctx.profile.nickname || __VLS_ctx.profile.username),
        email: ('-'),
        registerTime: (__VLS_ctx.formatDateTime(__VLS_ctx.profile.registerTime)),
        postCount: (__VLS_ctx.profile.postCount),
        commentCount: (__VLS_ctx.profile.commentCount),
        favoriteCount: (__VLS_ctx.profile.favoriteCount || 0),
        followingCount: (__VLS_ctx.profile.followingCount || 0),
        followerCount: (__VLS_ctx.profile.followerCount || 0),
        bio: (__VLS_ctx.profile.bio || ''),
        signature: (__VLS_ctx.profile.signature || ''),
        forumId: (__VLS_ctx.profile.forumUid),
        avatarUrl: (__VLS_ctx.profile.avatarUrl),
        achievementCount: (__VLS_ctx.profile.achievementCount || 0),
        businessCard: (__VLS_ctx.profile.businessCard || ''),
        userLevel: (__VLS_ctx.profile.userLevel || 1),
        experiencePoints: (__VLS_ctx.profile.experiencePoints || 0),
        nextLevelExp: (__VLS_ctx.profile.nextLevelExp || 0),
    }));
    const __VLS_1 = __VLS_0({
        displayName: (__VLS_ctx.profile.nickname || __VLS_ctx.profile.username),
        email: ('-'),
        registerTime: (__VLS_ctx.formatDateTime(__VLS_ctx.profile.registerTime)),
        postCount: (__VLS_ctx.profile.postCount),
        commentCount: (__VLS_ctx.profile.commentCount),
        favoriteCount: (__VLS_ctx.profile.favoriteCount || 0),
        followingCount: (__VLS_ctx.profile.followingCount || 0),
        followerCount: (__VLS_ctx.profile.followerCount || 0),
        bio: (__VLS_ctx.profile.bio || ''),
        signature: (__VLS_ctx.profile.signature || ''),
        forumId: (__VLS_ctx.profile.forumUid),
        avatarUrl: (__VLS_ctx.profile.avatarUrl),
        achievementCount: (__VLS_ctx.profile.achievementCount || 0),
        businessCard: (__VLS_ctx.profile.businessCard || ''),
        userLevel: (__VLS_ctx.profile.userLevel || 1),
        experiencePoints: (__VLS_ctx.profile.experiencePoints || 0),
        nextLevelExp: (__VLS_ctx.profile.nextLevelExp || 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    __VLS_2.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "profile-actions" },
    });
    const __VLS_3 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
        to: (`/me/messages?to=${__VLS_ctx.profile.userId}`),
    }));
    const __VLS_5 = __VLS_4({
        to: (`/me/messages?to=${__VLS_ctx.profile.userId}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    __VLS_6.slots.default;
    const __VLS_7 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        type: "primary",
        plain: true,
    }));
    const __VLS_9 = __VLS_8({
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_10.slots.default;
    var __VLS_10;
    var __VLS_6;
    if (__VLS_ctx.showFollowButton) {
        const __VLS_11 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.profile.followedByCurrentUser ? 'default' : 'success'),
        }));
        const __VLS_13 = __VLS_12({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.profile.followedByCurrentUser ? 'default' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        let __VLS_15;
        let __VLS_16;
        let __VLS_17;
        const __VLS_18 = {
            onClick: (__VLS_ctx.handleToggleFollow)
        };
        __VLS_14.slots.default;
        (__VLS_ctx.profile.followedByCurrentUser ? '取消关注' : '关注TA');
        var __VLS_14;
    }
    var __VLS_2;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card recent" },
});
/** @type {[typeof AchievementWall, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(AchievementWall, new AchievementWall({
    items: (__VLS_ctx.achievements),
}));
const __VLS_20 = __VLS_19({
    items: (__VLS_ctx.achievements),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hc-card recent" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
    /** @type {[typeof PostCard, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(PostCard, new PostCard({
        key: (post.id),
        post: (post),
    }));
    const __VLS_23 = __VLS_22({
        key: (post.id),
        post: (post),
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
if (!__VLS_ctx.loading && __VLS_ctx.posts.length === 0) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        title: "该用户暂未发布帖子",
    }));
    const __VLS_26 = __VLS_25({
        title: "该用户暂未发布帖子",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
/** @type {__VLS_StyleScopedClasses['hc-container']} */ ;
/** @type {__VLS_StyleScopedClasses['user-home']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['recent']} */ ;
/** @type {__VLS_StyleScopedClasses['hc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['recent']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserProfileCard: UserProfileCard,
            AchievementWall: AchievementWall,
            PostCard: PostCard,
            EmptyState: EmptyState,
            formatDateTime: formatDateTime,
            profile: profile,
            posts: posts,
            achievements: achievements,
            loading: loading,
            showFollowButton: showFollowButton,
            handleToggleFollow: handleToggleFollow,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=UserHomePage.vue.js.map
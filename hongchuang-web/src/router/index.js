import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import MainLayout from '@/layouts/MainLayout.vue';
import UserCenterLayout from '@/layouts/UserCenterLayout.vue';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                { path: '', name: 'home', component: () => import('@/views/home/HomePage.vue') },
                { path: 'forum', name: 'forum', component: () => import('@/views/forum/ForumPage.vue') },
                { path: 'resources', name: 'resources', component: () => import('@/views/resource/ResourceListPage.vue') },
                { path: 'search', name: 'search', component: () => import('@/views/search/SearchPage.vue') },
                { path: 'resources/create', name: 'resource-create', component: () => import('@/views/resource/ResourcePublishPage.vue'), meta: { requiresAuth: true } },
                { path: 'resources/:id/edit', name: 'resource-edit', component: () => import('@/views/resource/ResourcePublishPage.vue'), meta: { requiresAuth: true } },
                { path: 'resources/:id', name: 'resource-detail', component: () => import('@/views/resource/ResourceDetailPage.vue') },
                { path: 'announcements', name: 'announcements', component: () => import('@/views/announcement/AnnouncementListPage.vue') },
                { path: 'announcements/:id', name: 'announcement-detail', component: () => import('@/views/announcement/AnnouncementDetailPage.vue') },
                { path: 'forum/board/:slug', name: 'board', component: () => import('@/views/forum/BoardPage.vue') },
                { path: 'post/create', name: 'post-create', component: () => import('@/views/forum/CreatePostPage.vue'), meta: { requiresAuth: true } },
                { path: 'post/:id/edit', name: 'post-edit', component: () => import('@/views/forum/CreatePostPage.vue'), meta: { requiresAuth: true } },
                { path: 'post/:id', name: 'post-detail', component: () => import('@/views/forum/PostDetailPage.vue') },
                { path: 'contact', name: 'contact', component: () => import('@/views/contact/ContactPage.vue') },
                { path: 'login', name: 'login', component: () => import('@/views/auth/LoginPage.vue'), meta: { guestOnly: true } },
                { path: 'register', name: 'register', component: () => import('@/views/auth/RegisterPage.vue'), meta: { guestOnly: true } },
                { path: 'forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPasswordPage.vue'), meta: { guestOnly: true } },
                { path: 'user/:id', name: 'user-home', component: () => import('@/views/user/UserHomePage.vue') },
                { path: 'policies/user-agreement', name: 'user-agreement', component: () => import('@/views/policy/UserAgreementPage.vue') },
                { path: 'policies/privacy-policy', name: 'privacy-policy', component: () => import('@/views/policy/PrivacyPolicyPage.vue') },
                { path: 'policies/community-guidelines', name: 'community-guidelines', component: () => import('@/views/policy/CommunityRulesPage.vue') }
            ]
        },
        {
            path: '/me',
            component: UserCenterLayout,
            meta: { requiresAuth: true },
            children: [
                { path: '', redirect: '/me/profile' },
                { path: 'profile', name: 'me-profile', component: () => import('@/views/user/ProfilePage.vue') },
                { path: 'favorites', name: 'me-favorites', component: () => import('@/views/user/FavoritePostsPage.vue') },
                { path: 'follows', name: 'me-follows', component: () => import('@/views/user/RelationPage.vue') },
                { path: 'fans', name: 'me-fans', component: () => import('@/views/user/RelationPage.vue') },
                { path: 'achievements', name: 'me-achievements', component: () => import('@/views/user/AchievementPage.vue') },
                { path: 'posts', name: 'me-posts', component: () => import('@/views/user/MyPostsPage.vue') },
                { path: 'drafts', name: 'me-drafts', component: () => import('@/views/user/MyDraftsPage.vue') },
                { path: 'notifications', name: 'me-notifications', component: () => import('@/views/user/NotificationPage.vue') },
                { path: 'messages', name: 'me-messages', component: () => import('@/views/user/MessagePage.vue') },
                { path: 'security', name: 'me-security', component: () => import('@/views/user/SecurityPage.vue') }
            ]
        }
    ],
    scrollBehavior() {
        return { top: 0 };
    }
});
router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    if (authStore.accessToken && !authStore.initialized) {
        try {
            await authStore.initialize();
        }
        catch {
            // ignore
        }
    }
    if (to.meta.requiresAuth && !authStore.isLogin) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }
    if (to.meta.guestOnly && authStore.isLogin) {
        return { name: 'home' };
    }
    return true;
});
export default router;
//# sourceMappingURL=index.js.map
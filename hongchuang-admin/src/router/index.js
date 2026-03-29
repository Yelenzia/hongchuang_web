import { createRouter, createWebHistory } from 'vue-router';
import { useAdminAuthStore } from '@/store/auth';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'admin-login', component: () => import('@/views/login/AdminLoginPage.vue') },
        {
            path: '/',
            component: () => import('@/layouts/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                { path: '', redirect: '/dashboard' },
                { path: 'dashboard', name: 'dashboard', component: () => import('@/views/dashboard/DashboardPage.vue') },
                { path: 'users', name: 'users', component: () => import('@/views/users/UsersPage.vue') },
                { path: 'posts', name: 'posts', component: () => import('@/views/posts/PostsPage.vue') },
                { path: 'comments', name: 'comments', component: () => import('@/views/comments/CommentsPage.vue') },
                { path: 'notifications', name: 'notifications', component: () => import('@/views/notifications/NotificationsPage.vue') },
                { path: 'resources', name: 'resources', component: () => import('@/views/resources/ResourcesPage.vue') },
                { path: 'resource-categories', name: 'resource-categories', component: () => import('@/views/resources/ResourceCategoriesPage.vue') },
                { path: 'boards', name: 'boards', component: () => import('@/views/boards/BoardsPage.vue') },
                { path: 'tags', name: 'tags', component: () => import('@/views/tags/TagsPage.vue') },
                { path: 'reports', name: 'reports', component: () => import('@/views/reports/ReportsPage.vue') },
                { path: 'announcements', name: 'announcements', component: () => import('@/views/announcements/AnnouncementsPage.vue') },
                { path: 'achievements', name: 'achievements', component: () => import('@/views/achievements/AchievementsPage.vue') },
                { path: 'content-templates', name: 'content-templates', component: () => import('@/views/content/TemplatesPage.vue') },
                { path: 'site-pages', name: 'site-pages', component: () => import('@/views/site/SitePagesPage.vue') },
                { path: 'drafts', name: 'draft-governance', component: () => import('@/views/content/DraftsPage.vue') }
            ]
        }
    ]
});
router.beforeEach(async (to) => {
    const store = useAdminAuthStore();
    if (store.accessToken && !store.initialized) {
        try {
            await store.initialize();
        }
        catch {
            // 继续走下面的鉴权判断
        }
    }
    if (to.meta.requiresAuth && (!store.isLogin || !store.isAdmin)) {
        return { name: 'admin-login' };
    }
    if (to.name === 'admin-login' && store.isLogin && store.isAdmin) {
        return { name: 'dashboard' };
    }
    return true;
});
export default router;
//# sourceMappingURL=index.js.map
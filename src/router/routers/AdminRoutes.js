// src/router/routers/AdminRoutes.js
import { lazy } from 'react';

const AdminRoutes = [
    // Dashboard
    {
        path: '/admin/dashboard/overview',
        component: lazy(() => import('../../views/admin/dashboard/overview')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/dashboard/notification',
        component: lazy(() => import('../../views/admin/dashboard/notification')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/dashboard/event',
        component: lazy(() => import('../../views/admin/dashboard/event')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },

    // Report
    {
        path: '/admin/report/post',
        component: lazy(() => import('../../views/admin/report/post')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/report/group',
        component: lazy(() => import('../../views/admin/report/group')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/report/user',
        component: lazy(() => import('../../views/admin/report/user')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },

    // {
    //     path: '/admin/report/comment',
    //     component: lazy(() => import('../../views/admin/report/comment')),
    //     meta: {
    //         requiresAuth: true,
    //         roles: ['admin']
    //     }
    // },

    // Learning
    {
        path: '/admin/learning/overview',
        component: lazy(() => import('../../views/admin/learning/overview')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/faculty',
        component: lazy(() => import('../../views/admin/learning/faculty')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/specialization',
        component: lazy(() => import('../../views/admin/learning/specialization')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/batch',
        component: lazy(() => import('../../views/admin/learning/batch')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/class',
        component: lazy(() => import('../../views/admin/learning/class')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/subject',
        component: lazy(() => import('../../views/admin/learning/subject')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/learning/study',
        component: lazy(() => import('../../views/admin/learning/study')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },


    // Profile
    {
        path: '/admin/user',
        component: lazy(() => import('../../views/admin/profile/manage_user')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/career',
        component: lazy(() => import('../../views/admin/profile/career')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },


    // Category
    {
        path: '/admin/category/subject-category',
        component: lazy(() => import('../../views/admin/category/subject-category')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/category/task-category',
        component: lazy(() => import('../../views/admin/category/task-category')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/category/notice-type',
        component: lazy(() => import('../../views/admin/category/notice-type')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/category/category-support',
        component: lazy(() => import('../../views/admin/category/category-support')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/category/tag',
        component: lazy(() => import('../../views/admin/category/tag')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },


    // Support
    {
        path: '/admin/support/faq',
        component: lazy(() => import('../../views/admin/support/faq')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },
    {
        path: '/admin/support/guide',
        component: lazy(() => import('../../views/admin/support/guide')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },

    // System
    {
        path: '/admin/system/policy',
        component: lazy(() => import('../../views/admin/system/policy')),
        meta: {
            requiresAuth: true,
            roles: ['admin']
        }
    },

];

export default AdminRoutes;
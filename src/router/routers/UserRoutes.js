// src/router/routers/UserRoutes.js
import { lazy } from 'react';

const lazyLoad = (importFunc) => {
    return lazy(() => importFunc().catch(error => {
        console.error('Error loading module:', error);
        return import('../../views/pages/misc/Error');
    }));
};

const UserRoutes = [

    //Dashboard
    {
        path: '/dashboard/overview',
        component: lazyLoad(() => import('../../views/user/dashboard/overview')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/dashboard/notification',
        component: lazyLoad(() => import('../../views/user/dashboard/notification')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/dashboard/event',
        component: lazyLoad(() => import('../../views/user/dashboard/event')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },

    //Social
    {
        path: '/social/discus',
        component: lazyLoad(() => import('../../views/user/social/discus')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/social/group',
        component: lazyLoad(() => import('../../views/user/social/group')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/social/group/:idGroup',
        component: lazyLoad(() => import('../../views/user/social/group/detail')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/social/chat',
        component: lazyLoad(() => import('../../views/user/social/chat')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },

    {
        path: '/social/chat/:alias',
        component: lazyLoad(() => import('../../views/user/social/chat')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/social/friend',
        component: lazyLoad(() => import('../../views/user/social/friend')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },


    //Learning
    {
        path: '/learning/exercise',
        component: lazyLoad(() => import('../../views/user/learning/learn_exercise')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/exercise/:alias',
        component: lazyLoad(() => import('../../views/user/learning/learn_exercise')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/task',
        component: lazyLoad(() => import('../../views/user/learning/task')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/task/:alias',
        component: lazyLoad(() => import('../../views/user/learning/task')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },

    {
        path: '/learning/calendar',
        component: lazyLoad(() => import('../../views/user/learning/calendar')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/process',
        component: lazyLoad(() => import('../../views/user/learning/learn_progress')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/training_program',
        component: lazyLoad(() => import('../../views/user/learning/training_program')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/learning/document',
        component: lazyLoad(() => import('../../views/user/learning/document')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },


    //Profile
    {
        path: '/profile/information',
        component: lazyLoad(() => import('../../views/user/profile/information')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/information/:alias',
        component: lazyLoad(() => import('../../views/user/profile/information/detailProfile')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/manage_account',
        component: lazyLoad(() => import('../../views/user/profile/manage_account')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/love_item',
        component: lazyLoad(() => import('../../views/user/profile/love_item')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/post',
        component: lazyLoad(() => import('../../views/user/profile/post')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/study_history',
        component: lazyLoad(() => import('../../views/user/profile/study_history')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/profile/portfolio',
        component: lazyLoad(() => import('../../views/user/profile/portfolio')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },



    //Setting
    {
        path: '/setting/account',
        component: lazyLoad(() => import('../../views/user/setting/account')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/setting/notification',
        component: lazyLoad(() => import('../../views/user/setting/notification')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/setting/security',
        component: lazyLoad(() => import('../../views/user/setting/security')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/setting/customize_theme',
        component: lazyLoad(() => import('../../views/user/setting/customize_theme')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },


    //Support
    {
        path: '/support/guide',
        component: lazyLoad(() => import('../../views/user/support/guide')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/support/feedback',
        component: lazyLoad(() => import('../../views/user/support/feedback')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/support/policy',
        component: lazyLoad(() => import('../../views/user/support/policy')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
    {
        path: '/support/update',
        component: lazyLoad(() => import('../../views/user/support/update')),
        meta: {
            requiresAuth: true,
            roles: ['user', 'admin']
        }
    },
];

export default UserRoutes;
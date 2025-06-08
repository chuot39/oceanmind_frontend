
import { lazy } from 'react'

const AppRoutes = [
    // All Projects
    {
        path: '/apps/project',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/user/project')),
        exact: true
    },
    {
        path: '/apps/project/edit/:idProject',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/user/project')),
        exact: true
    },
    {
        path: '/apps/project/:alias',
        className: 'ecommerce-application',
        component: lazy(() => import('../../views/user/project')),
        exact: true
    },
]

export default AppRoutes
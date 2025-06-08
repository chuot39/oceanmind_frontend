import AdminRoutes from "./AdminRoutes";
import AppRoutes from "./App";
import PagesRoutes from "./Pages";
import UserRoutes from "./UserRoutes";

const DefaultRoute = '/dashboard/overview';

const TemplateTitle = 'OceanMind'
const Routers = [
    ...PagesRoutes,
    ...AppRoutes,
    ...AdminRoutes,
    ...UserRoutes
]

export { TemplateTitle, Routers }
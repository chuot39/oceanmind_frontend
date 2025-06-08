import SidebarComponent from './components/vertical/SidebarComponent';
import NavbarComponent from './components/vertical/NavbarComponent';
import userNavigation from './navigation/vertical';
import adminNavigation from './navigation/vertical/admin';
import '../scss/layouts/verticalLayout.scss';
import FooterComponent from "./components/vertical/FooterComponent";
import useLayout from '../../utils/hooks/useLayout';
import { useLocation } from 'react-router-dom';

const VerticalLayout = props => {
    const { menuCollapsed, changeMenuCollapsedRedux } = useLayout();
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    const navigation = isAdminPath ? adminNavigation : userNavigation;

    const toggleSidebar = () => {
        changeMenuCollapsedRedux(!menuCollapsed)
    };

    console.log('call to VerticalLayout');


    return (
        <div className='vertical-layout flex flex-col min-h-screen'>
            <div className="flex flex-1">
                <SidebarComponent
                    navigation={navigation}
                    isCollapsed={menuCollapsed}
                    toggleSidebar={toggleSidebar}
                    isAdmin={isAdminPath}
                />
                <div className="app-content flex-1 flex flex-col overflow-y-auto">
                    <div id="top-of-page"></div>

                    <NavbarComponent isAdmin={isAdminPath} />
                    <div className="content-wrapper flex-1">
                        <div className="content-body">
                            {props.children}
                        </div>
                        <FooterComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerticalLayout;
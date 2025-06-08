import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Toggle from '../../../../components/button/Toggle';
import logo from '@assets/images/logo/logo-main.jpg';
import { APP_NAME } from '../../../../constants';
import { Menu } from 'antd';
import useSkin from '../../../../utils/hooks/useSkin';

const SidebarComponent = ({ navigation, isCollapsed, toggleSidebar, isAdmin }) => {
    const { skin } = useSkin()
    const itemMenuColor = skin === 'dark' ? '#d0d2d6' : '#333';
    const location = useLocation();

    const [openKeys, setOpenKeys] = useState([]);

    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    // Check if current path matches navigation item path
    const isPathMatch = (itemPath, currentPath) => {
        // Handle root paths
        if (itemPath === currentPath) return true;

        // Handle dynamic routes by checking if current path starts with navigation path
        // This will match '/social/group' with '/social/group/123'
        if (itemPath && currentPath.startsWith(itemPath)) return true;

        return false;
    };

    const findParentKey = (path) => {
        for (const item of navigation) {
            if (item.children) {
                for (const child of item.children) {
                    if (isPathMatch(child.path, path)) {
                        return item.key;
                    }
                }
            }
        }
        return null;
    };

    // Get selected keys based on current location
    const getSelectedKeys = () => {
        const currentPath = location.pathname;
        const selectedKeys = [];

        navigation.forEach(item => {
            if (item.children) {
                item.children.forEach(child => {
                    if (isPathMatch(child.path, currentPath)) {
                        selectedKeys.push(child.path);
                    }
                });
            } else if (item.path && isPathMatch(item.path, currentPath)) {
                selectedKeys.push(item.key);
            }
        });

        return selectedKeys;
    };

    const parentKey = findParentKey(location.pathname);
    if (parentKey && !openKeys.includes(parentKey)) {
        setOpenKeys([parentKey]);
    }

    // Determine the dashboard link based on whether it's admin or user
    const dashboardLink = isAdmin ? '/admin/dashboard/overview' : '/dashboard/overview';

    return (
        <div className={`ps-3 overflow-x-hidden sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className='flex justify-between items-center'>
                <NavLink to={dashboardLink} className="sidebar-header">
                    <img className='object-fill h-12 w-12 rounded-full' src={logo} alt='Logo App' />
                    <div className={`app-name mx-2 ${isCollapsed ? 'hidden' : 'visible'}`}>{APP_NAME}</div>
                </NavLink>

                <button className={`${isCollapsed ? 'ms-2' : ''}`} onClick={toggleSidebar}>
                    <Toggle value={isCollapsed} />
                </button>
            </div>
            <div className='mt-4'>
                <Menu
                    selectedKeys={getSelectedKeys()}
                    {...(isCollapsed
                        ? { defaultOpenKeys: isCollapsed ? [] : openKeys }
                        : { openKeys: isCollapsed ? [] : openKeys })}
                    onOpenChange={onOpenChange}
                    mode="inline"
                    className='sidebar_menu'
                    inlineCollapsed={isCollapsed}
                    items={navigation.map(item => ({
                        key: item.key,
                        icon: React.cloneElement(item.icon, { style: { color: itemMenuColor } }),
                        label: (
                            <NavLink style={{ color: itemMenuColor }} to={item.path || '#'}>{item.label}</NavLink>
                        ),
                        children: item.children ? item.children.map(child => ({
                            key: child.path,
                            icon: React.cloneElement(child.icon, { style: { color: itemMenuColor } }),
                            label: (
                                <NavLink style={{ color: itemMenuColor }} to={child.path || '#'}>{child.label}</NavLink>
                            ),
                        })) : null,
                    }))}
                />
            </div>
        </div>
    );
};

export default SidebarComponent;
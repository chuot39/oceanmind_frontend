import React from 'react';
import { FaComments, FaClipboardList, FaBook, FaLock, FaImages, FaUsers } from 'react-icons/fa';

const menuItems = [
    {
        id: 'discussion',
        icon: <FaComments className="text-xl" />,
        title: 'Thảo luận',
        description: 'Các câu hỏi về thảo luận'
    },
    {
        id: 'posts',
        icon: <FaClipboardList className="text-xl" />,
        title: 'Bài đăng',
        description: 'Hướng dẫn đăng bài'
    },
    {
        id: 'tasks',
        icon: <FaClipboardList className="text-xl" />,
        title: 'Nhiệm vụ',
        description: 'Quản lý nhiệm vụ'
    },
    {
        id: 'documents',
        icon: <FaBook className="text-xl" />,
        title: 'Tài liệu',
        description: 'Tài liệu hướng dẫn'
    },
    {
        id: 'password',
        icon: <FaLock className="text-xl" />,
        title: 'Đổi mật khẩu',
        description: 'Thay đổi mật khẩu'
    },
    {
        id: 'portfolio',
        icon: <FaImages className="text-xl" />,
        title: 'Portfolio',
        description: 'Quản lý portfolio'
    },
    {
        id: 'group',
        icon: <FaUsers className="text-xl" />,
        title: 'Nhóm',
        description: 'Quản lý nhóm'
    }
];

const Sidebar = ({ activeSection, onSectionChange }) => {
    return (
        <div className="w-full card_sidebar rounded-lg shadow-sm">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSectionChange(item)}
                    className={`w-full flex item_sidebar text_secondary rounded-lg items-center space-x-3 p-3 transition-colors ${activeSection?.id === item.id ? 'item_active' : ''
                        }`}
                >
                    <div className={`${activeSection?.id === item.id ? 'text-[#7abfff]' : ''}`}>
                        {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                </button>
            ))}
        </div>
    );
};

export default Sidebar;
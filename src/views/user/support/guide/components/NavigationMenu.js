import React from 'react';
import { FaComments, FaTasks, FaBook, FaLock, FaUserCircle, FaUsers } from 'react-icons/fa';
import { BsFillCollectionFill } from 'react-icons/bs';

const menuItems = [
    { icon: <FaComments className="text-2xl" />, title: 'Thảo luận', link: '#' },
    { icon: <FaTasks className="text-2xl" />, title: 'Nhiệm vụ', link: '#' },
    { icon: <FaBook className="text-2xl" />, title: 'Tài liệu', link: '#' },
    { icon: <FaLock className="text-2xl" />, title: 'Đổi mật khẩu', link: '#' },
    { icon: <BsFillCollectionFill className="text-2xl" />, title: 'Porfolio', link: '#' },
    { icon: <FaUsers className="text-2xl" />, title: 'Nhóm', link: '#' },
];

const NavigationMenu = () => {
    return (
        <div className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
                <a
                    key={index}
                    href={item.link}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <div className="text-gray-600">{item.icon}</div>
                    <span className="text-gray-700 font-medium">{item.title}</span>
                </a>
            ))}
        </div>
    );
};

export default NavigationMenu; 
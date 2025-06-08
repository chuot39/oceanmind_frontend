import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Tooltip, Badge, Avatar, Menu, Dropdown, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdChatBubbleOutline, MdNotificationsNone } from 'react-icons/md';
import { FaRegCalendarAlt, FaRegStar, FaTasks } from 'react-icons/fa';
import flag_VI from '../../../../assets/icons/image.png'
import flag_EN from '../../../../assets/icons/us.png'
import SwitchTheme from '../../../../components/button/SwitchTheme';
import useSkin from '../../../../utils/hooks/useSkin';
import { useLogout, useUserData } from '../../../../utils/hooks/useAuth';
import { GrTasks } from 'react-icons/gr';
import { UserOutlined, SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { IoMdLogOut } from 'react-icons/io';
import { toast } from 'react-toastify';
import { notifySuccess, notifyError, notifyWarning } from "@/utils/Utils";
import postImage from '../../../../assets/icons/notifications/post.png';
import systemImage from '../../../../assets/icons/notifications/system.png';
import newTaskImage from '../../../../assets/icons/notifications/new_task.png';
import overdueTaskImage from '../../../../assets/icons/notifications/overdue_task.png';
import upcomingTaskImage from '../../../../assets/icons/notifications/upcoming_task.png';
import eventImage from '../../../../assets/icons/notifications/event.png';
import messageImage from '../../../../assets/icons/notifications/message.png';
import robotImage from '../../../../assets/icons/notifications/robot.png';
import { useUserNotice } from '@/views/user/components/hook';
import socket, { addNotificationListener, joinNotificationRoom } from '@/views/user/social/chat/socket';
import { useQueryClient } from 'react-query';
import { NOTIFICATION_EVENT } from '@/views/user/stores/actions/friendActions';

const navItems = [
    { link: '/learning/exercise', target: 'exercise', title: 'Exercise', icon: <GrTasks /> },
    { link: '/social/chat', target: 'chat', title: 'Chat', icon: <MdChatBubbleOutline /> },
    { link: '/learning/task', target: 'task', title: 'task', icon: <FaTasks /> },
    { link: '/learning/calendar', target: 'calendar', title: 'Calendar', icon: <FaRegCalendarAlt /> },
];

const imageMapping = {
    "Post": postImage,
    "System": systemImage,
    "New Task": newTaskImage,
    "Overdue Task": overdueTaskImage,
    "Upcoming Task": upcomingTaskImage,
    "Event": eventImage,
    "Message": messageImage,
};

const NavbarComponent = ({ toggleTheme, isAdmin }) => {

    const { language, skin, changeLanguageRedux } = useSkin()
    const { userData } = useUserData()
    const navigate = useNavigate()
    const { status, data: notifications, refetch } = useUserNotice(userData?.documentId)
    const queryClient = useQueryClient();

    // State để lưu trữ thông báo mới nhận qua socket
    const [realtimeNotifications, setRealtimeNotifications] = useState([]);

    // Kết hợp thông báo từ API và thông báo realtime
    const allNotifications = [
        ...realtimeNotifications,
        ...(notifications?.pages?.flatMap(page => page.data) || [])
    ];

    // Hàm xử lý thông báo
    const processNotification = useCallback((notification, recipientId) => {
        if (!notification) {
            console.error('Empty notification object in processNotification');
            return;
        }

        console.log('Processing notification in NavbarComponent:', notification);

        // Đảm bảo có ID
        const notificationId = notification.id || notification.documentId || Date.now().toString();

        // Hiển thị toast chỉ một lần duy nhất
        try {
            // Chuẩn hóa thông tin thông báo
            const title = notification.title || 'Thông báo mới';
            const content = notification.content || 'Bạn có thông báo mới';

            // Kiểm tra loại thông báo (kết bạn) để quyết định hiển thị toast
            const isFriendRequest =
                notification.title?.includes("Friend Request") ||
                notification.content?.includes("friend request") ||
                notification.status === 'pending' ||
                notification.status === 'accepted' ||
                notification.noticeType?.name_en === "Friend Request";

            if (isFriendRequest) {
                // Tạo một ID duy nhất cho notification dựa trên nội dung
                const stableToastId = `notification-${notificationId}`;

                // Hiển thị toast với ID cố định
                toast.success(`${title}: ${content}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    toastId: stableToastId,
                    style: { zIndex: 9999 }
                });
            }
        } catch (error) {
            console.error('Error showing toast notification:', error);
        }

        // Kiểm tra trùng lặp trước khi thêm vào state
        setRealtimeNotifications(prev => {
            const exists = prev.some(n =>
                (n.documentId === notificationId) ||
                (n.id === notificationId) ||
                (n.notification?.documentId === notificationId)
            );

            if (exists) {
                console.log('Notification already exists in state, skipping state update');
                return prev;
            }

            // Chuẩn hóa định dạng thông báo để hiển thị trong UI
            const newNotification = {
                documentId: notificationId,
                id: notificationId,
                notification: {
                    documentId: notificationId,
                    title: notification.title || 'Thông báo mới',
                    content: notification.content || 'Bạn có thông báo mới',
                    link: notification.link || '#',
                    createdAt: notification.createdAt || new Date().toISOString(),
                    noticeType: {
                        name_en: notification.noticeType?.name_en || 'Notification'
                    }
                },
                is_read: false
            };

            // Refresh danh sách thông báo từ server sau khi nhận thông báo mới
            setTimeout(() => refetch(), 500);

            return [newNotification, ...prev];
        });
    }, [refetch]);

    // Đăng ký xử lý thông báo realtime
    useEffect(() => {
        if (!userData?.documentId) return;

        console.log('Setting up notification listeners for user:', userData.documentId);

        // Hàm xử lý thông báo từ socket trực tiếp
        const handleSocketNotification = (data) => {
            console.log('Socket notification received in NavbarComponent:', data);

            try {
                if (!data) return;

                // Kiểm tra nếu đây là thông báo cho người dùng hiện tại
                const currentUserId = String(userData.documentId).trim();
                let recipientId = '';
                let notification = null;

                // Xử lý các cấu trúc dữ liệu khác nhau
                if (data.recipientId && data.notification) {
                    // Cấu trúc chuẩn {recipientId, notification}
                    recipientId = String(data.recipientId).trim();
                    notification = data.notification;
                } else if (data.notification && data.notification.recipientId) {
                    // Cấu trúc lồng {notification: {recipientId, ...}}
                    recipientId = String(data.notification.recipientId).trim();
                    notification = data.notification;
                } else if (data.id || data.documentId || data.title) {
                    // Trường hợp data là notification object
                    notification = data;
                    // Không có recipientId, chấp nhận cho tất cả
                }

                // Đảm bảo notification có đầy đủ thông tin
                if (!notification) {
                    console.error('Missing notification data');
                    return;
                }

                // Đảm bảo notification có timestamp
                notification.timestamp = notification.timestamp || notification.createdAt || new Date().toISOString();

                // Chỉ xử lý nếu thông báo dành cho người dùng hiện tại hoặc không có recipientId
                if (!recipientId || currentUserId === recipientId) {
                    // Gọi hàm xử lý chung để hiển thị toast và cập nhật UI
                    processNotification(notification, recipientId || currentUserId);
                } else {
                    console.log('Notification not for this user:', currentUserId, recipientId);
                }
            } catch (error) {
                console.error('Error handling socket notification:', error);
            }
        };

        // Hàm xử lý từ window event (các tab khác nhau)
        const handleWindowEvent = (event) => {
            console.log('Window event notification received:', event.detail);

            try {
                if (!event.detail) return;

                const { notification, recipientId } = event.detail;
                if (!notification) return;

                // Kiểm tra nếu thông báo dành cho người dùng hiện tại
                const currentUserId = String(userData.documentId).trim();
                const targetRecipientId = recipientId ? String(recipientId).trim() : '';

                if (!targetRecipientId || currentUserId === targetRecipientId) {
                    // Gọi hàm xử lý chung để hiển thị toast và cập nhật UI
                    processNotification(notification, targetRecipientId || currentUserId);
                } else {
                    console.log('Window event notification not for this user');
                }
            } catch (error) {
                console.error('Error handling window event notification:', error);
            }
        };

        // Đăng ký lắng nghe socket
        socket.off('notification').on('notification', handleSocketNotification);
        socket.off('directNotification').on('directNotification', handleSocketNotification);

        // Đăng ký lắng nghe window events
        window.addEventListener('socket_notification', handleWindowEvent);
        window.addEventListener(NOTIFICATION_EVENT, handleWindowEvent);
        window.addEventListener('OCEAN_MIND_NOTIFICATION', handleWindowEvent);

        // Tham gia room thông báo
        joinNotificationRoom(userData.documentId);

        // Làm mới danh sách thông báo từ server
        refetch();

        // Cleanup khi component unmount
        return () => {
            socket.off('notification', handleSocketNotification);
            socket.off('directNotification', handleSocketNotification);
            window.removeEventListener('socket_notification', handleWindowEvent);
            window.removeEventListener(NOTIFICATION_EVENT, handleWindowEvent);
            window.removeEventListener('OCEAN_MIND_NOTIFICATION', handleWindowEvent);
            console.log('Notification listeners removed');
        };
    }, [userData?.documentId, processNotification, refetch]);

    const handleMenuClick = (e) => {
        changeLanguageRedux(e.key)
    };

    const setMenuVisibility = () => {
        toast('🦄 We are working on this feature!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: skin,
        });
    }

    const handleLogout = useLogout()
    const menu = [
        {
            label: (
                <div>
                    <img src={flag_EN} alt="English" className="w-5 h-5 inline mr-2" />
                    English
                </div>
            ),
            key: 'en',
            onClick: () => handleMenuClick({ key: 'en' }),
        },
        {
            label: (
                <div>
                    <img src={flag_VI} alt="Vietnamese" className="w-5 h-5 inline mr-2" />
                    Vietnamese
                </div>
            ),
            key: 'vi',
            onClick: () => handleMenuClick({ key: 'vi' }),
        },
    ];

    const renderNotificationItems = () => {
        return (
            <div className='media-list custom-scrollbar'>
                {allNotifications?.length > 0 ? (
                    allNotifications.map((item, index) => (
                        <NavLink to={item?.notification?.link} key={index} className={`flex items-start p-3 rounded-lg transition-all duration-200 ${skin === 'dark' ? 'hover:bg-blue-950' : 'hover:bg-blue-100'}  ${index === 0 ? '' : ''}`}>
                            <div className='flex-shrink-0 me-2 w-8 h-8 flex items-center justify-center rounded-full overflow-hidden'>
                                <img
                                    src={imageMapping[item?.notification?.noticeType?.name_en] || robotImage}
                                    alt='Avatar'
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className={`flex-grow ${skin === 'dark' ? '' : 'hover:text-blue-800'}`}>
                                <p className='media-heading'>
                                    <span className='font-medium'>{item?.notification?.title}</span>
                                </p>
                                <small className='notification-text'>{item?.notification?.content}</small>
                            </div>
                        </NavLink>
                    ))
                ) : (
                    <div className="p-3 text-center text-gray-500">
                        No notifications
                    </div>
                )}
            </div>
        );
    };

    const menuNotice = [
        {
            label: (
                <div className='flex justify-between items-center'>
                    <h4 className="text_first">Notifications</h4>
                    <Badge count={allNotifications?.length} className='bg-light-primary text-primary' />
                </div>
            ),
            key: 'header',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            label: renderNotificationItems(),
            key: 'notifications',
            className: 'max-h-80 p-0 list_notice overflow-y-auto',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <Button type='primary' block onClick={() => {
                    setRealtimeNotifications([]);
                    queryClient.invalidateQueries(['userNotifications']);
                    refetch();
                }}>
                    Read all notifications
                </Button>
            ),
            key: 'footer',
        },
    ];

    const ActionOnAvatar = () => {
        const handleItemClick = ({ key }) => {
            switch (key) {
                case "profile":
                    navigate(isAdmin ? "/admin/profile" : "/profile/information");
                    break;
                case "settings":
                    navigate(isAdmin ? "/admin/settings" : "/setting/account");
                    break;
                case "faq":
                    navigate(isAdmin ? "/admin/guide" : "/support/guide");
                    break;
                case "logout":
                    handleLogout()
                    break;
                default:
                    break;
            }
        };

        const menuItems = [
            {
                label: "My Profile",
                key: "profile",
                icon: <UserOutlined />,
            },
            {
                label: "Settings",
                key: "settings",
                icon: <SettingOutlined />,
            },
            {
                label: "FAQ",
                key: "faq",
                icon: <QuestionCircleOutlined />,
            },
            {
                type: 'divider',
            },
            {
                label: (
                    <div className='text-red-500 font-medium'>
                        Logout
                    </div>
                ),
                key: "logout",
                icon: <IoMdLogOut className='text-red-500 font-bold' style={{ fontSize: "18px" }} />
            },
        ];

        return (
            <div className="custom-dropdown">
                <div className="dropdown-header">
                    <div className="header-avatar">
                        <Avatar src={userData?.avatar?.file_path} size='large' />
                    </div>
                    <div className="header-info">
                        <div className="text_first font-bold">{userData?.fullname}</div>
                        <div className="text_first font-light">{userData?.role_id?.name}</div>
                    </div>
                </div>
                <Menu onClick={handleItemClick} items={menuItems} className="dropdown-menu-avatar" />
            </div>
        );
    };

    return (
        <div flex className='header rounded-md flex justify-between'>
            <div className='flex items-center space-x-4'>
                {!isAdmin && navItems.map(item => (
                    <div key={item.target} className='hidden lg:block'>
                        <Tooltip title={item.title}>
                            <NavLink to={item.link} id={item.target} className="text_first">
                                <span className='text-2xl'>{item.icon}</span>
                            </NavLink>
                        </Tooltip>
                    </div>
                ))}
                {!isAdmin && (
                    <div key={'star'} className='hidden lg:block cursor-pointer'>
                        <Tooltip title={'Star'}>
                            <div id={'star'} className=" text-yellow-400" onClick={() => setMenuVisibility(true)}>
                                <span className='text-2xl'><FaRegStar /></span>
                            </div>
                        </Tooltip>
                    </div>
                )}
            </div>

            <div className='flex items-center space-x-4 nav-user'>
                <Dropdown menu={{ items: menu }} trigger={['click']} placement="bottomLeft">
                    <div className="flex items-center space-x-2 cursor-pointer text-white">
                        <img src={language === 'en' ? flag_EN : flag_VI} alt={language} className="w-8 h-5" />
                        <span className="text_first">{language === 'vi' ? 'Vietnamese' : 'English'}</span>
                    </div>
                </Dropdown>

                <SearchOutlined onClick={() => setMenuVisibility()} className="text_first text-2xl" />

                <button className='text-white'>
                    <Tooltip title='Toggle Theme'>
                        <SwitchTheme />
                    </Tooltip>
                </button>

                <Dropdown
                    placement="bottomRight"
                    menu={{ items: menuNotice }}
                    trigger={['click']}
                    className='me-24 custom-dropdown-notice'>
                    <div className='flex items-center cursor-pointer'>
                        <Badge count={allNotifications?.length} offset={[-4, 4]}>
                            <MdNotificationsNone size={30} className="text_first" />
                        </Badge>
                    </div>
                </Dropdown>

                <div className='flex items-center space-x-2 cursor-pointer'>
                    <Dropdown
                        dropdownRender={() => <ActionOnAvatar />}
                        trigger={["click"]}
                        placement="bottomRight"
                    >
                        <Avatar src={userData?.avatar?.file_path} size='large' />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default NavbarComponent;
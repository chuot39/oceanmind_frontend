import React, { useMemo, useEffect, useRef } from 'react';
import useSkin from '@utils/hooks/useSkin';
import { useNotificationCreatedBy, useUserData } from '@utils/hooks/useAuth';
import { NavLink } from 'react-router-dom';
import '@core/scss/styles/pages/dashboard/index.scss'

import postImage from '@assets/icons/notifications/post.png';
import systemImage from '@assets/icons/notifications/system.png';
import newTaskImage from '@assets/icons/notifications/new_task.png';
import overdueTaskImage from '@assets/icons/notifications/overdue_task.png';
import upcomingTaskImage from '@assets/icons/notifications/upcoming_task.png';
import eventImage from '@assets/icons/notifications/event.png';
import messageImage from '@assets/icons/notifications/message.png';
import robotImage from '@assets/icons/notifications/robot.png';
import defaultUserImage from '@assets/icons/notifications/default_user.png';
import Hamster from '@/components/loader/Hamster/Hamster';
import { useUserNotice } from '../../components/hook';
import BtnLoadMore from '@/components/button/ui/BtnLoadMore';
import Loading from '@/components/loader/Loading';
import { formatDate } from '@/utils';

const imageMapping = {
    "Post": postImage,
    "System": systemImage,
    "Notification": systemImage,
    "New Task": newTaskImage,
    "Overdue Task": overdueTaskImage,
    "Upcoming Task": upcomingTaskImage,
    "Event": eventImage,
    "Message": messageImage,
};

const Dashboard = () => {
    const { userData } = useUserData();
    const { skin } = useSkin();
    const loadingRef = useRef(null);

    const {
        status,
        data,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useUserNotice(userData?.documentId);

    const allNotifications = useMemo(() => {
        return data?.pages?.flatMap(page => page.data) || [];
    }, [data]);


    const handleScroll = () => {
        if (loadingRef.current) {
            const { top } = loadingRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (top <= windowHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    console.log('allNotifications', allNotifications);

    return (
        <div className='min-h-screen bg-transparent notification_page'>
            {status === 'loading' ? (
                <div className='flex justify-center items-center h-screen'>
                    <Hamster />
                </div>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                        {allNotifications?.map((item) => {

                            return (
                                <NavLink
                                    to={item?.notification?.link}
                                    key={item.documentId}
                                    className={`list_notification flex items-start p-3 rounded-lg transition-all duration-200 ${skin === 'dark' ? 'hover:bg-blue-950' : 'hover:bg-blue-100'}`}
                                >
                                    <div className='relative'>
                                        <div className='flex-shrink-0 me-2 w-12 h-12 flex items-center justify-center rounded-full overflow-hidden'>
                                            <img
                                                src={item?.notification?.creator?.avatar?.file_path || robotImage}
                                                alt='Avatar'
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='flex-shrink-0 me-2 w-6 h-6 absolute top-7 -right-1 flex items-center justify-center rounded-full overflow-hidden'>
                                            <img
                                                src={imageMapping[item?.notification?.noticeType?.name_en] || defaultUserImage}
                                                alt='Avatar'
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    </div>

                                    <div className={`flex-grow ${skin === 'dark' ? '' : 'hover:text-blue-800'}`}>
                                        <p className='media-heading text_first'>
                                            <span className='font-medium'>{item?.notification?.title}</span>
                                        </p>
                                        <p className='ps-3 text-xs font-thin text_secondary py-1'>{item?.notification?.content}</p>
                                        <p className='text_third text-xs font-medium'>{formatDate(item?.createdAt)}</p>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>

                    <div ref={loadingRef} className="flex justify-center mt-4">
                        {hasNextPage ? (
                            <div className='flex justify-center mt-4'
                                onClick={() => fetchNextPage()}
                            >
                                {isFetchingNextPage ? (
                                    <Loading />
                                ) : (
                                    <BtnLoadMore
                                        loading={isFetchingNextPage}
                                    >
                                    </BtnLoadMore>
                                )}
                            </div>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Card, Divider, Input, Modal } from 'antd';
import { BsSearch } from 'react-icons/bs';
import useSkin from '../../../../utils/hooks/useSkin';
import { FaRegEye } from 'react-icons/fa';
import '../../../../core/scss/styles/pages/social/index.scss'
import { TfiCommentAlt } from 'react-icons/tfi';
import { useEvent, useEventDetail } from '../overview/hook';
import avatar_university from '../../../../assets/images/logo/avatar_university.png'
import { formatDate } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import { useIntl } from 'react-intl';
import Hamster from '@/components/loader/Hamster/Hamster';
import BtnLoadMore from '@/components/button/ui/BtnLoadMore';
import Loading from '@/components/loader/Loading';
import BtnLocation from '@/components/button/ui/BtnLocation';

const { Search } = Input;

const Dashboard = () => {
    const { skin } = useSkin();
    const intl = useIntl();
    const loadingRef = useRef(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    const {
        status,
        data,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useEventDetail();


    const allEvents = useMemo(() => {
        return data?.pages?.flatMap(page => page.data) || [];
    }, [data]);

    const filteredEvents = useMemo(() => {
        if (!searchText) return allEvents;
        return allEvents.filter((event) =>
            event?.name?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, allEvents]);

    const handleScroll = () => {
        if (loadingRef.current) {
            const { top } = loadingRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (top <= windowHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    console.log('allEvents', allEvents);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    const showEventDetails = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const safeFormatDate = (date) => {
        if (!date) return '-';
        try {
            return formatDate(date);
        } catch (error) {
            return '-';
        }
    };

    return (
        <div className="min-h-screen bg-transparent event-page">
            <div className="grid grid-cols-12 gap-4 relative">
                {/* Main Content - Scrollable */}
                {status === 'loading' ? (
                    <div className="col-span-12 lg:col-span-8 flex justify-center items-center p-4">
                        <Hamster />
                    </div>
                ) : (
                    <div className="col-span-12 lg:col-span-8 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredEvents?.map((event) => (
                                <Card
                                    key={event?.documentId}
                                    className="border-none event-card"
                                    cover={
                                        <img
                                            alt={event?.name}
                                            src={event?.banner?.file_path}
                                            className="h-56 w-auto object-cover"
                                        />
                                    }
                                >
                                    <div className="space-y-2 event-main-content">
                                        <h3 className="text-base font-medium line-clamp-2">
                                            {event?.name}
                                        </h3>

                                        <div className='flex content-between gap-2 items-center '>
                                            <img src={avatar_university} alt="3D Sphere" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className='text-sm font-semibold'><span className='text_secondary font-light'>by </span> <span className='text_secondary'>Super Admin OceanMind | </span></p>
                                                <p className='text-sm text_third font-medium pt-1'>
                                                    <FormattedMessage id="dashboard.posted_time" />
                                                    {" "}{safeFormatDate(event?.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Divider className='my-2 border-1' />
                                        <div className="flex items-center justify-end text-sm font-bold">
                                            <span
                                                className="flex items-center justify-center gap-1 cursor-pointer text_action"
                                                onClick={() => showEventDetails(event)}
                                            >
                                                <FaRegEye className='w-4 h-4 mt-1' />
                                                <FormattedMessage id="dashboard.event.view_details" />
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
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
                                        />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Sidebar - Fixed */}
                <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-[50px] h-fit p-4 space-y-4">
                    <Search
                        className="w-full"
                        placeholder={intl.formatMessage({
                            id: 'dashboard.search.placeholder',
                            defaultMessage: "Enter subject name"
                        })}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    {/* Events this week */}
                    <Card
                        title={intl.formatMessage({ id: 'dashboard.event.this_week' })}
                        className="border-none"
                        loading={status === 'loading'}
                    >
                        <div className="space-y-4">
                            {allEvents?.slice(0, 4).map((event) => (
                                <div key={event?.documentId} className="flex space-x-3">
                                    <img
                                        src={event?.banner?.file_path}
                                        alt={event?.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium line-clamp-2 text-secondary">
                                            {event?.name}
                                        </h4>
                                        <span className="text-xs text-third">
                                            <FormattedMessage id="dashboard.posted_time" />
                                            {" "}{safeFormatDate(event?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Event Details Modal */}
            <Modal
                title={selectedEvent?.name}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={700}
                className={`event-details-modal ${skin === 'dark' ? 'dark-mode' : ''}`}
            >
                {selectedEvent && (
                    <div className="event-details-content">
                        <div className="banner-container mb-4">
                            <img
                                src={selectedEvent?.banner?.file_path}
                                alt={selectedEvent?.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>

                        <div className="event-info space-y-4">
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-xl font-semibold">{selectedEvent?.name}</h2>
                                <Divider />
                                <div className="flex gap-x-4">
                                    <div>
                                        <p className="text-sm font-medium">
                                            <FormattedMessage id="dashboard.event.start_date" />
                                        </p>
                                        <p className="text-base">
                                            {safeFormatDate(selectedEvent?.start_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            <FormattedMessage id="dashboard.event.due_date" />
                                        </p>
                                        <p className="text-base">
                                            {safeFormatDate(selectedEvent?.due_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    <FormattedMessage id="dashboard.event.description" />
                                </p>
                                <p className="text-base whitespace-pre-line">{selectedEvent?.description || '-'}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    <FormattedMessage id="dashboard.event.location" />
                                </p>
                                <div className="text-base flex items-center gap-2">  <BtnLocation /> {selectedEvent?.location || '-'}</div>
                            </div>


                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Dashboard;
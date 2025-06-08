import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Image, Popconfirm } from 'antd';
import { BsEye, BsTrash, BsPencil, BsCalendarEvent, BsGeoAlt, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { useDeleteEvent, usePermanentDeleteEvent, useRestoreEvent } from '../mutationHook';
import Delete from '@/components/button/action/Delete';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import BtnEdit from '@/components/button/action/BtnEdit';

const EventTable = ({ data, loading, pagination, onChange, onEdit, onView, refetchEvents }) => {
    const intl = useIntl();
    const { mutate: deleteEvent, isLoading: isDeleting } = useDeleteEvent();
    const { mutate: restoreEvent, isLoading: isRestoring } = useRestoreEvent();
    const { mutate: permanentDeleteEvent, isLoading: isPermanentDeleting } = usePermanentDeleteEvent();


    const handleDelete = (documentId) => {
        return ModalConfirm({
            typeModal: 'delete_event',
            loading: isDeleting,
            handleResolve: async () => {
                deleteEvent({ documentId },
                    {
                        onSuccess: () => {
                            refetchEvents();
                        },
                        onError: (error) => {
                            console.error("Error deleting event:", error);
                        }
                    }
                );
            },
            intl: intl
        });
    };

    // Handle restore notification
    const handleRestore = (documentId) => {
        return ModalConfirm({
            typeModal: 'restore_event',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    restoreEvent({ documentId },
                        {
                            onSuccess: () => {
                                refetchEvents();
                            },
                            onError: (error) => {
                                console.error("Error restoring event:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring event:", error);
                }
            },
            intl: intl
        });
    };

    // Handle permanent delete notification
    const handlePermanentDelete = (documentId) => {
        return ModalConfirm({
            typeModal: 'permanent_delete_event',
            loading: isPermanentDeleting,
            handleResolve: async () => {
                try {
                    await permanentDeleteEvent({ documentId },
                        {
                            onSuccess: () => {
                                refetchEvents();
                            },
                            onError: (error) => {
                                console.error("Error permanently deleting event:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error permanently deleting event:", error);
                }
            },
            intl: intl
        });
    };


    const columns = [
        {
            title: <FormattedMessage id="event.table.banner" defaultMessage="Banner" />,
            dataIndex: 'banner',
            key: 'banner',
            width: 100,
            render: (banner) => (
                banner ? (
                    <Image
                        src={banner?.file_path}
                        alt="Event Banner"
                        style={{ width: 80, height: 45, objectFit: 'cover' }}
                        preview={{
                            mask: <BsEye size={16} />
                        }}
                    />
                ) : (
                    <div className="w-20 h-10 flex items-center justify-center">
                        <FormattedMessage id="event.table.no_image" defaultMessage="No Image" />
                    </div>
                )
            )
        },
        {
            title: <FormattedMessage id="event.table.name" defaultMessage="Event Name" />,
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
                <span className="font-medium">{text}</span>
            ),
        },
        {
            title: <FormattedMessage id="event.table.date" defaultMessage="Date" />,
            key: 'date',
            width: 200,
            sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
            render: (_, record) => {
                const startDate = moment(record.start_date).format('DD/MM/YYYY');
                const dueDate = moment(record.due_date).format('DD/MM/YYYY');
                const isSameDay = startDate === dueDate;

                return (
                    <div className="flex items-center">
                        <BsCalendarEvent className="mr-2 text-blue-500" />
                        {isSameDay ? (
                            <span>{startDate}</span>
                        ) : (
                            <span>{startDate} - {dueDate}</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: <FormattedMessage id="event.table.location" defaultMessage="Location" />,
            dataIndex: 'location',
            key: 'location',
            width: 300,
            ellipsis: true,
            render: (text) => (
                <div className="flex items-center">
                    <BsGeoAlt className="mr-2 text-red-500" />
                    <span className='truncate max-w-[200px]'>{text}</span>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="event.table.status" defaultMessage="Status" />,
            key: 'status',
            width: 120,
            render: (_, record) => {
                const today = moment();
                const startDate = moment(record.start_date);
                const dueDate = moment(record.due_date);

                let status;
                let color;

                if (today < startDate) {
                    status = <FormattedMessage id="event.status.upcoming" defaultMessage="Upcoming" />;
                    color = 'blue';
                } else if (today > dueDate) {
                    status = <FormattedMessage id="event.status.past" defaultMessage="Past" />;
                    color = 'gray';
                } else {
                    status = <FormattedMessage id="event.status.ongoing" defaultMessage="Ongoing" />;
                    color = 'green';
                }

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: <FormattedMessage id="event.table.actions" defaultMessage="Actions" />,
            key: 'actions',
            width: 250,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={intl.formatMessage({ id: 'event.action.view', defaultMessage: 'View Details' })}>
                        <Button
                            type="text"
                            size="small"
                            className="!text-blue-500 bg-yellow-200 hover:!bg-yellow-300"
                            icon={<BsEye />}
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({ id: 'event.action.edit', defaultMessage: 'Edit' })}>
                        <Button
                            type="text"
                            size="small"
                            icon={<BtnEdit />}
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>

                    {record?.deletedAt ? (
                        <>
                            <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.restore', defaultMessage: 'Restore' })}>
                                <Button
                                    type="text"
                                    size="small"
                                    className="!text-green-500 bg-blue-100"
                                    loading={isRestoring}
                                    icon={<BsArrowCounterclockwise />}
                                    onClick={() => handleRestore(record?.documentId)}
                                />
                            </Tooltip>
                            <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.permanent_delete', defaultMessage: 'Permanent Delete' })}>
                                <Button
                                    type="text"
                                    size="small"
                                    className='flex'
                                    danger
                                    loading={isPermanentDeleting}
                                    icon={<Delete />}
                                    onClick={() => handlePermanentDelete(record?.documentId)}
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <Tooltip title={intl.formatMessage({ id: 'event.action.delete', defaultMessage: 'Delete' })}>
                            <Button
                                type="text"
                                size="small"
                                className='flex'
                                danger
                                // icon={<BsTrash />}
                                icon={<Delete />}
                                loading={isDeleting}
                                onClick={() => handleDelete(record?.documentId)}
                            />
                        </Tooltip>
                    )}

                    {/* 
                    <Tooltip title={intl.formatMessage({ id: 'event.action.delete', defaultMessage: 'Delete' })}>
                        <Button
                            type="text"
                            size="small"
                            className='flex'
                            danger
                            // icon={<BsTrash />}
                            icon={<Delete />}
                            loading={isDeleting}
                            onClick={() => handleDelete(record?.documentId)}
                        />
                    </Tooltip> */}
                </Space>
            ),
        },
    ];

    return (
        <Table
            className="custom-event-table"
            columns={columns}
            dataSource={data?.map((item, index) => ({ ...item, key: item.documentId || index }))}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            scroll={{ x: 1000 }}
        // rowClassName="hover:bg-gray-50"
        />
    );
};

export default EventTable; 
import React, { useState } from 'react';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { BsEye, BsGlobe, BsPeople, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { useDeleteNotification, usePermanentDeleteNotification, useRestoreNotification } from '../mutationHooks';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import Delete from '@/components/button/action/Delete';

const NotificationTable = ({ data, loading, pagination, onChange, onEdit, onView, onLoadMore, hasMore, refetchNotifications }) => {
    const intl = useIntl();
    const { mutate: deleteNotification, isLoading: isDeleting } = useDeleteNotification();
    const { mutate: restoreNotification, isLoading: isRestoring } = useRestoreNotification();
    const { mutate: permanentDeleteNotification, isLoading: isPermanentDeleting } = usePermanentDeleteNotification();

    // const handleDelete = (id) => {
    //     deleteNotification(id);
    // };

    const handleDelete = (documentId) => {
        return ModalConfirm({
            typeModal: 'delete_notification',
            loading: isDeleting,
            handleResolve: async () => {
                await deleteNotification({ documentId },
                    {
                        onSuccess: () => {
                            refetchNotifications();
                        },
                        onError: (error) => {
                            console.error("Error deleting notification:", error);
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
            typeModal: 'restore_notification',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    await restoreNotification({ documentId },
                        {
                            onSuccess: () => {
                                refetchNotifications();
                            },
                            onError: (error) => {
                                console.error("Error restoring notification:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring notification:", error);
                }
            },
            intl: intl
        });
    };

    // Handle permanent delete notification
    const handlePermanentDelete = (documentId) => {
        return ModalConfirm({
            typeModal: 'permanent_delete_notification',
            loading: isPermanentDeleting,
            handleResolve: async () => {
                try {
                    await permanentDeleteNotification({ documentId },
                        {
                            onSuccess: () => {
                                refetchNotifications();
                            },
                            onError: (error) => {
                                console.error("Error permanently deleting notification:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error permanently deleting notification:", error);
                }
            },
            intl: intl
        });
    };


    const columns = [
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.title" defaultMessage="Title" />,
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            sorter: (a, b) => a?.title?.localeCompare(b?.title),
            render: (text, record) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.type" defaultMessage="Type" />,
            dataIndex: 'noticeType',
            key: 'notice_type',
            width: 150,
            render: (noticeType) => (
                <Tag color={noticeType?.color || 'red'}>{noticeType?.name_en}</Tag>
            ),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.target" defaultMessage="Target" />,
            dataIndex: 'is_global',
            key: 'is_global',
            width: 130,
            filters: [
                { text: intl.formatMessage({ id: 'admin.dashboard.notification.table.global', defaultMessage: 'Global' }), value: true },
                { text: intl.formatMessage({ id: 'admin.dashboard.notification.table.specific', defaultMessage: 'Specific' }), value: false },
            ],
            onFilter: (value, record) => record?.is_global === value,
            render: (isGlobal) => (
                <Tag color={isGlobal ? 'green' : 'blue'}>
                    {isGlobal ? (
                        <span className="flex items-center gap-1">
                            <BsGlobe size={14} />
                            <FormattedMessage id="admin.dashboard.notification.table.global" defaultMessage="Global" />
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <BsPeople size={14} />
                            <FormattedMessage id="admin.dashboard.notification.table.specific" defaultMessage="Specific" />
                        </span>
                    )}
                </Tag>
            ),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.status" defaultMessage="Status" />,
            dataIndex: 'deletedAt',
            key: 'status',
            width: 120,
            filters: [
                { text: intl.formatMessage({ id: 'admin.dashboard.notification.table.active', defaultMessage: 'Active' }), value: false },
                { text: intl.formatMessage({ id: 'admin.dashboard.notification.table.deleted', defaultMessage: 'Soft Deleted' }), value: true },
            ],
            onFilter: (value, record) => (!!record?.deletedAt) === value,
            render: (deletedAt) => (
                <Tag color={deletedAt ? 'red' : 'green'}>
                    {deletedAt ? (
                        <FormattedMessage id="admin.dashboard.notification.table.deleted" defaultMessage="Soft Deleted" />
                    ) : (
                        <FormattedMessage id="admin.dashboard.notification.table.active" defaultMessage="Active" />
                    )}
                </Tag>
            ),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.date" defaultMessage="Date" />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
            render: (date) => format(new Date(date), 'dd/MM/yyyy HH:mm'),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.created_by" defaultMessage="Created By" />,
            dataIndex: 'creator',
            key: 'notification_created_by',
            width: 150,
            render: (user) => user?.fullname,
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.read_status" defaultMessage="Read Status" />,
            dataIndex: 'userNotifications',
            key: 'stats',
            width: 200,
            render: (userNotifications) => (
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text_secondary">
                            <FormattedMessage id="admin.dashboard.notification.table.read" defaultMessage="Read" />: {userNotifications?.map(item => item?.is_read).filter(Boolean).length}
                        </span>
                        <span className="text-xs text_secondary">
                            <FormattedMessage id="admin.dashboard.notification.table.unread" defaultMessage="Unread" />: {userNotifications?.map(item => !item?.is_read).filter(Boolean).length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(userNotifications?.map(item => item?.is_read).filter(Boolean).length / userNotifications?.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text_secondary mt-1 text-right">
                        {Math.round((userNotifications?.map(item => item?.is_read).filter(Boolean).length / userNotifications?.length) * 100) || 0}%
                    </div>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.dashboard.notification.table.actions" defaultMessage="Actions" />,
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.view', defaultMessage: 'View Details' })}>
                        <Button
                            type="text"
                            size="small"
                            className="!text-blue-500 bg-yellow-100 hover:!bg-yellow-200"
                            icon={<BsEye />}
                            onClick={() => onView(record)}
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
                        <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.delete', defaultMessage: 'Delete' })}>
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
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data?.map((item, index) => ({ ...item, key: item?.documentId || index }))}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            scroll={{ x: 1200 }}
        // rowClassName={(record) => `hover:bg-gray-50 ${record?.deletedAt ? 'bg-gray-50' : ''}`}
        />
    );
};

export default NotificationTable; 
import React, { useState } from 'react';
import { Table, Space, Button, Tooltip, Tag, ConfigProvider } from 'antd';
import { BsEye, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import BtnEdit from '@/components/button/action/BtnEdit';
import Delete from '@/components/button/action/Delete';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import { useRestoreSubject } from '../mutationHook';

const SubjectTable = ({ data, loading, pagination, onView, onEdit, onDelete, onChange }) => {
    const intl = useIntl();

    const { mutate: restoreSubject, isLoading: isRestoring } = useRestoreSubject();

    // Handle restore notification
    const handleRestore = (documentId) => {
        return ModalConfirm({
            typeModal: 'restore_subject',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    restoreSubject({ documentId },
                        {
                            onSuccess: () => { },
                            onError: (error) => {
                                console.error("Error restoring subject:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring subject:", error);
                }
            },
            intl: intl
        });
    };

    const columns = [
        {
            title: <FormattedMessage id="admin.subject.code" defaultMessage="Subject Code" />,
            dataIndex: 'subject_code',
            key: 'subject_code',
            sortDirections: ['ascend', 'descend'],
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: <FormattedMessage id="admin.subject.name" defaultMessage="Subject Name" />,
            dataIndex: 'name',
            key: 'name',
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="admin.subject.credits" defaultMessage="Credits" />,
            dataIndex: 'credits',
            key: 'credits',
            width: 100,
            sortDirections: ['ascend', 'descend'],
            render: (credits) => (
                <Tag className="tag-credits">
                    {credits}
                </Tag>
            ),
        },
        {
            title: <FormattedMessage id="admin.subject.prerequisite_subjects" defaultMessage="Prerequisite Subjects" />,
            key: 'prerequisite_subjects',
            render: (_, record) => (
                <div style={{ maxWidth: '200px' }}>
                    {record?.prerequisite_subjects?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {record?.prerequisite_subjects?.slice(0, 2).map((spec, index) => (
                                <Tag key={index} className="tag-specialization">
                                    {spec?.prerequisite_subject?.name || 'N/A'}
                                </Tag>
                            ))}
                            {record?.prerequisite_subjects?.length > 2 && (
                                <Tag>+{record?.prerequisite_subjects?.length - 2}</Tag>
                            )}
                        </div>
                    ) : (
                        <span className='text_secondary' style={{ fontStyle: 'italic' }}>
                            <FormattedMessage id="admin.subject.no_specializations" defaultMessage="None" />
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.subject.previous_subjects" defaultMessage="Previous Subjects" />,
            key: 'previous_subjects',
            render: (_, record) => (
                <div style={{ maxWidth: '200px' }}>
                    {record?.previous_subjects?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {record?.previous_subjects?.slice(0, 2).map((spec, index) => (
                                <Tag key={index} className="tag-specialization">
                                    {spec?.previous_subject?.name || 'N/A'}
                                </Tag>
                            ))}
                            {record?.previous_subjects?.length > 2 && (
                                <Tag>+{record?.previous_subjects?.length - 2}</Tag>
                            )}
                        </div>
                    ) : (
                        <span className='text_secondary' style={{ fontStyle: 'italic' }}>
                            <FormattedMessage id="admin.subject.no_specializations" defaultMessage="None" />
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.subject.created_at" defaultMessage="Created At" />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            sortDirections: ['ascend', 'descend'],
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: <FormattedMessage id="admin.subject.actions" defaultMessage="Actions" />,
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    {record?.deletedAt ? (
                        <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.restore', defaultMessage: 'Restore' })}>
                            <Button
                                type="text"
                                size="small"
                                className="!text-green-500 bg-blue-100 hover:!bg-blue-200"
                                loading={isRestoring}
                                icon={<BsArrowCounterclockwise />}
                                onClick={() => handleRestore(record?.documentId)}
                            />
                        </Tooltip>
                    ) : (
                        <>
                            <Tooltip title={intl.formatMessage({ id: 'admin.subject.view', defaultMessage: 'View Details' })}>
                                <Button
                                    type="text"
                                    size="small"
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
                            <Tooltip title={intl.formatMessage({ id: 'event.action.delete', defaultMessage: 'Delete' })}>
                                <Button
                                    type="text"
                                    size="small"
                                    className='flex'
                                    danger
                                    icon={<Delete />}
                                    onClick={() => onDelete(record)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider
            table={{
                sortTooltip: true,
            }}
        >
            <Table
                className="subject-table"
                columns={columns}
                dataSource={data?.map(item => ({ ...item, key: item.documentId }))}
                loading={loading}
                pagination={pagination}
                onChange={onChange}
                rowClassName="cursor-pointer"
            />
        </ConfigProvider>
    );
};

export default SubjectTable; 
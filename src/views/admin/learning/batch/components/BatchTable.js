import React, { useState } from 'react';
import { Table, Space, Button, Tooltip, Tag, ConfigProvider } from 'antd';
import { BsTrash, BsPencil, BsSortNumericDown, BsSortAlphaDown, BsSortAlphaUp, BsSortNumericUp, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { useRestoreBatch } from '../mutationHook';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import BtnEdit from '@/components/button/action/BtnEdit';
import Delete from '@/components/button/action/Delete';

const BatchTable = ({ data, loading, pagination, onEdit, onDelete }) => {
    const intl = useIntl();

    const [sortInfo, setSortInfo] = useState(null);

    const { mutate: restoreBatch, isLoading: isRestoring } = useRestoreBatch();
    // Hàm xử lý khi thay đổi sắp xếp
    const handleTableChange = (pagination, filters, sorter) => {
        setSortInfo(sorter);
    };

    // Handle restore notification
    const handleRestore = (documentId) => {
        return ModalConfirm({
            typeModal: 'restore_batch',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    restoreBatch({ documentId },
                        {
                            onSuccess: () => { },
                            onError: (error) => {
                                console.error("Error restoring batch:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring batch:", error);
                }
            },
            intl: intl
        });
    };

    // Tạo tiêu đề cột với biểu tượng sắp xếp tùy chỉnh
    const getColumnTitle = (title, dataIndex, isNumeric = false) => {
        const isSorted = sortInfo && (sortInfo.field === dataIndex || sortInfo.columnKey === dataIndex);
        const isAscending = isSorted && sortInfo.order === 'ascend';

        let sortIcon = null;
        if (isSorted) {
            if (isNumeric) {
                sortIcon = isAscending ? <BsSortNumericDown className="ml-1 !text-xl text-blue-300" /> : <BsSortNumericUp className="ml-1 !text-xl text-blue-300" />;
            } else {
                sortIcon = isAscending ? <BsSortAlphaDown className="ml-1 !text-xl text-blue-300" /> : <BsSortAlphaUp className="ml-1 !text-xl text-blue-300" />;
            }
        }

        return (
            <div className="flex items-center">
                {title}
                {sortIcon}
            </div>
        );
    };


    const columns = [
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.name" defaultMessage="Batch Name" />, 'name'),
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.period" defaultMessage="Period" />, 'period'),
            key: 'period',
            // sorter: (a, b) => a.period.localeCompare(b.period),
            render: (_, record) => {
                const startYear = new Date(record.start_year).getFullYear();
                const endYear = new Date(record.end_year).getFullYear();
                return (
                    <Tag color="blue">
                        {startYear} - {endYear}
                    </Tag>
                );
            },
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.start_year" defaultMessage="Start Year" />, 'start_year'),
            dataIndex: 'start_year',
            key: 'start_year',
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
            sorter: (a, b) => new Date(a.start_year) - new Date(b.start_year),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.end_year" defaultMessage="End Year" />, 'end_year'),
            dataIndex: 'end_year',
            key: 'end_year',
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
            sorter: (a, b) => new Date(a.end_year) - new Date(b.end_year),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.created_at" defaultMessage="Created At" />, 'createdAt', true),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.batch.actions" defaultMessage="Actions" />, 'actions'),
            key: 'actions',
            width: 120,
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

    // Tùy chỉnh các thông báo tooltip cho các biểu tượng sắp xếp
    const customizeTableLocale = {
        triggerDesc: intl.formatMessage({ id: 'reuse.click_to_sort_desc', defaultMessage: 'Click to sort descending' }),
        triggerAsc: intl.formatMessage({ id: 'reuse.click_to_sort_asc', defaultMessage: 'Click to sort ascending' }),
        cancelSort: intl.formatMessage({ id: 'reuse.click_to_sort_cancel', defaultMessage: 'Click to cancel sorting' })
    };

    return (
        <ConfigProvider
            table={{
                sortTooltip: true,
            }}
        >
            <Table
                className="batch-table"
                columns={columns}
                dataSource={data?.map(item => ({ ...item, key: item.documentId }))}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                rowClassName="cursor-pointer"
                locale={customizeTableLocale}
                showSorterTooltip={true}
            />
        </ConfigProvider>
    );
};

export default BatchTable; 
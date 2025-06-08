import React, { useState } from 'react';
import { Table, Space, Button, Tooltip, Tag, ConfigProvider } from 'antd';
import { BsTrash, BsPencil, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import BtnEdit from '@/components/button/action/BtnEdit';
import Delete from '@/components/button/action/Delete';
import { BsSortAlphaDown, BsSortAlphaUp, BsSortNumericDown, BsSortNumericUp } from 'react-icons/bs';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import { useRestoreSpecialization } from '../mutationHook';

const SpecializationTable = ({ data, loading, pagination, onEdit, onDelete }) => {
    const intl = useIntl();

    const { mutate: restoreSpecialization, isLoading: isRestoring } = useRestoreSpecialization();
    const [sortInfo, setSortInfo] = useState(null);

    // Hàm xử lý khi thay đổi sắp xếp
    const handleTableChange = (pagination, filters, sorter) => {
        setSortInfo(sorter);
    };

    // Handle restore notification
    const handleRestore = (documentId) => {
        return ModalConfirm({
            typeModal: 'restore_specialization',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    restoreSpecialization({ documentId },
                        {
                            onSuccess: () => { },
                            onError: (error) => {
                                console.error("Error restoring specialization:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring specialization:", error);
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
            title: getColumnTitle(<FormattedMessage id="admin.specialization.vn_name" defaultMessage="Vietnamese Name" />, 'name_vi'),
            dataIndex: 'name_vi',
            key: 'name_vi',
            sorter: (a, b) => a.name_vi.localeCompare(b.name_vi),
            sortDirections: ['ascend', 'descend'],
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.specialization.en_name" defaultMessage="English Name" />, 'name_en'),
            dataIndex: 'name_en',
            key: 'name_en',
            sorter: (a, b) => a.name_en.localeCompare(b.name_en),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <FormattedMessage id="admin.specialization.faculty" defaultMessage="Faculty" />,
            dataIndex: 'faculty',
            key: 'faculty',
            sorter: (a, b) => a.name_en.localeCompare(b.name_en),
            render: (faculty) => (
                <Tag color="blue">
                    {faculty?.name_vi || 'N/A'}
                </Tag>
            ),
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.specialization.created_at" defaultMessage="Created At" />, 'createdAt', true),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['ascend', 'descend'],
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: getColumnTitle(<FormattedMessage id="admin.specialization.updated_at" defaultMessage="Updated At" />, 'updatedAt', true),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            sortDirections: ['ascend', 'descend'],
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: <FormattedMessage id="admin.specialization.actions" defaultMessage="Actions" />,
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
                className="specialization-table"
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

export default SpecializationTable; 
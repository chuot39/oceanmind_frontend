import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Avatar } from 'antd';
import { BsEye, BsExclamationCircle, BsCheckCircle, BsClock } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { getStatusTag } from '@/helpers/systemHelper';

const ReportTable = ({ data, loading, pagination, onChange, onView }) => {
    const intl = useIntl();
    const columns = [
        {
            title: <FormattedMessage id="admin.report.group.group_reported" defaultMessage="Group" />,
            dataIndex: 'reportedGroup',
            key: 'group',
            render: (group) => (
                <div className="flex items-start">
                    <div className="flex-1">
                        <div className="font-medium text_first line-clamp-2">{group?.name}</div>
                        <div className="text-xs text_secondary mt-1 flex items-center">
                            <Avatar
                                src={group?.coverImage?.file_path}
                                size={22}
                                className="mr-1"
                            />
                            <span>{group?.creator?.fullname}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.reason" defaultMessage="Reason" />,
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <div className="max-w-xs truncate">{text}</div>
                </Tooltip>
            ),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.reporter" defaultMessage="Reported By" />,
            dataIndex: 'reporter',
            key: 'reporter',
            // width: 180,
            render: (user) => (
                <div className="flex items-center">
                    <Avatar
                        src={user?.avatar?.file_path}
                        size={32}
                        className="mr-2"
                    />
                    <div>
                        <div className="font-medium truncate line-clamp-1">{user?.fullname}</div>
                        <div className="text-xs text_secondary truncate line-clamp-1">{user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.date" defaultMessage="Date" />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.status" defaultMessage="Status" />,
            dataIndex: 'status_report',
            key: 'status',
            width: 140,
            render: (status) => getStatusTag(status, 14),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.actions" defaultMessage="Actions" />,
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={intl.formatMessage({ id: 'common.view_detail', defaultMessage: 'View Details' })}>
                        <Button
                            type="text"
                            size="small"
                            className="!text-blue-500 bg-yellow-100 hover:!bg-yellow-200"
                            icon={<BsEye />}
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            className="custom-report-table"
            columns={columns}
            dataSource={data?.map(item => ({ ...item, key: item.documentId }))}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            rowClassName="cursor-pointer"
            onRow={(record) => ({
                onClick: () => onView(record),
            })}
        />
    );
};

export default ReportTable; 
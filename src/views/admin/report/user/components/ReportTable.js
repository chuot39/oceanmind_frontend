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
            title: <FormattedMessage id="admin.report.user.table.user" defaultMessage="User" />,
            dataIndex: 'reportedUser',
            key: 'user',
            render: (user) => (
                <div className="flex items-center">
                    <Avatar
                        src={user?.avatar?.file_path}
                        size={40}
                        className="mr-3"
                    />
                    <div>
                        <div className="font-medium text_first">{user?.fullname}</div>
                        <div className="text-xs text_secondary mt-1">
                            <div>{user?.email}</div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.report.user.table.reason" defaultMessage="Reason" />,
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
            title: <FormattedMessage id="admin.report.user.table.reporter" defaultMessage="Reported By" />,
            dataIndex: 'reporter',
            key: 'reporter',
            width: 200,
            render: (user) => (
                <div className="flex items-center">
                    <Avatar
                        src={user?.avatar?.file_path}
                        size={32}
                        className="mr-2"
                    />
                    <div>
                        <div className="font-medium">{user?.fullname}</div>
                        <div className="text-xs text_secondary">{user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: <FormattedMessage id="admin.report.user.table.date" defaultMessage="Date" />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: <FormattedMessage id="admin.report.user.table.status" defaultMessage="Status" />,
            dataIndex: 'status_report',
            key: 'status',
            width: 150,
            render: (status) => getStatusTag(status, 14),
        },
        {
            title: <FormattedMessage id="admin.report.user.table.actions" defaultMessage="Actions" />,
            key: 'actions',
            width: 100,
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
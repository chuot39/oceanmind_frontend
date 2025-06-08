import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Avatar, Image } from 'antd';
import { BsEye, BsExclamationCircle, BsCheckCircle, BsClock } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';

const ReportTable = ({ data, loading, pagination, onChange, onView }) => {
    const intl = useIntl();

    const getStatusTag = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <Tag color="orange" className="flex items-center gap-1">
                        <BsClock size={14} />
                        <FormattedMessage id="admin.report.post.stats.pending" defaultMessage="Pending" />
                    </Tag>
                );
            case 'denied':
                return (
                    <Tag color="purple" className="flex items-center gap-1">
                        <BsExclamationCircle size={14} />
                        <FormattedMessage id="admin.report.post.stats.denied" defaultMessage="Denied" />
                    </Tag>
                );
            case 'resolved':
                return (
                    <Tag color="green" className="flex items-center gap-1">
                        <BsCheckCircle size={14} />
                        <FormattedMessage id="admin.report.post.stats.resolved" defaultMessage="Resolved" />
                    </Tag>
                );
            default:
                return (
                    <Tag color="default">
                        {status}
                    </Tag>
                );
        }
    };

    const columns = [
        {
            title: <FormattedMessage id="admin.report.post.table.post" defaultMessage="Post" />,
            dataIndex: 'reportedPost',
            key: 'post',
            render: (post) => (
                <div className="flex items-start">
                    <div className="flex-1">
                        <div className="font-medium text_first line-clamp-2">{post?.content}</div>
                        <div className="text-xs text_secondary mt-1 flex items-center">
                            <Avatar
                                src={post?.author?.avatar?.file_path}
                                size={18}
                                className="mr-1"
                            />
                            <span>{post?.author?.fullname}</span>
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
            width: 180,
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
            width: 120,
            // filters: [
            //     { text: intl.formatMessage({ id: 'admin.report.post.stats.pending', defaultMessage: 'Pending' }), value: 'pending' },
            //     { text: intl.formatMessage({ id: 'admin.report.post.stats.denied', defaultMessage: 'Denied' }), value: 'denied' },
            //     { text: intl.formatMessage({ id: 'admin.report.post.stats.resolved', defaultMessage: 'Resolved' }), value: 'resolved' },
            // ],
            // onFilter: (value, record) => record.status_report === value,
            render: (status) => getStatusTag(status),
        },
        {
            title: <FormattedMessage id="admin.report.post.table.actions" defaultMessage="Actions" />,
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
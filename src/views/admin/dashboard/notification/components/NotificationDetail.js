import React from 'react';
import { Drawer, Descriptions, Tag, Button, Divider, Progress, Typography } from 'antd';
import { BsEye, BsGlobe, BsPeople, BsLink45Deg } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { getLevelColor } from '@/helpers/colorHelper';

const { Title, Paragraph } = Typography;

const NotificationDetail = ({ visible, onClose, notification }) => {
    const intl = useIntl();

    if (!notification) {
        return null;
    }

    const { title, content, link, is_global, noticeType, creator, createdAt, updatedAt, userNotifications } = notification;

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    <BsEye size={18} />
                    <FormattedMessage id="notification.detail.title" defaultMessage="Notification Details" />
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={500}
            footer={
                <div className="flex justify-end">
                    <Button onClick={onClose}>
                        <FormattedMessage id="common.close" defaultMessage="Close" />
                    </Button>
                </div>
            }
        >
            <div className="mb-4">
                <Title className='text_first' level={4}>{title}</Title>
                <Tag color={noticeType?.color || 'red'} className="mt-1">
                    {noticeType?.name_en}
                </Tag>
            </div>

            <Divider className="my-4" />

            <Descriptions title={intl.formatMessage({ id: 'admin.dashboard.notification.detail.basic_info', defaultMessage: 'Basic Information' })} column={1} bordered>
                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.content', defaultMessage: 'Content' })}
                >
                    <Paragraph>{content}</Paragraph>
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.link', defaultMessage: 'Link' })}
                >
                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <BsLink45Deg />
                        {link}
                    </a>
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.target', defaultMessage: 'Target' })}
                >
                    {is_global ? (
                        <Tag color="green" className="flex items-center gap-1 w-fit">
                            <BsGlobe size={14} />
                            <FormattedMessage id="admin.dashboard.notification.detail.global" defaultMessage="Global" />
                        </Tag>
                    ) : (
                        <Tag color="blue" className="flex items-center gap-1 w-fit">
                            <BsPeople size={14} />
                            <FormattedMessage id="admin.dashboard.notification.detail.specific" defaultMessage="Specific Users" />
                        </Tag>
                    )}
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.created_by', defaultMessage: 'Created By' })}
                >
                    {creator?.fullname}
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.created_at', defaultMessage: 'Created At' })}
                >
                    {format(new Date(createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.notification.detail.updated_at', defaultMessage: 'Updated At' })}
                >
                    {format(new Date(updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>

            <Divider className="my-4" />

            <div className="mb-4">
                <Title level={5}>
                    <FormattedMessage id="admin.dashboard.notification.detail.read_stats" defaultMessage="Read Statistics" />
                </Title>

                <div className="flex justify-between mt-3 mb-1">
                    <span>
                        <FormattedMessage id="admin.dashboard.notification.table.read" defaultMessage="Read" />: {userNotifications?.map(item => item?.is_read).filter(Boolean).length}
                    </span>
                    <span>
                        <FormattedMessage id="admin.dashboard.notification.table.unread" defaultMessage="Unread" />: {userNotifications?.map(item => !item?.is_read).filter(Boolean).length}
                    </span>
                </div>

                <Progress
                    percent={Math.round((userNotifications?.map(item => item?.is_read).filter(Boolean).length / userNotifications?.length) * 100) || 0}
                    status="active"
                    format={(percent) => <span style={{ color: getLevelColor(percent) }}>{percent / 10}%</span>}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                />

                <div className="text-right text_secondary mt-1">
                    <FormattedMessage
                        id="admin.dashboard.notification.detail.total_recipients"
                        defaultMessage="Total Recipients: {total}"
                        values={{ total: userNotifications?.length }}
                    />
                </div>
            </div>
        </Drawer>
    );
};

export default NotificationDetail; 
import React from 'react';
import { Drawer, Descriptions, Button, Divider, Typography, Image, Tag } from 'antd';
import { BsEye, BsCalendarEvent, BsGeoAlt } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';

const { Title, Paragraph } = Typography;

const EventDetail = ({ visible, onClose, event }) => {
    const intl = useIntl();

    if (!event) {
        return null;
    }
    const { name, description, start_date, due_date, location, banner_url, createdAt, updatedAt } = event;

    // Determine event status
    const today = new Date();
    const startDate = new Date(start_date);
    const dueDate = new Date(due_date);

    let status;
    let statusColor;

    if (today < startDate) {
        status = <FormattedMessage id="admin.dashboard.event.detail.upcoming" defaultMessage="Upcoming" />;
        statusColor = 'blue';
    } else if (today > dueDate) {
        status = <FormattedMessage id="admin.dashboard.event.detail.past" defaultMessage="Past" />;
        statusColor = 'gray';
    } else {
        status = <FormattedMessage id="admin.dashboard.event.detail.ongoing" defaultMessage="Ongoing" />;
        statusColor = 'green';
    }

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    <BsEye size={18} />
                    <FormattedMessage id="admin.dashboard.event.detail.title" defaultMessage="Event Details" />
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
            footer={
                <div className="flex justify-end">
                    <Button onClick={onClose}>
                        <FormattedMessage id="common.close" defaultMessage="Close" />
                    </Button>
                </div>
            }
        >
            {banner_url && (
                <div className="mb-4">
                    <Image
                        src={banner_url}
                        alt={name}
                        className="w-full rounded-lg"
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                </div>
            )}

            <div className="mb-4">
                <Title level={4}>{name}</Title>
                <div className="flex items-center gap-2 mt-2">
                    <Tag color={statusColor}>{status}</Tag>
                </div>
            </div>

            <Divider className="my-4" />

            <Descriptions title={intl.formatMessage({ id: 'admin.dashboard.event.detail.basic_info', defaultMessage: 'Event Information' })} column={1} bordered>
                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.event.detail.date', defaultMessage: 'Date' })}
                >
                    <div className="flex items-center">
                        <BsCalendarEvent className="mr-2 text-blue-500" />
                        {format(new Date(start_date), 'dd/MM/yyyy')}
                        {start_date !== due_date && ` - ${format(new Date(due_date), 'dd/MM/yyyy')}`}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.event.detail.location', defaultMessage: 'Location' })}
                >
                    <div className="flex items-center">
                        <BsGeoAlt className="mr-2 text-red-500" />
                        {location}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.event.detail.description', defaultMessage: 'Description' })}
                >
                    <Paragraph>{description}</Paragraph>
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.event.detail.created_at', defaultMessage: 'Created At' })}
                >
                    {format(new Date(createdAt), 'dd/MM/yyyy HH:mm:ss')}
                </Descriptions.Item>

                <Descriptions.Item
                    label={intl.formatMessage({ id: 'admin.dashboard.event.detail.updated_at', defaultMessage: 'Updated At' })}
                >
                    {format(new Date(updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default EventDetail; 
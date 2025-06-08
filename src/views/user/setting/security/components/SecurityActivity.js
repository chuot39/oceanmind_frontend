import React from 'react';
import { Card, Timeline, Tag, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import { LoginOutlined, LogoutOutlined, SettingOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { formatDateTime } from '../../../../../utils';
import Marquee from 'react-fast-marquee';

const SecurityActivity = () => {
    // Example data - replace with actual data from API
    const activities = [
        {
            id: 1,
            type: 'login',
            device: 'Chrome on Windows',
            location: 'Hanoi, Vietnam',
            timestamp: new Date(),
            status: 'success'
        },
        {
            id: 2,
            type: 'settings_change',
            description: 'Password changed',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'success'
        },
        {
            id: 3,
            type: 'login',
            device: 'Firefox on MacOS',
            location: 'Unknown location',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'failed'
        },
        {
            id: 4,
            type: 'logout',
            device: 'Chrome on Windows',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'success'
        }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'login':
                return <LoginOutlined />;
            case 'logout':
                return <LogoutOutlined />;
            case 'settings_change':
                return <SettingOutlined />;
            default:
                return <SafetyCertificateOutlined />;
        }
    };

    const getStatusTag = (status) => {
        return (
            <Tag color={status === 'success' ? 'success' : 'error'}>
                <FormattedMessage id={`setting.security.status.${status}`} />
            </Tag>
        );
    };

    const getActivityDescription = (activity) => {
        switch (activity.type) {
            case 'login':
                return (
                    <>
                        <span className="text_first">
                            <FormattedMessage id="setting.security.activity.login" />
                        </span>
                        <br />
                        <span className="text_secondary">
                            {activity.device} • {activity.location}
                        </span>
                    </>
                );
            case 'logout':
                return (
                    <>
                        <span className="text_first">
                            <FormattedMessage id="setting.security.activity.logout" />
                        </span>
                        <br />
                        <span className="text_secondary">{activity.device}</span>
                    </>
                );
            case 'settings_change':
                return (
                    <>
                        <span className="text_first">
                            <FormattedMessage id="setting.security.activity.settings_change" />
                        </span>
                        <br />
                        <span className="text_secondary">{activity.description}</span>
                    </>
                );
            default:
                return activity.description;
        }
    };

    return (
        <Card
            title={
                <div className=" items-center gap-2">
                    <div className="my-2">
                        <Alert
                            banner
                            type="info"
                            showIcon
                            message={
                                <Marquee speed={60} pauseOnHover gradient={false}>
                                    This feature is under development, please wait for the next update! We will notify you when it is ready.🥰🥰🥰
                                </Marquee>
                            }
                            className=" rounded-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-100">
                        <SafetyCertificateOutlined className="text-blue-500" />
                        <span><FormattedMessage id="setting.security.activity.title" /></span>
                    </div>


                </div>
            }
            className="security-card"
        >
            <Timeline
                items={activities.map(activity => ({
                    dot: getIcon(activity.type),
                    children: (
                        <div key={activity.id} className="flex justify-between items-start">
                            <div>
                                {getActivityDescription(activity)}
                            </div>
                            <div className="text-right">
                                {getStatusTag(activity.status)}
                                <div className="text-sm text_secondary pt-1">
                                    {formatDateTime(activity.timestamp)}
                                </div>
                            </div>
                        </div>
                    )
                }))}
            />
        </Card>
    );
};

export default SecurityActivity; 
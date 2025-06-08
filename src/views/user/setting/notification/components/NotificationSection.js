import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BellOutlined, MessageOutlined, TeamOutlined, FileTextOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import SwitchNotice from '@/components/button/Switch/SwitchNotice';

const NotificationSection = ({ title, settings, onSettingChange }) => {
    const getIcon = (type) => {
        const icons = {
            general: <BellOutlined />,
            messages: <MessageOutlined />,
            groups: <TeamOutlined />,
            posts: <FileTextOutlined />,
            likes: <LikeOutlined />,
            comments: <CommentOutlined />
        };
        return icons[type] || <BellOutlined />;
    };

    const handleChange = (id, checked) => {
        onSettingChange(id, checked);
    };

    return (
        <div className="notification-section mb-8">
            <h2 className="text-xl font-semibold mb-4 text_first">
                <FormattedMessage id={title} />
            </h2>
            <div className="space-y-4">
                {settings.map((setting) => (
                    <Card key={setting.id} className="notification-card mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl text-blue-500">
                                    {getIcon(setting.type)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        <FormattedMessage id={setting?.titleId} />
                                    </h3>
                                    <p className="text-gray-500">
                                        <FormattedMessage id={setting?.descriptionId} />
                                    </p>
                                </div>
                            </div>
                            <SwitchNotice
                                id={setting.id}
                                checked={setting.enabled}
                                onChange={(checked) => handleChange(setting.id, checked)}
                                className="notification-switch"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NotificationSection; 
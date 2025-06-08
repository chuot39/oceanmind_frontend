import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NotificationSection from './components/NotificationSection';
import '../../../../core/scss/styles/pages/setting/index.scss';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';

const NotificationSettings = () => {


    const [settings, setSettings] = useState({
        general: [
            {
                id: 'push',
                type: 'general',
                titleId: 'setting.notification.push_notifications',
                descriptionId: 'setting.notification.push_notifications_desc',
                enabled: true
            },
            {
                id: 'email',
                type: 'general',
                titleId: 'setting.notification.email_notifications',
                descriptionId: 'setting.notification.email_notifications_desc',
                enabled: true
            }
        ],
        interactions: [
            {
                id: 'messages',
                type: 'messages',
                titleId: 'setting.notification.messages',
                descriptionId: 'setting.notification.messages_desc',
                enabled: true
            },
            {
                id: 'groups',
                type: 'groups',
                titleId: 'setting.notification.groups',
                descriptionId: 'setting.notification.groups_desc',
                enabled: true
            }
        ],
        content: [
            {
                id: 'posts',
                type: 'posts',
                titleId: 'setting.notification.posts',
                descriptionId: 'setting.notification.posts_desc',
                enabled: true
            },
            {
                id: 'likes',
                type: 'likes',
                titleId: 'setting.notification.likes',
                descriptionId: 'setting.notification.likes_desc',
                enabled: true
            },
            {
                id: 'comments',
                type: 'comments',
                titleId: 'setting.notification.comments',
                descriptionId: 'setting.notification.comments_desc',
                enabled: true
            }
        ]
    });

    const handleSettingChange = (section, id, checked) => {
        setSettings(prev => ({
            ...prev,
            [section]: prev[section].map(setting =>
                setting.id === id ? { ...setting, enabled: checked } : setting
            )
        }));
    };

    return (
        <div className="notification-settings p-6">
            <div className="max-w-4xl mx-auto">
                <Alert
                    banner
                    type="info"
                    showIcon
                    message={
                        <Marquee speed={60} pauseOnHover gradient={false}>
                            This feature is under development, please wait for the next update! We will notify you when it is ready.🥰🥰🥰
                        </Marquee>
                    }
                    className="mb-6 rounded-lg text-lg"
                />
                <h1 className="text-2xl font-bold mb-6 text_first">
                    <FormattedMessage id="setting.notification.title" />
                </h1>

                <div className="space-y-8">
                    <NotificationSection
                        title="setting.notification.general_section"
                        settings={settings.general}
                        onSettingChange={(id, checked) => handleSettingChange('general', id, checked)}
                    />

                    <NotificationSection
                        title="setting.notification.interactions_section"
                        settings={settings.interactions}
                        onSettingChange={(id, checked) => handleSettingChange('interactions', id, checked)}
                    />

                    <NotificationSection
                        title="setting.notification.content_section"
                        settings={settings.content}
                        onSettingChange={(id, checked) => handleSettingChange('content', id, checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
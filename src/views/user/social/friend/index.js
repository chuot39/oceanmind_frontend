import React from 'react';
import { Tabs } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserData } from '@utils/hooks/useAuth';
import '@core/scss/styles/pages/social/index.scss';

import SuggestedFriends from './components/SuggestedFriends';
import FriendsList from './components/FriendsList';
import FriendRequests from './components/FriendRequests';
import useSkin from '@/utils/hooks/useSkin';


const FriendDashboard = () => {
    const intl = useIntl();
    const { skin } = useSkin();
    const { userData } = useUserData();

    const tabs = [
        {
            key: 'suggested',
            label: <FormattedMessage id="social.friend.suggested_friends" />,
            component: <SuggestedFriends userData={userData} intl={intl} skin={skin} />
        },
        {
            key: 'requests',
            label: <FormattedMessage id="social.friend.requests" />,
            component: <FriendRequests userData={userData} intl={intl} skin={skin} />
        },
        {
            key: 'friends',
            label: <FormattedMessage id="social.friend.friends" />,
            component: <FriendsList userData={userData} intl={intl} skin={skin} />
        },

    ];

    return (
        <>
            <div className="friend-dashboard p-4">
                <Tabs
                    defaultActiveKey="suggested"
                    items={tabs.map(tab => ({
                        key: tab.key,
                        label: tab.label,
                        children: tab.component
                    }))}
                    className="friend-tabs"
                />
            </div>
        </>
    );
};

export default FriendDashboard;
import React from 'react';
import { Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SiZalo } from 'react-icons/si';
import { useSocialUser } from '../../manage_account/hook';
import { getIcon } from '@/helpers/imgHelper';

const ContactCard = ({ userData }) => {
    const { status: statusSocialUser, data: socialUser } = useSocialUser(userData?.documentId);

    return (
        <Card className="info-card overflow-x-hidden" loading={statusSocialUser === 'loading'}>
            <h2 className="card-title">
                <FormattedMessage id="profile.contact" defaultMessage="CONTACT" />
            </h2>
            {socialUser?.data?.map((item, index) => (
                <div key={item?.documentId} className="info-item">
                    <span className="icon">{item?.social?.icon_url || getIcon(item?.social?.platform?.toLowerCase())}</span>
                    <span className="label">{item?.social?.platform}:</span>
                    <span className="value">{item?.account_url}</span>
                </div>
            ))}
        </Card>
    );
};

export default ContactCard; 
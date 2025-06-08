import React from 'react';
import { Avatar, Button, Card, Tag } from 'antd';
import { BsPencil } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { formatDate } from '../../../../../utils/format/datetime';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ userData }) => {
    const navigate = useNavigate();
    return (
        <Card className="profile-header rounded-md">
            <img
                src={userData?.banner?.file_path}
                alt="cover"
                className="object-fill w-full h-56 rounded-t-md"
            />
            <div className="profile-info px-5 py-4 flex items-end">
                <div className="avatar-wrapper mr-4 -mt-11">
                    <Avatar
                        src={userData?.avatar?.file_path}
                        size={120}
                        shape="circle"
                    />
                </div>
                <div className="info-text">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text_first">{userData?.fullname}</h1>
                        <Tag className="role-tag tag-primary">{userData?.career?.name}</Tag>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text_secondary">{userData?.regularClass?.name}</span>
                        <span className="text-sm text_secondary"><FormattedMessage id="profile.information.joined_at" defaultMessage="Joined At" /> {formatDate(userData?.createdAt)}</span>
                    </div>
                </div>
                <Button
                    icon={<BsPencil />}
                    variant='solid'
                    color='primary'
                    onClick={() => navigate('/profile/manage_account')}
                >
                    <FormattedMessage id="common.edit" defaultMessage="Edit" />
                </Button>
            </div>
        </Card>
    );
};

export default ProfileHeader; 
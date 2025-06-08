import React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

const ProfileHeader = ({ userData, onUploadAvatar, onUploadBanner }) => {
    return (
        <div className="profile-upload-section bg-white rounded-lg p-6 mb-6">
            <div className="banner-section mb-6">
                <img
                    src={userData?.banner_url_id?.file_path}
                    alt="banner"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <Button
                    type="primary"
                    onClick={onUploadBanner}
                    className="w-full"
                >
                    <FormattedMessage id="profile.upload_banner" defaultMessage="Tải lên banner mới" />
                </Button>
                <p className="text-gray-500 text-sm mt-1">Allowed JPG, GIF or PNG. Max size of 800K</p>
            </div>

            <div className="avatar-section">
                <img
                    src={userData?.avatar_url_id?.file_path}
                    alt="avatar"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                />
                <Button
                    type="primary"
                    onClick={onUploadAvatar}
                    className="w-full"
                >
                    <FormattedMessage id="profile.upload_avatar" defaultMessage="Tải lên avatar mới" />
                </Button>
                <p className="text-gray-500 text-sm mt-1">Allowed JPG, GIF or PNG. Max size of 800K</p>
            </div>
        </div>
    );
};

export default ProfileHeader; 
import React from 'react';
import { Avatar, Button, Upload } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';

const ImageUpload = ({ avatarUrl, bannerUrl, onAvatarChange, onBannerChange }) => {
    return (
        <div className="upload-section">
            {/* Banner Upload */}
            <div className="banner-upload">
                {bannerUrl ? (
                    <img src={bannerUrl} alt="User Banner" />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            <FormattedMessage id="setting.account.upload_banner" />
                        </p>
                    </div>
                )}
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    onChange={onBannerChange}
                >
                    <Button
                        icon={<CameraOutlined />}
                        className="upload-btn btn_custom_secondary"
                    >
                        <FormattedMessage id="setting.account.change_banner" />
                    </Button>
                </Upload>
            </div>

            {/* Avatar Upload */}
            <div className="avatar-upload">
                <Avatar
                    src={avatarUrl}
                    size={100}
                    className="bg-gray-200"
                />
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    onChange={onAvatarChange}
                >
                    <Button
                        shape="circle"
                        icon={<CameraOutlined />}
                        className="upload-btn btn_custom_secondary"
                    />
                </Upload>
            </div>
        </div>
    );
};

export default ImageUpload; 
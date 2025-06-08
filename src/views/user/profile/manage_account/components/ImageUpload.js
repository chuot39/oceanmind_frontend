import React, { useState } from 'react';
import { Avatar, Button, Tooltip, Upload, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { uploadImage } from '@/helpers/imgHelper';
import { notifyError } from '@/utils/Utils';
import ImgCrop from 'antd-img-crop';
import { useUpdateUserAvatar, useUpdateUserBanner } from '../hookMutation';
import { useUpdateUserInfo, useUserData } from '@/utils/hooks/useAuth';

const ImageUpload = ({ avatarUrl, bannerUrl }) => {
    const intl = useIntl();
    const { userData } = useUserData();

    const { mutate: updateUserBanner, isLoading: isUpdatingBanner } = useUpdateUserBanner();
    const { mutate: updateUserAvatar, isLoading: isUpdatingAvatar } = useUpdateUserAvatar();
    const { mutate: updateUserInfo, isLoading: isUpdatingUserInfo } = useUpdateUserInfo();


    const [uploading, setUploading] = useState(false);
    const [previewBanner, setPreviewBanner] = useState(bannerUrl || null);
    const [previewAvatar, setPreviewAvatar] = useState(avatarUrl || null);
    const [avatarSubmit, setAvatarSubmit] = useState(null);
    const [bannerSubmit, setBannerSubmit] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    const handleBannerUpload = ({ file }) => {
        if (file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (file.status === 'done' || file.status === 'error') {
            setUploading(false);
        }

        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewBanner(reader.result);
                setHasChanges(true);
            };
            reader.readAsDataURL(file.originFileObj);
            setBannerSubmit(file.originFileObj);
        }
    };

    const handleAvatarChange = ({ file }) => {
        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewAvatar(reader.result);
                setHasChanges(true);
            };
            reader.readAsDataURL(file.originFileObj);
            setAvatarSubmit(file.originFileObj);
        }
    };



    const handleSave = async () => {
        try {
            setUploading(true);

            if (avatarSubmit) {
                const uploadedFile = await uploadImage(avatarSubmit, "avatar");
                if (uploadedFile?.data?.documentId) {
                    updateUserAvatar({ userId: userData.documentId, avatarId: uploadedFile.data.documentId },
                        {
                            onSuccess: () => {
                                setPreviewAvatar(URL.createObjectURL(avatarSubmit));
                            },
                            onError: (error) => {
                                console.log('error', error)
                                // throw error;
                            }
                        }
                    );
                }
            }


            if (bannerSubmit) {
                const uploadedFile = await uploadImage(bannerSubmit, "banner");
                if (uploadedFile?.data?.documentId) {
                    updateUserBanner({ userId: userData.documentId, bannerId: uploadedFile.data.documentId },
                        {
                            onSuccess: () => {
                                setPreviewBanner(URL.createObjectURL(bannerSubmit));
                            },
                            onError: (error) => {
                                console.log('error', error)
                                // throw error;
                            }
                        }
                    );
                }
            }


            updateUserInfo();
            // setHasChanges(false);
        } catch (error) {
            notifyError(intl.formatMessage({ id: 'profile.manage_account.upload_error' }));
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setPreviewBanner(bannerUrl || null);
        setPreviewAvatar(avatarUrl || null);
        setHasChanges(false);
    };

    return (
        <div className="upload_image relative mb-14">
            <div className="border-2 border-dashed border-gray-300 relative w-full h-64 overflow-hidden rounded-lg mb-4">
                {previewBanner ? (
                    <img
                        src={previewBanner}
                        alt="Banner Preview"
                        className="w-full h-full object-fill"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                        <p className="text-gray-500">
                            <FormattedMessage id="social.group.upload_banner" defaultMessage="Upload banner image" />
                        </p>
                    </div>
                )}
                <ImgCrop
                    aspect={16 / 9}
                    rotationSlider
                >
                    <Upload
                        accept=".jpg,.jpeg,.png"
                        showUploadList={false}
                        // customRequest={dummyRequest}
                        onChange={handleBannerUpload}
                        onPreview={onPreview}
                    >
                        <Button
                            icon={<CameraOutlined />}
                            className="absolute bottom-2 right-2"
                        >
                            <FormattedMessage id="social.group.change_banner" defaultMessage="Change Banner" />
                        </Button>
                    </Upload>
                </ImgCrop>
            </div>

            <div className="avatar-upload absolute -bottom-10 left-7">
                <Avatar
                    src={previewAvatar}
                    size={120}
                    className="bg-gray-200"
                    shape="circle"
                />
                <ImgCrop
                    aspect={1 / 1}
                    rotationSlider
                >
                    <Upload
                        accept=".jpg,.jpeg,.png"
                        showUploadList={false}
                        onChange={handleAvatarChange}

                    >
                        <Tooltip title={intl.formatMessage({ id: "profile.manage_account.upload_avatar_placeholder" })}>
                            <Button
                                shape="circle"
                                icon={<CameraOutlined />}
                                className="upload-btn absolute bottom-3 right-2"
                            />
                        </Tooltip>
                    </Upload>
                </ImgCrop>
            </div>

            {hasChanges && (
                <div className="flex gap-2 absolute right-0 -bottom-10">
                    <Button onClick={handleCancel}>
                        <FormattedMessage id="profile.manage_account.cancel_image" defaultMessage="Hủy" />
                    </Button>
                    <Button type="primary" onClick={handleSave} loading={uploading || isUpdatingBanner || isUpdatingAvatar || isUpdatingUserInfo}>
                        <FormattedMessage id="profile.manage_account.save_image" defaultMessage="Lưu thay đổi" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 
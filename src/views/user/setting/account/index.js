import React from 'react';
import { Form, Button, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import ImageUpload from './components/ImageUpload';
import PersonalInfo from './components/PersonalInfo';
import DeleteAccount from './components/DeleteAccount';
import '../../../../core/scss/styles/pages/setting/index.scss';
import { useUserData } from '../../../../utils/hooks/useAuth';

const AccountSettings = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const { userData } = useUserData();
    console.log(userData);

    const initialValues = {
        // Add initial values from user data here
        fullname: userData?.fullname || '',
        username: userData?.username || '',
        nickname: userData?.nickname || '',
        major: userData?.major || '',
        class: userData?.regular_class_id?.name || '',
        studentId: userData?.student_code || '',
        phone: userData?.phone || '',
        email: userData?.email,
        facebook: userData?.facebook || '',
        zalo: userData?.zalo || '',
        github: userData?.github || '',
        location: userData?.location || ''
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            // Handle save logic here
            message.success(intl.formatMessage({ id: 'setting.account.save_success' }));
        } catch (error) {
            message.error(intl.formatMessage({ id: 'setting.account.save_error' }));
        }
    };

    const handleAvatarChange = (file) => {
        // Handle avatar upload logic here
    };

    const handleBannerChange = (file) => {
        // Handle banner upload logic here
    };

    return (
        <div className="account-settings p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    <FormattedMessage id="setting.account.title" />
                </h1>

                <ImageUpload
                    avatarUrl={userData?.avatar_url_id?.file_path}
                    bannerUrl={userData?.banner_url_id?.file_path}
                    onAvatarChange={handleAvatarChange}
                    onBannerChange={handleBannerChange}
                />

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-6 p-6">
                    <PersonalInfo
                        form={form}
                        initialValues={initialValues}
                    />

                    <div className="flex justify-end mt-6">
                        <Button
                            type="primary"
                            onClick={handleSave}
                        >
                            <FormattedMessage id="common.save" />
                        </Button>
                    </div>
                </div>

                <DeleteAccount />
            </div>
        </div>
    );
};

export default AccountSettings;
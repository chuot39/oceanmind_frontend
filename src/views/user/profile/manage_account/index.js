import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserData } from '../../../../utils/hooks/useAuth';
import PersonalInfoForm from './components/PersonalInfoForm';
import DeleteAccount from './components/DeleteAccount';
import '../../../../core/scss/styles/pages/profile/manage_account.scss';
import ImageUpload from './components/ImageUpload';
import useSkin from '../../../../utils/hooks/useSkin';
import SocialInfoForm from './components/SocialInfoForm';

const ManageAccount = () => {
    const { userData } = useUserData();
    const intl = useIntl();
    const { language } = useSkin();


    return (
        <div className="manage-account-page p-6">
            <>
                <ImageUpload
                    avatarUrl={userData?.avatar?.file_path}
                    bannerUrl={userData?.banner?.file_path}
                    intl={intl}
                />
                <PersonalInfoForm
                    userData={userData}
                    intl={intl}
                    language={language}
                />
                <SocialInfoForm
                    userData={userData}
                    intl={intl}
                />
                <DeleteAccount />
            </>

        </div>
    );
};

export default ManageAccount;
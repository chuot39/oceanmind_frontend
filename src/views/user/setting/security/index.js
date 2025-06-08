import React from 'react';
import { FormattedMessage } from 'react-intl';
import TwoFactorAuth from './components/TwoFactorAuth';
import SecurityActivity from './components/SecurityActivity';
import PasswordSecurity from './components/PasswordSecurity';
import LoginInfoSecurity from './components/LoginInfoSecurity';
import '../../../../core/scss/styles/pages/setting/index.scss';

const SecuritySettings = () => {
    return (
        <div className="security-settings p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text_first">
                    <FormattedMessage id="setting.security.title" />
                </h1>

                <div className="space-y-6">
                    {/* Login Information Section */}
                    <LoginInfoSecurity />

                    {/* Password Security Section */}
                    <PasswordSecurity />

                    {/* Two-Factor Authentication Section */}
                    <TwoFactorAuth />

                    {/* Security Activity Section */}
                    <SecurityActivity />
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
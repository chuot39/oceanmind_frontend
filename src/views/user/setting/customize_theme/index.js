import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ThemeMode from './components/ThemeMode';
import NavbarType from './components/NavbarType';
import ContentLayout from './components/ContentLayout';
import ColorPicker from './components/ColorPicker';
import '../../../../core/scss/styles/pages/setting/index.scss';
import useSkin from '../../../../utils/hooks/useSkin';

const CustomizeTheme = () => {
    const { skin, changeSkinRedux } = useSkin()

    const [themeSettings, setThemeSettings] = useState({
        mode: skin,
        navbarType: 'default',
        contentLayout: 'compact',
        primaryColor: 'blue'
    });

    const handleSettingChange = (key, value) => {
        setThemeSettings(prev => ({
            ...prev,
            [key]: value
        }));

        // Only call changeSkinRedux when changing theme mode
        if (key === 'mode') {
            changeSkinRedux(value);
        }
    };

    useEffect(() => {
        setThemeSettings(prev => ({
            ...prev,
            mode: skin
        }));
    }, [skin]);

    return (
        <div className="customize-theme p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text_first">
                    <FormattedMessage id="setting.customize.title" />
                </h1>

                <div className="space-y-6">
                    {/* Theme Mode Section */}
                    <ThemeMode
                        currentMode={themeSettings.mode}
                        onChange={(value) => handleSettingChange('mode', value)}
                    />

                    {/* Color Picker Section */}
                    <ColorPicker
                        currentColor={themeSettings.primaryColor}
                        onChange={(value) => handleSettingChange('primaryColor', value)}
                    />

                    {/* Navbar Type Section */}
                    <NavbarType
                        currentType={themeSettings.navbarType}
                        onChange={(value) => handleSettingChange('navbarType', value)}
                    />

                    {/* Content Layout Section */}
                    <ContentLayout
                        currentLayout={themeSettings.contentLayout}
                        onChange={(value) => handleSettingChange('contentLayout', value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomizeTheme;
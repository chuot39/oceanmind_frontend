import React from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BulbOutlined } from '@ant-design/icons';
import previewLight from '../../../../../assets/images/preview_light.png';
import previewDark from '../../../../../assets/images/preview_dark.png';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { GrSystem } from 'react-icons/gr';

const ThemeMode = ({ currentMode, onChange }) => {
    const modes = [
        {
            key: 'light',
            icon: <MdOutlineLightMode className="text-2xl" />,
            label: <FormattedMessage id="setting.customize.theme.mode.light" />,
            preview: previewLight
        },
        {
            key: 'dark',
            icon: <MdOutlineDarkMode className="text-2xl" />,
            label: <FormattedMessage id="setting.customize.theme.mode.dark" />,
            preview: previewDark
        },
        {
            key: 'system',
            icon: <GrSystem className="text-2xl" />,
            label: <FormattedMessage id="setting.customize.theme.mode.system" />,
            preview: previewDark
        }
    ];

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <BulbOutlined className="text-xl text-blue-500" />
                    <span><FormattedMessage id="setting.customize.theme.mode.title" /></span>
                </div>
            }
            className="theme-card mb-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modes.map(mode => (
                    <div
                        key={mode.key}
                        className={`theme-option p-4 text-center ${currentMode === mode.key ? 'selected' : ''}`}
                        onClick={() => onChange(mode.key)}
                    >
                        <div className="mb-4">
                            <img
                                src={mode.preview}
                                alt={mode.label}
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-2 text_secondary">
                            {mode.icon}
                            <span className="font-medium text_secondary">{mode.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ThemeMode; 
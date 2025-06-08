import React from 'react';
import { Alert, Card, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BgColorsOutlined } from '@ant-design/icons';

const ColorPicker = ({ currentColor, onChange }) => {
    const colors = [
        {
            key: 'blue',
            value: '#1890ff',
            label: <FormattedMessage id="setting.customize.color.blue" />
        },
        {
            key: 'green',
            value: '#52c41a',
            label: <FormattedMessage id="setting.customize.color.green" />
        },
        {
            key: 'purple',
            value: '#722ed1',
            label: <FormattedMessage id="setting.customize.color.purple" />
        },
        {
            key: 'red',
            value: '#f5222d',
            label: <FormattedMessage id="setting.customize.color.red" />
        },
        {
            key: 'orange',
            value: '#fa8c16',
            label: <FormattedMessage id="setting.customize.color.orange" />
        },
        {
            key: 'cyan',
            value: '#13c2c2',
            label: <FormattedMessage id="setting.customize.color.cyan" />
        }
    ];

    return (
        <Card
            title={
                <div className='flex items-center gap-2 justify-between'>

                    <div className="flex items-center gap-2">
                        <BgColorsOutlined className="text-xl text-blue-500" />
                        <span><FormattedMessage id="setting.customize.color.title" /></span>
                    </div>

                    <Alert
                        message="This feature is under development, please wait for the next update!"
                        type="info"
                        showIcon
                        className=" rounded-lg"
                    />
                </div>
            }
            className="theme-card mb-6"
        >
            <div>
                <h3 className="text-lg mb-4">
                    <FormattedMessage id="setting.customize.color.primary" />
                </h3>
                <div className="color-picker flex gap-4 flex-wrap">
                    {colors.map(color => (
                        <Tooltip key={color.key} title={color.label}>
                            <div
                                className={`color-option ${currentColor === color.key ? 'selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => onChange(color.key)}
                            />
                        </Tooltip>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg mb-2">
                    <FormattedMessage id="setting.customize.color.preview" />
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded" style={{ backgroundColor: colors.find(c => c.key === currentColor)?.value }}>
                        <span className="text-white">
                            <FormattedMessage id="setting.customize.color.primary" />
                        </span>
                    </div>
                    <div className="p-4 rounded" style={{ backgroundColor: colors.find(c => c.key === currentColor)?.value + '99' }}>
                        <span className="text-white">
                            <FormattedMessage id="setting.customize.color.secondary" />
                        </span>
                    </div>
                    <div className="p-4 rounded border" style={{ borderColor: colors.find(c => c.key === currentColor)?.value }}>
                        <span style={{ color: colors.find(c => c.key === currentColor)?.value }}>
                            <FormattedMessage id="setting.customize.color.border" />
                        </span>
                    </div>
                    <div className="p-4 rounded" style={{ color: colors.find(c => c.key === currentColor)?.value }}>
                        <span>
                            <FormattedMessage id="setting.customize.color.text" />
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ColorPicker; 
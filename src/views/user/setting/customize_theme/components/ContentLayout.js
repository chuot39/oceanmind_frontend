import React from 'react';
import { Alert, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { LayoutOutlined } from '@ant-design/icons';

const ContentLayout = ({ currentLayout, onChange }) => {
    const layouts = [
        {
            key: 'compact',
            label: <FormattedMessage id="setting.customize.layout.compact" />,
            description: <FormattedMessage id="setting.customize.layout.compact.desc" />,
            preview: (
                <div className="layout-preview flex">
                    <div className="w-1/4 bg-gray-200 rounded-sm" />
                    <div className="flex-1 bg-gray-100 mx-2 rounded-sm" />
                </div>
            )
        },
        {
            key: 'wide',
            label: <FormattedMessage id="setting.customize.layout.wide" />,
            description: <FormattedMessage id="setting.customize.layout.wide.desc" />,
            preview: (
                <div className="layout-preview flex ">
                    <div className="w-1/5 bg-gray-200 rounded-sm" />
                    <div className="flex-1 bg-gray-100 mx-6 rounded-sm" />
                </div>
            )
        }
    ];

    return (
        <Card
            title={
                <div className='flex items-center gap-2 justify-between text-center'>
                    <div className="flex items-center gap-2">
                        <LayoutOutlined className="text-xl text-blue-500" />
                        <span><FormattedMessage id="setting.customize.layout.title" /></span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {layouts.map(layout => (
                    <div
                        key={layout.key}
                        className={`layout-option ${currentLayout === layout.key ? 'selected' : ''}`}
                        onClick={() => onChange(layout.key)}
                    >
                        {layout.preview}
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">{layout.label}</h3>
                            <p className="text_secondary text-sm">{layout.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ContentLayout; 
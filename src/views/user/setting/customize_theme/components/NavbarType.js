import React from 'react';
import { Alert, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import { MenuOutlined } from '@ant-design/icons';
import defaultNavbar from '../../../../../assets/images/nav_default.png';
import collapseNavbar from '../../../../../assets/images/nav_collapse.png';

const NavbarType = ({ currentType, onChange }) => {
    const navTypes = [
        {
            key: 'default',
            label: <FormattedMessage id="setting.customize.navbar.type.default" />,
            preview: defaultNavbar,
            description: <FormattedMessage id="setting.customize.navbar.type.default.desc" />
        },
        {
            key: 'compact',
            label: <FormattedMessage id="setting.customize.navbar.type.compact" />,
            preview: collapseNavbar,
            description: <FormattedMessage id="setting.customize.navbar.type.compact.desc" />
        },
        {
            key: 'mini',
            label: <FormattedMessage id="setting.customize.navbar.type.mini" />,
            preview: defaultNavbar,
            description: <FormattedMessage id="setting.customize.navbar.type.mini.desc" />
        }
    ];

    return (
        <Card
            title={
                <div className='flex items-center gap-2 justify-between text-center'>
                    <div className="flex items-center gap-2">
                        <MenuOutlined className="text-xl text-blue-500" />
                        <span><FormattedMessage id="setting.customize.navbar.title" /></span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {navTypes.map(type => (
                    <div
                        key={type.key}
                        className={`theme-option p-4 ${currentType === type.key ? 'selected' : ''}`}
                        onClick={() => onChange(type.key)}
                    >
                        <div className="mb-4">
                            <img
                                src={type.preview}
                                alt={type.label}
                                className="w-full h-auto shadow-lg rounded"
                            />
                        </div>
                        <h3 className="text-lg font-medium mb-2">{type.label}</h3>
                        <p className="text-gray-500 text-sm">{type.description}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default NavbarType; 
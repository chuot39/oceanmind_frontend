import React from 'react';
import { Card } from 'antd';
import { BiShieldQuarter } from 'react-icons/bi';
import { FormattedMessage } from 'react-intl';

const PolicyHeader = () => {
    return (
        <Card className="mb-8 shadow-sm">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <BiShieldQuarter className="text-2xl text-blue-500" />
                    <h1 className="text-xl font-semibold">
                        <FormattedMessage id="support.policy.title" />
                    </h1>
                    <BiShieldQuarter className="text-2xl text-blue-500" />
                </div>
                <p className="text_secondary">
                    <FormattedMessage id="support.policy.intro" />
                </p>
            </div>
        </Card>
    );
};

export default PolicyHeader; 
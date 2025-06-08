import React from 'react';
import { Card } from 'antd';
import { MdEmail } from 'react-icons/md';
import { BsTelephone, BsGeoAlt } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';

const ContactInfo = () => {
    return (
        <Card className="shadow-sm mt-8">
            <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">
                    <FormattedMessage id="support.policy.contact.title" />
                </h2>
                <p className="text_secondary">
                    <FormattedMessage id="support.policy.contact.description" />
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <MdEmail className="text-xl text-blue-500" />
                        <span className="text_secondary">
                            <FormattedMessage id="support.policy.contact.email" />
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <BsTelephone className="text-xl text-blue-500" />
                        <span className="text_secondary">
                            <FormattedMessage id="support.policy.contact.phone" />
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <BsGeoAlt className="text-xl text-blue-500" />
                        <span className="text_secondary">
                            <FormattedMessage id="support.policy.contact.address" />
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ContactInfo; 
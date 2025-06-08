import React from 'react';
import PolicyHeader from './components/PolicyHeader';
import PolicySection from './components/PolicySection';
import ContactInfo from './components/ContactInfo';
import '../../../../core/scss/styles/pages/support/policy.scss';

const Policy = () => {
    const policyData = [
        {
            id: 'terms_of_use',
            content: [
                {
                    id: 'service_rights',
                    points: [0, 1]
                },
                {
                    id: 'content_rules',
                    points: [0, 1]
                }
            ]
        },
        {
            id: 'privacy_policy',
            content: [
                {
                    id: 'data_collection',
                    points: [0]
                },
                {
                    id: 'data_usage',
                    points: [0, 1]
                }
            ]
        },
        {
            id: 'intellectual_property',
            content: [
                {
                    id: 'ocean_ownership',
                    points: [0]
                },
                {
                    id: 'user_ownership',
                    points: [0]
                }
            ]
        }
    ];

    return (
        <div className="policy-container space-y-6 mb-8">
            <PolicyHeader />
            <PolicySection sections={policyData} />
            <ContactInfo />
        </div>
    );
};

export default Policy;
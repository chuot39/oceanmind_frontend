import React from 'react';
import { Card, Collapse } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Panel } = Collapse;

const PolicySection = ({ sections }) => {
    const getTranslationId = (section, item) => {
        const sectionKey = section.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
        const itemKey = item.toLowerCase().replace(/\s+/g, '_');
        return `support.policy.${sectionKey}.${itemKey}`;
    };

    return (
        <Card className="shadow-sm">
            <Collapse
                bordered={false}
                className="bg-transparent"
                expandIconPosition="end"
            >
                {sections.map((section, index) => (
                    <Panel
                        header={
                            <div className="font-semibold text_first text-lg">
                                <FormattedMessage id={`support.policy.${section.id}.title`} />
                            </div>
                        }
                        key={index}
                        className="mb-4 bg-transparent"
                    >
                        <div className="space-y-4">
                            {section.content.map((item, idx) => (
                                <div key={idx} className="ml-4">
                                    <h3 className="font-medium text_first mb-2">
                                        <FormattedMessage id={`support.policy.${section.id}.${item.id}.title`} />
                                    </h3>
                                    <ul className="list-disc space-y-2 ml-4">
                                        {item.points.map((point, pointIdx) => (
                                            <li key={pointIdx} className="text_secondary">
                                                <FormattedMessage id={`support.policy.${section.id}.${item.id}.points.${pointIdx}`} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Panel>
                ))}
            </Collapse>
        </Card>
    );
};

export default PolicySection; 
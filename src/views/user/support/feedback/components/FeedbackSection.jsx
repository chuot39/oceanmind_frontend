import React, { useState } from 'react';
import { Switch, Input, Card } from 'antd';

const { TextArea } = Input;

const FeedbackSection = ({ title, questions }) => {
    const [switchStates, setSwitchStates] = useState(
        questions.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
    );

    const handleSwitchChange = (index, checked) => {
        setSwitchStates(prev => ({
            ...prev,
            [index]: checked
        }));
    };

    return (
        <Card className="mb-8">
            <h3 className="text-lg font-medium mb-6">{title}</h3>
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="">{question.text}</p>
                            <Switch
                                checkedChildren="Có"
                                unCheckedChildren="Không"
                                checked={switchStates[index]}
                                onChange={(checked) => handleSwitchChange(index, checked)}
                            />
                        </div>
                        {question.hasTextArea && (
                            <TextArea
                                placeholder="Add your comments..."
                                className="w-full mt-2"
                                rows={4}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default FeedbackSection; 
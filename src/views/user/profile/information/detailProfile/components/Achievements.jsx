import React from 'react';
import { Card, Timeline, Badge } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const Achievements = ({ achievements }) => {
    if (!achievements || achievements?.length === 0) return null;

    return (
        <div className="achievements-section">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaTrophy />
                <FormattedMessage id="profile.achievements" defaultMessage="Achievements & Awards" />
            </h2>

            <Card className="achievements-card">
                <Timeline
                    items={achievements?.map(achievement => ({
                        color: 'gold',
                        children: (
                            <div className="achievement-item">
                                <h3 className="text-lg font-medium mb-1">
                                    <Badge color="gold" /> {achievement?.title}
                                </h3>
                                <p className="text-gray-600 mb-1">{achievement?.organization}</p>
                                <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                                    <FaCalendarAlt /> {achievement?.date}
                                </p>
                                {achievement?.description && (
                                    <p className="text-gray-700">{achievement?.description}</p>
                                )}
                            </div>
                        )
                    }))}
                />
            </Card>
        </div>
    );
};

export default Achievements; 
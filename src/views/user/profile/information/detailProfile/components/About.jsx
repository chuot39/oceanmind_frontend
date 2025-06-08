import React from 'react';
import { Card, Tag, Timeline, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FaBook, FaTrophy, FaTools, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const About = ({ profile }) => {
    ``
    if (!profile) return null;

    return (
        <div className="about-section">
            {/* Skills Section */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FaTools />
                        <FormattedMessage id="profile.skills" defaultMessage="Skills" />
                    </div>
                }
                className="mb-6"
            >
                <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill, index) => (
                        <Tag key={index} color="blue" className="py-1 px-3 text-sm">
                            {skill}
                        </Tag>
                    ))}
                </div>
            </Card>

            {/* Education Section */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FaBook />
                        <FormattedMessage id="profile.education" defaultMessage="Education" />
                    </div>
                }
                className="mb-6"
            >
                <Timeline
                    items={profile?.education?.map(edu => ({
                        children: (
                            <div className="education-item">
                                <h3 className="text-lg font-medium">{edu.institution}</h3>
                                <p className="text-gray-600">
                                    {edu.degree} • {edu.fieldOfStudy}
                                </p>
                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <FaCalendarAlt /> {edu.startDate} - {edu.endDate}
                                </p>
                                {edu.description && (
                                    <p className="mt-2 text-gray-700">{edu.description}</p>
                                )}
                            </div>
                        )
                    }))}
                />
            </Card>

            {/* Experience Section */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FaTrophy />
                        <FormattedMessage id="profile.experience" defaultMessage="Experience" />
                    </div>
                }
            >
                <Timeline
                    items={profile?.experience?.map(exp => ({
                        children: (
                            <div className="experience-item">
                                <h3 className="text-lg font-medium">{exp?.position}</h3>
                                <p className="text-gray-600">{exp?.company}</p>
                                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                                    <span className="flex items-center gap-1">
                                        <FaCalendarAlt /> {exp?.startDate} - {exp?.endDate}
                                    </span>
                                    {exp?.location && (
                                        <span className="flex items-center gap-1">
                                            <FaMapMarkerAlt /> {exp?.location}
                                        </span>
                                    )}
                                </div>
                                {exp?.description && (
                                    <p className="mt-2 text-gray-700">{exp?.description}</p>
                                )}
                            </div>
                        )
                    }))}
                />
            </Card>
        </div>
    );
};

export default About; 
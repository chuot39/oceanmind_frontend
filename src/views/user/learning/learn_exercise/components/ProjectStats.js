import React from 'react';
import { Row, Col, Card } from 'antd';
import { BsListTask, BsCalendar, BsPeople, BsCheckCircle } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';

const ProjectStats = ({ projectUser }) => {

    const stats = [
        {
            title: <FormattedMessage id="learning.learn_exercise.stats.total_projects" />,
            value: projectUser?.data?.length,
            icon: <BsListTask />,
            color: 'blue'
        },
        {
            title: <FormattedMessage id="learning.learn_exercise.stats.ongoing_projects" />,
            value: projectUser?.data?.filter(item => item?.project?.project_completed_on === null)?.length,
            icon: <BsCalendar />,
            color: 'green'
        },
        {
            title: <FormattedMessage id="learning.learn_exercise.stats.team_members" />,
            value: projectUser?.data?.reduce((acc, item) => acc + item?.project_member?.length, 0),
            icon: <BsPeople />,
            color: 'purple'
        },
        {
            title: <FormattedMessage id="learning.learn_exercise.stats.completed_projects" />,
            value: projectUser?.data?.filter(item => item?.project?.project_completed_on !== null)?.length,
            icon: <BsCheckCircle />,
            color: 'cyan'
        }
    ];

    return (
        <Row gutter={[16, 16]} className="mb-6">
            {stats.map((stat, index) => (
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                    <Card className="stat-card h-full">
                        <div className="flex items-center gap-4">
                            <div className={`icon-wrapper text-2xl text-${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-secondary text-sm mb-1">{stat.title}</p>
                                <p className="text-xl font-semibold">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default ProjectStats; 
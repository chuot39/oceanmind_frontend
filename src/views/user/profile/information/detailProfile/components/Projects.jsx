import React from 'react';
import { Card, Row, Col, Tag, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useUserProjectsByUserId } from '../hook';

const Projects = ({ profile }) => {
    console.log('profile', profile);

    const { data: projects, isLoading: isProjectsLoading } = useUserProjectsByUserId(profile?.documentId);
    console.log('projects', projects);

    if (!profile || !projects || projects?.data?.length === 0) return null;

    return (
        <div className="projects-section">
            <h2 className="text-xl text_first font-bold mb-4 flex items-center">
                <FormattedMessage id="profile.projects" defaultMessage="Projects" />
            </h2>

            <Row gutter={[16, 16]}>
                {projects?.data?.map(project => (
                    <Col xs={24} md={12} key={project?.documentId}>
                        <Card
                            hoverable
                            cover={
                                <div
                                    className="h-48 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${project?.image || 'https://picsum.photos/1200/500'})` }}
                                />
                            }
                            className="h-full flex flex-col"
                        >
                            <div className="flex-grow">
                                <h3 className="text-lg font-medium mb-2">{project?.name}</h3>
                                <p className="text_secondary mb-3">{project?.description}</p>

                                <div className="mb-4">
                                    {project?.technologies?.map((tech, index) => (
                                        <Tag key={index} className="mr-1 mb-1">
                                            {tech}
                                        </Tag>
                                    ))}
                                </div>
                            </div>

                            {project?.project_url && (
                                <Button
                                    type="primary"
                                    icon={<FaExternalLinkAlt />}
                                    href={project?.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FormattedMessage id="profile.view_project" defaultMessage="View Project" />
                                </Button>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Projects; 
import React, { useState } from 'react';
import { Card, List, Button, Tag, Space, Typography, Divider, Avatar, Progress, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { BsGrid3X3Gap, BsList, BsLink45Deg, BsEye } from 'react-icons/bs';
import { formatDate } from '../../../../../utils';
import { getProjectStatus, getStatusColor, getTaskStatus } from './util';

const { Title } = Typography;
const { Search } = Input;

const ProjectList = ({ onViewDetail, loading, projectUser }) => {

    const intl = useIntl();

    const [viewMode, setViewMode] = useState('card');
    const [searchQuery, setSearchQuery] = useState('');

    const projectsUser = projectUser?.data?.map(item => {
        return {
            ...item,
            documentId: item?.project?.documentId || '',
            name: item?.project?.name || '',
            description: item?.project?.description || '',
            status: item?.project?.project_completed_on ? 'completed' : 'in_progress',
            due_date: item?.project?.due_date || '',
            members: item?.project_member,
            tasks: item?.project_tasks
        }
    })

    const filteredProjects = projectsUser?.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const inProgressProjects = filteredProjects?.filter(p => p.status === 'in_progress');
    const completedProjects = filteredProjects?.filter(p => p.status === 'completed');


    const renderProjectActions = (project) => [
        // <Button
        //     key="document"
        //     type="text"
        //     icon={<BsFileEarmarkText />}
        //     onClick={() => window.open(project.documentUrl, '_blank')}
        // >
        //     <FormattedMessage id="learning.learn_exercise.access_document" />
        // </Button>,
        <Button
            key="link"
            type="text"
            icon={<BsLink45Deg />}
            onClick={() => window.open(project.project_url, '_blank')}
        >
            <FormattedMessage id="learning.learn_exercise.project_link" />
        </Button>,
        <Button
            key="view"
            type="text"
            icon={<BsEye />}
            onClick={() => onViewDetail(project)}
        >
            <FormattedMessage id="learning.learn_exercise.view_detail" />
        </Button>
    ];

    const renderProjectCard = (project) => (
        <Card
            key={project.documentId}
            className="project-card"
            actions={renderProjectActions(project)}
            loading={loading}
        >
            <Card.Meta
                title={project.name}
                description={
                    <div className="flex justify-between">
                        <Space className="w-[55%]" direction="vertical">
                            <p className='text-justify line-clamp-3 overflow-hidden' >
                                {project.description}
                            </p>
                            <Space>
                                <Tag color={getStatusColor(project.status)}>
                                    {project.status === 'completed' ?
                                        <FormattedMessage id="learning.learn_exercise.status_completed" /> :
                                        <FormattedMessage id="learning.learn_exercise.status_in_progress" />
                                    }
                                </Tag>
                                <p className="flex flex-col"> <span> <FormattedMessage id="learning.learn_exercise.due_date" /> </span> <span> {formatDate(project.due_date)}</span></p>
                            </Space>

                            <Avatar.Group
                                size="default"
                                max={{
                                    count: 3,
                                    style: {
                                        color: '#f56a00',
                                        backgroundColor: '#fde3cf',
                                    },
                                }}
                            >
                                {project?.members?.map((member) => (
                                    <Avatar key={member?.documentId} src={member?.user?.avatar?.file_path} />
                                ))}
                            </Avatar.Group>
                        </Space>

                        <Space className="w-[45%] pl-7" direction="vertical">
                            <Space>
                                <div className="grid gap-2 w-full">
                                    <p><Tag color="blue">{project?.tasks?.length}</Tag><FormattedMessage id="learning.learn_exercise.total_tasks" /> </p>
                                    <p> <Tag color="green">{project?.tasks?.filter(item => getTaskStatus(item) === 'completed')?.length}</Tag><FormattedMessage id="learning.learn_exercise.total_tasks_completed" /> </p>
                                    <p> <Tag color="orange">{project?.tasks?.filter(item => item?.task_completed_on === null)?.length}</Tag><FormattedMessage id="learning.learn_exercise.total_tasks_in_progress" /></p>
                                    <p> <Tag color="red">{project?.tasks?.filter(item => getTaskStatus(item) === 'overdue')?.length}</Tag><FormattedMessage id="learning.learn_exercise.total_tasks_overdue" /></p>
                                </div>
                            </Space>
                        </Space>
                    </div>

                }
            />
        </Card>
    );

    const renderProjectList = (project) => (

        <List.Item
            key={project.documentId}
            actions={renderProjectActions(project)}
            className="rounded-xl my-5 p-0 hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
        >
            <div className="flex flex-col">
                <div className={`h-1 w-full ${getProjectStatus(project) === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}></div>

                <div className="p-6">
                    {/* Header Section with Priority Badge */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Title level={4} className="!mb-0 flex-1 text_first">{project?.name}</Title>
                                <Tag color={getStatusColor(getProjectStatus(project))} className="m-0 uppercase text-xs font-semibold">
                                    {getProjectStatus(project) === 'completed' ?
                                        <FormattedMessage id="learning.learn_exercise.status_completed" /> :
                                        <FormattedMessage id="learning.learn_exercise.status_in_progress" />
                                    }
                                </Tag>
                            </div>
                            <p className="text_secondary text-sm line-clamp-2">{project?.description}</p>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <Progress
                                percent={Math.round((project?.tasks?.filter(item => getTaskStatus(item) === 'completed')?.length / project?.tasks?.length) * 100)}
                                size="small"
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                format={percent => (
                                    <span className={`text-xs font-semibold ${percent === 100 ? '' : 'text_first'}`}>{percent}%</span>
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-2 min-w-fit">
                            <span className="text-xs text_secondary">Deadline:</span>
                            <Tag color="default" className="m-0 text-xs">
                                {formatDate(project?.due_date)}
                            </Tag>
                        </div>
                    </div>

                    {/* Task Statistics Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                            {
                                label: 'learning.learn_exercise.total_tasks',
                                value: project?.tasks?.length,
                                color: 'primary',
                                icon: '📋'
                            },
                            {
                                label: 'learning.learn_exercise.total_tasks_completed',
                                value: project?.tasks?.filter(item => getTaskStatus(item) === 'completed')?.length,
                                color: 'success',
                                icon: '✅'
                            },
                            {
                                label: 'learning.learn_exercise.total_tasks_in_progress',
                                value: project?.tasks?.filter(item => item?.task_completed_on === null)?.length,
                                color: 'warning',
                                icon: '⏳'
                            },
                            {
                                label: 'learning.learn_exercise.total_tasks_overdue',
                                value: project?.tasks?.filter(item => getTaskStatus(item) === 'overdue')?.length,
                                color: 'error',
                                icon: '⚠️'
                            }
                        ].map((stat, index) => (
                            <div key={index} className={`stat-box relative p-3 rounded-lg tag-${stat.color} border`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg">{stat.icon}</span>
                                    <span className={`text-lg font-bold text-${stat.color}-600`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <div className={`text-xs text-${stat.color}-600 mt-1 truncate`}>
                                    <FormattedMessage id={stat.label} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <Avatar.Group
                                className="flex items-center"
                                size={50}
                                max={{
                                    count: 10,
                                    style: {
                                        color: '#f56a00',
                                        backgroundColor: '#fde3cf',
                                    },
                                }}
                            >
                                {project?.members?.map((member) => (
                                    <Avatar key={member?.documentId} src={member?.user?.avatar?.file_path} />
                                ))}
                            </Avatar.Group>
                        </div>

                        {/* <Space size="small">
                            <Button
                                type="text"
                                icon={<BsEye className="text-gray-500" />}
                                onClick={() => onViewDetail(project)}
                            />
                            <Button
                                type="text"
                                icon={<BsFileEarmarkText className="text-gray-500" />}
                                onClick={() => onEditProject(project)}
                            />
                        </Space> */}
                    </div>
                </div>
            </div>
        </List.Item>
    );

    const renderProjects = (projects) => {
        if (viewMode === 'card') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 [@media(min-width:1700px)]:grid-cols-3 [@media(min-width:2000px)]:grid-cols-4 gap-6">
                    {projects?.map(renderProjectCard)}
                </div>
            );
        }

        return (
            <List
                itemLayout="vertical"
                dataSource={projects}
                renderItem={renderProjectList}
                className='project_list'
            />
        );
    };

    return (
        <div className="space-y-6 project_exercise">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">

                <Search
                    className="w-full md:w-64"
                    placeholder={intl.formatMessage({
                        id: 'dashboard.search.placeholder',
                        defaultMessage: "Enter subject name"
                    })}
                    allowClear
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="view-mode-toggle">
                    <Button
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        icon={<BsList />}
                        onClick={() => setViewMode('list')}
                        className="mr-2"
                    />
                    <Button
                        type={viewMode === 'card' ? 'primary' : 'default'}
                        icon={<BsGrid3X3Gap />}
                        onClick={() => setViewMode('card')}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <Title level={4} className="mb-4 text_first">
                        <FormattedMessage id="learning.learn_exercise.in_progress_projects" />
                    </Title>

                    {
                        loading ?
                            <Card
                                loading={loading}
                                style={{
                                    minWidth: 300,
                                    maxWidth: 400,
                                }}
                            >
                            </Card> :
                            renderProjects(inProgressProjects)
                    }
                </div>
                <Divider />
                <div>
                    <Title level={4} className="mb-4 text_first">
                        <FormattedMessage id="learning.learn_exercise.completed_projects" />
                    </Title>
                    {loading ? <Card
                        loading={loading}
                        style={{
                            minWidth: 300,
                            maxWidth: 400,
                        }}
                    >
                    </Card> : renderProjects(completedProjects)}
                    {/* {renderProjects(completedProjects)} */}
                </div>
            </div>
        </div>
    );
};

export default ProjectList; 
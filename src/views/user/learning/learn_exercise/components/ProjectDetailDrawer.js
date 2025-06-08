import React, { useEffect, useState } from 'react';
import { Drawer, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getProjectStatus } from './util';
import { useUserData } from '../../../../../utils/hooks/useAuth';
import ListTaskProject from './ListTaskProject';
import ListMemberProject from './ListMemberProject';
import ProjectInfo from './ProjectInfo';


const ProjectDetailDrawer = ({ visible, onClose, project, onEditProject, refetchProjectUser, handleDrawerClose }) => {
    const { userData } = useUserData();

    const [activeTab, setActiveTab] = useState('project_info');
    const [statusProject, setStatusProject] = useState(false);

    const isLeader = project?.project?.leader?.username === userData?.username;

    useEffect(() => {
        setStatusProject(getProjectStatus(project?.project) === 'completed');
    }, [project]);

    // Refetch dữ liệu khi tab tasks được chọn hoặc khi project.tasks thay đổi
    useEffect(() => {
        if (activeTab === 'tasks' && project?.tasks?.length > 0) {
            refetchProjectUser();
        }
    }, [activeTab, project?.tasks]);


    // Error state - only show error drawer if project is missing, not for update errors
    if (!project) {
        return (
            <Drawer
                title="Error"
                placement="right"
                onClose={onClose}
                open={visible}
                width={720}
            >
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">Failed to load project details</p>
                </div>
            </Drawer>
        );
    }

    return (
        <>
            <Drawer
                title={project?.name}
                placement="right"
                onClose={onClose}
                open={visible}
                width={720}
                className="project-detail-drawer"
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: 'tasks',
                            label: <FormattedMessage id="learning.learn_exercise.tasks" />,
                            children: <ListTaskProject
                                project={project}
                                refetchProjectUser={refetchProjectUser}
                                onClose={onClose}
                            />
                        },
                        {
                            key: 'project_info',
                            label: <FormattedMessage id="learning.learn_exercise.project_info" />,
                            children: <ProjectInfo
                                project={project}
                                isLeader={isLeader}
                                onEditProject={onEditProject}
                                onClose={onClose}
                                statusProject={statusProject}
                            />
                        },
                        {
                            key: 'team_members',
                            label: <FormattedMessage id="learning.learn_exercise.team_members" />,
                            children: <ListMemberProject
                                project={project}
                                refetchProjectUser={refetchProjectUser}
                                onClose={onClose}
                                isLeader={isLeader}
                            />
                        }
                    ]}
                />
            </Drawer>
        </>
    );
};

export default ProjectDetailDrawer; 
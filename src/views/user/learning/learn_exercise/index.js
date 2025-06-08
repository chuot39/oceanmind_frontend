import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { BsPlus } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import ProjectList from './components/ProjectList';
import ProjectDrawer from './components/ProjectDrawer';
import ProjectDetailDrawer from './components/ProjectDetailDrawer';
import ProjectStats from './components/ProjectStats';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { useProjectUser } from './hook';
import '../../../../core/scss/styles/pages/learning/index.scss';

const LearnExercise = () => {
    const { userData } = useUserData()

    const { status: statusProjectUser, data: projectUser, refetch: refetchProjectUser } = useProjectUser(userData?.documentId);

    const [editingProject, setEditingProject] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);


    const showDrawer = (project = null) => {
        setEditingProject(project);
        setIsDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerVisible(false);
        setEditingProject(null);
    };

    const showDetailDrawer = (project) => {
        setSelectedProject(project);
        setIsDetailDrawerVisible(true);
    };

    const handleDetailDrawerClose = () => {
        setIsDetailDrawerVisible(false);
        setSelectedProject(null);
    };

    return (
        <div className="learn-exercise-page p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text_first font-bold">
                    <FormattedMessage id="learning.learn_exercise.title" />
                </h1>
                <Button
                    type="primary"
                    icon={<BsPlus />}
                    onClick={() => showDrawer()}
                >
                    <FormattedMessage id="learning.learn_exercise.add_project" />
                </Button>
            </div>

            {/* Project Statistics */}
            <ProjectStats projectUser={projectUser} />

            <Divider />

            {/* Project List */}
            <ProjectList
                onViewDetail={showDetailDrawer}
                loading={statusProjectUser === 'loading'}
                projectUser={projectUser}
            />

            {/* Project Drawer */}
            <ProjectDrawer
                visible={isDrawerVisible}
                onClose={handleDrawerClose}
                onCloseDetailDrawer={handleDetailDrawerClose}
                project={editingProject}
                refetchProjectUser={refetchProjectUser}
            />

            <ProjectDetailDrawer
                visible={isDetailDrawerVisible}
                onClose={handleDetailDrawerClose}
                project={selectedProject}
                onEditProject={showDrawer}
                refetchProjectUser={refetchProjectUser}
                handleDrawerClose={handleDrawerClose}
            />
        </div>
    );
};

export default LearnExercise;
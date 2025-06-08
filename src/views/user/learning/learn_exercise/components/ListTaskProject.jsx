import Hamster from "@/components/loader/Hamster/Hamster";
import { Avatar, Button, List, Modal, Tag } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { PlusOutlined } from '@ant-design/icons';
import { BsStar, BsCalendar, BsClock, BsCheckCircle } from 'react-icons/bs';
import { getCategoryColor, getStatusColor, getTaskStatus } from "./util";
import { formatDate } from "../../../../../utils";
import BtnEdit from "@/components/button/action/BtnEdit";
import BtnTrashSquare from "@/components/button/action/BtnTrashSquare";
import { useUserData } from "@/utils/hooks/useAuth";
import useSkin from "@/utils/hooks/useSkin";
import { useState } from "react";
import TaskDrawer from "../../task/components/TaskDrawer";
import { useDeleteTask } from "../../task/mutationHooks";
import { useQueryClient } from "react-query";

const ListTaskProject = ({ project, refetchProjectUser, loading, onClose }) => {
    const { userData } = useUserData();
    const { language } = useSkin();
    const intl = useIntl();
    const queryClient = useQueryClient();

    const { mutate: deleteTaskAsync, status: statusDeleteTask } = useDeleteTask();


    const [showTaskDrawer, setShowTaskDrawer] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [typeModal, setTypeModal] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleAddTask = (values) => {
        setShowTaskDrawer(true);
        setEditingTask(null);
    };


    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskDrawer(true);
    };


    const handleShowModalDeleteTask = (task) => {
        setTaskToDelete(task);
        setTypeModal('delete_task');
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleTaskUpdated = () => {
        refetchProjectUser();
        onClose();
        queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
    };


    const handleDeleteTask = async (task) => {
        deleteTaskAsync({ taskId: task?.documentId }, {
            onSuccess: () => {
                refetchProjectUser();
                queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
                handleCancel();
                onClose();
            },
            onError: (error) => {
                handleCancel();
            }
        });
    }

    const renderModal = () => {
        let title, content, okText;
        switch (typeModal) {
            case 'delete_task':
                title = intl.formatMessage({ id: 'learning.learn_exercise.delete_task_title', defaultMessage: 'Delete Task' });
                content = intl.formatMessage(
                    { id: 'learning.learn_exercise.delete_task_content', defaultMessage: 'Are you sure you want to delete this task?' },
                    { name: taskToDelete?.name }
                );
                okText = intl.formatMessage({ id: 'learning.learn_exercise.yes_delete_task', defaultMessage: 'Yes, Delete Task' });
                return { title, content, okText, onOk: () => handleDeleteTask(taskToDelete) };
            default:
                return { title: '', content: '', okText: '', onOk: () => { } };
        }
    }

    const { title, content, okText, onOk } = renderModal();

    return (
        <>
            <div>
                {loading ?
                    <div className='flex justify-center items-center h-[60vh]'>
                        <Hamster />
                    </div>
                    :

                    <>

                        <div className="flex justify-end items-center mb-4">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddTask}
                            >
                                <FormattedMessage id="learning.learn_exercise.add_task" />
                            </Button>
                        </div>
                        <List
                            dataSource={project?.tasks || []}
                            renderItem={task => {
                                const isTaskCreator = task?.taskAssignedBy?.username === userData?.username;
                                const isTaskAssignee = task?.taskAssignedTo?.username === userData?.username;
                                return (
                                    <List.Item
                                        className="rounded-lg p-4 mb-4 hover:shadow-md transition-all custom_list"
                                        actions={[
                                            <div className='flex items-center gap-2'>
                                                <Button
                                                    type="dashed"
                                                    className='tag-primary mr-4'
                                                    icon={<BtnEdit />}
                                                    onClick={() => handleEditTask(task)}
                                                />

                                                <Button
                                                    type="dashed"
                                                    className='tag-primary mr-4'
                                                    icon={<BtnTrashSquare className={`btn_trash_square ${!isTaskCreator && !isTaskAssignee ? 'disabled' : ''}`} />}
                                                    onClick={() => handleShowModalDeleteTask(task)}
                                                    disabled={!isTaskCreator && !isTaskAssignee}
                                                />
                                            </div>
                                        ]}
                                    >
                                        <div className="w-full px-4">
                                            {/* Header Section */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-lg font-medium m-0 text_first flex items-center gap-2">
                                                        {task.name}
                                                        {task.is_important && (
                                                            <BsStar className="text-yellow-500" />
                                                        )}
                                                    </h4>
                                                    <Tag color={getStatusColor(getTaskStatus(task))}>
                                                        {getTaskStatus(task) === 'completed' ? (
                                                            <FormattedMessage id="learning.learn_exercise.status_completed" />
                                                        ) : (
                                                            <FormattedMessage id="learning.learn_exercise.status_in_progress" />
                                                        )}
                                                    </Tag>

                                                    <Tag color={getCategoryColor(task?.taskCategory?.name_en)}>
                                                        {language === 'vi' ? task?.taskCategory?.name_vi : task?.taskCategory?.name_en}
                                                    </Tag>
                                                </div>

                                            </div>

                                            {/* Description */}
                                            <p className="text_secondary mb-4">{task?.description}</p>

                                            {/* Meta Information */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text_secondary">
                                                    <BsCalendar className="text-red-500 text-xl" />
                                                    <span><FormattedMessage id="learning.learn_exercise.created_at" />: {formatDate(task.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text_secondary">
                                                    <BsClock className="text-blue-500 text-xl" />
                                                    <span><FormattedMessage id="learning.learn_exercise.due_date" />: {formatDate(task.due_date)}</span>
                                                </div>
                                                {task.task_completed_on && (
                                                    <div className="flex items-center gap-2 text_secondary">
                                                        <BsCheckCircle className="text-green-500 text-xl" />
                                                        <span><FormattedMessage id="learning.task.completed" />: {formatDate(task.task_completed_on)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assignee Information */}
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={task.taskAssignedBy?.avatar?.file_path} size="default" />
                                                    <span className="text_secondary"><FormattedMessage id="learning.task.assign_by" />: {task.taskAssignedBy?.fullname}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={task.taskAssignedTo?.avatar?.file_path} size="default" />
                                                    <span className="text_secondary"><FormattedMessage id="learning.task.assignee" />: {task.taskAssignedTo?.fullname}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )
                            }}
                        />

                    </>
                }


            </div>

            <Modal
                title={title}
                open={isModalVisible}
                onOk={onOk}
                onCancel={handleCancel}
                okText={okText}
                cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                okButtonProps={{ danger: true }}
                confirmLoading={statusDeleteTask === 'loading'}
            >
                <p>{content}</p>
            </Modal>


            {showTaskDrawer && (
                <TaskDrawer
                    visible={showTaskDrawer}
                    onClose={() => setShowTaskDrawer(false)}
                    task={editingTask}
                    mode={editingTask ? 'edit' : 'add'}
                    onTaskUpdated={handleTaskUpdated}
                    defaultProject={project}
                />
            )}
        </>

    )
};

export default ListTaskProject;

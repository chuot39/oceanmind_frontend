import React, { useMemo, useState } from 'react';
import { Input, Button, Avatar, Tag, Checkbox, Dropdown, message, Tooltip, Modal, Empty } from 'antd';
import { BsThreeDotsVertical, BsSearch, BsArrowCounterclockwise } from 'react-icons/bs';
import Hamster from '../../../../../components/loader/Hamster/Hamster';
import BtnTrashSquare from '@/components/button/action/BtnTrashSquare';
import { GiCheckMark } from "react-icons/gi";
import { IoMdStar } from 'react-icons/io';
import { useDeleteTask, useUpdateTask, useRestoreTask, usePermanentDeleteTask } from '../mutationHooks';
import BtnNext from '@/components/button/Reaction/BtnNext';
import { FormattedMessage, useIntl } from 'react-intl';
import { getPriorityTagColor } from '@/helpers/colorHelper';
import useSkin from '@/utils/hooks/useSkin';
import { MdRestoreFromTrash, MdDeleteForever } from 'react-icons/md';
import ModalConfirm from '@/views/user/components/ModalConfirm';

const { Search } = Input;

const TaskList = ({ tasks, onTaskClick, onTaskSelect, selectedTasks, userTaskStatus, categoryTaskStatus, onClearSelectedTasks, refetchUserTask }) => {

    const intl = useIntl();
    const { language } = useSkin();

    const { mutateAsync: deleteTask } = useDeleteTask();
    const { mutateAsync: updateTask } = useUpdateTask();
    const { mutate: restoreTask, isLoading: isRestoring } = useRestoreTask();
    const { mutate: permanentDeleteTask, isLoading: isPermanentDeleting } = usePermanentDeleteTask();
    const [searchQuery, setSearchQuery] = useState('');


    const filteredTasks = useMemo(() => {
        if (!tasks) return [];

        // Only filter by search query - other filtering is done on the server
        if (searchQuery) {
            return tasks?.data?.filter(task =>
                task?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return tasks?.data || [];
    }, [tasks, searchQuery]);

    const getStatusIcon = (task) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        const dueDate = task?.due_date ? new Date(task?.due_date) : null;
        if (dueDate) dueDate.setHours(0, 0, 0, 0);

        // Tạo mảng chứa tất cả các icon thỏa mãn điều kiện
        const icons = [];

        // Check completed status
        if (task?.task_completed_on !== null) {
            icons.push({
                icon: '✓',
                status: 'completed',
                color: 'text-green-500'
            });
        }

        // Check important status
        if (task?.is_important) {
            icons.push({
                icon: '★',
                status: 'important',
                color: 'text-yellow-500'
            });
        }

        // Check overdue status
        if (dueDate && dueDate < today && !task?.task_completed_on) {
            icons.push({
                icon: '❌',
                status: 'overdue',
                color: 'text-red-500'
            });
        }

        // Check due today status
        if (dueDate && dueDate.getTime() === today.getTime()) {
            icons.push({
                icon: '⏰',
                status: 'due-today',
                color: 'text-orange-500'
            });
        }

        // Nếu không có icon nào thỏa mãn, trả về icon mặc định
        if (icons.length === 0) {
            return [{
                icon: '○',
                status: 'in-progress',
                color: 'text-gray-500'
            }];
        }

        return icons;
    };

    const actionItems = [
        {
            key: 'complete',
            label:
                <div className='flex items-center gap-2'>
                    <GiCheckMark className='text-green-500' />
                    <FormattedMessage id="common.mark_complete" defaultMessage="Mark Complete" />
                </div>
        },
        {
            key: 'important',
            label:
                <div className='flex items-center gap-2'>
                    <IoMdStar className='text-yellow-500 text-xl' />
                    <FormattedMessage id="common.mark_important" defaultMessage="Mark Important" />
                </div>
        },
        {
            key: 'delete',
            label:
                <div className='flex items-center gap-2'>
                    <BtnTrashSquare className='btn_trash_square_20' />
                    <FormattedMessage id="common.delete" defaultMessage="Delete" />
                </div>
        }
    ];

    const handleTaskUpdate = async (selectedTasks, data) => {
        if (selectedTasks.length === 0) return;

        try {
            let updatePromises = [];
            switch (data?.key) {
                case 'complete':
                    updatePromises = selectedTasks.map(taskId =>
                        updateTask({ taskId, data: { task_completed_on: new Date().toISOString() } })
                    );
                    break;
                case 'important':
                    updatePromises = selectedTasks.map(taskId =>
                        updateTask({ taskId, data: { is_important: true } })
                    );
                    break;
                case 'delete':
                    updatePromises = selectedTasks.map(taskId =>
                        deleteTask({ taskId })
                    );
                    break;
            }

            // Chờ tất cả các promises hoàn thành
            await Promise.all(updatePromises);

            refetchUserTask();
            // Reset selectedTasks
            onClearSelectedTasks();
        } catch (error) {
            console.error("Error updating tasks:", error);
        }
    };

    const handleComplete = (selectedTasks) => {
        handleTaskUpdate(selectedTasks, {
            task_completed_on: new Date().toISOString(),
            key: 'complete'
        });
    };

    const handleImportant = (selectedTasks) => {
        handleTaskUpdate(selectedTasks, {
            is_important: true,
            key: 'important'
        });
    };

    const handleDelete = (selectedTasks) => {
        handleTaskUpdate(selectedTasks, {
            key: 'delete'
        });
    };

    const handleRestore = (taskId) => {
        return ModalConfirm({
            typeModal: 'restore_task',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    await restoreTask({ taskId },
                        {
                            onSuccess: () => {
                                refetchUserTask();
                                onClearSelectedTasks();
                            },
                            onError: (error) => {
                                console.error("Error restoring task:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring task:", error);
                }
            },
            intl: intl
        });
    };

    const handlePermanentDelete = (taskId) => {
        return ModalConfirm({
            typeModal: 'permanent_delete_task',
            handleResolve: async () => {
                try {
                    await permanentDeleteTask({ taskId });
                    refetchUserTask();
                    onClearSelectedTasks();
                } catch (error) {
                    console.error("Error permanently deleting task:", error);
                }
            },
            intl: intl
        });
    };

    const handleAction = (key) => {
        switch (key?.key) {
            case 'complete':
                handleComplete(selectedTasks);
                break;
            case 'important':
                handleImportant(selectedTasks);
                break;
            case 'delete':
                handleDelete(selectedTasks);
                break;
        }
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header sticky top-0 bg-transparent z-10  border-b">
                <div className="flex justify-between items-center px-2">
                    <Search
                        placeholder="Search tasks..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<BsSearch />}
                        className="search_task w-full h-11"
                    />
                    {selectedTasks.length > 0 && (
                        <Dropdown
                            menu={{ items: actionItems, onClick: handleAction }}
                            placement="bottomRight"
                        >
                            <Button icon={<BsThreeDotsVertical />} />
                        </Dropdown>
                    )}
                </div>
            </div>

            <div className="task-list p-4">


                {userTaskStatus === 'loading' || categoryTaskStatus === 'loading' ? (
                    <div className="flex justify-center items-center h-[55vh]">
                        <Hamster />
                    </div>
                ) : (
                    <>
                        {filteredTasks.length > 0 ? (
                            filteredTasks?.map(task => (
                                <div
                                    key={task.documentId}
                                    className="task-item flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b z-10"
                                >

                                    {task?.deletedAt === null && (
                                        <Checkbox
                                            checked={selectedTasks.includes(task.documentId)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onTaskSelect(task.documentId);
                                            }}
                                            className="mr-3"
                                        />
                                    )}
                                    <div className="flex items-center w-full justify-between" onClick={() => onTaskClick(task)}>
                                        <div>
                                            <div className="flex items-center">
                                                {getStatusIcon(task).map((statusIcon, index) => (
                                                    <span key={index} className={`status-icon mr-1 ${statusIcon.color}`} title={statusIcon.status}>
                                                        {statusIcon.icon}
                                                    </span>
                                                ))}
                                                <span className="task-title flex-1 ml-2">{task?.name}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Tag color={getPriorityTagColor(task?.taskCategory?.name_en)}>{language === 'vi' ? task?.taskCategory?.name_vi : task?.taskCategory?.name_en}</Tag>
                                            <span className="task-date mx-4 text_secondary">{task?.due_date}</span>
                                            <Tooltip title={task?.taskAssignedBy?.fullname}>
                                                <Avatar src={task?.taskAssignedBy?.avatar?.file_path} />
                                            </Tooltip>
                                            <BtnNext name={intl.formatMessage({ id: 'reuse.assign_to' })} autoFocus={true} size={1} />
                                            <Tooltip title={task?.taskAssignedTo?.fullname}>
                                                <Avatar src={task?.taskAssignedTo?.avatar?.file_path} />
                                            </Tooltip>

                                            {task?.deletedAt && (
                                                <div className='ms-9 flex items-center gap-2'>
                                                    <Tooltip title={intl.formatMessage({ id: 'learning.task.permanent_delete', defaultMessage: 'Delete Permanently' })}>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            className="!text-red-500 !bg-red-100 text-xl"
                                                            loading={isPermanentDeleting}
                                                            icon={<MdDeleteForever />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePermanentDelete(task.documentId);
                                                            }}
                                                        />
                                                    </Tooltip>

                                                    <Tooltip title={intl.formatMessage({ id: 'admin.dashboard.notification.table.restore', defaultMessage: 'Restore' })}>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            className="!text-green-500 !bg-green-100 text-xl"
                                                            loading={isRestoring}
                                                            icon={<BsArrowCounterclockwise />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRestore(task.documentId);
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center items-center h-[55vh]">
                                <Empty
                                    description={<FormattedMessage id="common.no_data" defaultMessage="No data" />}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskList; 
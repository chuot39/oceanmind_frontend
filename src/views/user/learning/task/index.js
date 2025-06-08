import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { BsPlus } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskSidebar from './components/TaskSidebar';
import TaskDrawer from './components/TaskDrawer';
import '../../../../core/scss/styles/pages/learning/index.scss';
import { useCategoryTask } from './hook';
import { useUserData } from '../../../../utils/hooks/useAuth';
import { useUserTask } from '../../components/hook';
import dayjs from 'dayjs';

const TaskDashboard = () => {
    const { userData } = useUserData();
    const { alias } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const oldData = location?.state?.taskData || null;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [filterParams, setFilterParams] = useState({
        task_assigned_to: userData?.documentId,
        same_assign: false,
        includeDeleted: false
    });

    const { status: userTaskStatus, data: userTask, refetch: refetchUserTask } = useUserTask(filterParams);
    const { status: categoryTaskStatus, data: categoryTasks } = useCategoryTask();

    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(oldData);

    const drawerVisible = alias === 'add' || alias === 'edit';

    useEffect(() => {
        if (oldData) {
            setSelectedTask(oldData);
        }
    }, [oldData]);

    useEffect(() => {
        const newFilterParams = {
            task_assigned_to: userData?.documentId,
            same_assign: false
        };

        // Add status filters based on selectedCategory
        if (selectedCategory) {
            switch (selectedCategory) {
                case 'important':
                    newFilterParams.is_important = true;
                    break;
                case 'completed':
                    newFilterParams.is_completed = true;
                    break;
                case 'due-today':
                    newFilterParams.due_date_start = dayjs().format('YYYY-MM-DD');
                    newFilterParams.due_date_end = dayjs().format('YYYY-MM-DD');
                    break;
                case 'overdue':
                    newFilterParams.overdue = true;
                    break;
                case 'deleted':
                    newFilterParams.includeDeleted = true;
                    break;
                default:
                    newFilterParams.includeDeleted = false;
                    break;
            }
        } else {
            newFilterParams.includeDeleted = false;
        }

        // Add category filter based on selectedPriority
        if (selectedPriority && selectedPriority !== 'All') {
            newFilterParams.task_category_id = selectedPriority;
        }

        setFilterParams(newFilterParams);
    }, [selectedCategory, selectedPriority, userData?.documentId]);

    // Thêm effect để refetch dữ liệu khi chuyển tab
    useEffect(() => {
        refetchUserTask();
    }, [selectedCategory, refetchUserTask]);

    const handleTaskSelect = (taskId) => {
        setSelectedTasks(prev => {
            if (prev.includes(taskId)) {
                return prev.filter(id => id !== taskId);
            }
            return [...prev, taskId];
        });
    };

    const handleClearSelectedTasks = () => {
        setSelectedTasks([]);
    };

    const handleTaskClick = (task) => {
        navigate('/learning/task/edit', { state: { taskData: task } });
    };

    const handleAddTask = () => {
        navigate('/learning/task/add');
    };

    const handleDrawerClose = () => {
        navigate('/learning/task');
        setSelectedTask(null);
    };

    return (
        <Card className="task-dashboard h-full mb-4">
            <div className="flex h-full">
                <div className="w-64 flex flex-col  border-r">
                    <Button
                        type="primary"
                        size="large"
                        icon={<BsPlus />}
                        onClick={handleAddTask}
                        className="mb-4 me-2 p-2 flex items-center justify-center"
                    >
                        <FormattedMessage id="learning.task.add_task" defaultMessage="Add Task" />
                    </Button>
                    <TaskSidebar
                        selectedCategory={selectedCategory}
                        selectedPriority={selectedPriority}
                        onSelectCategory={setSelectedCategory}
                        onSelectPriority={setSelectedPriority}
                        categoryTasks={categoryTasks}
                        refetchUserTask={refetchUserTask}
                    />
                </div>

                <div className="flex-1">
                    <TaskList
                        tasks={userTask}
                        onTaskClick={handleTaskClick}
                        onTaskSelect={handleTaskSelect}
                        selectedTasks={selectedTasks}
                        userTaskStatus={userTaskStatus}
                        categoryTaskStatus={categoryTaskStatus}
                        refetchUserTask={refetchUserTask}
                        onClearSelectedTasks={handleClearSelectedTasks}
                    />
                </div>
            </div>

            <TaskDrawer
                visible={drawerVisible}
                onClose={handleDrawerClose}
                task={selectedTask}
                mode={alias === 'edit' ? 'edit' : 'add'}
                refetchUserTask={refetchUserTask}
            />
        </Card>
    );
};

export default TaskDashboard;
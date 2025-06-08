import React from 'react';
import { Menu, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BsInbox, BsStar, BsCheck2Square, BsExclamationTriangle, BsTrash } from 'react-icons/bs';
import { FaRegDotCircle } from 'react-icons/fa';
import useSkin from '../../../../../utils/hooks/useSkin';
import { MdOutlineDangerous } from 'react-icons/md';
import { LuAlarmClock } from 'react-icons/lu';

const TaskSidebar = ({ selectedCategory, selectedPriority, onSelectCategory, onSelectPriority, categoryTasks, refetchUserTask }) => {
    const { language } = useSkin();

    const handleCategorySelect = (key) => {
        onSelectCategory(key);
        // Gọi refetch khi chuyển tab để đảm bảo dữ liệu luôn mới nhất
        if (refetchUserTask) {
            setTimeout(() => {
                refetchUserTask();
            }, 100);
        }
    };

    const handlePrioritySelect = (key) => {
        onSelectPriority(key);
        // Gọi refetch khi chuyển tab để đảm bảo dữ liệu luôn mới nhất
        if (refetchUserTask) {
            setTimeout(() => {
                refetchUserTask();
            }, 100);
        }
    };

    const statusItems = [
        {
            key: 'my-tasks',
            icon: <BsInbox />,
            label: <FormattedMessage id="learning.task.my_tasks" defaultMessage="My Tasks" />
        },
        {
            key: 'important',
            icon: <BsStar />,
            label: <FormattedMessage id="learning.task.important" defaultMessage="Important" />
        },
        {
            key: 'completed',
            icon: <BsCheck2Square />,
            label: <FormattedMessage id="learning.task.completed" defaultMessage="Completed" />
        },
        {
            key: 'due-today',
            icon: <LuAlarmClock />,
            label: <FormattedMessage id="learning.task.due_today" defaultMessage="Due Today" />
        },
        {
            key: 'overdue',
            icon: <MdOutlineDangerous />,
            label: <FormattedMessage id="learning.task.overdue" defaultMessage="Overdue" />
        },
        {
            key: 'deleted',
            icon: <BsTrash />,
            label: <FormattedMessage id="learning.task.deleted" defaultMessage="Deleted" />
        }
    ];

    const priorityItems = categoryTasks?.data?.map(category => ({
        key: category.name_en,
        icon: <FaRegDotCircle />,
        label: language === 'vi' ? category.name_vi : category.name_en
    }));

    return (
        <div className="task-sidebar h-full max-h-[calc(100vh-100px)] overflow-y-auto">
            <Menu
                mode="inline"
                selectedKeys={[selectedCategory || 'my-tasks']}
                onSelect={({ key }) => handleCategorySelect(key)}
                items={statusItems}
                className="border-none"
            />

            <Divider className="my-4" />

            <Menu
                mode="inline"
                selectedKeys={[selectedPriority || 'All']}
                onSelect={({ key }) => handlePrioritySelect(key)}
                items={priorityItems}
                className="border-none"
            />
        </div>
    );
};

export default TaskSidebar; 
import React from 'react';
import { Table, Space, Button, Tooltip, Tag } from 'antd';
import { BsTrash, BsPencil, BsEye } from 'react-icons/bs';
import { format } from 'date-fns';

const TaskCategoryTable = ({
    data,
    loading,
    pagination,
    onChange,
    onView,
    onEdit,
    onDelete
}) => {
    // Function to get priority tag color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 0: return 'red'; // Urgent
            case 1: return 'orange'; // High
            case 2: return 'blue'; // Medium
            case 3: return 'green'; // Low
            case 4: return 'purple'; // Long-term
            default: return 'default';
        }
    };

    // Function to get priority label
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 0: return 'Urgent';
            case 1: return 'High';
            case 2: return 'Medium';
            case 3: return 'Low';
            case 4: return 'Long-term';
            default: return 'Unknown';
        }
    };

    const columns = [
        {
            title: 'Vietnamese Name',
            dataIndex: 'name_vi',
            key: 'name_vi',
            sorter: true,
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'English Name',
            dataIndex: 'name_en',
            key: 'name_en',
            sorter: true,
        },
        {
            title: 'Priority',
            dataIndex: 'task_priority',
            key: 'task_priority',
            sorter: true,
            render: (priority) => (
                <Tag color={getPriorityColor(priority)}>
                    {getPriorityLabel(priority)}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 120,
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            size="small"
                            icon={<BsEye />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<BsPencil />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<BsTrash />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(record);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            className="task-category-table"
            columns={columns}
            dataSource={data?.map(item => ({ ...item, key: item.documentId }))}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            rowClassName="cursor-pointer"
            onRow={(record) => ({
                onClick: () => onView(record),
            })}
        />
    );
};

export default TaskCategoryTable; 
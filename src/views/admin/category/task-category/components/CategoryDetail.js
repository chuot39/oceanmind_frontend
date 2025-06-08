import React from 'react';
import { Modal, Descriptions, Typography, Button, Space, Tag } from 'antd';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { format } from 'date-fns';

const { Title } = Typography;

const CategoryDetail = ({ visible, onClose, category, onEdit, onDelete }) => {
    if (!category) return null;

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

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <Title level={4} className="m-0">Task Category Details</Title>
                    <Space>
                        <Button
                            icon={<BsPencil />}
                            onClick={() => {
                                onClose();
                                onEdit(category);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            icon={<BsTrash />}
                            onClick={() => {
                                onClose();
                                onDelete(category);
                            }}
                        >
                            Delete
                        </Button>
                    </Space>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={700}
        >
            <div className="category-detail">
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Vietnamese Name">
                        {category.name_vi}
                    </Descriptions.Item>
                    <Descriptions.Item label="English Name">
                        {category.name_en}
                    </Descriptions.Item>
                    <Descriptions.Item label="Priority">
                        <Tag color={getPriorityColor(category.task_priority)}>
                            {getPriorityLabel(category.task_priority)} ({category.task_priority})
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {format(new Date(category.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {format(new Date(category.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default CategoryDetail; 
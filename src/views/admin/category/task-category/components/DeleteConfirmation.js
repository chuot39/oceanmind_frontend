import React from 'react';
import { Modal, Typography, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, category, isLoading }) => {
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
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    Delete Task Category
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {category && (
                <>
                    <p>
                        Are you sure you want to delete the task category:
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <div className="flex flex-col">
                            <Text strong>Vietnamese: {category.name_vi}</Text>
                            <Text>English: {category.name_en}</Text>
                            <div className="mt-2">
                                <Text>Priority: </Text>
                                <Tag color={getPriorityColor(category.task_priority)}>
                                    {getPriorityLabel(category.task_priority)}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    <p className="text-red-500">
                        This action cannot be undone and may affect tasks associated with this category.
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
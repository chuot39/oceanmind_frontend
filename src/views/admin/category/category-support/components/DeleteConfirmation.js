import React from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, category, isLoading }) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    Delete Support Category
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
                        Are you sure you want to delete the support category:
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <div className="flex flex-col">
                            <Text strong>Vietnamese: {category.name_vi}</Text>
                            <Text>English: {category.name_en}</Text>
                            {category.description_vi && (
                                <div className="mt-2">
                                    <Text type="secondary" className="block">Description (VI): </Text>
                                    <Text className="text-gray-600 text-sm">
                                        {category.description_vi.length > 100
                                            ? `${category.description_vi.substring(0, 100)}...`
                                            : category.description_vi}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-red-500">
                        This action cannot be undone and may affect support requests associated with this category.
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
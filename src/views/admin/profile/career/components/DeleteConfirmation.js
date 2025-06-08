import React from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, career, isLoading }) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    Delete Career
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {career && (
                <>
                    <p>
                        Are you sure you want to delete the career:
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <Text strong>{career.name}</Text>
                        {career.description && (
                            <div className="mt-1 text-gray-500">
                                {career.description.length > 100
                                    ? `${career.description.substring(0, 100)}...`
                                    : career.description}
                            </div>
                        )}
                    </div>

                    <p className="text-red-500">
                        This action cannot be undone.
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
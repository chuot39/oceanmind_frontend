import React from 'react';
import { Modal, Typography } from 'antd';
import { BsExclamationTriangle } from 'react-icons/bs';

const { Text, Paragraph } = Typography;

const DeleteConfirmation = ({ visible, onCancel, onConfirm, loading, item }) => {
    return (
        <Modal
            title={
                <div className="flex items-center text-red-500">
                    <BsExclamationTriangle className="mr-2" />
                    <span>Delete Guide</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            onOk={onConfirm}
            okText="Delete"
            okButtonProps={{ danger: true, loading }}
            cancelButtonProps={{ disabled: loading }}
            centered
        >
            <div className="py-4">
                <Paragraph>
                    Are you sure you want to delete this guide?
                </Paragraph>

                {item && (
                    <div className="bg-gray-50 p-3 rounded-md mt-2">
                        <Text strong>{item.title}</Text>
                    </div>
                )}

                <Paragraph className="text-red-500 mt-4">
                    This action cannot be undone.
                </Paragraph>
            </div>
        </Modal>
    );
};

export default DeleteConfirmation; 
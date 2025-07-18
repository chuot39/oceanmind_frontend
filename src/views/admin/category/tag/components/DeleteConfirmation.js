import React from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, tag, isLoading }) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    Delete Tag
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {tag && (
                <>
                    <p>
                        Are you sure you want to delete the tag:
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <div className="flex flex-col">
                            <Text strong>Vietnamese: {tag.name_vi}</Text>
                            <Text>English: {tag.name_en}</Text>
                        </div>
                    </div>

                    <p className="text-red-500">
                        This action cannot be undone and may affect posts associated with this tag.
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
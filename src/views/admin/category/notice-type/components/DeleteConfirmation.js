import React from 'react';
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, noticeType, isLoading }) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    Delete Notice Type
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {noticeType && (
                <>
                    <p>
                        Are you sure you want to delete the notice type:
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <div className="flex flex-col">
                            <Text strong>Vietnamese: {noticeType.name_vi}</Text>
                            <Text>English: {noticeType.name_en}</Text>
                            {noticeType.description_vi && (
                                <div className="mt-2">
                                    <Text type="secondary" className="block">Description (VI): </Text>
                                    <Text className="text-gray-600 text-sm">
                                        {noticeType.description_vi.length > 100
                                            ? `${noticeType.description_vi.substring(0, 100)}...`
                                            : noticeType.description_vi}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-red-500">
                        This action cannot be undone and may affect notices associated with this type.
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
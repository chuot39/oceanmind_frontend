import React from 'react';
import { Modal, Descriptions, Typography, Button, Space } from 'antd';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { format } from 'date-fns';

const { Title, Text } = Typography;

const CareerDetail = ({ visible, onClose, career, onEdit, onDelete }) => {
    if (!career) return null;

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <Title level={4} className="m-0">Career Details</Title>
                    <Space>
                        <Button
                            icon={<BsPencil />}
                            onClick={() => {
                                onClose();
                                onEdit(career);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            icon={<BsTrash />}
                            onClick={() => {
                                onClose();
                                onDelete(career);
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
            <div className="career-detail">
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Name">
                        {career.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                        {career.description || <Text italic className="text-gray-400">No description provided</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {format(new Date(career.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {format(new Date(career.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default CareerDetail; 
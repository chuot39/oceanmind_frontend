import React from 'react';
import { Modal, Descriptions, Typography, Button, Space } from 'antd';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { format } from 'date-fns';

const { Title } = Typography;

const CategoryDetail = ({ visible, onClose, category, onEdit, onDelete }) => {
    if (!category) return null;

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <Title level={4} className="m-0">Subject Category Details</Title>
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
import React from 'react';
import { Modal, Descriptions, Typography, Button, Space } from 'antd';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { format } from 'date-fns';

const { Title } = Typography;

const TagDetail = ({ visible, onClose, tag, onEdit, onDelete }) => {
    if (!tag) return null;

    return (
        <Modal
            title={
                <div className="flex justify-between items-center">
                    <Title level={4} className="m-0">Tag Details</Title>
                    <Space>
                        <Button
                            icon={<BsPencil />}
                            onClick={() => {
                                onClose();
                                onEdit(tag);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            icon={<BsTrash />}
                            onClick={() => {
                                onClose();
                                onDelete(tag);
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
            <div className="tag-detail">
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Vietnamese Name">
                        {tag.name_vi}
                    </Descriptions.Item>
                    <Descriptions.Item label="English Name">
                        {tag.name_en}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {format(new Date(tag.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {format(new Date(tag.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default TagDetail; 
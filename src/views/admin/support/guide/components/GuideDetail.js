import React from 'react';
import { Modal, Descriptions, Typography, Tag, Button, Skeleton } from 'antd';
import { format } from 'date-fns';

const { Title, Paragraph } = Typography;

const GuideDetail = ({ visible, onClose, guide, loading }) => {
    if (!guide && !loading) return null;

    return (
        <Modal
            title="Guide Details"
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Close
                </Button>
            ]}
        >
            {loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
                <div className="guide-detail">
                    <Title level={4} className="mb-4">{guide.title}</Title>

                    <Descriptions bordered column={1} className="mb-4">
                        <Descriptions.Item label="Category">
                            <Tag color="blue">{guide.category?.name_vi} ({guide.category?.name_en})</Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Content">
                            <Paragraph className="whitespace-pre-wrap">
                                {guide.content}
                            </Paragraph>
                        </Descriptions.Item>

                        <Descriptions.Item label="Created At">
                            {guide.createdAt ? format(new Date(guide.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Last Updated">
                            {guide.updatedAt ? format(new Date(guide.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
};

export default GuideDetail; 
import React from 'react';
import { Modal, Descriptions, Typography, Tag, Button, Skeleton } from 'antd';
import { format } from 'date-fns';

const { Title, Paragraph } = Typography;

const FaqDetail = ({ visible, onClose, faq, loading }) => {
    if (!faq && !loading) return null;

    return (
        <Modal
            title="FAQ Details"
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
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <div className="faq-detail">
                    <Title level={4} className="mb-4">{faq.question}</Title>

                    <Descriptions bordered column={1} className="mb-4">
                        <Descriptions.Item label="Category">
                            <Tag color="blue">{faq.category?.name_vi} ({faq.category?.name_en})</Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Answer">
                            <Paragraph className="whitespace-pre-wrap">
                                {faq.answer}
                            </Paragraph>
                        </Descriptions.Item>

                        <Descriptions.Item label="Created At">
                            {faq.createdAt ? format(new Date(faq.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Last Updated">
                            {faq.updatedAt ? format(new Date(faq.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
};

export default FaqDetail; 
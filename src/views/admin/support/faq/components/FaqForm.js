import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Modal } from 'antd';
import { useAllCategories } from '../hook';

const { Option } = Select;
const { TextArea } = Input;

const FaqForm = ({
    visible,
    onCancel,
    onFinish,
    initialValues = {},
    loading,
    title = 'Add New FAQ'
}) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading: categoriesLoading } = useAllCategories();

    useEffect(() => {
        if (visible) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onFinish(values);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Save
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="question"
                            label="Question"
                            rules={[
                                { required: true, message: 'Please enter the question' },
                                { max: 500, message: 'Question cannot exceed 500 characters' }
                            ]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Enter question"
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="answer"
                            label="Answer"
                            rules={[
                                { required: true, message: 'Please enter the answer' },
                                { max: 2000, message: 'Answer cannot exceed 2000 characters' }
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Enter answer"
                                showCount
                                maxLength={2000}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="category_id"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select
                                placeholder="Select category"
                                loading={categoriesLoading}
                            >
                                {categories?.map(category => (
                                    <Option key={category.documentId} value={category.documentId}>
                                        {category.name_vi} ({category.name_en})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default FaqForm; 
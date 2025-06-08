import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col, Modal } from 'antd';
import { useAllCategories } from '../hook';

const { Option } = Select;
const { TextArea } = Input;

const GuideForm = ({
    visible,
    onCancel,
    onFinish,
    initialValues = {},
    loading,
    title = 'Add New Guide'
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
                            name="title"
                            label="Title"
                            rules={[
                                { required: true, message: 'Please enter the guide title' },
                                { max: 200, message: 'Title cannot exceed 200 characters' }
                            ]}
                        >
                            <Input
                                placeholder="Enter title"
                                maxLength={200}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[
                                { required: true, message: 'Please enter the guide content' },
                                { max: 5000, message: 'Content cannot exceed 5000 characters' }
                            ]}
                        >
                            <TextArea
                                rows={10}
                                placeholder="Enter guide content"
                                showCount
                                maxLength={5000}
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

export default GuideForm; 
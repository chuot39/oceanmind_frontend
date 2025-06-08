import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';

const CareerForm = ({
    visible,
    onClose,
    onSubmit,
    initialValues,
    isLoading,
    isEdit = false
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                name: initialValues.name,
                description: initialValues.description
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    const title = isEdit ? 'Edit Career' : 'Add New Career';

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                >
                    Save
                </Button>,
            ]}
            maskClosable={false}
            destroyOnClose={true}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                className="career-form"
            >
                <Form.Item
                    name="name"
                    label="Career Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the career name'
                        }
                    ]}
                >
                    <Input placeholder="Enter career name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        {
                            required: false
                        }
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter career description (optional)"
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CareerForm; 
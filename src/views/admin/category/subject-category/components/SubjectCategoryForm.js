import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';

const SubjectCategoryForm = ({
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
                name_vi: initialValues.name_vi,
                name_en: initialValues.name_en
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

    const title = isEdit ? 'Edit Subject Category' : 'Add New Subject Category';

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
                className="subject-category-form"
            >
                <Form.Item
                    name="name_vi"
                    label="Vietnamese Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the Vietnamese name'
                        }
                    ]}
                >
                    <Input placeholder="Enter Vietnamese name" />
                </Form.Item>

                <Form.Item
                    name="name_en"
                    label="English Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the English name'
                        }
                    ]}
                >
                    <Input placeholder="Enter English name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubjectCategoryForm; 
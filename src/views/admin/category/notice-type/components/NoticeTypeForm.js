import React, { useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';

const { TextArea } = Input;

const NoticeTypeForm = ({
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
                name_en: initialValues.name_en,
                description_vi: initialValues.description_vi,
                description_en: initialValues.description_en
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

    const title = isEdit ? 'Edit Notice Type' : 'Add New Notice Type';

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
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                className="notice-type-form"
            >
                <div className="form-section">
                    <div className="section-title">Vietnamese Information</div>
                    <Form.Item
                        name="name_vi"
                        label="Name (Vietnamese)"
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
                        name="description_vi"
                        label="Description (Vietnamese)"
                    >
                        <TextArea
                            placeholder="Enter Vietnamese description (optional)"
                            rows={3}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </div>

                <div className="form-section">
                    <div className="section-title">English Information</div>
                    <Form.Item
                        name="name_en"
                        label="Name (English)"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the English name'
                            }
                        ]}
                    >
                        <Input placeholder="Enter English name" />
                    </Form.Item>

                    <Form.Item
                        name="description_en"
                        label="Description (English)"
                    >
                        <TextArea
                            placeholder="Enter English description (optional)"
                            rows={3}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default NoticeTypeForm; 
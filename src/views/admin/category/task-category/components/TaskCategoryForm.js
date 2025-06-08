import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, InputNumber, Select } from 'antd';

const { Option } = Select;

const TaskCategoryForm = ({
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
                task_priority: initialValues.task_priority
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

    const title = isEdit ? 'Edit Task Category' : 'Add New Task Category';

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
                className="task-category-form"
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

                <Form.Item
                    name="task_priority"
                    label="Priority Level"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the priority level'
                        }
                    ]}
                    initialValue={2}
                >
                    <Select placeholder="Select priority level">
                        <Option value={0}>
                            <span className="text-red-500 font-medium">Urgent (0)</span>
                        </Option>
                        <Option value={1}>
                            <span className="text-orange-500 font-medium">High (1)</span>
                        </Option>
                        <Option value={2}>
                            <span className="text-blue-500 font-medium">Medium (2)</span>
                        </Option>
                        <Option value={3}>
                            <span className="text-green-500 font-medium">Low (3)</span>
                        </Option>
                        <Option value={4}>
                            <span className="text-purple-500 font-medium">Long-term (4)</span>
                        </Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskCategoryForm; 
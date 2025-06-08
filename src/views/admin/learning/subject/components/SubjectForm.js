import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, InputNumber } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

const SubjectForm = ({
    visible,
    onClose,
    onSubmit,
    initialValues,
    isLoading,
    isEdit = false
}) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                subject_code: initialValues.subject_code,
                name: initialValues.name,
                credits: initialValues.credits
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            // Prepare the data for submission
            const data = {
                basicInfo: {
                    subject_code: values.subject_code,
                    name: values.name,
                    credits: values.credits
                }
            };

            onSubmit(data);
        });
    };

    const title = isEdit
        ? intl.formatMessage({ id: 'subject.form.edit.title', defaultMessage: 'Edit Subject' })
        : intl.formatMessage({ id: 'subject.form.add.title', defaultMessage: 'Add New Subject' });

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                >
                    <FormattedMessage id="common.save" defaultMessage="Save" />
                </Button>,
            ]}
            maskClosable={false}
            destroyOnClose={true}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                className="subject-form"
            >
                <div className="form-section">
                    <div className="section-title">
                        <FormattedMessage id="subject.form.basic_info" defaultMessage="Basic Information" />
                    </div>

                    <Form.Item
                        name="subject_code"
                        label={<FormattedMessage id="subject.form.code" defaultMessage="Subject Code" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: 'subject.form.code.required',
                                    defaultMessage: 'Please enter the subject code'
                                })
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label={<FormattedMessage id="subject.form.name" defaultMessage="Subject Name" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: 'subject.form.name.required',
                                    defaultMessage: 'Please enter the subject name'
                                })
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="credits"
                        label={<FormattedMessage id="subject.form.credits" defaultMessage="Credits" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: 'subject.form.credits.required',
                                    defaultMessage: 'Please enter the number of credits'
                                })
                            }
                        ]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default SubjectForm; 
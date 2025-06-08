import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

const FacultyForm = ({ visible, onClose, onSubmit, initialValues, isLoading, isEdit = false }) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (isEdit && initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEdit, initialValues, form]);

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    const title = isEdit
        ? intl.formatMessage({ id: 'admin.faculty.edit_title', defaultMessage: 'Edit Faculty' })
        : intl.formatMessage({ id: 'admin.faculty.add_title', defaultMessage: 'Add New Faculty' });

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
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
        >
            <Form
                key={isEdit ? `edit-${initialValues?.documentId || ''}` : 'add-new'}
                form={form}
                layout="vertical"
                initialValues={{}}
                preserve={false}
            >
                <Form.Item
                    name="name_vi"
                    label={<FormattedMessage id="admin.faculty.vn_name" defaultMessage="Vietnamese Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.faculty.vn_name_required',
                                defaultMessage: 'Please enter the Vietnamese name'
                            })
                        },
                        {
                            min: 3,
                            message: intl.formatMessage({
                                id: 'admin.faculty.vn_name_min',
                                defaultMessage: 'Vietnamese name cannot be less than {min} characters'
                            }, {
                                min: 3
                            })
                        },
                        {
                            max: 50,
                            message: intl.formatMessage({
                                id: 'admin.faculty.vn_name_max',
                                defaultMessage: 'Vietnamese name cannot be more than {max} characters'
                            }, {
                                max: 50
                            })
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name_en"
                    label={<FormattedMessage id="admin.faculty.en_name" defaultMessage="English Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.faculty.en_name_required',
                                defaultMessage: 'Please enter the English name'
                            })
                        },
                        {
                            min: 3,
                            message: intl.formatMessage({
                                id: 'admin.faculty.en_name_min',
                                defaultMessage: 'English name cannot be less than {min} characters'
                            }, {
                                min: 3
                            })
                        },
                        {
                            max: 50,
                            message: intl.formatMessage({
                                id: 'admin.faculty.en_name_max',
                                defaultMessage: 'English name cannot be more than {max} characters'
                            }, {
                                max: 50
                            })
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FacultyForm; 
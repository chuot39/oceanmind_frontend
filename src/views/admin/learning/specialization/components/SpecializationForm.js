import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Select, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFacultiesDropdown } from '../hook';

const { Option } = Select;
const { TextArea } = Input;

const SpecializationForm = ({ visible, onClose, onSubmit, initialValues, isLoading, isEdit = false }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const { data: faculties, isLoading: isLoadingFaculties } = useFacultiesDropdown();

    useEffect(() => {
        if (visible) {
            if (isEdit && initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    faculty_id: initialValues.faculty_id
                });
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
        ? intl.formatMessage({ id: 'admin.specialization.edit_title', defaultMessage: 'Edit Specialization' })
        : intl.formatMessage({ id: 'admin.specialization.add_title', defaultMessage: 'Add New Specialization' });

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
            width={600}
        >
            <Form
                key={isEdit ? `edit-${initialValues?.documentId || ''}` : 'add-new'}
                form={form}
                layout="vertical"
                initialValues={{}}
                preserve={false}
            >
                <Form.Item
                    name="faculty_id"
                    label={<FormattedMessage id="admin.specialization.faculty" defaultMessage="Faculty" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.specialization.faculty_required',
                                defaultMessage: 'Please select a faculty'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'admin.specialization.faculty_placeholder',
                            defaultMessage: 'Select faculty'
                        })}
                        loading={isLoadingFaculties}
                    >
                        {faculties?.map(faculty => (
                            <Option key={faculty.documentId} value={faculty.documentId}>
                                {faculty.name_vi} ({faculty.name_en})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="name_vi"
                    label={<FormattedMessage id="admin.specialization.vn_name" defaultMessage="Vietnamese Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.specialization.vn_name_required',
                                defaultMessage: 'Please enter the Vietnamese name'
                            })
                        },
                        {
                            min: 3,
                            message: intl.formatMessage({
                                id: 'admin.specialization.vn_name_min',
                                defaultMessage: 'Vietnamese name cannot be less than {min} characters'
                            }, {
                                min: 3
                            })
                        },
                        {
                            max: 50,
                            message: intl.formatMessage({
                                id: 'admin.specialization.vn_name_max',
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
                    label={<FormattedMessage id="admin.specialization.en_name" defaultMessage="English Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.specialization.en_name_required',
                                defaultMessage: 'Please enter the English name'
                            })
                        },
                        {
                            min: 3,
                            message: intl.formatMessage({
                                id: 'admin.specialization.en_name_min',
                                defaultMessage: 'English name cannot be less than {min} characters'
                            }, {
                                min: 3
                            })
                        },
                        {
                            max: 50,
                            message: intl.formatMessage({
                                id: 'admin.specialization.en_name_max',
                                defaultMessage: 'English name cannot be more than {max} characters'
                            }, {
                                max: 50
                            })
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description_vi"
                    label={<FormattedMessage id="admin.specialization.vn_description" defaultMessage="Vietnamese Description" />}
                    rules={[
                        {
                            max: 150,
                            message: intl.formatMessage({
                                id: 'admin.specialization.vn_description_max',
                                defaultMessage: 'Vietnamese description cannot be more than {max} characters'
                            }, {
                                max: 150
                            })
                        }
                    ]}
                >
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="description_en"
                    label={<FormattedMessage id="admin.specialization.en_description" defaultMessage="English Description" />}
                    rules={[
                        {
                            max: 300,
                            message: intl.formatMessage({
                                id: 'admin.specialization.en_description_max',
                                defaultMessage: 'English description cannot be more than {max} characters'
                            }, {
                                max: 300
                            })
                        }
                    ]}
                >
                    <TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SpecializationForm; 
import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSpecializations, useBatches } from '../hook';

const { Option } = Select;
const { TextArea } = Input;

const ClassForm = ({ visible, onClose, onSubmit, initialValues, isLoading, isEdit = false }) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    // Fetch specializations and batches for dropdowns
    const { data: specializations, isLoading: loadingSpecializations } = useSpecializations();
    const { data: batches, isLoading: loadingBatches } = useBatches();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    const title = isEdit
        ? intl.formatMessage({ id: 'admin.class.edit_title', defaultMessage: 'Edit Class' })
        : intl.formatMessage({ id: 'admin.class.add_title', defaultMessage: 'Add New Class' });

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
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues || {}}
            >
                <Form.Item
                    name="name"
                    label={<FormattedMessage id="admin.class.name" defaultMessage="Tên lớp học" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.class.name_required',
                                defaultMessage: 'Vui lòng nhập tên lớp học'
                            })
                        },
                        {
                            min: 3,
                            message: intl.formatMessage({
                                id: 'admin.class.name_min',
                                defaultMessage: 'Tên lớp học không được nhỏ hơn 3 ký tự'
                            }, {
                                min: 3
                            })
                        },
                        {
                            max: 25,
                            message: intl.formatMessage({
                                id: 'admin.class.name_max',
                                defaultMessage: 'Tên lớp học không được lớn hơn 25 ký tự'
                            }, {
                                max: 25
                            })
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<FormattedMessage id="admin.class.description" defaultMessage="Mô tả" />}
                    rules={[
                        {
                            max: 255,
                            message: intl.formatMessage({
                                id: 'admin.class.description_max',
                                defaultMessage: 'Mô tả không được lớn hơn 255 ký tự'
                            }, {
                                max: 255
                            })
                        }
                    ]}
                >
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="specialized_id"
                    label={<FormattedMessage id="admin.class.specialized" defaultMessage="Chuyên ngành" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'select.specialized_required',
                                defaultMessage: 'Vui lòng chọn chuyên ngành'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'select.select_specialized',
                            defaultMessage: 'Chọn chuyên ngành'
                        })}
                        loading={loadingSpecializations}
                    >
                        {specializations?.map(spec => (
                            <Option key={spec.documentId} value={spec.documentId}>
                                {spec.name_vi}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="batch_id"
                    label={<FormattedMessage id="select.select_batch" defaultMessage="Khoá đào tạo" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'select.batch_required',
                                defaultMessage: 'Vui lòng chọn khoá đào tạo'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'select.select_batch',
                            defaultMessage: 'Chọn khoá đào tạo'
                        })}
                        loading={loadingBatches}
                    >
                        {batches?.map(batch => (
                            <Option key={batch.documentId} value={batch.documentId}>
                                {batch.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ClassForm; 
import React, { useEffect } from 'react';
import { Form, Input, Button, Modal, DatePicker, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

const BatchForm = ({ visible, onClose, onSubmit, initialValues, isLoading, isEdit = false }) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            // Convert string dates to moment objects for DatePicker
            form.setFieldsValue({
                ...initialValues,
                start_year: initialValues.start_year ? moment(initialValues.start_year) : null,
                end_year: initialValues.end_year ? moment(initialValues.end_year) : null
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            // Convert moment objects to ISO strings for API
            const formattedValues = {
                ...values,
                start_year: values.start_year ? values.start_year.format('YYYY-MM-DD') : null,
                end_year: values.end_year ? values.end_year.format('YYYY-MM-DD') : null
            };

            console.log('formattedValues', formattedValues);
            onSubmit(formattedValues);
        });
    };

    const title = isEdit
        ? intl.formatMessage({ id: 'admin.batch.edit_title', defaultMessage: 'Edit Batch' })
        : intl.formatMessage({ id: 'admin.batch.add_title', defaultMessage: 'Add New Batch' });

    // Validate that end year is after start year
    const validateEndYear = (_, value) => {
        const startYear = form.getFieldValue('start_year');
        if (value && startYear && value.isBefore(startYear)) {
            return Promise.reject(new Error(intl.formatMessage({
                id: 'admin.batch.end_year_invalid_start_year',
                defaultMessage: 'End year must be after start year'
            })));
        }
        return Promise.resolve();
    };

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
                    label={<FormattedMessage id="admin.batch.name" defaultMessage="Batch Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.batch.name_required',
                                defaultMessage: 'Please enter the batch name'
                            })
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="start_year"
                    label={<FormattedMessage id="admin.batch.start_year" defaultMessage="Start Year" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.batch.start_year_required',
                                defaultMessage: 'Please select the start year'
                            })
                        }
                    ]}
                >
                    <DatePicker
                        picker="date"
                        placeholder={intl.formatMessage({ id: 'admin.batch.start_year_placeholder', defaultMessage: 'Select start year' })}
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                    />
                </Form.Item>

                <Form.Item
                    name="end_year"
                    label={<FormattedMessage id="admin.batch.end_year" defaultMessage="End Year" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.batch.end_year_required',
                                defaultMessage: 'Please select the end year'
                            })
                        },
                        {
                            validator: validateEndYear
                        }
                    ]}
                >
                    <DatePicker
                        picker="date"
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder={intl.formatMessage({ id: 'admin.batch.end_year_placeholder', defaultMessage: 'Select end year' })}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BatchForm; 
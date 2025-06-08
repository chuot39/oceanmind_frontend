import React, { useEffect } from 'react';
import { Form, Button, Modal, Select, InputNumber } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAllSpecializations, useAllCategories, useAllBatches } from '../hook';

const { Option } = Select;

const AddSpecializationForm = ({
    visible,
    onClose,
    onSubmit,
    subjectId
}) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    const { data: specializations, isLoading: loadingSpecializations } = useAllSpecializations();
    const { data: categories, isLoading: loadingCategories } = useAllCategories();
    const { data: batches, isLoading: loadingBatches } = useAllBatches();

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    return (
        <Modal
            title={intl.formatMessage({ id: 'subject.form.add_to_specialization', defaultMessage: 'Add Subject to Specialization' })}
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
                >
                    <FormattedMessage id="common.add" defaultMessage="Add" />
                </Button>,
            ]}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="specialized_id"
                    label={<FormattedMessage id="subject.form.specialization" defaultMessage="Specialization" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'subject.form.specialization.required',
                                defaultMessage: 'Please select a specialization'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'subject.form.specialization.placeholder',
                            defaultMessage: 'Select a specialization'
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
                    name="category_subject_id"
                    label={<FormattedMessage id="subject.form.category" defaultMessage="Category" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'subject.form.category.required',
                                defaultMessage: 'Please select a category'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'subject.form.category.placeholder',
                            defaultMessage: 'Select a category'
                        })}
                        loading={loadingCategories}
                    >
                        {categories?.map(category => (
                            <Option key={category.documentId} value={category.documentId}>
                                {category.name_vi}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="batch_id"
                    label={<FormattedMessage id="subject.form.batch" defaultMessage="Batch" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'subject.form.batch.required',
                                defaultMessage: 'Please select a batch'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'subject.form.batch.placeholder',
                            defaultMessage: 'Select a batch'
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

                <Form.Item
                    name="semester"
                    label={<FormattedMessage id="subject.form.semester" defaultMessage="Semester" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'subject.form.semester.required',
                                defaultMessage: 'Please enter the semester'
                            })
                        }
                    ]}
                >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSpecializationForm; 
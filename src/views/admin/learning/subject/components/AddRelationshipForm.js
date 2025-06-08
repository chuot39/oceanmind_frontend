import React, { useEffect } from 'react';
import { Form, Button, Modal, Select } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAllSubjects } from '../hook';

const { Option } = Select;

const AddRelationshipForm = ({
    visible,
    onClose,
    onSubmit,
    subjectId,
    title,
    excludeIds = []
}) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    const { data: subjects, isLoading: loadingSubjects } = useAllSubjects();

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

    // Filter out the current subject and any excluded subjects
    const filteredSubjects = subjects?.filter(
        subject => subject.documentId !== subjectId && !excludeIds.includes(subject.documentId)
    ) || [];

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
                    disabled={filteredSubjects.length === 0}
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
                {filteredSubjects.length > 0 ? (
                    <Form.Item
                        name="related_subject_id"
                        label={<FormattedMessage id="subject.form.related_subject" defaultMessage="Related Subject" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: 'subject.form.related_subject.required',
                                    defaultMessage: 'Please select a subject'
                                })
                            }
                        ]}
                    >
                        <Select
                            placeholder={intl.formatMessage({
                                id: 'subject.form.related_subject.placeholder',
                                defaultMessage: 'Select a subject'
                            })}
                            loading={loadingSubjects}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {filteredSubjects.map(subject => (
                                <Option key={subject.documentId} value={subject.documentId}>
                                    {subject.subject_code} - {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500">
                            <FormattedMessage
                                id="subject.form.no_available_subjects"
                                defaultMessage="No available subjects to add"
                            />
                        </p>
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default AddRelationshipForm; 
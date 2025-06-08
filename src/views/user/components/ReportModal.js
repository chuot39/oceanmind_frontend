import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Divider } from 'antd';
import { useReportPost } from './hook';
const { TextArea } = Input;

const ReportModal = ({ visible, onClose, objReport, userData, intl, reportType, title }) => {
    const [form] = Form.useForm();
    const reportPostMutation = useReportPost();
    const [reportSubmitting, setReportSubmitting] = useState(false);

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const handleSubmit = async (values) => {
        try {
            setReportSubmitting(true);
            await reportPostMutation.mutateAsync({
                postId: objReport.documentId,
                userId: userData.documentId,
                reason: values.reason,
                email: values.email || userData.email
            });

            form.resetFields();
            onClose();

            message.success(intl.formatMessage({
                id: 'social.post.report_success',
                defaultMessage: 'Report submitted successfully'
            }));
        } catch (error) {
            console.error('Error reporting post:', error);
            message.error(intl.formatMessage({
                id: 'social.post.report_error',
                defaultMessage: 'Failed to submit report'
            }));
        } finally {
            setReportSubmitting(false);
        }
    };

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
        >
            <Divider className='mt-0 mb-4' />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="reason"
                    label={intl.formatMessage({ id: 'support.report.reason', defaultMessage: 'Reason for reporting' })}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'support.report.reason_required',
                                defaultMessage: 'Please provide a reason for reporting this post'
                            })
                        }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder={intl.formatMessage({
                            id: 'support.report.reason_placeholder',
                            defaultMessage: 'Please explain why you are reporting this post'
                        })}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={intl.formatMessage({ id: 'support.report.email', defaultMessage: 'Email for notification (optional)' })}
                    rules={[
                        {
                            type: 'email',
                            message: intl.formatMessage({
                                id: 'support.report.email_invalid',
                                defaultMessage: 'Please enter a valid email address'
                            })
                        }
                    ]}
                    extra={intl.formatMessage({
                        id: 'support.report.email_note',
                        defaultMessage: 'If not provided, notifications will be sent to your account email and system notifications'
                    })}
                    className='email_report'
                >
                    <Input
                        placeholder={intl.formatMessage({
                            id: 'support.report.email_placeholder',
                            defaultMessage: 'Enter email address (optional)'
                        })}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancel}>
                        {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                    </Button>
                    <Button type="primary" htmlType="submit" loading={reportSubmitting}>
                        {intl.formatMessage({ id: 'common.submit', defaultMessage: 'Submit' })}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ReportModal; 
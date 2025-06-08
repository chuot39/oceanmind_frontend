import React, { useState, useMemo } from 'react';
import { Drawer, Button, Divider, Typography, Avatar, Tag, Modal, Form, Input, Checkbox, Image } from 'antd';
import { BsEye, BsCheckCircle, BsXCircle, BsExclamationCircle, BsClock, BsEnvelope, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { useResolvePostReport, useRestoreReport } from '../mutationHook';
import { usePostDetail } from '../hook';
import dayjs from 'dayjs';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import useSkin from '@/utils/hooks/useSkin';
import { useCreateNotification, useCreateUserNotification } from '@/views/user/components/mutationHooks';
import { useUserData } from '@/utils/hooks/useAuth';
import { getStatusTag } from '@/helpers/systemHelper';
import { useDeletePost } from '@/views/user/social/shared/actions/mutationHooks';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ReportDetail = ({ visible, onClose, report }) => {
    const intl = useIntl();
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [form] = Form.useForm();

    const { language } = useSkin()
    const { userData } = useUserData();

    const { mutate: resolveReport, isLoading: isResolving } = useResolvePostReport();
    const { mutate: restoreReport, isLoading: isRestoring } = useRestoreReport();
    const { mutate: createNotification, isLoading: isCreatingNotification } = useCreateNotification();
    const { mutate: createUserNotification, isLoading: isCreatingUserNotification } = useCreateUserNotification();
    const { mutate: deletePost, isLoading: isDeletingPost } = useDeletePost();
    // Lấy documentId an toàn từ report
    const postId = useMemo(() => report?.reportedPost?.documentId || null, [report]);

    // Gọi hook trước điều kiện return
    const { data: reportedPostDetail, isLoading: isLoadingReportedPost } = usePostDetail(postId);

    if (!report) {
        return null;
    }

    const { documentId, reason, answer, status_report, email_receive, reporter, reportedPost, createdAt, updatedAt } = report;

    // Handle restore notification
    const handleRestore = (documentId) => {
        return ModalConfirm({
            typeModal: 'restore_report',
            loading: isRestoring,
            handleResolve: async () => {
                try {
                    restoreReport({ documentId },
                        {
                            onSuccess: () => {
                                onClose();
                            },
                            onError: (error) => {
                                console.error("Error restoring report:", error);
                            }
                        }
                    );
                } catch (error) {
                    console.error("Error restoring report:", error);
                }
            },
            intl: intl
        });
    };

    const handleNotifyPersonReported = async () => {
        try {
            const dataSubmit = {
                title: '[Xử lý báo cáo] Bài viết của bạn đã bị xử lý',
                content: `Xin chào ${reportedPostDetail?.data?.author?.fullname}, bài viết của bạn đã bị báo cáo bởi người dùng khác trong hệ thống. Chúng tôi đã xem xét bài viết của bạn và tìm thấy nó vi phạm các điều khoản dịch vụ của chúng tôi. Chúng tôi đã tạm thời xóa bài viết của bạn. Vui lòng xem thêm các điều khoản dịch vụ của chúng tôi để biết thêm thông tin. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`,
                link: `/dashboard/notification`,
                is_global: false,
                notice_type_label: 'system',
                notification_created_by: userData?.documentId
            };

            return new Promise((resolve, reject) => {
                createNotification(dataSubmit, {
                    onSuccess: (response) => {
                        console.log('Notification created successfully:', response);

                        if (response?.data?.documentId) {
                            const dataSubmitUserNotification = {
                                user_id: reportedPostDetail?.data?.author?.documentId,
                                notification_id: response.data.documentId,
                                is_read: false
                            };

                            createUserNotification(dataSubmitUserNotification, {
                                onSuccess: () => {
                                    console.log('User notification created successfully for reported person');
                                    resolve();
                                },
                                onError: (error) => {
                                    console.error('Error creating user notification for reported person:', error);
                                    reject(error);
                                }
                            });
                        } else {
                            console.error('Missing notification ID in response:', response);
                            reject(new Error('Missing notification ID'));
                        }
                    },
                    onError: (error) => {
                        console.error('Error creating notification:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error in handleNotifyPersonReported:', error);
        }
    };

    const handleNotifyReporter = async () => {
        try {
            const contentAccept = ` Xin chào ${reporter?.fullname}, báo cáo của bạn đã được xử lý. \nĐối với bài viết bạn đã báo cáo, chúng tôi ghi nhận rằng nó đã vi phạm điều khoản của hệ thống. Do đó chúng tôi đã tạm thời xóa bài viết đó. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`
            const contentDenied = ` Xin chào ${reporter?.fullname}, báo cáo của bạn đã được xử lý. \nĐối với bài viết bạn đã báo cáo, chúng tôi chưa ghi nhận rằng nó đã vi phạm điều khoản của hệ thống. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`


            const dataSubmit = {
                title: '[Xử lý báo cáo] Báo cáo của bạn đã được xử lý',
                content: actionType === 'resolve' ? contentAccept : contentDenied,
                link: `/dashboard/notification`,
                is_global: false,
                notice_type_label: 'system',
                notification_created_by: userData?.documentId
            };

            return new Promise((resolve, reject) => {
                createNotification(dataSubmit, {
                    onSuccess: (response) => {
                        if (response?.data?.documentId) {
                            const dataSubmitUserNotification = {
                                user_id: reporter?.documentId,
                                notification_id: response.data.documentId,
                                is_read: false
                            };

                            createUserNotification(dataSubmitUserNotification, {
                                onSuccess: () => {
                                    console.log('User notification created successfully for reporter');
                                    resolve();
                                },
                                onError: (error) => {
                                    console.error('Error creating user notification for reporter:', error);
                                    reject(error);
                                }
                            });
                        } else {
                            console.error('Missing notification ID in response:', response);
                            reject(new Error('Missing notification ID'));
                        }
                    },
                    onError: (error) => {
                        console.error('Error creating notification for reporter:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Error in handleNotifyReporter:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            deletePost(postId);
        } catch (error) {
            console.error('Error in handleDeletePost:', error);
        }
    };

    const handleAction = (type) => {
        setActionType(type);
        form.resetFields();
        setActionModalVisible(true);
    };


    const handleActionSubmit = () => {
        form.validateFields().then(values => {
            const { resolution, notifyUser, email, reason, duration, useDefaultMessage } = values;

            const formattedMessage = useDefaultMessage ? intl.formatMessage({
                id: 'admin.report.action.default_resolution_content',
                defaultMessage: 'Hi {name}, your {obj} has been reported. We have reviewed your {obj} and found it to be in violation of our terms of service. We have temporarily deleted your {obj}. Please review our terms of service for more information. If you have any questions, please contact us at {email}.'
            }, {
                name: reporter?.fullname || '',
                obj: language === 'vi' ? 'bài viết' : 'post',
                email: 'phamngochuy0102@gmail.com' || ''
            }) : resolution;


            const formattedDismissMessage = useDefaultMessage ?
                `Xin chào ${reporter?.fullname}, Chúng tôi đã ghi nhận báo cáo của bạn. Nhưng chúng tôi đã quyết định không xử lý báo cáo của bạn vì không nhận thấy vi phạm điều khoản của hệ thống. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`
                : reason;

            switch (actionType) {
                case 'resolve':
                    resolveReport({
                        documentId: documentId,
                        data: {
                            answer: formattedMessage,
                            status_report: 'resolved'
                        }
                    }, {
                        onSuccess: (response) => {
                            handleDeletePost()
                                .then(() => {
                                    handleNotifyPersonReported()
                                        .then(() => {
                                            return handleNotifyReporter();
                                        })
                                        .then(() => {
                                            console.log('All notifications sent successfully');
                                            setActionModalVisible(false);
                                            onClose();
                                        })
                                        .catch((error) => {
                                            console.error('Error sending notifications:', error);
                                            // Vẫn đóng modal và hoàn thành quy trình ngay cả khi thông báo thất bại
                                            setActionModalVisible(false);
                                            onClose();
                                        });
                                })
                                .catch((error) => {
                                    console.error('Error deleting post:', error);
                                });
                        },
                        onError: (error) => {
                            console.error('Error resolving report:', error);
                        }
                    });
                    break;
                case 'dismiss':
                    resolveReport({
                        documentId: documentId,
                        data: {
                            answer: formattedDismissMessage,
                            status_report: 'denied'
                        }
                    }, {
                        onSuccess: (response) => {
                            handleNotifyReporter()
                                .then(() => {
                                    setActionModalVisible(false);
                                    onClose();
                                })
                                .catch((error) => {
                                    console.error('Error sending notifications:', error);
                                    setActionModalVisible(false);
                                    onClose();
                                });
                        },
                        onError: (error) => {
                            console.error('Error resolving report:', error);
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    };

    const renderActionForm = () => {
        switch (actionType) {
            case 'resolve':
                return (
                    <Form form={form} layout="vertical" initialValues={{ useDefaultMessage: true }}>
                        <Form.Item
                            name="useDefaultMessage"
                            valuePropName="checked"
                        >
                            <Checkbox value={intl.formatMessage({
                                id: 'admin.report.action.default_resolution_content', defaultMessage: 'Hi {name}, your {obj} has been reported. We have reviewed your {obj} and found it to be in violation of our terms of service. We have temporarily deleted your {obj}. Please review our terms of service for more information. If you have any questions, please contact us at {email}.',
                                values: {
                                    name: reporter?.fullname,
                                    obj: language === 'vi' ? 'bài viết' : 'post',
                                    email: 'phamngochuy0102@gmail.com'
                                }
                            })}>
                                <FormattedMessage id="admin.report.action.default_resolution" defaultMessage="Use default system message" />
                            </Checkbox>
                        </Form.Item>
                        <Paragraph className="text-sm mb-4 text-justify text_secondary">
                            <FormattedMessage id="admin.report.action.default_resolution_content" defaultMessage="Resolution"
                                values={{
                                    name: reporter?.fullname,
                                    obj: language === 'vi' ? 'bài viết' : 'post',
                                    email: 'phamngochuy0102@gmail.com'
                                }}
                            />
                        </Paragraph>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.useDefaultMessage !== currentValues.useDefaultMessage}
                        >
                            {({ getFieldValue }) => !getFieldValue('useDefaultMessage') && (
                                <Form.Item
                                    name="resolution"
                                    label={<FormattedMessage id="admin.report.action.resolution" defaultMessage="Resolution" />}
                                    rules={[
                                        { required: !getFieldValue('useDefaultMessage'), message: intl.formatMessage({ id: 'admin.report.action.resolution_required', defaultMessage: 'Please enter a resolution' }) },
                                        { min: 10, message: intl.formatMessage({ id: 'admin.report.action.resolution_min', defaultMessage: 'Resolution cannot be less than 10 characters' }) },
                                        { max: 500, message: intl.formatMessage({ id: 'admin.report.action.resolution_max', defaultMessage: 'Resolution cannot exceed 500 characters' }) }
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            )}
                        </Form.Item>
                    </Form>
                );
            case 'dismiss':
                return (
                    <Form form={form} layout="vertical" initialValues={{ useDefaultMessage: true }}>
                        <Form.Item
                            name="useDefaultMessage"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                <FormattedMessage id="admin.report.action.default_resolution" defaultMessage="Use default system message" />
                            </Checkbox>
                        </Form.Item>
                        <span className="text-sm mb-4 text_secondary">
                            <FormattedMessage id="admin.report.action.default_resolution_content" defaultMessage="Reason for dismissal"
                                values={{
                                    name: reporter?.fullname,
                                    obj: language === 'vi' ? 'bài viết' : 'post',
                                    email: reporter?.email
                                }}
                            />
                        </span>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) => prevValues.useDefaultMessage !== currentValues.useDefaultMessage}
                        >
                            {({ getFieldValue }) => !getFieldValue('useDefaultMessage') && (
                                <Form.Item
                                    name="reason"
                                    label={<FormattedMessage id="admin.report.action.dismiss_reason" defaultMessage="Reason for dismissal" />}
                                    rules={[
                                        { required: !getFieldValue('useDefaultMessage'), message: intl.formatMessage({ id: 'report.action.reason.required', defaultMessage: 'Please enter a reason' }) }
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            )}
                        </Form.Item>

                    </Form>
                );
            default:
                return null;
        }
    };

    const getActionModalTitle = () => {
        switch (actionType) {
            case 'resolve':
                return <FormattedMessage id="admin.report.action.resolution" defaultMessage="Resolve Report" />;
            case 'hide':
                return <FormattedMessage id="admin.report.action.hide.title" defaultMessage="Hide Post" />;
            case 'delete':
                return <FormattedMessage id="admin.report.action.delete.title" defaultMessage="Delete Post" />;
            case 'dismiss':
                return <FormattedMessage id="admin.report.action.resolution" defaultMessage="Dismiss Report" />;
            default:
                return '';
        }
    };

    const isLoading = isResolving || isCreatingNotification || isCreatingUserNotification;

    return (
        <>
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <BsEye size={18} />
                        <FormattedMessage id="admin.report.post.detail_title" defaultMessage="Report Details" />
                    </div>
                }
                placement="right"
                onClose={onClose}
                open={visible}
                loading={isLoadingReportedPost}
                width={800}
                extra={
                    status_report === 'pending' ? (
                        <div className="flex justify-end gap-2">
                            <Button
                                icon={<BsXCircle />}
                                onClick={() => handleAction('dismiss')}
                            >
                                <FormattedMessage id="admin.report.action.dismiss" defaultMessage="Dismiss" />
                            </Button>
                            {/* <Button
                                type="primary"
                                danger
                                icon={<BsEyeSlash />}
                                onClick={() => handleAction('hide')}
                            >
                                <FormattedMessage id="admin.report.action.hide" defaultMessage="Hide Post" />
                            </Button> */}
                            <Button
                                type="primary"
                                icon={<BsCheckCircle />}
                                onClick={() => handleAction('resolve')}
                            >
                                <FormattedMessage id="admin.report.action.resolve" defaultMessage="Resolve" />
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-8 text-center">
                            <Button
                                type="text"
                                size="middle"
                                className="!text-blue-700 bg-blue-100 hover:!bg-blue-200"
                                loading={isRestoring}
                                icon={<BsArrowCounterclockwise />}
                                onClick={() => handleRestore(documentId)}
                            >
                                <FormattedMessage id="admin.report.action.restore" defaultMessage="Restore" />
                            </Button>
                        </div>
                    )
                }
            >
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <div className="text-sm text_secondary">
                            <FormattedMessage id="admin.report.post.detail.id" defaultMessage="Report ID" />: {documentId}
                        </div>
                        <div className="text-sm text_secondary">
                            <FormattedMessage id="admin.report.post.detail.date" defaultMessage="Reported on" />: {format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                    </div>
                    <div>
                        {getStatusTag(status_report)}
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                    <Title level={5}>
                        <FormattedMessage id="admin.report.post.detail.post" defaultMessage="Reported Post" />
                    </Title>

                    {reportedPostDetail?.data?.media?.length > 0 && (
                        <div className="mb-4 mt-2">
                            <Image
                                src={reportedPostDetail?.data?.media[0]?.file_path}
                                alt="Post image"
                                style={{ maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }}
                            />
                        </div>
                    )}

                    <Paragraph className="mt-3 whitespace-pre-line">
                        {reportedPostDetail?.data?.content}
                    </Paragraph>

                    <div className="flex items-center mt-3">
                        <Avatar
                            src={reportedPostDetail?.data?.author?.avatar?.file_path}
                            size={36}
                            className="mr-2"
                        />
                        <div>
                            <div className="font-medium">{reportedPostDetail?.data?.author?.fullname}</div>
                            <div className="text-xs text_secondary">
                                {dayjs(reportedPostDetail?.data?.createdAt).format('DD/MM/YYYY HH:mm')}
                            </div>
                        </div>
                        <div className="ml-auto text-sm text_secondary">
                            <span className="mr-3">❤️ {reportedPostDetail?.data?.likes?.length}</span>
                            <span>💬 {reportedPostDetail?.data?.comments?.length}</span>
                        </div>
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                    <Title level={5}>
                        <FormattedMessage id="admin.report.post.detail.user" defaultMessage="Reporter" />
                    </Title>
                    <div className="flex items-center mt-2">
                        <Avatar
                            src={reporter?.avatar?.file_path}
                            size={48}
                            className="mr-3"
                        />
                        <div>
                            <div className="font-medium">{reporter?.fullname}</div>
                            <div className="text-sm text_secondary">
                                <span className="flex items-center gap-1">
                                    <BsEnvelope size={14} />
                                    {reporter?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="mb-6">
                    <Title level={5}>
                        <FormattedMessage id="admin.report.post.detail.reason" defaultMessage="Reason for Report" />
                    </Title>
                    <Paragraph className="mt-2 whitespace-pre-line">
                        {reason}
                    </Paragraph>
                </div>

                {answer && (
                    <>
                        <Divider className="my-4" />
                        <div className="mb-6">
                            <Title level={5}>
                                <FormattedMessage id="admin.report.post.detail.resolution" defaultMessage="Resolution" />
                            </Title>
                            <Paragraph className="mt-2 whitespace-pre-line">
                                {answer}
                            </Paragraph>
                            {email_receive && (
                                <Text type="secondary" className="mt-2 block">
                                    <FormattedMessage
                                        id="admin.report.post.detail.notified"
                                        defaultMessage="Notification sent to: {email}"
                                        values={{ email: email_receive }}
                                    />
                                </Text>
                            )}
                        </div>
                    </>
                )}
            </Drawer>

            <Modal
                title={getActionModalTitle()}
                open={actionModalVisible}
                onCancel={() => setActionModalVisible(false)}
                onOk={handleActionSubmit}
                confirmLoading={isLoading}
                okText={intl.formatMessage({ id: 'common.submit', defaultMessage: 'Submit' })}
                cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            >
                {renderActionForm()}
            </Modal>
        </>
    );
};

export default ReportDetail; 
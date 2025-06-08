import React, { useState, useMemo } from 'react';
import { Drawer, Descriptions, Button, Divider, Typography, Avatar, Tag, Space, Modal, Form, Input, Radio, Checkbox, message, Badge } from 'antd';
import { BsEye, BsPersonSlash, BsCheckCircle, BsXCircle, BsExclamationCircle, BsClock, BsEnvelope, BsExclamationTriangle, BsArrowCounterclockwise } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { format } from 'date-fns';
import { useUpdateReportStatus, useBanUser, useWarnUser, useDeleteUser, useRestoreReport, useActiveUser } from '../mutationHook';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import useSkin from '@/utils/hooks/useSkin';
import { useCreateNotification, useCreateUserNotification } from '@/views/user/components/mutationHooks';
import { useUserData } from '@/utils/hooks/useAuth';
import { getStatusTag } from '@/helpers/systemHelper';
import { FaUserXmark } from 'react-icons/fa6';
import { notifyError, notifySuccess } from '@/utils/Utils';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ReportDetail = ({ visible, onClose, report }) => {
    const intl = useIntl();
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [form] = Form.useForm();

    const { language } = useSkin()
    const { userData } = useUserData();

    const { mutate: resolveReport, isLoading: isResolving } = useUpdateReportStatus();
    const { mutate: banUser, isLoading: isBanning } = useBanUser();
    const { mutate: warnUser, isLoading: isWarning } = useWarnUser();
    const { mutate: updateReportStatus, isLoading: isUpdating } = useUpdateReportStatus();
    const { mutate: deleteUser, isLoading: isDeletingUser } = useDeleteUser();
    const { mutate: createNotification, isLoading: isCreatingNotification } = useCreateNotification();
    const { mutate: createUserNotification, isLoading: isCreatingUserNotification } = useCreateUserNotification();
    const { mutate: restoreReport, isLoading: isRestoring } = useRestoreReport();
    const { mutate: activeUser, isLoading: isActiveUser } = useActiveUser();

    // Lấy documentId an toàn từ report
    const userId = useMemo(() => report?.reportedUser?.documentId || null, [report]);

    if (!report) {
        return null;
    }

    const { documentId, reason, answer, status_report, email_receive, reporter, reportedUser, createdAt, updatedAt } = report;

    const handleNotifyReportedUser = async () => {
        try {
            const dataSubmit = {
                title: '[Xử lý báo cáo] Tài khoản của bạn đã bị xử lý',
                content: `Xin chào ${reportedUser?.fullname}, tài khoản của bạn đã bị báo cáo bởi người dùng khác trong hệ thống. Chúng tôi đã xem xét và tìm thấy vi phạm các điều khoản dịch vụ của chúng tôi. Vui lòng xem thêm các điều khoản dịch vụ của chúng tôi để biết thêm thông tin. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`,
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
                                user_id: reportedUser?.documentId,
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
            console.error('Error in handleNotifyReportedUser:', error);
        }
    };

    const handleWarningMessage = async () => {
        try {
            const dataSubmit = {
                title: '[Cảnh báo] Tài khoản của bạn đã bị cảnh báo',
                content: `Xin chào ${reporter?.fullname}, tài khoản của bạn đã bị cảnh báo bởi người dùng khác trong hệ thống với lý do: "${reason}".\n Bạn vui lòng kiểm tra lại các hoạt động của tài khoản để tránh vi phạm các điều khoản dịch vụ của chúng tôi.\n Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`, link: `/dashboard/notification`,
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
                                user_id: reportedUser?.documentId,
                                notification_id: response.data.documentId,
                                is_read: false
                            };

                            createUserNotification(dataSubmitUserNotification, {
                                onSuccess: () => {
                                    notifySuccess(intl.formatMessage({ id: 'admin.report.action.warning_message_success', defaultMessage: 'Warning message sent successfully' }));
                                    console.log('User notification created successfully for reported person');
                                    resolve();
                                },
                                onError: (error) => {
                                    notifyError(intl.formatMessage({ id: 'admin.report.action.warning_message_failed', defaultMessage: 'Failed to send warning message' }));
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
            console.error('Error in handleNotifyReportedUser:', error);
        }
    }

    const handleNotifyReporter = async () => {
        try {
            const contentAccept = ` Xin chào ${reporter?.fullname}, báo cáo của bạn đã được xử lý. \nĐối với người dùng bạn đã báo cáo, chúng tôi ghi nhận rằng đã vi phạm điều khoản của hệ thống. Do đó chúng tôi đã xử lý người dùng đó. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`
            const contentDenied = ` Xin chào ${reporter?.fullname}, báo cáo của bạn đã được xử lý. \nĐối với người dùng bạn đã báo cáo, chúng tôi chưa ghi nhận rằng đã vi phạm điều khoản của hệ thống. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`

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

    const handleDeleteUser = async () => {
        try {
            deleteUser({ userId });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAction = (type) => {
        setActionType(type);
        form.resetFields();
        setActionModalVisible(true);
    };

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
                                activeUser({ userId });
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

    const handleActionSubmit = async () => {
        form.validateFields().then(async values => {
            const { answer, email_receive, notifyUser, notifyReporter, reason, duration, warning_message, useDefaultMessage } = values;


            const formattedMessage = useDefaultMessage ?
                `Xin chào ${reportedUser?.fullname}, tài khoản của bạn đã bị báo cáo bởi người dùng khác trong hệ thống. Chúng tôi đã xem xét tài khoản của bạn và tìm thấy nó vi phạm các điều khoản dịch vụ của chúng tôi. Chúng tôi đã tạm thời xóa tài khoản của bạn. Vui lòng xem thêm các điều khoản dịch vụ của chúng tôi để biết thêm thông tin. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`
                : resolution;


            const formattedDismissMessage = useDefaultMessage ?
                `Xin chào ${reporter?.fullname}, Chúng tôi đã ghi nhận báo cáo của bạn. Nhưng chúng tôi đã quyết định không xử lý báo cáo của bạn vì không nhận thấy vi phạm điều khoản của hệ thống. \n Chúng tôi xin cảm ơn bạn đã báo cáo kịp thời.\nn Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`
                : reason;

            try {
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
                                handleDeleteUser()
                                    .then(() => {
                                        handleNotifyReportedUser()
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
                                                setActionModalVisible(false);
                                                onClose();
                                            });
                                    })
                                    .catch((error) => {
                                        console.error('Error deleting user:', error);
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

                    case 'ban':
                        // Cấm người dùng
                        await banUser({
                            userId: reportedUser.documentId,
                            reason,
                            duration
                        });

                        // Cập nhật trạng thái báo cáo
                        await updateReportStatus({
                            reportId: documentId,
                            status: 'resolved',
                            answer,
                            email_receive: notifyReporter ? email_receive : null
                        });

                        if (notifyUser) {
                            await handleNotifyReportedUser();
                        }

                        if (notifyReporter) {
                            await handleNotifyReporter();
                        }
                        break;

                    case 'warn':
                        await handleWarningMessage();
                        break;

                    default:
                        break;
                }

                setActionModalVisible(false);
                onClose();
            } catch (error) {
                console.error('Error in handleActionSubmit:', error);
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
                                    obj: language === 'vi' ? 'tài khoản' : 'account',
                                    email: reporter?.email
                                }
                            })}>
                                <FormattedMessage id="admin.report.action.default_resolution" defaultMessage="Use default system message" />
                            </Checkbox>
                        </Form.Item>
                        <Paragraph className="text-sm mb-4 text-justify text_secondary">
                            <FormattedMessage id="admin.report.action.default_resolution_content" defaultMessage="Resolution"
                                values={{
                                    name: reportedUser?.fullname,
                                    obj: language === 'vi' ? 'tài khoản' : 'account',
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
                                    obj: language === 'vi' ? 'người dùng' : 'user',
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
                                        { required: !getFieldValue('useDefaultMessage'), message: intl.formatMessage({ id: 'admin.report.action.reason.required', defaultMessage: 'Please enter a reason' }) }
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            )}
                        </Form.Item>

                    </Form>
                );
            case 'ban':
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="reason"
                            label={<FormattedMessage id="admin.report.action.ban.reason" defaultMessage="Ban Reason" />}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'admin.report.action.ban.reason.required', defaultMessage: 'Please enter a reason for banning' }) }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="duration"
                            label={<FormattedMessage id="admin.report.action.ban.duration" defaultMessage="Ban Duration (days)" />}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'admin.report.action.ban.duration.required', defaultMessage: 'Please enter ban duration' }) }]}
                        >
                            <Input type="number" min={1} />
                        </Form.Item>
                        <Form.Item
                            name="answer"
                            label={<FormattedMessage id="admin.report.action.resolution" defaultMessage="Resolution" />}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'admin.report.action.resolution.required', defaultMessage: 'Please enter a resolution' }) }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="notifyUser"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                <FormattedMessage id="admin.report.action.notify_user" defaultMessage="Notify reported user" />
                            </Checkbox>
                        </Form.Item>
                        <Form.Item
                            name="notifyReporter"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                <FormattedMessage id="admin.report.action.notify_reporter" defaultMessage="Notify reporter" />
                            </Checkbox>
                        </Form.Item>
                        <Form.Item
                            name="email_receive"
                            label={<FormattedMessage id="admin.report.action.email" defaultMessage="Email" />}
                            dependencies={['notifyReporter']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (getFieldValue('notifyReporter') && !value) {
                                            return Promise.reject(new Error(intl.formatMessage({ id: 'admin.report.action.email.required', defaultMessage: 'Please enter an email' })));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input type="email" />
                        </Form.Item>
                    </Form>
                );
            case 'warn':
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
                        <Paragraph className="text-sm mb-4 text-justify text_secondary">
                            <p>
                                {`Xin chào ${reporter?.fullname}, tài khoản của bạn đã bị cảnh báo bởi người dùng khác trong hệ thống với lý do: "${reason}".\n
                             Bạn vui lòng kiểm tra lại các hoạt động của tài khoản để tránh vi phạm các điều khoản dịch vụ của chúng tôi.\n
                             Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi tại email Phamngochuy0102@gmail.com.`}
                            </p>
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
            default:
                return null;
        }
    };

    const getActionModalTitle = () => {
        switch (actionType) {
            case 'resolve':
                return intl.formatMessage({ id: 'admin.report.action.resolve.title', defaultMessage: 'Resolve Report' });
            case 'deny':
                return intl.formatMessage({ id: 'admin.report.action.deny.title', defaultMessage: 'Deny Report' });
            case 'ban':
                return intl.formatMessage({ id: 'admin.report.action.ban.title', defaultMessage: 'Ban User' });
            case 'warn':
                return intl.formatMessage({ id: 'admin.report.action.warn.title', defaultMessage: 'Warn User' });
            default:
                return '';
        }
    };

    const isLoading = isResolving || isBanning || isWarning || isUpdating || isActiveUser || isCreatingNotification || isCreatingUserNotification || isDeletingUser;

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <FormattedMessage id="admin.report.user.detail_title" defaultMessage="User Report Details" />
                </div>
            }
            width={720}
            placement="right"
            onClose={onClose}
            open={visible}
            extra={
                <div className="flex justify-end">
                    <Button onClick={onClose} className="mr-2">
                        <FormattedMessage id="common.cancel" defaultMessage="Close" />
                    </Button>
                    {status_report === 'pending' ? (
                        <>
                            <Button
                                type="primary"
                                danger
                                onClick={() => handleAction('dismiss')}
                                className="mr-2"
                            >
                                <FormattedMessage id="admin.report.action.dismiss" defaultMessage="Dismiss Report" />
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => handleAction('resolve')}
                                className="mr-2"
                            >
                                <FormattedMessage id="admin.report.action.resolve" defaultMessage="Resolve Report" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center justify-end">
                            <Button
                                type="primary"
                                color='primary'
                                onClick={() => handleRestore(documentId)}
                            >
                                <FormattedMessage id="admin.report.action.restore" defaultMessage="Restore Report" />
                            </Button>
                        </div>

                    )}
                </div>
            }
        >
            <div className="report-detail">
                <div className="mb-6">
                    <Title level={5} className="text_first">
                        <FormattedMessage id="admin.report.user.detail.reported_user" defaultMessage="Reported User" />
                    </Title>
                    <div className="flex items-start">
                        <Avatar
                            src={reportedUser?.avatar?.file_path}
                            size={64}
                            className="mr-4"
                        />
                        <div className="flex-1">
                            {reportedUser?.deletedAt && (
                                <div className="text-sm text-red-500 flex items-center gap-2">
                                    <FaUserXmark className='text-red-500 text-lg' />
                                    <FormattedMessage id="admin.report.user.detail.deleted" defaultMessage="Deleted" />
                                </div>
                            )}
                            <div className="text-lg font-medium text_first">{reportedUser?.fullname}</div>
                            <div className="text-sm text_secondary">{reportedUser?.email}</div>
                            <div className="text-sm text_secondary">
                                <FormattedMessage
                                    id="admin.report.user.detail.faculty"
                                    defaultMessage="Faculty: {faculty}"
                                    values={{ faculty: language === 'vi' ? reportedUser?.regularClass?.specialized?.faculty?.name_vi : reportedUser?.regularClass?.specialized?.faculty?.name_en }}
                                />
                            </div>
                            <div className="text-sm text_secondary">
                                <FormattedMessage
                                    id="admin.report.user.detail.join_date"
                                    defaultMessage="Joined: {join_date}"
                                    values={{ join_date: format(new Date(reportedUser?.createdAt), 'dd/MM/yyyy') }}
                                />
                            </div>

                            <div className="mt-3 flex gap-2">
                                {status_report === 'pending' && (
                                    <>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<BsPersonSlash />}
                                            onClick={() => handleAction('resolve')}
                                        >
                                            <FormattedMessage id="admin.report.action.ban" defaultMessage="Ban User" />
                                        </Button>
                                        <Button
                                            color="orange" variant="solid"
                                            icon={<BsExclamationCircle />}
                                            onClick={() => handleAction('warn')}
                                        >
                                            <FormattedMessage id="admin.report.action.warn" defaultMessage="Warn User" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div className="mb-6">
                        <Title level={5} className="text_first">
                            <FormattedMessage id="admin.report.user.detail.reason" defaultMessage="Report Reason" />
                        </Title>
                        <Paragraph>{reason}</Paragraph>
                    </div>

                    <Divider />

                    <div className="mb-6">
                        <Title level={5} className="text_first">
                            <FormattedMessage id="admin.report.user.detail.reporter" defaultMessage="Reported By" />
                        </Title>
                        <div className="flex items-center">
                            <Avatar
                                src={reporter?.avatar?.file_path}
                                size={48}
                                className="mr-3"
                            />
                            <div>
                                {reporter?.deletedAt && (
                                    <div className="text-sm text_secondary flex items-center gap-2">
                                        <FaUserXmark className='text-red-500 text-lg' />
                                        <span className='text-red-500'><FormattedMessage id="admin.report.user.detail.deleted" defaultMessage="Deleted" /></span>
                                    </div>
                                )}
                                <div className="text-base font-medium text_first">{reporter?.fullname}</div>
                                <div className="text-sm text_secondary">{reporter?.email}</div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div className="mb-6">
                        <Title level={5} className="text_first">
                            <FormattedMessage id="admin.report.user.detail.report_info" defaultMessage="Report Information" />
                        </Title>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="admin.report.user.detail.date" defaultMessage="Report Date" />
                                </div>
                                <div>{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}</div>
                            </div>
                            <div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="admin.report.user.detail.status" defaultMessage="Status" />
                                </div>
                                <div>{getStatusTag(status_report, 20)}</div>
                            </div>
                            {answer && (
                                <div className="col-span-2">
                                    <div className="text-sm text_secondary">
                                        <FormattedMessage id="admin.report.user.detail.resolution" defaultMessage="Resolution" />
                                    </div>
                                    <div>{answer}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Modal
                    title={getActionModalTitle()}
                    open={actionModalVisible}
                    onCancel={() => setActionModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setActionModalVisible(false)}>
                            <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={isLoading}
                            onClick={handleActionSubmit}
                        >
                            <FormattedMessage id="common.submit" defaultMessage="Submit" />
                        </Button>
                    ]}
                >
                    {renderActionForm()}
                </Modal>
            </div>
        </Drawer>
    );
};

export default ReportDetail; 
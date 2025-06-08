import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Drawer, Space, Divider } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNoticeTypes } from '../hook';
import { useCreateNotification, useUpdateNotification } from '../mutationHooks';
import useSkin from '@/utils/hooks/useSkin';
import { getNoticeTypeColor } from '@/helpers/colorHelper';
import UserSelect from '@/components/elements/UserSelect';

const { Option } = Select;
const { TextArea } = Input;

const NotificationForm = ({ visible, onClose, initialValues = null, isEdit = false }) => {
    const intl = useIntl();
    const { language } = useSkin();

    const [form] = Form.useForm();
    const [isGlobal, setIsGlobal] = useState(initialValues?.is_global || false);

    // Use Form.useWatch to track content length
    const content = Form.useWatch('content', form);
    const contentLength = content?.length || 0;

    const { data: noticeTypesData, isLoading: noticeTypesLoading } = useNoticeTypes();

    const { mutate: createNotification, isLoading: isCreating } = useCreateNotification();
    const { mutate: updateNotification, isLoading: isUpdating } = useUpdateNotification();

    const isSubmitting = isCreating || isUpdating;

    const [tempUsers, setTempUsers] = useState([]);


    // Reset form when drawer opens with initial values
    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    title: initialValues?.title,
                    content: initialValues?.content,
                    link: initialValues?.link,
                    notice_type_id: initialValues?.noticeType?.documentId,
                    is_global: initialValues?.is_global,
                    user_ids: initialValues?.is_global ? [] : initialValues?.user_ids || [],
                });
                setIsGlobal(initialValues?.is_global);
            } else {
                form.resetFields();
                setIsGlobal(false);
            }
        }
    }, [visible, form, initialValues]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const selectedType = noticeTypesData?.data?.find(type => type.documentId === values.notice_type_id);

            const formData = {
                ...values,
                type: {
                    documentId: values.notice_type_id,
                    name_en: selectedType?.name_en,
                    name_vi: selectedType?.name_vi
                },
                // If global is true, we don't need user_ids
                user_ids: values?.is_global ? [] : values?.user_ids,
            };

            createNotification(formData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        });
    };

    const handleGlobalChange = (checked) => {
        setIsGlobal(checked);
        if (checked) {
            form.setFieldsValue({ user_ids: [] });
        }
    };

    const getContentColor = () => {
        if (contentLength >= 10 && contentLength <= 500) {
            return '#52c41a'; // green
        }
        return '#ff4d4f'; // red
    };

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    <FormattedMessage
                        id={isEdit ? 'admin.dashboard.notification.edit_notification' : 'admin.dashboard.notification.create_notification'}
                        defaultMessage={isEdit ? 'Edit Notification' : 'Create New Notification'}
                    />
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={500}
            extra={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        <FormattedMessage
                            id={isEdit ? 'common.update' : 'common.create'}
                            defaultMessage={isEdit ? 'Update' : 'Create'}
                        />
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    is_global: false,
                    user_ids: [],
                }}
            >
                <Form.Item
                    name="title"
                    label={<FormattedMessage id="admin.dashboard.notification.title" defaultMessage="Title" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.title_required',
                                defaultMessage: 'Please enter notification title'
                            })
                        },
                        {
                            max: 50,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.title_max',
                                defaultMessage: 'Title cannot exceed 50 characters'
                            })
                        },
                        {
                            min: 10,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.title_min',
                                defaultMessage: 'Title cannot be less than 10 characters'
                            })
                        }
                    ]}
                >
                    <Input
                        placeholder={intl.formatMessage({
                            id: 'admin.dashboard.notification.title_placeholder',
                            defaultMessage: 'Enter notification title'
                        })}
                    />
                </Form.Item>

                <Form.Item
                    name="content"
                    label={
                        <div className="flex items-center justify-between !w-full">
                            <div>
                                <FormattedMessage id="admin.dashboard.notification.content" defaultMessage="Content" />
                            </div>
                            <div>
                                <span style={{ color: getContentColor() }}>
                                    {contentLength}/500
                                </span>
                            </div>
                        </div>
                    }
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.content_required',
                                defaultMessage: 'Please enter notification content'
                            })
                        },
                        {
                            max: 500,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.content_max',
                                defaultMessage: 'Content cannot exceed 500 characters'
                            })
                        },
                        {
                            min: 10,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.content_min',
                                defaultMessage: 'Content cannot be less than 10 characters'
                            })
                        }
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder={intl.formatMessage({
                            id: 'admin.dashboard.notification.content_placeholder',
                            defaultMessage: 'Enter notification content'
                        })}
                    />
                </Form.Item>

                {/* <Form.Item
                    name="link"
                    label={<FormattedMessage id="notification.form.link" defaultMessage="Link" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.link_required',
                                defaultMessage: 'Please enter notification link'
                            })
                        }
                    ]}
                >
                    <Input
                        placeholder={intl.formatMessage({
                            id: 'admin.dashboard.notification.link_placeholder',
                            defaultMessage: 'Enter notification link'
                        })}
                    />
                </Form.Item> */}

                <Form.Item
                    name="notice_type_id"
                    label={<FormattedMessage id="admin.dashboard.notification.type" defaultMessage="Notification Type" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'admin.dashboard.notification.type_required',
                                defaultMessage: 'Please select notification type'
                            })
                        }
                    ]}
                >
                    <Select
                        placeholder={intl.formatMessage({
                            id: 'admin.dashboard.notification.type_placeholder',
                            defaultMessage: 'Select notification type'
                        })}
                        loading={noticeTypesLoading}
                    >
                        {noticeTypesData?.data?.map(type => (
                            <Option key={type.documentId} value={type.documentId}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: getNoticeTypeColor(type?.name_en) }}
                                    ></span>
                                    <span>{language === 'vi' ? type?.name_vi : type?.name_en}</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Divider className="my-3" />

                <Form.Item
                    name="is_global"
                    label={<FormattedMessage id="admin.dashboard.notification.is_global" defaultMessage="Send to All Users" />}
                    valuePropName="checked"
                >
                    <Switch onChange={handleGlobalChange} />
                </Form.Item>

                {!isGlobal && (
                    <Form.Item
                        name="user_ids"
                        label={<FormattedMessage id="admin.dashboard.notification.user_ids" defaultMessage="Select Users" />}
                        rules={[
                            {
                                required: !isGlobal,
                                message: intl.formatMessage({
                                    id: 'admin.dashboard.notification.user_ids_required',
                                    defaultMessage: 'Please select at least one user'
                                })
                            }
                        ]}
                    >

                        <UserSelect
                            type="multiple"
                            value={tempUsers}
                            onChange={(selectedUsers) => {
                                setTempUsers(selectedUsers);
                            }}
                            placeholder={intl.formatMessage({ id: 'admin.dashboard.notification.user_ids_placeholder' })}
                        />
                    </Form.Item>
                )}
            </Form>
        </Drawer>
    );
};

export default NotificationForm;
import React, { useState } from 'react';
import { Card, Form, Input, Button, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { handleNoticeAction } from '../../../../../utils/Utils';
import useSkin from '../../../../../utils/hooks/useSkin';
import { useUpdateUserSecurity } from '../mutationHook';
import { useUpdateUserInfo, useUserData } from '@/utils/hooks/useAuth';

const LoginInfoSecurity = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const { skin } = useSkin();
    const { userData } = useUserData();

    const { mutate: updateUserSecurity, isLoading } = useUpdateUserSecurity();
    const { mutateAsync: updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();



    const [isModalVisible, setIsModalVisible] = useState(false);
    const [changeType, setChangeType] = useState(null);

    const showModal = (type) => {
        setChangeType(type);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            updateUserSecurity({
                userId: userData.documentId,
                username: values.username,
                email: values.email,
                currentPassword: values.password
            }, {
                onSuccess: () => {
                    updateUserInfo();
                    handleCancel();

                },
                onError: (error) => {
                    console.error('Error:', error);
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <UserOutlined className="text-xl text-blue-500" />
                    <span>
                        <FormattedMessage id="setting.security.login_info.title" />
                    </span>
                </div>
            }
            className="security-card"
        >
            <div className="space-y-6">
                {/* Email Change Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium">
                            <FormattedMessage id="setting.security.login_info.email" />
                        </h3>
                        <p className="text_secondary">
                            <FormattedMessage id="setting.security.login_info.email_desc" />
                        </p>
                    </div>
                    <Button type="primary" onClick={() => showModal('email')}>
                        <FormattedMessage id="setting.security.login_info.change" />
                    </Button>
                </div>

                {/* Username Change Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium">
                            <FormattedMessage id="setting.security.login_info.username" />
                        </h3>
                        <p className="text_secondary">
                            <FormattedMessage id="setting.security.login_info.username_desc" />
                        </p>
                    </div>
                    <Button type="primary" onClick={() => showModal('username')}>
                        <FormattedMessage id="setting.security.login_info.change" />
                    </Button>
                </div>
            </div>

            <Modal
                title={
                    <FormattedMessage
                        id={`setting.security.login_info.change_${changeType}`}
                    />
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        <FormattedMessage id="common.cancel" />
                    </Button>,
                    <Button
                        loading={isUpdating || isLoading}
                        key="submit" type="primary" onClick={handleSubmit}
                    >
                        <FormattedMessage id="common.confirm" />
                    </Button>
                ]}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item
                        name={changeType}
                        label={
                            <FormattedMessage
                                id={`setting.security.login_info.new_${changeType}`}
                            />
                        }
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: `setting.security.login_info.${changeType}_required`
                                })
                            },
                            changeType === 'email' && {
                                type: 'email',
                                message: intl.formatMessage({
                                    id: 'setting.security.login_info.email_invalid'
                                })
                            }
                        ].filter(Boolean)}
                    >
                        <Input
                            prefix={changeType === 'email' ? <MailOutlined /> : <UserOutlined />}
                            placeholder={intl.formatMessage({
                                id: `setting.security.login_info.${changeType}_placeholder`
                            })}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<FormattedMessage id="setting.security.login_info.confirm_password" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: 'setting.security.login_info.password_required'
                                })
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={intl.formatMessage({
                                id: 'setting.security.login_info.password_placeholder'
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default LoginInfoSecurity; 
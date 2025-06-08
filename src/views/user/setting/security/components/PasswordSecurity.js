import React, { useState } from 'react';
import { Card, Button, Form, Input, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { KeyOutlined } from '@ant-design/icons';
import { useUpdateUserInfo, useUserData } from '@/utils/hooks/useAuth';
import { useUpdateUserSecurity } from '../mutationHook';

const PasswordSecurity = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const intl = useIntl();
    const { userData } = useUserData();


    const { mutate: updateUserSecurity, isLoading } = useUpdateUserSecurity();
    const { mutateAsync: updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();

    const showModal = () => {
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
                currentPassword: values.currentPassword,
                password: values.newPassword,
            }, {
                onSuccess: () => {
                    updateUserInfo();
                    handleCancel();
                },
                onError: (error) => {
                    console.error('Error:', error);
                }
            })
            setIsModalVisible(false);
            form.resetFields();
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    return (
        <>
            <Card className="security-card mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl">
                            <KeyOutlined className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                <FormattedMessage id="setting.security.password.title" />
                            </h3>
                            <p className="text_secondary">
                                <FormattedMessage id="setting.security.password.description" />
                            </p>
                        </div>
                    </div>
                    <Button type="primary" onClick={showModal}>
                        <FormattedMessage id="setting.security.password.change" />
                    </Button>
                </div>
            </Card>

            <Modal
                title={<FormattedMessage id="setting.security.password.change_title" />}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText={<FormattedMessage id="common.save" />}
                cancelText={<FormattedMessage id="common.cancel" />}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="currentPassword"
                        label={<FormattedMessage id="setting.security.password.current" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.security.password.current_required' })
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label={<FormattedMessage id="setting.security.password.new" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'profile.manage_account.password_required' }),
                            },
                            {
                                min: 5,
                                message: intl.formatMessage({ id: 'profile.manage_account.password_min' }, { min: 5 }),
                            },
                            {
                                max: 15,
                                message: intl.formatMessage({ id: 'profile.manage_account.password_max' }, { max: 15 }),
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={<FormattedMessage id="setting.security.password.confirm" />}
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.security.password.confirm_required' })
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(intl.formatMessage({ id: 'setting.security.password.mismatch' }))
                                    );
                                }
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PasswordSecurity; 
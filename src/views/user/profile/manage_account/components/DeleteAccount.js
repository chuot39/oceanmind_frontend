import React, { useState } from 'react';
import { Card, Button, Checkbox, Alert, Modal, Form, Input, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import userService from '@/services/api/userService';
import { notifyError, notifySuccess } from '@/utils/Utils';

const DeleteAccount = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const intl = useIntl();

    const deleteAccountMutation = useMutation(
        async (password) => {
            // await userService.lockAccount(password);
        },
        {
            onSuccess: () => {
                notifySuccess(intl.formatMessage({ id: 'profile.manage_account.delete_success' }));
                setIsModalVisible(false);
                form.resetFields();
            },
            onError: (error) => {
                if (error?.response?.data?.message === 'Invalid password') {
                    message.error(intl.formatMessage({ id: 'profile.manage_account.invalid_password' }));
                } else {
                    notifyError(intl.formatMessage({ id: 'profile.manage_account.delete_error' }));
                }
            }
        }
    );

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleDeleteClick = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            await deleteAccountMutation.mutateAsync(values.password);
        } catch (error) {
            // Form validation error
        }
    };

    return (
        <Card className="delete-account-section">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="profile.manage_account.delete_account" defaultMessage="XÓA TÀI KHOẢN" />
            </h2>

            <Alert
                type="warning"
                message={
                    <FormattedMessage
                        id="profile.manage_account.delete_warning"
                        defaultMessage="Bạn có chắc chắn muốn xóa tài khoản của mình không?"
                    />
                }
                showIcon
            />

            <div className="mb-4 mt-2">
                <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
                    <FormattedMessage
                        id="profile.manage_account.delete_confirmation_title"
                        defaultMessage="Tôi xác nhận việc hủy kích hoạt tài khoản của tôi"
                    />
                </Checkbox>
            </div>

            <Button
                danger
                type="primary"
                disabled={!isChecked}
                onClick={handleDeleteClick}
                loading={deleteAccountMutation.isLoading}
            >
                <FormattedMessage id="profile.manage_account.delete_button" defaultMessage="Xóa Tài Khoản" />
            </Button>

            <Modal
                title={<FormattedMessage id="profile.manage_account.confirm_delete" defaultMessage="Xác nhận xóa tài khoản" />}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={deleteAccountMutation.isLoading}
            >
                <Alert
                    message={<FormattedMessage id="profile.manage_account.delete_confirmation_title" defaultMessage="Bạn có chắc chắn muốn xóa tài khoản của mình không?" />}
                    type="warning"
                    showIcon
                    description={<FormattedMessage id="profile.manage_account.delete_confirmation_message" defaultMessage="Bạn có chắc chắn muốn xóa tài khoản của mình không?" />}
                />

                <Alert
                    message={<FormattedMessage id="profile.manage_account.enter_password" defaultMessage="Nhập mật khẩu để xóa tài khoản" />}
                    type="warning"
                    className='my-3'
                    showIcon
                />

                <Form form={form} layout="vertical">
                    <Form.Item
                        name="username"
                        label={<FormattedMessage id="profile.manage_account.username" defaultMessage="Tên tài khoản" />}
                        rules={[
                            {
                                required: true,
                                message: <FormattedMessage id="profile.manage_account.username_required" defaultMessage="Vui lòng nhập tên tài khoản" />
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label={<FormattedMessage id="profile.manage_account.password" defaultMessage="Mật khẩu" />}
                        rules={[
                            {
                                required: true,
                                message: <FormattedMessage id="profile.manage_account.password_required" defaultMessage="Vui lòng nhập mật khẩu" />
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default DeleteAccount; 
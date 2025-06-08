import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteAccount = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const intl = useIntl();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setConfirmText('');
    };

    const handleDelete = () => {
        // Handle account deletion logic here
        setIsModalVisible(false);
        setConfirmText('');
    };

    const confirmationText = 'DELETE MY ACCOUNT';

    return (
        <div className="delete-account-section mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-start">
                <ExclamationCircleOutlined className="text-2xl text-red-500 mr-4 mt-1" />
                <div>
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                        <FormattedMessage id="setting.account.delete_account" />
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        <FormattedMessage id="setting.account.delete_warning" />
                    </p>
                </div>
            </div>

            <Button
                danger
                type="primary"
                className="mt-4"
                onClick={showModal}
            >
                <FormattedMessage id="setting.account.delete_button" />
            </Button>

            <Modal
                title={<FormattedMessage id="setting.account.delete_confirmation_title" />}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        <FormattedMessage id="common.cancel" />
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        type="primary"
                        disabled={confirmText !== confirmationText}
                        onClick={handleDelete}
                    >
                        <FormattedMessage id="setting.account.confirm_delete" />
                    </Button>
                ]}
            >
                <p>
                    <FormattedMessage id="setting.account.delete_confirmation_message" />
                </p>
                <p className="mt-4 font-medium">
                    <FormattedMessage id="setting.account.type_to_confirm" />
                    {' '}
                    <span className="font-bold">{confirmationText}</span>
                </p>
                <Input
                    className="mt-2"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'setting.account.confirmation_placeholder' })}
                />
            </Modal>
        </div>
    );
};

export default DeleteAccount; 
import React from 'react';
import { Modal, Typography } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useSkin from '@/utils/hooks/useSkin';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, specialization, isLoading }) => {
    const intl = useIntl();
    const { skin } = useSkin();

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    <FormattedMessage id="admin.specialization.delete_title" defaultMessage="Delete Specialization" />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {specialization && (
                <>
                    <p>
                        <FormattedMessage
                            id="admin.specialization.delete_confirmation"
                            defaultMessage="Are you sure you want to delete the specialization:"
                        />
                    </p>
                    <div className={`my-4 p-3 rounded ${skin === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                        <Text strong>{specialization.name_vi}</Text>
                        <br />
                        <Text>{specialization.name_en}</Text>
                        {specialization.faculty && (
                            <div className="mt-2">
                                <Text type="secondary">
                                    <FormattedMessage id="admin.specialization.faculty" defaultMessage="Faculty" />: {specialization.faculty.name_vi}
                                </Text>
                            </div>
                        )}
                    </div>
                    <p className="text-red-500">
                        <FormattedMessage
                            id="admin.specialization.delete_warning"
                            defaultMessage="This action cannot be undone. All data associated with this specialization will also be affected."
                        />
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
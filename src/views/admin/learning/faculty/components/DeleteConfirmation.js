import React from 'react';
import { Modal, Typography } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useSkin from '@/utils/hooks/useSkin';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, faculty, isLoading }) => {
    const intl = useIntl();
    const { skin } = useSkin();

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    <FormattedMessage id="admin.faculty.delete_title" defaultMessage="Delete Faculty" />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {faculty && (
                <>
                    <p>
                        <FormattedMessage
                            id="admin.faculty.delete_confirmation"
                            defaultMessage="Are you sure you want to delete the faculty:"
                        />
                    </p>
                    <div className={`my-4 p-3 rounded ${skin === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                        <Text strong>{faculty.name_vi}</Text>
                        <br />
                        <Text>{faculty.name_en}</Text>
                    </div>
                    <p className="text-red-500">
                        <FormattedMessage
                            id="admin.faculty.delete_warning"
                            defaultMessage="This action cannot be undone. All specializations associated with this faculty will also be affected."
                        />
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
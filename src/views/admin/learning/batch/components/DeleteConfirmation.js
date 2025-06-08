import React from 'react';
import { Modal, Typography, Tag } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import useSkin from '@/utils/hooks/useSkin';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, batch, isLoading }) => {
    const intl = useIntl();
    const { skin } = useSkin();

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    <FormattedMessage id="admin.batch.delete_title" defaultMessage="Delete Batch" />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {batch && (
                <>
                    <p>
                        <FormattedMessage
                            id="admin.batch.delete_warning"
                            defaultMessage="Are you sure you want to delete the batch:"
                        />
                    </p>
                    <div className={`my-4 p-3 rounded ${skin === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                        <Text strong>{batch.name}</Text>
                        <div className="mt-2">
                            <Tag color="blue">
                                {format(new Date(batch.start_year), 'yyyy')} - {format(new Date(batch.end_year), 'yyyy')}
                            </Tag>
                        </div>
                    </div>
                    <p className="text-red-500">
                        <FormattedMessage
                            id="admin.batch.delete_warning_detail"
                            defaultMessage="This action cannot be undone. All classes associated with this batch will also be affected."
                        />
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
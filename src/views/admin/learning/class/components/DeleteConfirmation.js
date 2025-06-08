import React from 'react';
import { Modal, Typography } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useSkin from '@/utils/hooks/useSkin';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, classItem, isLoading }) => {
    const intl = useIntl();
    const { skin, language } = useSkin();

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    <FormattedMessage id="admin.class.delete_title" defaultMessage="Delete Class" />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {classItem && (
                <>
                    <p>
                        <FormattedMessage
                            id="admin.class.delete_warning"
                            defaultMessage="Are you sure you want to delete the class:"
                        />
                    </p>
                    <div className={`my-4 p-3 rounded ${skin === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                        <Text strong>{classItem.name}</Text>
                        <div className="mt-2">
                            <Text type="secondary">
                                <FormattedMessage id="admin.class.specialized" defaultMessage="Specialization" />: {language === 'vi' ? classItem.specialized?.name_vi : classItem.specialized?.name_en || 'N/A'}
                            </Text>
                            <br />
                            <Text type="secondary">
                                <FormattedMessage id="admin.class.batch" defaultMessage="Batch" />: {classItem.batch?.name || 'N/A'}
                            </Text>
                        </div>
                    </div>
                    <p className="text-red-500">
                        <FormattedMessage
                            id="admin.class.delete_warning_detail"
                            defaultMessage="This action cannot be undone. All data associated with this class will also be affected."
                        />
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
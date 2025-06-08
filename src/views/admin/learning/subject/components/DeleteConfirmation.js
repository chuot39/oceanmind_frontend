import React from 'react';
import { Modal, Typography, Tag } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmation = ({ visible, onClose, onConfirm, subject, isLoading }) => {
    const intl = useIntl();

    const hasRelationships = subject && (
        subject.specializations?.length > 0 ||
        subject.previousSubjects?.length > 0 ||
        subject.prerequisiteSubjects?.length > 0
    );

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <ExclamationCircleOutlined className="text-red-500 mr-2" />
                    <FormattedMessage id="subject.delete.title" defaultMessage="Delete Subject" />
                </div>
            }
            open={visible}
            onCancel={onClose}
            onOk={onConfirm}
            okText={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}
            cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
            okButtonProps={{ danger: true, loading: isLoading }}
        >
            {subject && (
                <>
                    <p>
                        <FormattedMessage
                            id="subject.delete.confirmation"
                            defaultMessage="Are you sure you want to delete the subject:"
                        />
                    </p>
                    <div className="my-4 p-3 bg-gray-50 rounded">
                        <Text strong>{subject.name}</Text>
                        <div className="mt-1">
                            <Text code>{subject.subject_code}</Text>
                            <Tag className="tag-credits ml-2">
                                {subject.credits} <FormattedMessage id="subject.credits" defaultMessage="credits" />
                            </Tag>
                        </div>
                    </div>

                    {hasRelationships && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                            <Text strong className="text-yellow-700">
                                <FormattedMessage
                                    id="subject.delete.warning.relationships"
                                    defaultMessage="Warning: This subject has relationships"
                                />
                            </Text>
                            <ul className="mt-2 text-yellow-700">
                                {subject.specializations?.length > 0 && (
                                    <li>
                                        <FormattedMessage
                                            id="subject.delete.warning.specializations"
                                            defaultMessage="Used in {count} specialization(s)"
                                            values={{ count: subject.specializations.length }}
                                        />
                                    </li>
                                )}
                                {subject.previousSubjects?.length > 0 && (
                                    <li>
                                        <FormattedMessage
                                            id="subject.delete.warning.previous"
                                            defaultMessage="Has {count} previous subject(s)"
                                            values={{ count: subject.previousSubjects.length }}
                                        />
                                    </li>
                                )}
                                {subject.prerequisiteSubjects?.length > 0 && (
                                    <li>
                                        <FormattedMessage
                                            id="subject.delete.warning.prerequisites"
                                            defaultMessage="Has {count} prerequisite subject(s)"
                                            values={{ count: subject.prerequisiteSubjects.length }}
                                        />
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <p className="text-red-500">
                        <FormattedMessage
                            id="subject.delete.warning"
                            defaultMessage="This action cannot be undone. All relationships with this subject will also be deleted."
                        />
                    </p>
                </>
            )}
        </Modal>
    );
};

export default DeleteConfirmation; 
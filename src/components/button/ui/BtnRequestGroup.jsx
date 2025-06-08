import { Button, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { useRequestJoinGroup, useLeaveGroup } from '@/views/user/social/shared/actions/mutationHooks';
import { useUserData } from '@/utils/hooks/useAuth';

export const BtnRequestGroup = ({ group, status, setStatusRequestSend, onSuccessLeave }) => {
    const intl = useIntl();
    const { userData } = useUserData();

    const { mutateAsync: requestJoinGroup, isLoading: isLoadingRequestJoinGroup } = useRequestJoinGroup();
    const { mutate: leaveGroupMutation, isLoading: isLoadingLeaveGroup } = useLeaveGroup();
    const [currentStatus, setCurrentStatus] = useState(status);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => setIsModalVisible(false);

    const handleChangeGroupRequestStatus = async (newStatus) => {
        try {
            if (newStatus === 'join_group') {
                await requestJoinGroup({ groupId: group?.documentId, userId: userData?.documentId });
                setIsModalVisible(false);
                setCurrentStatus('cancel_request');
                if (setStatusRequestSend) {
                    setStatusRequestSend('cancel_request');
                }
            } else if (newStatus === 'cancel_request') {
                // Implement cancel request if needed
                setIsModalVisible(false);
                setCurrentStatus('join_group');
                if (setStatusRequestSend) {
                    setStatusRequestSend('join_group');
                }
            } else if (newStatus === 'leave_group') {
                leaveGroupMutation(
                    {
                        groupId: group?.documentId,
                        userId: userData?.documentId
                    },
                    {
                        onSuccess: () => {
                            setIsModalVisible(false);
                            setCurrentStatus('join_group');
                            if (setStatusRequestSend) {
                                setStatusRequestSend('join_group');
                            }
                            // Call onSuccessLeave callback to update parent component's group list
                            if (onSuccessLeave && typeof onSuccessLeave === 'function') {
                                onSuccessLeave(group?.documentId);
                            }
                        },
                        onError: (error) => {
                            console.error('Error leaving group:', error);
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error changing group request status:', error);
        }
    };

    const renderButton = () => {
        switch (currentStatus) {
            case 'join_group':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_accept"
                        onClick={() => handleChangeGroupRequestStatus('join_group')}
                        loading={isLoadingRequestJoinGroup}
                    >
                        <FormattedMessage id="social.group.join" defaultMessage="Join Group" />
                    </Button>
                );

            case 'cancel_request':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_reject"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingRequestJoinGroup}
                    >
                        <FormattedMessage id="social.group.requested" defaultMessage="Requested" />
                    </Button>
                );

            case 'leave_group':
                return (
                    <Button
                        color="danger"
                        variant="solid"
                        className="flex-1 btn_custom_reject"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingLeaveGroup}
                    >
                        <FormattedMessage id="social.group.leave" defaultMessage="Leave Group" />
                    </Button>
                );

            default:
                return null;
        }
    };

    const renderModal = () => {
        let title, content, okText;

        switch (currentStatus) {
            case 'cancel_request':
                title = intl.formatMessage({ id: 'social.group.cancel_request_title', defaultMessage: 'Cancel Group Join Request' });
                content = intl.formatMessage(
                    { id: 'social.group.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your request to join {name}?' },
                    { name: group?.name }
                );
                okText = intl.formatMessage({ id: 'social.group.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeGroupRequestStatus('cancel_request') };

            case 'leave_group':
                title = intl.formatMessage({ id: 'social.group.leave_title', defaultMessage: 'Leave Group' });
                content = intl.formatMessage(
                    { id: 'social.group.leave_content', defaultMessage: 'Are you sure you want to leave {name}?' },
                    { name: group?.name }
                );
                okText = intl.formatMessage({ id: 'social.group.yes_leave', defaultMessage: 'Yes, Leave' });
                return { title, content, okText, onOk: () => handleChangeGroupRequestStatus('leave_group') };

            default:
                return { title: '', content: '', okText: '', onOk: () => { } };
        }
    };

    const { title, content, okText, onOk } = renderModal();

    return (
        <>
            {renderButton()}
            <Modal
                title={title}
                open={isModalVisible}
                onOk={onOk}
                onCancel={handleCancel}
                okText={okText}
                cancelText={intl.formatMessage({ id: 'social.group.cancel_modal', defaultMessage: 'Cancel' })}
                okButtonProps={{ danger: true }}
                confirmLoading={isLoadingRequestJoinGroup || isLoadingLeaveGroup}
            >
                <p>{content}</p>
            </Modal>
        </>
    );
}; 
import { Button, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState, useEffect } from 'react';
import { useChangeFriendStatus } from '@/views/user/stores/actions/friendHook';
import { useUserData } from '@/utils/hooks/useAuth';

export const BtnRequestFriend = ({ friend, status, setStatusRequestSend }) => {
    const intl = useIntl();
    const { userData } = useUserData();

    const { mutateAsync: sendFriendRequest, isLoading: isLoadingSendFriendRequest } = useChangeFriendStatus();
    const [currentStatus, setCurrentStatus] = useState(status);

    // Update currentStatus when status prop changes
    useEffect(() => {
        setCurrentStatus(status);
    }, [status, friend?.documentId]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => setIsModalVisible(false);

    const handleChangeFriendStatus = async (newStatus) => {
        try {
            const statusRequest = newStatus === 'add_friend' || newStatus === 'chat_now' ? 'pending' : newStatus;
            await sendFriendRequest({ userId: userData?.documentId, friendId: friend?.documentId, status: statusRequest });
            setIsModalVisible(false);

            // Update current status based on the action
            let updatedStatus;
            switch (newStatus) {
                case 'accepted':
                    updatedStatus = 'chat_now';
                    break;
                case 'add_friend':
                    updatedStatus = 'cancel_request';
                    break;
                case 'chat_now':
                    updatedStatus = 'cancel_request';
                    break;
                case 'denied':
                    updatedStatus = 'add_friend';
                    break;
                default:
                    updatedStatus = newStatus;
            }

            // Update local state immediately
            setCurrentStatus(updatedStatus);

            // Update parent component's state
            if (setStatusRequestSend) {
                setStatusRequestSend(updatedStatus);
            }

        } catch (error) {
            console.error('Error changing friend status:', error);
        }
    };

    const renderButton = () => {
        switch (currentStatus) {
            case 'add_friend':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_accept"
                        onClick={() => handleChangeFriendStatus('add_friend')}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.add_friend" />
                    </Button>
                );

            case 'chat_now':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_accept"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.chat_now" />
                    </Button>
                );

            case 'received':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_accept"
                        onClick={() => handleChangeFriendStatus('accepted')}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.accept" />
                    </Button>
                );

            case 'unfriend':
                return (
                    <Button
                        color="danger"
                        variant="solid"
                        className="flex-1 btn_custom_reject"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.unfriend" />
                    </Button>
                );

            case 'decline':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_reject"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.decline" />
                    </Button>
                );

            case 'cancel_request':
                return (
                    <Button
                        type="primary"
                        className="flex-1 btn_custom_reject"
                        onClick={() => setIsModalVisible(true)}
                        loading={isLoadingSendFriendRequest}
                    >
                        <FormattedMessage id="social.friend.cancel" />
                    </Button>
                );

            default:
                return null;
        }
    };

    const renderModal = () => {
        let title, content, okText;

        switch (currentStatus) {
            case 'all':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus('denied') };

            case 'unfriend':
                title = intl.formatMessage({ id: 'social.friend.unfriend_title', defaultMessage: 'Remove Friend' });
                content = intl.formatMessage(
                    { id: 'social.friend.unfriend_content', defaultMessage: 'Are you sure you want to remove {name} from your friends?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_remove', defaultMessage: 'Yes, Remove' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus('denied') };

            case 'received':
                title = intl.formatMessage({ id: 'social.friend.decline_request_title', defaultMessage: 'Decline Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.decline_request_content', defaultMessage: 'Are you sure you want to decline the friend request from {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_decline', defaultMessage: 'Yes, Decline' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus('denied') };

            case 'requests':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus('denied') };

            case 'cancel_request':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus('denied') };

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
                cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                okButtonProps={{ danger: true }}
                confirmLoading={isLoadingSendFriendRequest}
            >
                <p>{content}</p>
            </Modal>
        </>
    );
};
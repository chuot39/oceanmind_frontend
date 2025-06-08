import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { handleNavigateToChat, handleSendFriendRequest } from '@/views/user/stores/actions/friendActions';
import { useChangeFriendStatus, useCreateConversation } from '@/views/user/stores/actions/friendHook';
import { getConversation } from '@/helpers/userHelper';
import { notifyError, notifyWarning } from '@/utils/Utils';
import { useUserData } from '@/utils/hooks/useAuth';
import { useCreateNotification, useCreateUserNotification } from '@/views/user/components/mutationHooks';

const BtnChatFriend = ({ friend, showModal }) => {
    const navigate = useNavigate();
    const { userData } = useUserData();
    const { mutateAsync: createConversationAsync } = useCreateConversation();
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Button
                type="primary"
                className="flex-1"
                onClick={() => handleNavigateToChat({
                    friend,
                    userData,
                    navigate,
                    createConversationAsync,
                    setLoading
                })}
                loading={loading}
            >
                <FormattedMessage id="social.friend.chat_now" />
            </Button>
            <Button
                type="default"
                className="flex-1 btn_custom_reject"
                onClick={showModal}
            >
                <FormattedMessage id="social.friend.unfriend" />
            </Button>
        </>
    );
};

const BtnRequestFriend = ({ handleChangeFriendStatus, loading, showModal }) => {
    return (
        <>
            <Button
                type="primary"
                className="flex-1 btn_custom_accept"
                onClick={() => handleChangeFriendStatus({ status: 'accepted' })}
                loading={loading}
            >
                <FormattedMessage id="social.friend.accept" />
            </Button>
            <Button
                type="default"
                className="flex-1 btn_custom_reject"
                onClick={showModal}
            >
                <FormattedMessage id="social.friend.decline" />
            </Button>
        </>
    );
};

const BtnSuggestFriend = ({ handleChangeFriendStatus, loading, showModal, requestSent }) => {
    return (
        <>
            {requestSent ? (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        className="flex-1"
                        disabled
                    >
                        <FormattedMessage id="social.friend.request_sent" defaultMessage="Request Sent" />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        className="flex-1"
                        onClick={showModal}
                        loading={loading}
                    >
                        <FormattedMessage id="social.friend.cancel" defaultMessage="Cancel" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="primary"
                    className="btn_custom_accept w-full"
                    onClick={() => { handleChangeFriendStatus({ status: 'pending' }); }}
                    loading={loading}
                >
                    <FormattedMessage id="social.friend.add_friend" />
                </Button>
            )}
        </>
    );
};


const FriendCard = ({ friend, type, userData, status, setStatusRequestSend }) => {
    const intl = useIntl();
    const navigate = useNavigate();

    const { mutate: sendFriendRequest } = useChangeFriendStatus();
    const { mutateAsync: createConversationAsync } = useCreateConversation();
    const { mutate: createNotification } = useCreateNotification();
    const { mutate: createUserNotification } = useCreateUserNotification();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(status === 'cancel_request');
    const [currentStatus, setCurrentStatus] = useState(status || null);
    const [requestAction, setRequestAction] = useState(null);

    // Update currentStatus and requestSent when status prop changes
    useEffect(() => {
        if (status) {
            setCurrentStatus(status);
            // Also update requestSent based on status
            if (status === 'cancel_request') {
                setRequestSent(true);
            } else if (status === 'add_friend') {
                setRequestSent(false);
            }
        }
    }, [status, friend?.documentId]);

    // Mutation hooks
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const handleChangeFriendStatus = ({ status }) => {
        // Update status in local state first
        setCurrentStatus(status);

        // Update requestSent based on status
        if (status === 'pending') {
            setRequestSent(true);
        } else if (status === 'denied') {
            setRequestSent(false);
        }

        // Update parent component's state
        if (setStatusRequestSend) {
            if (status === 'pending') {
                setStatusRequestSend('cancel_request');
            } else if (status === 'denied') {
                setStatusRequestSend('add_friend');
            } else {
                setStatusRequestSend(status);
            }
        }

        handleSendFriendRequest({
            userId: userData?.documentId,
            friendId: friend?.documentId,
            status: status,
            setLoading,
            setRequestSent,
            sendFriendRequestMutation: sendFriendRequest,
            createNotification,
            createUserNotification
        });
    };

    useEffect(() => {
        if (!loading && (currentStatus === 'denied' || currentStatus === 'unfriend') && isModalVisible) {
            setIsModalVisible(false);
            setCurrentStatus(null);
            setRequestAction('denied');

        }
        if (!loading && (currentStatus === 'accepted')) {
            setRequestAction('accepted');
        }
        if (!loading && (currentStatus === 'denied')) {
            setRequestAction('denied');
            setRequestSent(false);
        }
    }, [loading, currentStatus, isModalVisible]);

    const renderActions = () => {
        switch (type) {
            case 'all':
                return (
                    <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                );

            case 'friends':
                return (
                    requestAction === 'denied' ? (
                        <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                    ) : (
                        <div className="flex gap-2">
                            <BtnChatFriend friend={friend} showModal={showModal} />
                        </div>
                    )
                );

            case 'received':
                return (
                    <div className="flex gap-2">
                        {
                            requestAction === 'accepted' ? (
                                <BtnChatFriend friend={friend} showModal={showModal} />
                            ) : requestAction === 'denied' ? (
                                <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                            ) : (
                                <BtnRequestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} />
                            )
                        }

                    </div>
                );

            case 'requests':
                return (
                    requestAction === 'denied' ? (
                        <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                className="flex-1 btn_custom_accept"
                                onClick={showModal}
                                loading={loading}
                            >
                                <FormattedMessage id="social.friend.cancel" />
                            </Button>
                        </div>
                    )
                );
            default:
                return null;
        }
    };

    const renderModal = () => {
        let title, content, okText;

        switch (type) {
            case 'all':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            case 'friends':
                title = intl.formatMessage({ id: 'social.friend.unfriend_title', defaultMessage: 'Remove Friend' });
                content = intl.formatMessage(
                    { id: 'social.friend.unfriend_content', defaultMessage: 'Are you sure you want to remove {name} from your friends?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_remove', defaultMessage: 'Yes, Remove' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            case 'received':
                title = intl.formatMessage({ id: 'social.friend.decline_request_title', defaultMessage: 'Decline Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.decline_request_content', defaultMessage: 'Are you sure you want to decline the friend request from {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_decline', defaultMessage: 'Yes, Decline' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            case 'requests':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            default:
                return { title: '', content: '', okText: '', onOk: () => { } };
        }
    };

    const { title, content, okText, onOk } = renderModal();

    return (
        <>
            <Card
                className="friend-card"
                cover={
                    <div className="h-32 overflow-hidden">
                        <img
                            alt="cover"
                            src={friend?.banner?.file_path}
                            className="w-full h-full object-cover"
                        />
                    </div>
                }
            >
                <div className="relative -mt-16 mb-4">
                    <Avatar
                        src={friend?.avatar?.file_path}
                        size={64}
                        className="border-4 avatar_border"
                    />
                </div>
                <h3 className="text-lg font-semibold text_first">
                    {friend?.fullname}
                </h3>
                <p className="text-sm text_secondary mb-4">
                    @{friend?.username}
                </p>
                {renderActions()}
            </Card>

            <Modal
                title={title}
                open={isModalVisible}
                onOk={onOk}
                onCancel={handleCancel}
                okText={okText}
                cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                okButtonProps={{ danger: true }}
                confirmLoading={loading}
            >
                <p>{content}</p>
            </Modal>
        </>
    );
};

export default FriendCard;
